CREATE DATABASE IF NOT EXISTS `IdIoT_Middleware`;
USE `IdIoT_Middleware`;

-- Table structure for table `devices`
CREATE TABLE IF NOT EXISTS `devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `number_of_pins` int DEFAULT NULL,
  `chosen_usecase` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `sensor_data`
CREATE TABLE IF NOT EXISTS `sensor_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_id` int default NULL,
  `temperature` int default NULL,
  `humidity` int default NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `sensor_data_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
