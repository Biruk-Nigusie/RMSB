# Complete API Endpoints Documentation

## Authentication & User Management
- `POST /api/auth/register` - Register new resident
- `POST /api/auth/login` - Login (resident/admin/super admin)
- `GET /api/auth/profile` - Get logged-in user info
- `PUT /api/auth/profile` - Update profile

## Resident Management
- `GET /api/residents` - List all residents (Admin only)
- `GET /api/residents/:id` - View specific resident details
- `PUT /api/residents/:id` - Update resident info
- `DELETE /api/residents/:id` - Remove resident (Admin only)

## Announcements
- `POST /api/announcements` - Create announcement (Admin only)
- `GET /api/announcements` - View all announcements
- `GET /api/announcements/:id` - Get specific announcement
- `PUT /api/announcements/:id` - Update announcement (Admin only)
- `DELETE /api/announcements/:id` - Delete announcement (Admin only)

## Parking Management
- `POST /api/parking/slots` - Create parking slot (Admin only)
- `GET /api/parking/slots` - List all parking slots
- `GET /api/parking/slots/available` - View available slots
- `PUT /api/parking/slots/:id` - Assign parking slot (Admin only)
- `POST /api/parking/pay` - Pay parking fee

## Ekub/Eddir Management
- `POST /api/groups` - Create new Ekub/Eddir
- `GET /api/groups` - List all groups
- `POST /api/groups/:id/members` - Add member to group
- `POST /api/groups/:id/payments` - Record payment/contribution
- `GET /api/groups/:id/payments` - View payment history

## Service Management
- `POST /api/services` - Register service provider (Admin only)
- `GET /api/services` - View all providers
- `POST /api/services/:id/pay` - Pay cleaning/security fee
- `POST /api/services/:id/rating` - Rate provider performance

## Utilities (Electricity & Water)
- `POST /api/utilities` - Upload new bill/reading (Admin only)
- `GET /api/utilities` - View all bills
- `POST /api/utilities/pay/:id` - Pay utility bill
- `POST /api/utilities/report` - Report issue (outage, leak)
- `PUT /api/utilities/reports/:id/resolve` - Mark issue resolved (Admin only)

## Complaint System
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - View all complaints (Admin only)
- `GET /api/complaints/my` - View own complaints
- `PUT /api/complaints/:id` - Update complaint status (Admin only)

## Admin Management (Super Admin Only)
- `POST /api/admins` - Create condominium admin
- `GET /api/admins` - View all admins
- `PUT /api/admins/:id` - Update admin info
- `DELETE /api/admins/:id` - Delete admin

## Condominium Management
- `POST /api/condominiums` - Register new condominium (Super Admin)
- `GET /api/condominiums` - View all condominiums
- `PUT /api/condominiums/:id/approve` - Approve condominium (Super Admin)

## Dashboard & Analytics
- `GET /api/dashboard/resident` - Resident dashboard
- `GET /api/dashboard/admin` - Admin dashboard
- `GET /api/dashboard/super` - Super admin dashboard

## Financial Management
- `GET /api/finance/summary` - Income/expense overview (Admin only)
- `GET /api/finance/income` - Income report (Admin only)

## Search & Utilities
- `GET /api/search?query=` - Global search across residents, groups, announcements

## Notifications
- `POST /api/notifications/send` - Send notification (Admin only)
- `GET /api/notifications` - List user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## Audit & System
- `GET /api/audit` - View audit logs (Super Admin only)
- `DELETE /api/audit/clear` - Clear audit logs (Super Admin only)

## Health Check
- `GET /health` - System health check