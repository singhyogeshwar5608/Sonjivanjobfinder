# Quick Setup Guide - Job Finder Application

## 🚀 Quick Start (Local Development)

### Step 1: Database Setup (5 minutes)

1. **Start XAMPP/WAMP:**
   - Start Apache and MySQL

2. **Create Database:**
   ```bash
   # Open phpMyAdmin (http://localhost/phpmyadmin)
   # Or use MySQL command line:
   mysql -u root -p
   ```

3. **Import Schema:**
   - In phpMyAdmin: Import `database/schema.sql`
   - Or via command line:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

### Step 2: Backend Setup (5 minutes)

1. **Copy Backend Files:**
   ```bash
   # Copy backend folder to XAMPP htdocs
   cp -r backend C:/xampp/htdocs/sonjivan_job_finder/backend
   ```

2. **Install FPDF Library:**
   ```bash
   cd C:/xampp/htdocs/sonjivan_job_finder/backend
   composer install
   ```
   
   **If you don't have Composer:**
   - Download FPDF from: http://www.fpdf.org/
   - Extract `fpdf.php` to `backend/vendor/fpdf/fpdf.php`

3. **Verify Backend:**
   - Open: `http://localhost/sonjivan_job_finder/backend/`
   - Should see JSON response with API status

### Step 3: Frontend Setup (5 minutes)

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API URL:**
   - File: `frontend/.env`
   - Content:
   ```
   VITE_API_URL=http://localhost/sonjivan_job_finder/backend
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   - Frontend runs on: `http://localhost:3000`

### Step 4: Test Application

1. **Visit Landing Page:**
   - URL: `http://localhost:3000`
   - Should see job listings

2. **Test Admin Login:**
   - URL: `http://localhost:3000/admin/login`
   - Email: `admin@jobfinder.com`
   - Password: `password`

3. **Test Application Flow:**
   - Click "Apply Now" on any job
   - Fill out the application form
   - Submit and verify in admin dashboard

---

## 🌐 Production Deployment (Shared Hosting)

### Step 1: Prepare Files

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```
   - Build output in `frontend/dist/`

2. **Update Production API URL:**
   - Edit `frontend/.env` before building:
   ```
   VITE_API_URL=https://yourdomain.com/backend
   ```

### Step 2: Upload to cPanel

1. **Upload Backend:**
   - Via File Manager or FTP
   - Upload `backend` folder to `public_html/backend`
   - Ensure folder structure is maintained

2. **Upload Frontend:**
   - Upload contents of `frontend/dist/` to `public_html/`
   - Or to a subdomain folder

### Step 3: Database Setup on cPanel

1. **Create MySQL Database:**
   - cPanel → MySQL Databases
   - Create database: `username_jobfinder`
   - Create user with password
   - Assign user to database with ALL PRIVILEGES

2. **Import Schema:**
   - cPanel → phpMyAdmin
   - Select your database
   - Import `database/schema.sql`

3. **Update Database Credentials:**
   - Edit `backend/config/db.php`:
   ```php
   private $host = 'localhost';
   private $db_name = 'username_jobfinder';
   private $username = 'username_dbuser';
   private $password = 'your_password';
   ```

### Step 4: Configure Permissions

1. **Set Folder Permissions:**
   ```bash
   chmod 755 backend/uploads
   ```
   - Or via cPanel File Manager: Right-click → Change Permissions → 755

2. **Verify .htaccess Files:**
   - Ensure `backend/.htaccess` exists
   - Create `public_html/.htaccess` for React Router:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Step 5: Install FPDF on Server

**Option 1: Via Composer (if available):**
```bash
cd public_html/backend
composer install
```

**Option 2: Manual Upload:**
1. Download FPDF from: http://www.fpdf.org/
2. Upload `fpdf.php` to `backend/vendor/fpdf/fpdf.php`

### Step 6: Test Production Site

1. **Test Backend:**
   - Visit: `https://yourdomain.com/backend/`
   - Should return JSON response

2. **Test Frontend:**
   - Visit: `https://yourdomain.com/`
   - Should load landing page

3. **Test Admin:**
   - Visit: `https://yourdomain.com/admin/login`
   - Login with default credentials

---

## 🔧 Common Issues & Solutions

### Issue: CORS Error

**Solution:**
```apache
# Add to backend/.htaccess
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
```

### Issue: 404 on React Routes

**Solution:**
Create `.htaccess` in frontend root with React Router configuration (see above)

### Issue: Database Connection Failed

**Solution:**
1. Verify database credentials in `backend/config/db.php`
2. Check database exists in phpMyAdmin
3. Ensure database user has proper privileges

### Issue: File Upload Not Working

**Solution:**
1. Check `backend/uploads/` folder exists
2. Set permissions: `chmod 755 backend/uploads`
3. Verify `MAX_FILE_SIZE` in `backend/config/config.php`

### Issue: PDF Generation Error

**Solution:**
1. Ensure FPDF library is installed
2. Check file path in `backend/api/pdf/generate.php`
3. Verify `backend/vendor/fpdf/fpdf.php` exists

### Issue: Admin Can't Login

**Solution:**
1. Verify admin exists in database:
   ```sql
   SELECT * FROM admins;
   ```
2. Reset admin password:
   ```sql
   UPDATE admins SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@jobfinder.com';
   ```
   (Password: `password`)

---

## 📊 Verification Checklist

- [ ] Database created and schema imported
- [ ] Backend accessible and returns JSON
- [ ] Frontend loads landing page
- [ ] Job listings display correctly
- [ ] Application form submits successfully
- [ ] Admin login works
- [ ] Admin can create/edit/delete jobs
- [ ] Admin can view applications
- [ ] Filters work in admin dashboard
- [ ] PDF download works
- [ ] Mobile responsive design works
- [ ] Bottom navigation visible on mobile

---

## 🎯 Default Credentials

**Admin Login:**
- Email: `admin@jobfinder.com`
- Password: `password`

**⚠️ IMPORTANT:** Change admin password after first login!

```sql
-- Generate new password hash in PHP:
<?php echo password_hash('your_new_password', PASSWORD_DEFAULT); ?>

-- Update in database:
UPDATE admins SET password = 'new_hash_here' WHERE email = 'admin@jobfinder.com';
```

---

## 📞 Need Help?

1. Check the main README.md for detailed documentation
2. Review API endpoints in README.md
3. Check browser console for errors
4. Verify backend PHP error logs
5. Test API endpoints directly using Postman/curl

---

**Setup Complete! 🎉**

Your Job Finder application is now ready to use!
