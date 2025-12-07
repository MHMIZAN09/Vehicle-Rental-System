# 🚗 Vehicle Rental Booking System

**Live Deployment:** [https://vehicle-rental-pi.vercel.app/]

---

## 🔹 Project Overview
This project is a **Vehicle Rental System** that allows users to view and book vehicles online.  
Admins can manage vehicles and view all bookings, while customers can view and manage their own bookings.  


---

## ✨ Features
- **User Authentication:** Role-based login (Admin & Customer)
- **Vehicle Management:** Admin can add, update, and track vehicle availability
- **Booking Management:** Customers can book vehicles; Admin can view all bookings
- **Booking Status:** Track active and completed bookings
- **Data Persistence:** PostgreSQL database for storing users, vehicles, and bookings
- **REST API:** Built with Node.js and Express


---

## 🛠 Technology Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM / DB Library:** pg (node-postgres)
- **Authentication:** JWT (JSON Web Tokens)

- **Deployment:** Vercel 

---

## 🚀 Setup & Usage Instructions

### 1️. Clone the repository
```bash
https://github.com/MHMIZAN09/Vehicle-Rental-System
cd Vehicle-Rental-System

npm install

CONNECTION_STRING=postgresql://neondb_owner:npg_mr2l7biqtZSn@ep-floral-fire-a89jhgyo-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
PORT = 5000

JWT_SECRET=f3b4d7e2f1a4c3b5e6d7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9

```

