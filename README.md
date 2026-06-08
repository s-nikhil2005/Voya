# 🌍 Voya – Full Stack Travel Booking Platform

Voya is a modern full-stack travel booking application built using the MERN stack. The platform enables users to discover destinations, book flights and hotels, manage multiple travellers within a single booking, and complete secure online payments.

The project was designed to simulate real-world travel booking workflows while implementing production-oriented features such as authentication, Redis caching, payment processing, PDF ticket generation, and email notifications.

---

## 🚀 Live Demo

Frontend: [Add Frontend URL]

Backend API: [Add Backend URL]

---

## ✨ Key Features

### 🧳 Multi-Traveller Booking System

* Add up to 5 travellers per booking
* Dynamic traveller form generation
* Individual traveller validation
* Backend array-based traveller schema
* Scalable booking architecture for future seat allocation and pricing models

### ✈️ Flight & Hotel Booking

* Browse destinations
* Select hotels and flights
* View booking summaries
* Complete booking workflow

### 🔐 Authentication & Authorization

* JWT-based authentication
* Protected frontend and backend routes
* Secure user registration and login
* Password hashing using Bcrypt
* OTP verification using Redis

### 💳 Secure Payment Processing

* Stripe payment integration
* Transaction verification
* Booking confirmation only after successful payment
* Secure payment flow

### 📄 PDF Ticket Generation

Automatically generates booking confirmation PDFs containing:

* Traveller information
* Booking details
* Flight details
* Hotel details
* Payment summary

### 📧 Email Notifications

* Automated booking confirmation emails
* PDF attachment delivery
* Nodemailer integration

### ⚡ Redis-Based Booking Workflow

* Temporary booking storage before payment
* 15-minute expiration mechanism
* Prevents incomplete booking persistence
* Stores only successful bookings in MongoDB

### 🎄 Christmas Mode

* Optional snowfall animation
* Seasonal UI enhancement

---

## 🏗️ Tech Stack

### Frontend

* React.js
* React Router
* Context API
* Axios
* React Toastify
* React Icons
* Framer Motion
* React Snowfall

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Redis
* JWT Authentication
* Bcrypt
* Stripe API
* Nodemailer
* PDFKit
* Validator.js
* XSS Sanitization

---

## 🧠 System Workflow

1. User registers and verifies account using OTP.
2. User selects destination, hotel, and flight.
3. User adds travellers (1–5 travellers).
4. Backend validates traveller information.
5. Booking data is temporarily stored in Redis.
6. User completes payment through Stripe.
7. Payment verification is performed.
8. Booking is saved in MongoDB.
9. PDF confirmation is generated.
10. Confirmation email is sent.
11. Temporary Redis data is removed.

---

## 📂 Project Structure

```text
Voya
│
├── frontend
│   ├── src
│   ├── public
│   └── components
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── utils
│   └── services
│
└── README.md
```

## 🔒 Security Features

* JWT Authentication
* Password Hashing (Bcrypt)
* OTP Verification (Redis)
* Route Protection
* Input Validation
* XSS Protection
* Secure Payment Verification
* Server-Side Data Validation

---

## 📊 Database Design

### Booking Schema

```javascript
travellers: [
  {
    name: String,
    age: Number,
    gender: String,
    adharNumber: String,
    address: String
  }
]
```

Supports multiple travellers within a single booking and allows future expansion for advanced booking functionality.

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/voya.git
cd voya
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend

```env
PORT=
MONGODB_URI=
SECRET_KEY=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
STRIPE_SECRET_KEY=
AUTH_MAIL_USER=
AUTH_MAIL_PASS=
```

### Frontend

```env
VITE_BASE_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
```

---

## 📌 Future Enhancements

* Seat Selection System
* Booking Cancellation
* Admin Dashboard
* Dynamic Pricing Engine
* Booking History Dashboard
* User Reviews & Ratings
* Travel Recommendations
* CI/CD Pipeline Integration

---

## 👨‍💻 Author

Nikhil Singh

Full Stack Developer | MERN Stack Enthusiast

---

## 📄 License

This project is licensed under the MIT License.
