# Parking Management System

A full-stack parking management application built with Spring Boot (Backend) and Next.js (Frontend).

## Features

- 🚗 **User Authentication** - JWT-based login and registration
- 🅿️ **Parking Spot Management** - View and book available parking spots
- 👨‍💼 **Admin Dashboard** - Manage spots, users, and reservations
- 📅 **Reservation System** - Book parking spots with time slots
- 🔒 **Role-Based Access Control** - Admin and User roles

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.4
- Spring Security with JWT
- H2 Database
- JPA/Hibernate

### Frontend
- Next.js 15
- React 19
- Tailwind CSS

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- Maven

### Backend Setup

```bash
cd Back-end/parking-system
./mvnw spring-boot:run
```

The backend will run on `http://localhost:8081`

### Frontend Setup

```bash
cd Front-end/parking-frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Credentials

- **Admin**: username: `admin`, password: `admin123`

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/spots` - Get all parking spots
- `POST /api/spots` - Create parking spot (Admin only)
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation
- `DELETE /api/reservations/{id}` - Delete reservation (Admin only)

## License

MIT
