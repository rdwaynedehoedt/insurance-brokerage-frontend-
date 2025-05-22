-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 06:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `insurance_brokerage`
--

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` varchar(50) NOT NULL,
  `introducer_code` varchar(50) DEFAULT NULL,
  `customer_type` varchar(50) NOT NULL,
  `product` varchar(50) NOT NULL,
  `policy_` varchar(100) DEFAULT NULL,
  `insurance_provider` varchar(100) NOT NULL,
  `branch` varchar(100) DEFAULT NULL,
  `client_name` varchar(255) NOT NULL,
  `street1` varchar(255) DEFAULT NULL,
  `street2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `mobile_no` varchar(50) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `social_media` varchar(255) DEFAULT NULL,
  `nic_proof` varchar(255) DEFAULT NULL,
  `dob_proof` varchar(255) DEFAULT NULL,
  `business_registration` varchar(255) DEFAULT NULL,
  `svat_proof` varchar(255) DEFAULT NULL,
  `vat_proof` varchar(255) DEFAULT NULL,
  `policy_type` varchar(100) DEFAULT NULL,
  `policy_no` varchar(100) DEFAULT NULL,
  `policy_period_from` varchar(50) DEFAULT NULL,
  `policy_period_to` varchar(50) DEFAULT NULL,
  `coverage` varchar(255) DEFAULT NULL,
  `sum_insured` decimal(15,2) DEFAULT 0.00,
  `basic_premium` decimal(15,2) DEFAULT 0.00,
  `srcc_premium` decimal(15,2) DEFAULT 0.00,
  `tc_premium` decimal(15,2) DEFAULT 0.00,
  `net_premium` decimal(15,2) DEFAULT 0.00,
  `stamp_duty` decimal(15,2) DEFAULT 0.00,
  `admin_fees` decimal(15,2) DEFAULT 0.00,
  `road_safety_fee` decimal(15,2) DEFAULT 0.00,
  `policy_fee` decimal(15,2) DEFAULT 0.00,
  `vat_fee` decimal(15,2) DEFAULT 0.00,
  `total_invoice` decimal(15,2) DEFAULT 0.00,
  `debit_note` varchar(100) DEFAULT NULL,
  `payment_receipt` varchar(100) DEFAULT NULL,
  `commission_type` varchar(50) DEFAULT NULL,
  `commission_basic` decimal(15,2) DEFAULT 0.00,
  `commission_srcc` decimal(15,2) DEFAULT 0.00,
  `commission_tc` decimal(15,2) DEFAULT 0.00,
  `policies` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `coverage_proof` varchar(255) DEFAULT NULL,
  `sum_insured_proof` varchar(255) DEFAULT NULL,
  `policy_fee_invoice` varchar(255) DEFAULT NULL,
  `vat_debit_note` varchar(255) DEFAULT NULL,
  `business_registration_proof` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `introducer_code`, `customer_type`, `product`, `policy_`, `insurance_provider`, `branch`, `client_name`, `street1`, `street2`, `city`, `district`, `province`, `telephone`, `mobile_no`, `contact_person`, `email`, `social_media`, `nic_proof`, `dob_proof`, `business_registration`, `svat_proof`, `vat_proof`, `policy_type`, `policy_no`, `policy_period_from`, `policy_period_to`, `coverage`, `sum_insured`, `basic_premium`, `srcc_premium`, `tc_premium`, `net_premium`, `stamp_duty`, `admin_fees`, `road_safety_fee`, `policy_fee`, `vat_fee`, `total_invoice`, `debit_note`, `payment_receipt`, `commission_type`, `commission_basic`, `commission_srcc`, `commission_tc`, `policies`, `created_at`, `updated_at`, `coverage_proof`, `sum_insured_proof`, `policy_fee_invoice`, `vat_debit_note`, `business_registration_proof`) VALUES
