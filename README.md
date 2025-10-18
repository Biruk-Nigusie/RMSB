# CMSB Backend - Condominium Management System

A comprehensive backend system for managing condominium operations including residents, parking, announcements, complaints, and more.

## Features

- **Authentication & Authorization** - JWT-based auth for residents and admins
- **Resident Management** - Registration, profile management, verification
- **Announcements** - Community-wide notifications
- **Parking Management** - Slot allocation and payment tracking
- **Complaint System** - Issue reporting and resolution tracking
- **Role-based Access Control** - Different permissions for residents, admins, and super admins

## Tech Stack

- **Backend**: Express.js with ES modules
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express-validator

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Make sure PostgreSQL is running locally
   - Update the `DATABASE_URL` in `.env` file with your PostgreSQL credentials
   - Generate Prisma client and push schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Environment Variables**
   Update `.env` file with your configuration:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/cmsb_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new resident
- `POST /api/auth/login` - Login (resident/admin)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Residents
- `GET /api/residents` - List all residents (Admin only)
- `GET /api/residents/:id` - Get resident details
- `PUT /api/residents/:id` - Update resident
- `DELETE /api/residents/:id` - Delete resident (Admin only)

### Announcements
- `POST /api/announcements` - Create announcement (Admin only)
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get specific announcement
- `PUT /api/announcements/:id` - Update announcement (Admin only)
- `DELETE /api/announcements/:id` - Delete announcement (Admin only)

### Parking
- `POST /api/parking/slots` - Create parking slot (Admin only)
- `GET /api/parking/slots` - Get all parking slots
- `GET /api/parking/slots/available` - Get available slots
- `PUT /api/parking/slots/:id` - Assign parking slot (Admin only)
- `POST /api/parking/pay` - Pay parking fee

### Complaints
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - Get all complaints (Admin only)
- `GET /api/complaints/my` - Get user's complaints
- `PUT /api/complaints/:id` - Update complaint status (Admin only)

## Database Schema

The system uses a normalized PostgreSQL schema with the following main entities:
- Residents
- Admins
- Condominiums
- Parking Slots
- Announcements
- Complaints
- Ekub/Eddir Groups
- Service Providers
- Utilities
- Audit Logs

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with express-validator
- Role-based access control

## Development

- `npm run dev` - Start development server with nodemon
- `npm run db:studio` - Open Prisma Studio for database management
- `npm run db:migrate` - Run database migrations