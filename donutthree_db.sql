-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 24, 2026 at 05:12 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `donutthree_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `items` text,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` int NOT NULL,
  `description` text,
  `img` varchar(255) DEFAULT NULL,
  `stock` int DEFAULT '20'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `nama`, `price`, `description`, `img`, `stock`) VALUES
(2, 'Strawberry Bliss', 10000, 'Glaze strawberry asli dengan taburan rainbow sprinkles.', 'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6', 7),
(3, 'Classic Glazed', 8000, 'Original donut kentang dengan gula halus manis pas.', 'https://images.unsplash.com/photo-1551106652-a5bcf4b29e57', 20),
(4, 'Donut Matcha', 3000, 'Enakk dan lembut', NULL, 7),
(6, 'Donut Chocolate', 8000, 'Dengan coklat yang lumer', 'https://placehold.co/400x400?text=Donut', 15);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `name`, `email`, `message`, `created_at`) VALUES
(7, 'Jordan', 'jordan@gmail.com', 'Enak bangetttttt\n', '2026-01-24 17:01:45');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `phone`, `password`, `created_at`) VALUES
(2, 'Zaky', 'zakyamar22@gmail.com', '085756973107', '$2b$10$Bx6WBE3b0jcs5uBpuUhnt.7MyTFXabsTdCBgo6ERPKBB8JMwis10.', '2026-01-21 06:47:36'),
(3, 'Jordan', 'jordan@gmail.com', '00000', '$2b$10$MA1pnMgpZ/5wqKV4NMdwFeSDJH.6bY9Qpu0SiiDAbey9/BHSK7EMS', '2026-01-21 07:16:37'),
(4, 'Oswald', '2403310036@gmail.com', '0895341469512', '$2b$10$DqV038SGX8b/4N5Z4QIhJe4/px74qweVH90EWPehKWyvU0K9T3E7S', '2026-01-21 07:24:11'),
(5, 'Bubu', 'siahaan@18gmail.com', '+628938298392', '$2b$10$qDznQHjYa2S81joleUkCZ.iFE.FHYI6nJRx6I7srgvxe0v8UDWDuG', '2026-01-24 08:24:20'),
(6, 'admin', 'admin@donut.com', '+628123456789', '$2b$10$1mSNS23XSQyoB1XjyiIfUev4wMaV05gypdBWmh6z4ri2BQSKxE7r6', '2026-01-24 08:24:53'),
(7, 'Zahwa', 'zahwa@gmail.com', '+6282165457839', '$2b$10$UyziadfmmBjMqJvz5iVVR.gZmokToyKhc/kof5k1UiLxLhQ2fvA/C', '2026-01-24 15:18:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
