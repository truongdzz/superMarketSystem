-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 28, 2022 at 04:13 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shibamarket`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(55) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Rau củ'),
(2, 'Trái cây'),
(3, 'Thực phẩm đóng gói'),
(4, 'Thực phẩm tươi'),
(5, 'Tạp hóa phẩm'),
(6, 'Nước uống'),
(7, 'Quần áo nam'),
(8, 'Quần áo nữ'),
(9, 'Gia dụng'),
(10, 'Đặc biệt');

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `sender` int(11) NOT NULL,
  `reciever` int(11) NOT NULL,
  `content` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `goods`
--

CREATE TABLE `goods` (
  `id` int(11) NOT NULL,
  `name` varchar(25) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `buyPrice` int(25) DEFAULT NULL,
  `sellPrice` int(25) DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `goods`
--

INSERT INTO `goods` (`id`, `name`, `description`, `buyPrice`, `sellPrice`, `discount`, `amount`, `category`, `position`) VALUES
(1, 'snack oshi bap', 'ko mo ta gi het', 2000, 5000, 0, 66, 3, 1),
(2, 'rau muốn', 'model adu vip', 4000, 7000, 0, 200, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `goodsInOrder`
--

CREATE TABLE `goodsInOrder` (
  `goodID` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `orderID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `goodsInOrder`
--

INSERT INTO `goodsInOrder` (`goodID`, `amount`, `orderID`) VALUES
(1, 3, 1),
(1, 7, 9),
(1, 1, 10),
(1, 5, 12);

-- --------------------------------------------------------

--
-- Table structure for table `importOrder`
--

CREATE TABLE `importOrder` (
  `good` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `staff` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `importOrder`
--

INSERT INTO `importOrder` (`good`, `amount`, `time`, `staff`) VALUES
(1, 100, '2022-03-25 06:36:01', 1),
(2, 200, '2022-03-26 15:18:53', 1);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` varchar(11) DEFAULT NULL,
  `price` int(25) DEFAULT NULL,
  `status` varchar(25) DEFAULT 'wait',
  `staffid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `userid`, `date`, `type`, `price`, `status`, `staffid`) VALUES
(1, 19, '2022-03-24 10:09:17', 'online', 15000, 'delivered', 1),
(2, 19, '2022-03-24 10:55:55', 'offline', NULL, 'pending', 1),
(4, NULL, '2022-03-27 09:23:42', 'offline', NULL, 'delivered', 8),
(5, NULL, '2022-03-27 09:30:36', 'offline', NULL, 'delivered', 8),
(6, NULL, '2022-03-27 09:34:59', 'offline', NULL, 'delivered', 8),
(7, NULL, '2022-03-27 09:35:26', 'offline', NULL, 'delivered', 8),
(8, NULL, '2022-03-27 09:35:57', 'offline', NULL, 'delivered', 8),
(9, NULL, '2022-03-27 09:37:25', 'offline', NULL, 'delivered', 8),
(10, NULL, '2022-03-27 12:44:00', 'offline', NULL, 'delivered', 8),
(11, NULL, '2022-03-27 12:53:09', 'offline', NULL, 'delivered', 8),
(12, NULL, '2022-03-27 12:56:38', 'offline', NULL, 'delivered', 8);

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `staff` int(11) NOT NULL,
  `day` varchar(20) NOT NULL,
  `shift` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `shelf`
--

