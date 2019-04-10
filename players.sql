-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2019 at 01:34 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pew_pew`
--

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `FirstName` varchar(50) COLLATE utf8_bin NOT NULL,
  `LastName` varchar(50) COLLATE utf8_bin NOT NULL,
  `UserName` varchar(20) COLLATE utf8_bin NOT NULL,
  `Password` varchar(30) COLLATE utf8_bin NOT NULL,
  `Score` bigint(20) NOT NULL,
  `Email` varchar(50) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`FirstName`, `LastName`, `UserName`, `Password`, `Score`, `Email`) VALUES
('Vishrut', 'Sutaria', 'vsutaria', 'adfadfaef', 0, 'suta8636@mylaurier.ca'),
('Vishrut', 'Sutaria', 'vsutaria', '[object Promise]', 0, 'suta8636@mylaurier.ca'),
('Vishrut', 'Sutaria', 'vsutaria', 'undefined', 0, 'suta8636@mylaurier.ca'),
('Vishrut', 'Sutaria', 'vsutaria', 'undefined', 0, 'suta8636@mylaurier.ca'),
('Vishrut', 'Sutaria', 'vsutaria', 'undefined', 0, 'suta8636@mylaurier.ca');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
