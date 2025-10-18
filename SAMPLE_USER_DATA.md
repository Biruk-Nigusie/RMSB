# Sample User Registration Data & Endpoints

## 🚀 BOOTSTRAP: Create First Super Admin (One-Time Only)
**Note:** This endpoint only works when NO super admin exists in the system. Use this to create the very first super admin.

**Endpoint:** `POST /api/bootstrap/super-admin`
**Headers:** 
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Super Admin",
  "phone": "+251911000000",
  "email": "superadmin@cmsb.com",
  "password": "superadmin123"
}
```

**Response:** Returns JWT token immediately for use in subsequent requests.

## 1. Additional Super Admin Registration (After Bootstrap)
**Note:** Use this endpoint to create more super admins after the first one exists.

**Endpoint:** `POST /api/admins`
**Headers:** 
```
Content-Type: application/json
Authorization: Bearer <super_admin_token>
```

**Request Body:**
```json
{
  "name": "Jane Super Admin",
  "phone": "+251911000001",
  "email": "jane.superadmin@cmsb.com",
  "role": "SUPER_ADMIN",
  "password": "superadmin123"
}
```

## 2. Create Condominium 1 (Super Admin Only)
**Endpoint:** `POST /api/condominiums`
**Headers:** 
```
Content-Type: application/json
Authorization: Bearer <super_admin_token>
```

**Request Body:**
```json
{
  "name": "Summit Condominium",
  "location": "Addis Ababa, Ethiopia",
  "totalBlocks": 5
}
```

## 3. Create Condominium 2 (Super Admin Only)
**Endpoint:** `POST /api/condominiums`
**Headers:** 
```
Content-Type: application/json
Authorization: Bearer <super_admin_token>
```

**Request Body:**
```json
{
  "name": "Paradise Heights",
  "location": "Bole, Addis Ababa",
  "totalBlocks": 8
}
```

## 4. Condominium Admin 1 Registration
**Endpoint:** `POST /api/admins`
**Headers:** 
```
Content-Type: application/json
Authorization: Bearer <super_admin_token>
```

**Request Body:**
```json
{
  "name": "Sarah Admin",
  "phone": "+251911111111",
  "email": "sarah.admin@cmsb.com",
  "role": "ADMIN",
  "assignedCondominium": "Summit Condominium",
  "password": "admin123"
}
```

## 5. Condominium Admin 2 Registration
**Endpoint:** `POST /api/admins`
**Headers:** 
```
Content-Type: application/json
Authorization: Bearer <super_admin_token>
```

**Request Body:**
```json
{
  "name": "Michael Admin",
  "phone": "+251922222222",
  "email": "michael.admin@cmsb.com",
  "role": "ADMIN",
  "assignedCondominium": "Summit Condominium",
  "password": "admin123"
}
```

## 6. Resident 1 Registration
**Endpoint:** `POST /api/auth/register`
**Headers:** 
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "Ahmed Hassan",
  "phone": "+251933333333",
  "email": "ahmed.hassan@email.com",
  "block": "A",
  "houseNo": "A-101",
  "ownershipType": "OWNED",
  "familyMembers": 4,
  "carPlate": "AA-12345",
  "condominiumId": "<condominium_id_from_step_2>",
  "password": "resident123"
}
```

## 7. Resident 2 Registration
**Endpoint:** `POST /api/auth/register`
**Headers:** 
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "Meron Tadesse",
  "phone": "+251944444444",
  "email": "meron.tadesse@email.com",
  "block": "B",
  "houseNo": "B-205",
  "ownershipType": "RENTED",
  "ownerName": "Dawit Bekele",
  "familyMembers": 2,
  "carPlate": "AA-67890",
  "condominiumId": "<condominium_id_from_step_2>",
  "password": "resident123"
}
```

## Login Endpoints

### Admin/Super Admin Login
**Endpoint:** `POST /api/auth/login`
**Headers:** 
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "phone": "+251911000000",
  "password": "superadmin123",
  "userType": "admin"
}
```

### Resident Login
**Endpoint:** `POST /api/auth/login`
**Headers:** 
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "phone": "+251933333333",
  "password": "resident123",
  "userType": "resident"
}
```

## Additional Condominium Endpoints

### Get All Condominiums
**Endpoint:** `GET /api/condominiums`
**Headers:** 
```
Authorization: Bearer <any_admin_token>
```

### Approve Condominium Registration
**Endpoint:** `PUT /api/condominiums/:id/approve`
**Headers:** 
```
Content-Type: application/json
Authorization: Bearer <super_admin_token>
```

## 📝 Registration Flow

### **STEP 1: Bootstrap Super Admin (One-Time Only)**
```bash
POST /api/bootstrap/super-admin
# Creates first super admin + returns token immediately
```

### **STEP 2: Create Condominiums**
```bash
POST /api/condominiums (with super admin token)
```

### **STEP 3: Create Additional Admins**
```bash
POST /api/admins (with super admin token)
```

### **STEP 4: Register Residents**
```bash
POST /api/auth/register (no token needed)
```

### **STEP 5: Login Users**
```bash
POST /api/auth/login (get tokens for existing users)
```

## 🧪 Testing All Endpoints

### Announcements
```bash
# Create Announcement (Admin)
POST /api/announcements
Authorization: Bearer <admin_token>
{
  "title": "Community Meeting",
  "message": "Monthly meeting on Saturday",
  "targetAudience": "ALL"
}

# Get All Announcements
GET /api/announcements
Authorization: Bearer <any_token>
```

### Parking Management
```bash
# Create Parking Slot (Admin)
POST /api/parking/slots
Authorization: Bearer <admin_token>
{
  "slotNo": "P-001",
  "feeMonthly": 500.00
}