CREATE TABLE `shelf` (
  `position` int(11) NOT NULL,
  `name` varchar(55) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `shelf`
--

INSERT INTO `shelf` (`position`, `name`) VALUES
(1, 'Hàng 1 dãy 1'),
(2, 'Hàng 2 dãy 1'),
(3, 'Hàng 1 dãy 2'),
(4, 'Hàng 2 dãy 2'),
(23, 'Dãy cuối');

-- --------------------------------------------------------

--
-- Table structure for table `shift`
--

CREATE TABLE `shift` (
  `number` int(11) NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `shift`
--

INSERT INTO `shift` (`number`, `startTime`, `endTime`) VALUES
(1, '07:00:00', '11:00:00'),
(2, '12:00:00', '16:00:00'),
(3, '17:00:00', '22:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `salaryBase` int(25) DEFAULT NULL,
  `name` varchar(55) DEFAULT NULL,
  `username` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `refreshToken` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `phone`, `role`, `salaryBase`, `name`, `username`, `password`, `refreshToken`) VALUES
(1, NULL, 'admin', NULL, NULL, 'truong', '$2b$10$BbiwSssPisVVMB.kOvifROYDUSFO.csoDP/GKNrLS3pvQtPvSsuo.', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJ1c2VybmFtZSI6InRydW9uZyJ9LCJpYXQiOjE2NDg0NzEyMTUsImV4cCI6MTY0ODU1NzYxNX0.QoI3jeplEEy6N0SYmpPQPSW3UsrzZMfQeHX7RSNGJOs'),
(8, NULL, 'cashier', NULL, NULL, 'thuNgan', '$2b$10$Ksy55mLFU2YS/Ao5ZuKJg.29e.uygQu0dvMi67YcN/B5qp./zDcJy', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJ1c2VybmFtZSI6InRodU5nYW4ifSwiaWF0IjoxNjQ4MzcyMTk1LCJleHAiOjE2NDg0NTg1OTV9.Ldt9qaaieaskN6qkwtVI6SqID1wgfnVO3kbXvoQ5cio'),
(9, NULL, 'admin', NULL, 'ahu', 'ahu', '$2b$10$m6yIW3vuzYn5wgu7O6LICebi15ADlZKjgaT4seeTOmPz6ZyAHJ5AC', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `point` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `username` varchar(250) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `refreshToken` text DEFAULT NULL,
  `dateCreated` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `phone`, `point`, `name`, `username`, `password`, `role`, `refreshToken`, `dateCreated`) VALUES
(19, '0772026629', 28, 'Nguyen Thi B', 'tommy', '$2b$10$JZr5EwWiWY0wI.jcG5zvdOzW1Jd/Fj4uQYeqrixFFNOrhv3gVl4rG', 'user', '', '2022-03-24 11:03:42'),
(23, '098890', NULL, 'Tran Van Giau', '098890', '$2b$10$YXJRqbiXKsW4N8Mo5Ndf.uE7C1qRSnEyhjdKnJ9Qqm.HJ/EjoUITm', 'user', NULL, '2022-03-27 12:56:38'),
(24, '7676758', NULL, 'Le Van Viet', '7676758', '$2b$10$r88yGfk2KcK1VRr9hyFz5OfoD.G9S6PDydTjVQvwq05n/wQmA7Emi', 'user', NULL, '2022-03-27 13:06:48'),
(25, '123554', NULL, 'Tran Van Khôn', '123554', '$2b$10$n19qe/x0F0SUw66U7Oo4v.NceeTMo5G0s.C.CylMeRLwFoTsEJ0vu', 'user', NULL, '2022-03-27 13:08:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender` (`sender`),
  ADD KEY `reciever` (`reciever`);

--
-- Indexes for table `goods`
--
ALTER TABLE `goods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`),
  ADD KEY `position` (`position`);

--
-- Indexes for table `goodsInOrder`
--
ALTER TABLE `goodsInOrder`
  ADD PRIMARY KEY (`goodID`,`orderID`),
  ADD KEY `orderID` (`orderID`);

--
-- Indexes for table `importOrder`
--
ALTER TABLE `importOrder`
  ADD PRIMARY KEY (`good`,`time`,`staff`),
  ADD KEY `staff` (`staff`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `staffid` (`staffid`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`staff`,`day`,`shift`),
  ADD KEY `shift` (`shift`);

--
-- Indexes for table `shelf`
--
ALTER TABLE `shelf`
  ADD PRIMARY KEY (`position`);

--
-- Indexes for table `shift`
--
ALTER TABLE `shift`
  ADD PRIMARY KEY (`number`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `goods`
--
ALTER TABLE `goods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `shelf`
--
ALTER TABLE `shelf`
  MODIFY `position` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`reciever`) REFERENCES `staff` (`id`);

--
-- Constraints for table `goods`
--
ALTER TABLE `goods`
  ADD CONSTRAINT `goods_ibfk_1` FOREIGN KEY (`category`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `goods_ibfk_2` FOREIGN KEY (`position`) REFERENCES `shelf` (`position`);

--
-- Constraints for table `goodsInOrder`
--
ALTER TABLE `goodsInOrder`
  ADD CONSTRAINT `goodsInOrder_ibfk_1` FOREIGN KEY (`goodID`) REFERENCES `goods` (`id`),
  ADD CONSTRAINT `goodsInOrder_ibfk_2` FOREIGN KEY (`orderID`) REFERENCES `order` (`id`);

--
-- Constraints for table `importOrder`
--
ALTER TABLE `importOrder`
  ADD CONSTRAINT `importOrder_ibfk_1` FOREIGN KEY (`good`) REFERENCES `goods` (`id`),
  ADD CONSTRAINT `importOrder_ibfk_2` FOREIGN KEY (`staff`) REFERENCES `staff` (`id`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`staffid`) REFERENCES `staff` (`id`);

--
-- Constraints for table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`staff`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `schedule_ibfk_2` FOREIGN KEY (`shift`) REFERENCES `shift` (`number`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
