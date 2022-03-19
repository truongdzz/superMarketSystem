DROP DATABASE IF EXISTS shibamarket;
CREATE DATABASE shibamarket;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `user` (
    `id` int(11) NOT NULL PRIMARY KEY,
  	`phone` int(11) NOT NULL,
  	`point` int(11) DEFAULT NULL,
	`name` varchar(100) DEFAULT NULL,
	`username` varchar(250) DEFAULT NULL,
	`password` varchar(250) DEFAULT NULL
);

INSERT INTO `user` VALUES
(1, '0772026629', 100, 'Nguyễn Văn A', 'adeptrai123', '123456')
;

CREATE TABLE `category` (
  `id` int(11) NOT NULL PRIMARY KEY,
  `name` varchar(55) DEFAULT NULL
);

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

CREATE TABLE `shelf` (
	`position` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` varchar(55) DEFAULT NULL
);

INSERT INTO `shelf` (`position`, `name`) VALUES
(1, 'Hàng 1 dãy 1'),
(2, 'Hàng 2 dãy 1'),
(3, 'Hàng 1 dãy 2'),
(4, 'Hàng 2 dãy 2'),
(23, 'Dãy cuối');


CREATE TABLE `goods` (
  	`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` varchar(25) DEFAULT NULL,
	`description` text DEFAULT NULL,
	`buyPrice` int(25) DEFAULT NULL,
	`sellPrice` int(25) DEFAULT NULL,
	`discount` float(11) DEFAULT NULL, 
	`amount` int(11) DEFAULT NULL,
	`category`int(11) DEFAULT NULL,
	`position` int(11) DEFAULT NULL,
    
    FOREIGN KEY (category) REFERENCES category(id),
    FOREIGN KEY (position) REFERENCES shelf(position)
);

INSERT INTO `goods` (`id`, `name`, `description`, `buyPrice`, `sellPrice`, `discount`, `amount`, `category`, `position`) VALUES
 (1, 'Rau muốn', 'Rau củ xanh tươi nhập khẩu từ nước ngoài (Lào)', 30000, 40000, 0.1, 100, 1, 1),
 (2, 'Áo thun MENDE', 'Local brand nổi tiếng ở Việt Nam', 200000, 250000, 0.1, 50, 2, 2);



CREATE TABLE `shift` (
	`number` int(11) NOT NULL PRIMARY KEY,
	`startTime` time NOT NULL,
    `endTime` time NOT NULL
);


INSERT INTO `shift` (`number`, `startTime`, `endTime`) VALUES 
	(1, '07:00:00', '11:00:00'),
	(2, '12:00:00', '16:00:00'),
    (3, '17:00:00', '22:00:00')
;

CREATE TABLE `staff` (
	`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `phone` varchar(11) DEFAULT NULL,
	`type` varchar(50) DEFAULT NULL,
	`salaryBase` int(25) DEFAULT NULL,
    `name` varchar(55) DEFAULT NULL,
    `username` varchar(250) NOT NULL,
    `password` varchar(250) NOT NULL
);

INSERT INTO `staff` (`id`, `phone`, `type`, `salaryBase`, `name`, `username`, `password`) VALUES 
(1, '0584822138', 'admin', 10000000, 'John', 'john123', '123456')
;

CREATE TABLE `schedule`(
    `staff` int(11) NOT NULL,
    `day` varchar(20) NOT NULL,
    `shift` int(11) NOT NULL,
    
    CONSTRAINT PK_schedule PRIMARY KEY (staff,day,shift),
    FOREIGN KEY (staff) REFERENCES staff(id),
    FOREIGN KEY (shift) REFERENCES shift(number)
);

INSERT INTO `schedule` VALUES
(1, 'Monday', 1);

CREATE TABLE chat(
    `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`sender` int(11) NOT NULL,
    `reciever` int(11) NOT NULL,
    `content` text NOT NULL,
    `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    
    FOREIGN KEY (sender) REFERENCES staff(id),
    FOREIGN KEY (reciever) REFERENCES staff(id)
);


CREATE TABLE `order` (
	`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`userid` int(11) DEFAULT NULL,
	`date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`type` int(11) DEFAULT NULL,
	`price` int(25) DEFAULT NULL,
	`status` varchar(25) DEFAULT 'wait',
	`staffid` int(11) DEFAULT NULL,
    
    FOREIGN KEY (userid) REFERENCES `user`(id),
    FOREIGN KEY (staffid) REFERENCES staff(id)
);

INSERT INTO `order` (`id`, `userid`, `date`, `type`, `price`, `status`, `staffid`) VALUES 
(1, 1, current_timestamp(), 'online', 100000, 'waiting', 1);

CREATE TABLE `goodsInOrder`(
	`goodID` int(11) NOT NULL,
    `amount` int(11) NOT NULL,
    `orderID` int(11) NOT NULL,
    
    CONSTRAINT PK_goodsInOrder PRIMARY KEY (goodID,orderID),
    FOREIGN KEY (goodID) REFERENCES goods(id),
    FOREIGN KEY (orderID) REFERENCES `order`(`id`)
);

CREATE TABLE importOrder(
	`good` int(11) NOT NULL,
    `amount` int(11) NOT NULL,
    `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `staff` int(11) NOT NULL,
    
    
    CONSTRAINT `PK_importOrder` PRIMARY KEY (`good`,`time`,`staff`),
    FOREIGN KEY (good) REFERENCES goods(id),
    FOREIGN KEY (staff) REFERENCES staff(id)
);
