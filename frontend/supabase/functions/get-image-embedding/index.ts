// @ts-nocheck
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const body = await req.json();
    const imageBase64 = body.imageBase64;

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "imageBase64 is required" }),
        { status: 400, headers },
      );
    }

    const HF_TOKEN = Deno.env.get("HF_TOKEN");
    if (!HF_TOKEN) {
      return new Response(JSON.stringify({ error: "HF_TOKEN not set" }), {
        status: 500,
        headers,
      });
    }

    // Convert base64 → raw binary (new router needs binary not JSON)
    const binaryString = atob(imageBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    let embedding = null;
    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`Attempt ${attempt}: Calling HuggingFace...`);

      // Use the standard inference API
      const hfRes = await fetch(
        "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/octet-stream", // send raw binary
          },
          body: bytes,
        },
      );

      console.log(`Response status: ${hfRes.status}`);
      let result;
      const textResponse = await hfRes.text();

      try {
        result = JSON.parse(textResponse);
        console.log(
          `Response preview: ${JSON.stringify(result).slice(0, 200)}`,
        );
      } catch (parseError) {
        lastError = `HuggingFace returned non-JSON: ${hfRes.status} ${textResponse.slice(0, 100)}`;
        console.log(lastError);
        break;
      }

      if (result?.error?.includes("loading")) {
        console.log("Model loading, waiting 20s...");
        await new Promise((r) => setTimeout(r, 20000));
        lastError = result.error;
        continue;
      }

      if (!hfRes.ok) {
        lastError = result?.error ?? `HTTP ${hfRes.status}`;
        break;
      }

      embedding = result;
      break;
    }

    if (!embedding) {
      return new Response(
        JSON.stringify({ error: lastError ?? "Failed after retries" }),
        { status: 500, headers },
      );
    }

    return new Response(JSON.stringify({ embedding }), {
      status: 200,
      headers,
    });
  } catch (e) {
    console.error("Error:", String(e));
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers,
    });
  }
});
