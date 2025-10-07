# 📸 CLICKSY – One Click, Infinite Possibilities

CLICKSY is a dedicated full-stack platform designed to connect photographers, clients, and photography enthusiasts. It provides a centralized space for portfolio management, booking services, collaboration, and skill development, solving the problems of fragmented systems like social media and general freelancing sites.

## 🚀 Key Features (Modules)

This project is structured around the following core modules:

*   **User Management:** Secure Sign-up (Client/Photographer) and Login powered by Supabase Auth.
*   **Portfolio Module:** Dedicated, clean profiles for photographers to showcase their work.
*   **Booking & Payment (To be Implemented):** Seamless scheduling and payment integration.
*   **Collaboration & Community (Future Scope):** Tools for connecting and co-working.
*   **Marketplace (Future Scope):** Equipment rental and sale.

## 🛠️ Technology Stack

The CLICKSY platform is built using a modern, scalable JavaScript-centric architecture.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React.js (Vite)** | A fast, component-based library for building the user interface. |
| **Styling** | **Standard CSS** | Custom, modular CSS for clean, responsive, and maintainable styles. |
| **Backend (BFF)** | **Node.js & Express.js** | A lightweight, fast server acting as a Backend-for-Frontend (BFF) layer. |
| **Database & Auth** | **Supabase** | Provides a PostgreSQL database, robust authentication, and secure storage, eliminating boilerplate server code. |
| **Communication** | **Axios** | For making promise-based HTTP requests from the frontend to the Express API. |

## ⚙️ Project Setup and Local Development

Follow these steps to get a copy of the project up and running on your local machine.

### Prerequisites

*   Node.js (v18+)
*   npm (v9+)
*   A Supabase Account and Project

### 1. Clone the Repository

bash
git clone https://github.com/YOUR_USERNAME/clicksy-project.git
cd clicksy-project

### 2. Configure Backend
Navigate to the backend directory, install dependencies, and set up the environment file.
code
Bash
cd backend
npm install
# Create the .env file
touch .env
File: backend/.env (Replace with your actual Supabase credentials)
code
Code
PORT=5000
SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL_HERE"
SUPABASE_SERVICE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE"

### 3. Configure Frontend
Navigate to the frontend directory and install dependencies.
code
Bash
cd ../frontend
npm install

### 4.Run the Application
You will need two separate terminal windows.
Terminal 1 (Backend - Start API Server):
code
Bash
cd backend
npm run dev
Terminal 2 (Frontend - Start React App):
code
Bash
cd frontend
npm run dev
The application will be accessible at http://localhost:5173 and the API endpoints will be running on http://localhost:5000/api/v1
