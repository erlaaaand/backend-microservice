-- Database untuk Notification Service
CREATE DATABASE IF NOT EXISTS notification_db;
CREATE USER IF NOT EXISTS 'notif_user'@'%' IDENTIFIED BY 'notif_pass';
GRANT ALL PRIVILEGES ON notification_db.* TO 'notif_user'@'%';

-- Database untuk Auth Service
CREATE DATABASE IF NOT EXISTS auth_db;
CREATE USER IF NOT EXISTS 'auth_user'@'%' IDENTIFIED BY 'auth_pass';
GRANT ALL PRIVILEGES ON auth_db.* TO 'auth_user'@'%';

FLUSH PRIVILEGES;