# Get Available Slots
GET /api/parking/slots/available
Authorization: Bearer <any_token>

# Assign Parking Slot (Admin)
PUT /api/parking/slots/<slot_id>
Authorization: Bearer <admin_token>
{
  "carOwnerId": "<resident_id>",
  "carPlate": "AA-12345"
}

# Pay Parking Fee (Resident)
POST /api/parking/pay
Authorization: Bearer <resident_token>
{
  "slotId": "<slot_id>"
}
```

### Complaints
```bash
# Submit Complaint (Resident)
POST /api/complaints
Authorization: Bearer <resident_token>
{
  "category": "MAINTENANCE",
  "description": "Elevator not working",
  "photo": "elevator_issue.jpg"
}

# Get All Complaints (Admin)
GET /api/complaints
Authorization: Bearer <admin_token>

# Get My Complaints (Resident)
GET /api/complaints/my
Authorization: Bearer <resident_token>

# Update Complaint Status (Admin)
PUT /api/complaints/<complaint_id>
Authorization: Bearer <admin_token>
{
  "status": "IN_PROGRESS",
  "assignedAdminId": "<admin_id>"
}
```

### Ekub/Eddir Groups
```bash
# Create Group (Resident)
POST /api/groups
Authorization: Bearer <resident_token>
{
  "name": "Block A Ekub",
  "type": "EKUB",
  "monthlyContribution": 1000.00,
  "paymentMethod": "TELEBIRR"
}

# Add Member to Group
POST /api/groups/<group_id>/members
Authorization: Bearer <resident_token>
{
  "memberId": "<resident_id>"
}

# Record Payment
POST /api/groups/<group_id>/payments
Authorization: Bearer <resident_token>
{
  "amount": 1000.00,
  "method": "TELEBIRR",
  "roundNo": 1
}
```

### Service Providers
```bash
# Create Service Provider (Admin)
POST /api/services
Authorization: Bearer <admin_token>
{
  "name": "Clean Masters",
  "serviceType": "CLEANING",
  "contact": "+251911555555",
  "feeMonthly": 200.00
}

# Pay Service Fee (Resident)
POST /api/services/<provider_id>/pay
Authorization: Bearer <resident_token>
{
  "month": "2024-01-01",
  "amount": 200.00
}

# Rate Provider (Resident)
POST /api/services/<provider_id>/rating
Authorization: Bearer <resident_token>
{
  "rating": 4.5
}
```

### Utilities
```bash
# Create Utility Bill (Admin)
POST /api/utilities
Authorization: Bearer <admin_token>
{
  "residentId": "<resident_id>",
  "meterNo": "EEU123456",
  "serviceType": "ELECTRICITY",
  "currentReading": 1500,
  "previousReading": 1200,
  "billingAmount": 450.00,
  "provider": "Ethiopian Electric Utility"
}

# Pay Utility Bill (Resident)
POST /api/utilities/pay/<utility_id>
Authorization: Bearer <resident_token>

# Report Issue (Resident)
POST /api/utilities/report
Authorization: Bearer <resident_token>
{
  "utilityId": "<utility_id>",
  "issue": "Power outage in Block A"
}
```

### Dashboards
```bash
# Resident Dashboard
GET /api/dashboard/resident
Authorization: Bearer <resident_token>

# Admin Dashboard
GET /api/dashboard/admin
Authorization: Bearer <admin_token>

# Super Admin Dashboard
GET /api/dashboard/super
Authorization: Bearer <super_admin_token>
```

### Search
```bash
# Global Search
GET /api/search?query=Ahmed
Authorization: Bearer <any_token>
```

### Finance (Admin Only)
```bash
# Financial Summary
GET /api/finance/summary
Authorization: Bearer <admin_token>

# Income Report
GET /api/finance/income?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>
```

### Notifications
```bash
# Send Notification (Admin)
POST /api/notifications/send
Authorization: Bearer <admin_token>
{
  "title": "Payment Reminder",
  "message": "Your parking fee is due",
  "recipientId": "<resident_id>",
  "type": "PAYMENT_REMINDER"
}

# Get User Notifications
GET /api/notifications
Authorization: Bearer <any_token>

# Mark as Read
PUT /api/notifications/<notification_id>/read
Authorization: Bearer <any_token>
```

### Audit Logs (Super Admin Only)
```bash
# Get Audit Logs
GET /api/audit?page=1&limit=50
Authorization: Bearer <super_admin_token>

# Clear Audit Logs
DELETE /api/audit/clear
Authorization: Bearer <super_admin_token>
```

### Resident Management (Admin)
```bash
# Get All Residents
GET /api/residents?block=A&ownershipType=OWNED
Authorization: Bearer <admin_token>

# Get Resident Details
GET /api/residents/<resident_id>
Authorization: Bearer <admin_token>

# Update Resident
PUT /api/residents/<resident_id>
Authorization: Bearer <admin_token>
{
  "familyMembers": 5,
  "carPlate": "AA-54321"
}
```

## Important Notes

- Replace `<condominium_id_from_step_2>` with the actual ID returned from condominium creation
- Replace `<super_admin_token>` with the JWT token received after super admin login
- Replace `<admin_token>` with admin JWT token
- Replace `<resident_token>` with resident JWT token
- Replace all `<id>` placeholders with actual IDs from previous responses
- All phone numbers must be unique
- All email addresses must be unique
- Passwords are hashed automatically by the system
- Residents can register themselves, but admins must be created by super admins