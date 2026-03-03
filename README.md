oya – MERN Travel Booking Platform

Voya is a full-stack travel booking web application built using the MERN stack.
Users can explore destinations, book flights and hotels, add multiple travellers per booking, and complete secure payments.

This project demonstrates real-world full-stack architecture including authentication, Redis-based transaction handling, Stripe payment integration, and PDF ticket generation.

🚀 Features
🧳 Multi-Traveller Booking (1–5 Travellers)

Dynamic traveller form generation

Individual validation per traveller

Backend array-based traveller schema

Ticket count validation (frontend + backend)

Scalable booking architecture

🔐 Authentication & Security

JWT-based authentication

Protected routes (frontend + backend)

Bcrypt password hashing

XSS input sanitization

Server-side validation using Validator.js

Redis-based OTP verification

💳 Stripe Payment Integration

Stripe test mode integration

Secure payment processing

Booking saved only after successful payment

Transaction ID-based booking confirmation

📦 Redis-Based Temporary Booking System

Booking data stored in Redis before payment

15-minute expiration for security

Prevents incomplete booking storage

MongoDB stores only confirmed bookings

📄 Booking Confirmation

Automatically generates booking confirmation

PDF generation using PDFKit

Email sent via Nodemailer

Includes:

Traveller details

Holiday details

Payment breakdown

🎄 Christmas Mode

Optional snowfall animation toggle

Enhances UI during festive season

🏗 Tech Stack
Frontend

React.js

Context API

React Router

Axios

React Toastify

React Icons

React Snowfall

Backend

Node.js

Express.js

MongoDB + Mongoose

Redis

JWT (JSON Web Token)

Bcrypt

Stripe API

Nodemailer

PDFKit

XSS

Validator.js

🧠 Application Flow

User selects destination, hotel, and flight

User adds 1–5 travellers dynamically

Backend validates all traveller data

Booking temporarily stored in Redis

User completes Stripe payment

On success:

Booking saved in MongoDB

PDF generated

Confirmation email sent

Redis entry removed

📂 Project Structure
Voya/
│
├── frontend/     → React Application
├── backend/      → Express Server
├── models/       → Mongoose Schemas
├── controllers/  → Business Logic
├── config/       → Database & Redis Setup
└── utils/        → Email, PDF, API Response Helpers
⚙️ Installation
Prerequisites

Node.js (v16+)

MongoDB

Redis Server

Stripe Test Account

Clone the Repository
git clone https://github.com/yourusername/voya.git
cd voya
Frontend Setup
cd frontend
npm install
npm start
Backend Setup
cd backend
npm install
npm start
🔒 Protected Routes

Booking page

Confirm booking page

Payment page

Backend routes are protected using JWT middleware.

📊 Database Design (Updated)
Booking Model (Multi-Traveller Support)
travellers: [
  {
    name: String,
    age: Number,
    gender: String,
    adharNumber: String,
    address: String
  }
]

Supports 1–5 travellers

Validated server-side

Designed for scalability (seat allocation, pricing tiers, etc.)

🛡 Security Measures

Server-side input validation

XSS sanitization

Encrypted passwords

JWT authentication

Redis-based OTP expiration

Payment verification before database storage

📌 Future Improvements

Seat selection per traveller

Booking cancellation feature

Admin dashboard

Dynamic pricing (adult/child pricing)

Payment history dashboard

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Developed as a full-stack MERN practice project to demonstrate real-world booking system architecture and secure payment integration.