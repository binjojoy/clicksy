"""
app.py — Clicksy KNN Price Predictor API
Hugging Face Spaces | FastAPI + scikit-learn
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import numpy as np
import joblib
import json
import os

# ── Load model + metadata ─────────────────────────────────────────────────────
DIR      = os.path.dirname(__file__)
pipeline = joblib.load(os.path.join(DIR, "clicksy_knn_model.pkl"))
meta     = json.load(open(os.path.join(DIR, "model_metadata.json")))

BRAND_TIER     = meta["brand_tier"]
CATEGORY_LIST  = meta["category_list"]

CONDITION_SCORE = {
    "New (Open Box)": 6, "Like New": 5, "Excellent": 4,
    "Good": 3, "Fair": 2, "For Parts": 1,
}

# Category median new prices — fallback when exact model is unknown
CAT_MEDIAN_PRICE = {
    "Camera Body": 134990, "Lens": 74990, "Drone": 109990,
    "Lighting": 34990, "Audio": 24990, "Stabilizer": 34990, "Accessory": 7990,
}

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Clicksy — KNN Price Predictor",
    description="Resale price estimator for photography equipment in Indian market (₹)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Schemas ───────────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    brand:         str
    category:      str
    condition:     str
    purchase_year: int
    sale_year:     int = 2025

    @validator("brand")
    def v_brand(cls, v):
        return v if v in BRAND_TIER else "Other"

    @validator("category")
    def v_category(cls, v):
        if v not in CATEGORY_LIST:
            raise ValueError(f"category must be one of {CATEGORY_LIST}")
        return v

    @validator("condition")
    def v_condition(cls, v):
        if v not in CONDITION_SCORE:
            raise ValueError(f"condition must be one of {list(CONDITION_SCORE)}")
        return v

class PredictResponse(BaseModel):
    predicted_price_inr:  int
    confidence_band_low:  int
    confidence_band_high: int
    model_info:           dict

# ── Feature builder (must mirror Colab feature engineering exactly) ───────────
def build_features(req: PredictRequest) -> np.ndarray:
    return np.array([[
        CONDITION_SCORE[req.condition],
        req.sale_year - req.purchase_year,
        np.log1p(CAT_MEDIAN_PRICE.get(req.category, 50000)),
        CATEGORY_LIST.index(req.category),
        BRAND_TIER.get(req.brand, 0.85),
    ]])

# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "service":    "Clicksy KNN Price Predictor",
        "algorithm":  f"K-Nearest Neighbours  (K={meta['best_k']})",
        "r2":         meta["r2"],
        "mae_inr":    meta["mae"],
        "mape":       f"{meta['mape']}%",
        "categories": CATEGORY_LIST,
        "usage":      "POST /predict  with brand, category, condition, purchase_year",
    }

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if req.purchase_year > req.sale_year:
        raise HTTPException(422, "purchase_year cannot be after sale_year")

    X       = build_features(req)
    raw     = float(pipeline.predict(X)[0])
    rounded = int(round(raw / 500) * 500)
    mae     = meta["mae"]

    return PredictResponse(
        predicted_price_inr  = rounded,
        confidence_band_low  = max(0, rounded - mae),
        confidence_band_high = rounded + mae,
        model_info = {
            "k":       meta["best_k"],
            "r2":      meta["r2"],
            "mae_inr": mae,
        },
    )

@app.get("/health")
def health():
    return {"status": "ok"}
