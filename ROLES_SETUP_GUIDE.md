# Role-Based Access Control Setup Guide

## Overview
You can now have different types of admin users with restricted access:
- **admin** - Full access to all sections (default)
- **appointments_only** - Can only access the Appointments tab
- **viewer** - Read-only access (future use)

## How to Set Up an Appointments-Only User

### Option 1: Using Supabase Dashboard (Easiest)

1. **Create the user in Supabase:**
   - Go to Authentication > Users
   - Click "Add user" > "Create new user"
   - Enter email: `receptionist@example.com`
   - Set a password
   - Click "Create user"

2. **Set the role:**
   - Click on the newly created user
   - Click "Edit user"
   - Scroll to "User Metadata (raw_user_meta_data)"
   - Add this JSON:
     ```json
     {
       "role": "appointments_only"
     }
     ```
   - Click "Save"

3. **Done!** When this user logs in, they will only see the Appointments tab.

### Option 2: Using SQL (After creating user)

```sql
-- Get the user's UUID first
SELECT id, email FROM auth.users WHERE email = 'receptionist@example.com';

-- Set role using metadata
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "appointments_only"}'::jsonb
WHERE email = 'receptionist@example.com';
```

### Option 3: Using the user_roles table

```sql
-- Get the user's UUID
SELECT id, email FROM auth.users WHERE email = 'receptionist@example.com';

-- Insert role (replace USER_UUID with actual UUID)
INSERT INTO user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'appointments_only')
ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
```

## Testing

1. Log in with the appointments-only user email
2. You should see:
   - ✅ Only "Appointments" tab in the sidebar
   - ✅ "APPOINTMENTS ONLY" badge under the email
   - ✅ Can view and manage appointments
   - ❌ Cannot access Gallery, Feed, Blogs, Doctors, Ask Doctor

## Creating Multiple Users

You can create multiple appointments-only users (e.g., multiple receptionists):

```sql
-- Set role for multiple users
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "appointments_only"}'::jsonb
WHERE email IN (
    'receptionist1@example.com',
    'receptionist2@example.com',
    'receptionist3@example.com'
);
```

## Changing a User's Role

### To give full admin access:
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'user@example.com';
```

### To restrict to appointments only:
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "appointments_only"}'::jsonb
WHERE email = 'user@example.com';
```

## Viewing All Users and Their Roles

```sql
SELECT 
    u.email,
    u.raw_user_meta_data->>'role' as role_from_metadata,
    ur.role as role_from_table,
    u.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;
```

## Security Notes

1. **All existing users without a role will default to 'admin'** for backward compatibility
2. The role is checked both in the frontend (to hide tabs) and can be enforced in the backend (RPC functions)
3. Appointments-only users can:
   - ✅ View all appointments
   - ✅ Mark appointments as confirmed
   - ✅ Delete appointments
   - ❌ Access any other admin sections

## Troubleshooting

### User sees no tabs after login
- Check the role is set correctly
- Default role is 'admin' if not set
- Try logging out and back in

### User still sees all tabs
- Check role is set in metadata: `SELECT raw_user_meta_data FROM auth.users WHERE email = 'user@example.com';`
- Clear browser cache and refresh
- Verify code is deployed

### Role not updating after change
- Have the user log out and log back in
- Roles are loaded on login, not dynamically
