# Backend API Documentation

## Overview

Core PHP backend API for Job Finder application. No framework used - pure PHP with PDO for database operations.

## Requirements

- PHP 7.4+
- MySQL 5.7+
- Apache with mod_rewrite
- Composer (for FPDF)

## Installation

```bash
composer install
```

## Configuration

### Database Configuration
Edit `config/db.php`:
```php
private $host = 'localhost';
private $db_name = 'job_finder_db';
private $username = 'root';
private $password = '';
```

### Upload Configuration
Edit `config/config.php`:
```php
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
```

### JWT Secret
Edit `config/config.php`:
```php
define('JWT_SECRET', 'your_secret_key_change_in_production');
```

## API Endpoints

### Public Endpoints

#### Get All Jobs
```
GET /api/jobs/index.php
GET /api/jobs/index.php?status=active

Response:
{
  "success": true,
  "jobs": [...]
}
```

#### Get Single Job
```
GET /api/jobs/index.php?id=1

Response:
{
  "success": true,
  "job": {...}
}
```

#### Submit Application
```
POST /api/applications/index.php
Content-Type: multipart/form-data

Fields:
- job_id (required)
- full_name (required)
- email (required)
- phone (required)
- education
- skills
- profession
- languages
- experience
- bio
- contact_info
- profile_image (file)

Response:
{
  "success": true,
  "application_id": 1,
  "message": "Application submitted successfully"
}
```

### Admin Endpoints (Require Authentication)

#### Admin Login
```
POST /api/admin/login.php
Content-Type: application/json

Body:
{
  "email": "admin@jobfinder.com",
  "password": "password"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "admin": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@jobfinder.com"
  }
}
```

#### Verify Token
```
GET /api/admin/verify.php
Authorization: Bearer {token}

Response:
{
  "success": true,
  "admin": {...}
}
```

#### Create Job
```
POST /api/jobs/index.php
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "title": "Job Title",
  "company": "Company Name",
  "location": "Location",
  "job_type": "Full-time",
  "salary": "$50,000 - $70,000",
  "description": "Job description",
  "requirements": "Job requirements",
  "status": "active"
}

Response:
{
  "success": true,
  "job_id": 1,
  "message": "Job created successfully"
}
```

#### Update Job
```
PUT /api/jobs/index.php
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "id": 1,
  "title": "Updated Title",
  ...
}

Response:
{
  "success": true,
  "message": "Job updated successfully"
}
```

#### Delete Job
```
DELETE /api/jobs/index.php
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "id": 1
}

Response:
{
  "success": true,
  "message": "Job deleted successfully"
}
```

#### Get Applications (with filters)
```
GET /api/applications/index.php
Authorization: Bearer {token}

Query Parameters:
- job_id: Filter by job
- skills: Filter by skills (partial match)
- profession: Filter by profession (partial match)
- min_experience: Minimum years of experience
- max_experience: Maximum years of experience
- search: Search by name, email, or phone

Response:
{
  "success": true,
  "applications": [...]
}
```

#### Get Applicant Profile
```
GET /api/profiles/index.php?id=1
Authorization: Bearer {token}

Response:
{
  "success": true,
  "profile": {...}
}
```

#### Generate PDF
```
GET /api/pdf/generate.php?id=1&type=profile
Authorization: Bearer {token}

Response: PDF file download
```

## Authentication

JWT-based authentication using custom implementation.

**Token Generation:**
- Login endpoint generates JWT token
- Token expires in 24 hours
- Token includes user_id and email

**Token Verification:**
- Include token in Authorization header: `Bearer {token}`
- Token is verified on each protected endpoint
- Invalid/expired tokens return 401 Unauthorized

## Error Responses

```json
{
  "error": "Error message here"
}
```

HTTP Status Codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 405: Method Not Allowed
- 500: Internal Server Error

## File Upload

**Allowed Types:**
- image/jpeg
- image/png
- image/jpg
- image/webp

**Max Size:** 5MB

**Upload Directory:** `backend/uploads/`

**Filename Format:** `{uniqid}_{timestamp}.{extension}`

## Security Features

- Password hashing using `password_hash()` (bcrypt)
- SQL injection prevention using PDO prepared statements
- File upload validation (type and size)
- JWT token authentication
- CORS headers configured
- Input sanitization

## Database Schema

See `database/schema.sql` for complete schema.

**Tables:**
- `admins` - Admin users
- `jobs` - Job postings
- `applications` - Job applications

## CORS Configuration

CORS is enabled for all origins. For production, update headers in:
- `config/db.php`
- `.htaccess`

Restrict to specific domains:
```php
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

## Deployment

### Shared Hosting (cPanel)

1. Upload backend folder to `public_html/backend`
2. Create MySQL database via cPanel
3. Update `config/db.php` with database credentials
4. Run `composer install` or manually upload FPDF
5. Set permissions: `chmod 755 uploads`
6. Test: `https://yourdomain.com/backend/`

### Local Development (XAMPP)

1. Copy backend to `htdocs/sonjivan_job_finder/backend`
2. Import database schema
3. Update `config/db.php` if needed
4. Run `composer install`
5. Test: `http://localhost/sonjivan_job_finder/backend/`

## Troubleshooting

**Database Connection Failed:**
- Check credentials in `config/db.php`
- Verify database exists
- Ensure MySQL is running

**CORS Errors:**
- Check `.htaccess` configuration
- Verify `mod_headers` is enabled in Apache

**File Upload Errors:**
- Check `uploads` folder permissions
- Verify folder exists
- Check `MAX_FILE_SIZE` setting

**PDF Generation Errors:**
- Ensure FPDF library is installed
- Check `vendor/fpdf/fpdf.php` exists
- Verify file paths in `api/pdf/generate.php`

## Testing

Test endpoints using:
- Postman
- curl
- Browser (for GET requests)

Example curl request:
```bash
# Login
curl -X POST http://localhost/sonjivan_job_finder/backend/api/admin/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jobfinder.com","password":"password"}'

# Get jobs
curl http://localhost/sonjivan_job_finder/backend/api/jobs/index.php
```

## Support

For issues or questions, refer to main README.md or contact support.
