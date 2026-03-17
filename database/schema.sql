CREATE DATABASE IF NOT EXISTS job_finder_db;
USE job_finder_db;

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    job_type VARCHAR(50),
    salary VARCHAR(100),
    description TEXT,
    requirements TEXT,
    status ENUM('active', 'inactive', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    education TEXT,
    skills TEXT,
    profession VARCHAR(100),
    languages VARCHAR(200),
    experience INT DEFAULT 0,
    bio TEXT,
    contact_info TEXT,
    profile_image VARCHAR(255),
    document_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS application_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    doc_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

INSERT INTO admins (name, email, password) VALUES 
('Admin User', 'admin@jobfinder.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO jobs (title, company, location, job_type, salary, description, requirements, status) VALUES
('Senior Full Stack Developer', 'Tech Solutions Inc', 'Remote', 'Full-time', '$80,000 - $120,000', 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will work on cutting-edge projects using modern technologies.', 'React, Node.js, PHP, MySQL, 5+ years experience', 'active'),
('UI/UX Designer', 'Creative Agency', 'New York, NY', 'Full-time', '$60,000 - $90,000', 'Join our creative team to design beautiful and intuitive user interfaces for web and mobile applications.', 'Figma, Adobe XD, Portfolio required, 3+ years experience', 'active'),
('Digital Marketing Specialist', 'Marketing Pro', 'Los Angeles, CA', 'Part-time', '$40,000 - $60,000', 'Help businesses grow their online presence through strategic digital marketing campaigns.', 'SEO, SEM, Social Media Marketing, Google Analytics', 'active');