('1', 'IC001', 'Individual', 'Motor Insurance', '', 'AIA Insurance', 'Colombo', 'John Fernandoo', '45 Galle Road', 'Apt 3B', 'Colombo', 'Colombo', 'Western', '0112345678', '0771234567', 'John Fernando', 'john.fernando@gmail.com', '@johnf', '', '', '', '', '', 'Comprehensive', 'POL-MT-2023-001', '2023-01-15', '2024-01-14', 'Full Coverage', 5000000.00, 45000.00, 5000.00, 3000.00, 53000.00, 250.00, 1500.00, 500.00, 1000.00, 6600.00, 62850.00, '', '', 'Percentage', 5400.00, 600.00, 360.00, 0, '2025-05-18 14:34:41', '2025-05-18 14:40:12', NULL, NULL, NULL, NULL, NULL),
('2', 'IC002', 'Corporate', 'Fire Insurance', NULL, 'Ceylinco Insurance', 'Negombo', 'ABC Enterprises', '78 Main Street', 'Floor 2', 'Negombo', 'Gampaha', 'Western', '0312267890', '0761234567', 'Samantha Perera', 'info@abcenterprises.lk', '@abcenterprises', NULL, NULL, NULL, NULL, NULL, 'Standard', 'POL-FI-2023-012', '2023-02-10', '2024-02-09', 'Fire & Lightning', 12000000.00, 120000.00, 15000.00, 7500.00, 142500.00, 500.00, 2000.00, 0.00, 1500.00, 17640.00, 164140.00, NULL, NULL, 'Percentage', 14400.00, 1800.00, 900.00, 0, '2025-05-18 14:34:41', '2025-05-18 14:34:41', NULL, NULL, NULL, NULL, NULL),
('3', 'IC003', 'Individual', 'Health Insurance', NULL, 'Union Assurance', 'Kandy', 'Priya Gunasekara', '23 Temple Road', '', 'Kandy', 'Kandy', 'Central', '0814563218', '0712345678', 'Priya Gunasekara', 'priya.g@yahoo.com', '@priyag', NULL, NULL, NULL, NULL, NULL, 'Premium', 'POL-HI-2023-036', '2023-03-20', '2024-03-19', 'Hospitalization', 2500000.00, 75000.00, 0.00, 0.00, 75000.00, 250.00, 1000.00, 0.00, 1000.00, 9270.00, 86520.00, NULL, NULL, 'Fixed', 9000.00, 0.00, 0.00, 0, '2025-05-18 14:34:41', '2025-05-18 14:34:41', NULL, NULL, NULL, NULL, NULL),
('5', 'IC005', 'Individual', 'Life Insurance', NULL, 'AIA Insurance', 'Galle', 'Lakshmi Silva', '56 Marine Drive', '', 'Galle', 'Galle', 'Southern', '0915678901', '0753456789', 'Lakshmi Silva', 'lakshmi.silva@hotmail.com', '', NULL, NULL, NULL, NULL, NULL, 'Term Life', 'POL-LF-2023-125', '2023-05-05', '2043-05-04', 'Death Benefit', 5000000.00, 87500.00, 0.00, 0.00, 87500.00, 250.00, 1000.00, 0.00, 1000.00, 10770.00, 100520.00, NULL, NULL, 'Fixed', 8750.00, 0.00, 0.00, 0, '2025-05-18 14:34:41', '2025-05-18 14:34:41', NULL, NULL, NULL, NULL, NULL),
('C6de9ae7b', '', 'Corporate', 'Marine', '', 'Allianz', '', 'qwe', '806 Galle road, Katukurunnda, Kalutara', '', 'Kalutara', '', '', '0772186241', '0772186241', 'Dwayne Dehoedt', 'dwaynedehoedt@gmail.com', '', '/uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/nic_proof-fd604ac6-c3ff-485a-a317-e119510a388c.jpg', '/uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/dob_proof-88f02908-63aa-4673-aeae-b62ffaea870d.jpg', NULL, '/uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/svat_proof-1a703c7b-638c-4023-a06e-dbdd5f3d8a07.jpg', '/uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/vat_proof-342cfbbf-b6a8-40c6-a110-23412518b770.jpg', '', '1231', '2025-05-05', '2025-05-16', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '', '/uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/payment_receipt-4c618d54-86e2-49c4-bdf8', '', 0.00, 0.00, 0.00, 0, '2025-05-18 15:27:42', '2025-05-18 15:27:42', '/uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/coverage_proof-ea1f2d89-ae7b-48c0-ac23-d8a52b4036ac.jpg', '/uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/sum_insured_proof-b507db5a-daa8-429b-b4a3-421d4d886865.jpg', '/uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/policy_fee_invoice-dc110d9b-3c85-4058-9751-5f9a7ca5d0a4.jpg', '/uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/vat_debit_note-d490c68e-8dca-45bc-862c-c6eafe932c4b.jpg', '/uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/business_registration_proof-71b08d0a-b657-462d-bf95-ddd1462c185c.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_client_name` (`client_name`),
  ADD KEY `idx_mobile_no` (`mobile_no`),
  ADD KEY `idx_policy_no` (`policy_no`),
  ADD KEY `idx_product` (`product`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
