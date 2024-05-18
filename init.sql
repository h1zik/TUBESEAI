CREATE DATABASE IF NOT EXISTS user_service_db;
CREATE DATABASE IF NOT EXISTS topup_service_db;
CREATE DATABASE IF NOT EXISTS main_app_db;

-- Switch to the new database
USE user_service_db;

-- Create the users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    account_balance DECIMAL(10, 2) DEFAULT 0.00
);