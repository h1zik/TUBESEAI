-- Create user_service_db and its tables
CREATE DATABASE IF NOT EXISTS user_service_db;
USE user_service_db;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    account_balance DECIMAL(10, 2) DEFAULT 0.00
);

-- Create topup_service_db and its tables
CREATE DATABASE IF NOT EXISTS topup_service_db;
USE topup_service_db;
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10, 2),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE DATABASE IF NOT EXISTS main_app_db;
