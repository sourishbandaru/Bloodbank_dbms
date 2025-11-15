CREATE DATABASE IF NOT EXISTS bloodbank_management_db;
USE bloodbank_management_db;

CREATE TABLE Donors (
  donor_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  age INT,
  blood_type ENUM('A', 'B', 'AB', 'O') NOT NULL,
  rh_factor ENUM('+', '-') NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  address VARCHAR(255),
  last_donation_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BloodInventory (
  unit_id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  blood_type ENUM('A', 'B', 'AB', 'O') NOT NULL,
  rh_factor ENUM('+', '-') NOT NULL,
  collection_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status ENUM('Available', 'Reserved', 'Expired', 'Used') DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES Donors(donor_id) ON DELETE CASCADE
);

CREATE TABLE Recipients (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_name VARCHAR(100) NOT NULL,
  patient_age INT,
  hospital_name VARCHAR(100) NOT NULL,
  contact_number VARCHAR(15),
  blood_type ENUM('A', 'B', 'AB', 'O') NOT NULL,
  rh_factor ENUM('+', '-') NOT NULL,
  quantity_required INT NOT NULL,
  status ENUM('Pending', 'Fulfilled', 'Cancelled') DEFAULT 'Pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Staff (
  staff_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Technician') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin user (password: admin123)
INSERT INTO Staff (username, hashed_password, role) 
VALUES ('admin', '$2b$10$YourHashedPasswordHere', 'Admin');
