# Loan Origination & Approval System

A full-stack Loan Management System built with modern web technologies for efficient loan processing and management.

## 🚀 Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Frontend**: React + Vite
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Docker
- Docker Compose

*No need to install Node.js or MongoDB locally — everything runs inside containers!*

## 🐳 Docker Setup

This project uses a multi-container Docker setup with the following services:

### Docker Services

| Service  | Image | Port  | Description |
|----------|-------|-------|-------------|
| backend  | Custom Node.js | 5000  | Express API Server |
| frontend | Custom React | 4173  | React Vite Application |
| mongo    | MongoDB | 27017 | Database |

## 🛠️ Quick Start

###  Setting up the project

```bash
1️⃣ git clone https://github.com/anuragdas2001/CN_TA.git
cd CN_TA
2️⃣ Start the Application
3️⃣ docker compose up --build
  
Once all services are running, access the application at:

🌐 Frontend: http://localhost:4173

🛠️ Backend API: http://localhost:5000
