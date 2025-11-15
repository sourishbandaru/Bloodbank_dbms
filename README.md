# Blood Bank Management System

A comprehensive web-based Blood Bank Management System built with Node.js, Express, MySQL, and Vanilla JavaScript.

## Features

- **Dashboard**: Real-time inventory statistics by blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Donor Management**: Register donors with age, contact details, and address
- **Blood Inventory**: Track blood units with automatic expiry calculation (42 days from collection)
- **Blood Requests**: Manage patient blood requests with age and contact information
- **Automated Fulfillment**: Automatically marks blood units as 'Used' when fulfilling requests
- **Search & Filter**: Search donors and filter inventory by status
- **Status Tracking**: Color-coded status badges for inventory and requests

## Technology Stack

**Backend:**
- Node.js
- Express.js
- MySQL2
- bcrypt (password hashing)
- jsonwebtoken (authentication)
- dotenv (environment configuration)

**Frontend:**
- HTML5
- CSS3 (Red theme #c41e3a)
- Vanilla JavaScript
- Responsive design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Step 1: Clone or Download
Download the project to your local machine.

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Create Database
Open MySQL command line or MySQL Workbench and run:
```sql
CREATE DATABASE bloodbank_db;
```

### Step 4: Import Database Schema
```bash
mysql -u root -p bloodbank_db < schema.sql
```

### Step 5: Configure Environment Variables
Edit `backend/.env` file with your database credentials:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bloodbank_db
JWT_SECRET=your_secret_key_here_change_this
```

### Step 6: Create Admin User
Generate a bcrypt hash for your password and insert into Staff table:
```javascript
// Run this in Node.js or create a script
const bcrypt = require('bcrypt');
bcrypt.hash('admin123', 10, (err, hash) => {
  console.log(hash);
});
```

Then insert into database:
```sql
INSERT INTO Staff (username, hashed_password, role) 
VALUES ('admin', 'YOUR_GENERATED_HASH', 'Admin');
```

### Step 7: Start the Server
```bash
cd backend
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Step 8: Access the Application
Open your browser and navigate to:
