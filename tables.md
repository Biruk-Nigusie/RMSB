Database Schema (Core Tables)

Here’s a normalized relational schema with essential fields and relationships.

1. residents
   Field Type Notes
   id UUID (PK)
   full_name VARCHAR(100)
   phone VARCHAR(20) unique
   email VARCHAR(100) nullable
   block VARCHAR(20) e.g., “B1”
   house_no VARCHAR(20) e.g., “B1-12”
   ownership_type ENUM(owned, rented)
   owner_name VARCHAR(100) if rented
   family_members INT
   car_plate VARCHAR(20) nullable
   date_registered DATETIME default now()
   status ENUM(active, inactive) default active
   created_by FK → admins(id)
2. parking_slots
   Field Type Notes
   id UUID
   slot_no VARCHAR(10)
   car_owner_id FK → residents(id) nullable
   car_plate VARCHAR(20)
   is_reserved BOOLEAN
   fee_monthly DECIMAL(10,2)
   payment_status ENUM(paid, pending, overdue)
   date_paid DATETIME nullable
3. ekub_eddir
   Field Type Notes
   id UUID
   name VARCHAR(100)
   type ENUM(ekub, eddir)
   admin_id FK → residents(id)
   created_at DATETIME
   monthly_contribution DECIMAL(10,2)
   payment_method ENUM(cash, telebirr, chapa, in-app)
4. ekub_eddir_members
   Field Type Notes
   id UUID
   group_id FK → ekub_eddir(id)
   member_id FK → residents(id)
   join_date DATETIME
   status ENUM(active, inactive)
5. ekub_eddir_payments
   Field Type Notes
   id UUID
   member_id FK → residents(id)
   group_id FK → ekub_eddir(id)
   amount DECIMAL(10,2)
   payment_date DATETIME
   method VARCHAR(20)
   round_no INT For Ekub rotation
6. service_providers
   Field Type Notes
   id UUID
   name VARCHAR(100)
   service_type ENUM(cleaning, security, garbage)
   contact VARCHAR(100)
   fee_monthly DECIMAL(10,2)
   rating FLOAT avg resident rating
7. service_payments
   Field Type Notes
   id UUID
   provider_id FK → service_providers(id)
   resident_id FK → residents(id)
   month DATE
   amount DECIMAL(10,2)
   payment_status ENUM(paid, pending, overdue)
   payment_date DATETIME
8. utilities
   Field Type Notes
   id UUID
   resident_id FK → residents(id)
   meter_no VARCHAR(50)
   service_type ENUM(electricity, water)
   current_reading INT
   previous_reading INT
   usage INT derived
   billing_amount DECIMAL(10,2)
   payment_status ENUM(paid, pending, overdue)
   report_issue TEXT
   report_status ENUM(open, resolved)
   provider VARCHAR(100) e.g. “EEU”
9. complaints
   Field Type Notes
   id UUID
   resident_id FK → residents(id)
   category ENUM(water, electricity, security, maintenance, theft, other)
   description TEXT
   photo VARCHAR(255) nullable
   status ENUM(open, in_progress, resolved)
   assigned_admin FK → admins(id) nullable
   created_at DATETIME
10. announcements
    Field Type Notes
    id UUID
    title VARCHAR(200)
    message TEXT
    author_id FK → admins(id)
    target_audience ENUM(all, block, group)
    created_at DATETIME
11. admins
    Field Type Notes
    id UUID
    name VARCHAR(100)
    phone VARCHAR(20)
    email VARCHAR(100)
    role ENUM(admin, super_admin)
    assigned_condominium VARCHAR(100) nullable
    password_hash TEXT
12. condominiums
    Field Type Notes
    id UUID
    name VARCHAR(100) e.g. “Summit Site A”
    location VARCHAR(200)
    total_blocks INT
    created_at DATETIME
    approved_by FK → admins(id)
13. audit_logs
    Field Type Notes
    id UUID
    actor_id FK → admins/residents(id) polymorphic
    action TEXT e.g. “Updated house info”
    target_table VARCHAR(50)
    timestamp DATETIME
    ip_address VARCHAR(45)
    ⚙️ Relationships Summary

resident → parking_slots (1-to-many)

resident → utilities (1-to-many)

resident → complaints (1-to-many)

ekub_eddir ↔ residents (many-to-many via ekub_eddir_members)

service_providers ↔ residents (many-to-many via service_payments)

admins → announcements (1-to-many)

condominiums → residents (1-to-many)
