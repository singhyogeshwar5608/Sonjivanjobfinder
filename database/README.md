# Database Setup

## Default Admin Credentials
- **Email:** admin@jobfinder.com
- **Password:** password

## Setup Instructions

1. Import the schema.sql file into your MySQL database:
```bash
mysql -u root -p < schema.sql
```

Or use phpMyAdmin:
- Open phpMyAdmin
- Create a new database named `job_finder_db`
- Import the `schema.sql` file

2. Update database credentials in `backend/config/db.php` if needed:
```php
private $host = 'localhost';
private $db_name = 'job_finder_db';
private $username = 'root';
private $password = '';
```

## Database Structure

### Tables

**admins**
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- created_at

**jobs**
- id (Primary Key)
- title
- company
- location
- job_type
- salary
- description
- requirements
- status (active/inactive/closed)
- created_at
- updated_at

**applications**
- id (Primary Key)
- job_id (Foreign Key -> jobs.id)
- full_name
- email
- phone
- education
- skills
- profession
- languages
- experience
- bio
- contact_info
- profile_image
- created_at
