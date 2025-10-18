API ENDPOINTS LIST

1. AUTHENTICATION & USER MANAGEMENT
   Method Endpoint Description
   POST /api/auth/register Register new resident
   POST /api/auth/login Authenticate (resident/admin/super admin)
   POST /api/auth/logout Logout current session
   GET /api/auth/profile Get logged-in user info
   PUT /api/auth/profile Update profile
   PATCH /api/auth/change-password Change password
   GET /api/auth/users [Admin] View all users
   DELETE /api/auth/users/:id [Admin] Remove user
2. RESIDENT REGISTRATION
   Method Endpoint Description
   POST /api/residents Register new resident
   GET /api/residents List all residents (filter by block, ownership, etc.)
   GET /api/residents/:id View specific resident details
   PUT /api/residents/:id Update resident info
   DELETE /api/residents/:id Remove resident
   GET /api/residents/report/pdf Generate resident report PDF
   POST /api/residents/verify/:id Verify ownership or rental document upload
3. ANNOUNCEMENTS / NOTICES
   Method Endpoint Description
   POST /api/announcements [Admin] Post new announcement
   GET /api/announcements View all announcements
   GET /api/announcements/:id Get one announcement
   DELETE /api/announcements/:id [Admin] Delete announcement
   PUT /api/announcements/:id [Admin] Edit announcement
   POST /api/announcements/:id/read [Resident] Mark announcement as read
4. PARKING MANAGEMENT
   Method Endpoint Description
   POST /api/parking/slots [Admin] Create parking slot
   GET /api/parking/slots List all parking slots
   GET /api/parking/slots/available View only free slots
   GET /api/parking/slots/:id Get slot details
   PUT /api/parking/slots/:id Update slot info or reassign owner
   DELETE /api/parking/slots/:id Delete slot
   POST /api/parking/pay [Resident] Pay monthly parking fee
   GET /api/parking/report [Admin] Generate income report
5. EKUB / EDDIR MANAGEMENT
   Method Endpoint Description
   POST /api/groups Create new Ekub/Eddir
   GET /api/groups List all groups
   GET /api/groups/:id View specific group
   PUT /api/groups/:id Update group details
   DELETE /api/groups/:id Delete group
   POST /api/groups/:id/members Add member to group
   DELETE /api/groups/:id/members/:memberId Remove member
   GET /api/groups/:id/members List group members
   POST /api/groups/:id/payments Record payment or contribution
   GET /api/groups/:id/payments View payment history
   POST /api/groups/:id/notices [Admin] Post notice in group
   GET /api/groups/:id/forum Get discussion forum messages
   POST /api/groups/:id/forum Post a message
   GET /api/groups/:id/rotation View or schedule rotation (for Ekub)
6. GARBAGE / CLEANING / SECURITY SERVICES
   Method Endpoint Description
   POST /api/services [Admin] Register service provider
   GET /api/services View all providers
   GET /api/services/:id Get service details
   PUT /api/services/:id Update provider info
   DELETE /api/services/:id Remove provider
   POST /api/services/:id/bills [Admin] Generate monthly bills
   GET /api/services/:id/bills View all bills for provider
   POST /api/services/:id/pay [Resident] Pay cleaning/security fee
   GET /api/services/payments/report [Admin] View total payments
   POST /api/services/:id/rating [Resident] Rate provider performance
   POST /api/services/:id/issues [Resident] Report issue (missed cleaning, poor security)
7. ELECTRICITY & WATER
   Method Endpoint Description
   POST /api/utilities [Admin] Upload new bill / reading
   GET /api/utilities View all bills
   GET /api/utilities/:id View specific bill
   PUT /api/utilities/:id Update usage or status
   DELETE /api/utilities/:id Delete bill
   POST /api/utilities/pay/:id [Resident] Pay bill
   POST /api/utilities/report [Resident] Report issue (outage, leak)
   GET /api/utilities/reports [Admin] View all issues
   PUT /api/utilities/reports/:id/resolve [Admin] Mark issue as resolved
8. COMPLAINT SYSTEM
   Method Endpoint Description
   POST /api/complaints [Resident] Submit complaint
   GET /api/complaints [Admin] View all complaints
   GET /api/complaints/:id View complaint details
   PUT /api/complaints/:id [Admin] Update complaint status
   DELETE /api/complaints/:id [Admin] Delete complaint
   GET /api/complaints/my [Resident] View own complaints
   POST /api/complaints/:id/assign [Admin] Assign handler
   PUT /api/complaints/:id/resolve Mark complaint resolved
9. FINANCIAL DASHBOARD (ADMIN)
   Method Endpoint Description
   GET /api/finance/summary Income/expense overview
   GET /api/finance/income List all income sources
   GET /api/finance/expenses List all expenses
   POST /api/finance/expenses Add expense record
   GET /api/finance/report/pdf Generate PDF summary
10. SYSTEM ADMINISTRATION (SUPER ADMIN)
    Method Endpoint Description
    POST /api/admins Create condominium admin
    GET /api/admins View all admins
    PUT /api/admins/:id Update admin info
    DELETE /api/admins/:id Delete admin
    GET /api/system/stats System-wide statistics
    GET /api/system/audit View activity logs
    POST /api/system/integrations Add or edit integrations (EEU, AAWSA, Telebirr)
    GET /api/system/integrations List integrations
    POST /api/system/backup Export all data
    POST /api/condominiums Register new condominium
    GET /api/condominiums View all condominiums
    PUT /api/condominiums/:id/approve Approve condominium registration
11. AUDIT LOGS (GLOBAL)
    Method Endpoint Description
    GET /api/audit View all logs
    GET /api/audit/:id View specific log entry
    DELETE /api/audit/clear Clear logs (super admin only)
12. SEARCH & DASHBOARD UTILITIES
    Method Endpoint Description
    GET /api/search Search across residents, cars, groups, etc.
    GET /api/dashboard/resident Resident home dashboard
    GET /api/dashboard/admin Admin summary dashboard
    GET /api/dashboard/super Super admin global dashboard
13. FILES / DOCUMENTS
    Method Endpoint Description
    POST /api/files/upload Upload ownership/rent contract or complaint photo
    GET /api/files/:id View/download file
    DELETE /api/files/:id Delete uploaded file
14. NOTIFICATIONS
    Method Endpoint Description
    GET /api/notifications List user notifications
    POST /api/notifications/send [Admin] Send notification manually
    DELETE /api/notifications/:id Delete notification
    PUT /api/notifications/:id/read Mark as read
    ⚙️ OPTIONAL SYSTEM ENDPOINTS (Future Expansion)
    Method Endpoint Description
    GET /api/visitors Visitor logs
    POST /api/lost-found Submit lost item
    GET /api/events Community events calendar
    POST /api/inventory Record community asset
    GET /api/maintenance Maintenance requests list
