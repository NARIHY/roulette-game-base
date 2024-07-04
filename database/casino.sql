-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 04 juil. 2024 à 10:00
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `casino`
--

-- --------------------------------------------------------

--
-- Structure de la table `scores`
--

DROP TABLE IF EXISTS `scores`;
CREATE TABLE IF NOT EXISTS `scores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `numero_gagnant` int DEFAULT NULL,
  `montant_mise` decimal(10,2) DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `cin` varchar(20) DEFAULT NULL,
  `telephone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mot_de_passe` varchar(255) DEFAULT NULL,
  `code_secret` varchar(255) DEFAULT NULL,
  `solde` decimal(10,2) DEFAULT '1000.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cin` (`cin`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `cin`, `telephone`, `email`, `mot_de_passe`, `code_secret`, `solde`) VALUES
(1, 'John', 'Doe', '10120000', '025455', 'doe@gmail.com', '1234', '1234', 6000.00),
(2, 'sdq', 'sdq', 'qsd', 'qsd', 'narihy@narihy.mg', '$2y$10$U1.tCsHIcohikbXLX6pZIezrGicFDpa0Pr12DmMp7IVRjImDcU9x.', '12345678', 1000.00),
(3, 'Nari', 'soa', '21124545', '341275102s', 'narihy@narihy.mgs', '$2y$10$VFRyrxoGhChFwV7dQoJSBeca13dr0xtRT4EF0sXtckmf1Jik/jjYq', '$2y$10$hkXnue53TTtAXct7285Q3uoam3Uin5qfUO6Lel..OM4cTthkbLC8y', 76000.00),
(4, 'tyyy', 'azzz', '27588528', '2822828', 'narihy@narihy.mgz', '$2y$10$xKfYs7Qnm3TBtuI2c56PoemUgxvmcl71y5TnftOCyP6tq8GTRxfLC', '$2y$10$pwmtFeqvf4pBh7undm9.5OdWCK54MEAS54aSJDR2.S/jnNfLBzPNO', 1000.00),
(5, 'Az', 'azzz', '8795522', '1234568', 'aze@aze.com', '$2y$10$.8EviXEw1V2yFRFiPuaEruov8q04XmH/aTm55vLxbLHziMQ9w0loC', '$2y$10$NTtkrS5WA4yc7WczZPcrsuvYlhhzc1A2vJKirQN897zi/o6BMOl/q', 1000.00),
(6, 'Anjatiana', 'is2m', '111111111', '111111111', 'h@h.com', '$2y$10$.jdA757ft2EmAgb.VL95muEbW5y1nlo4WB9dczqWkVRU6kl5Hurm2', '$2y$10$iM2KCKL0q7MzJHuYTcGVtOV.q4dsYQSqAu8fwCWmX9CYc9Jx/KlfS', 1000.00),
(7, 'test', 'test', '1234588888', '0333333', 'test@test.test', '$2y$10$7ihGvO3XO2XfzU8BcvCPO.8gi8leez0HDbQ8u.7ybGKRwcH9fS/8W', '$2y$10$yZLaMo4sNI3fiSfwi4XZbuzuL9Ts66wpXY/kGrGNoQHynP6VEhH22', 1000.00),
(8, 'guest', NULL, NULL, NULL, NULL, NULL, NULL, 100000.00),
(9, 'hu', 'hu', '1233', '2222222', 'hu@hu.hu', '$2y$10$2hGkJ90Cj6OzGtNrW9FyG.UhUcBZJ7nvIQ4LPxRbqWraC9geWhMuG', '$2y$10$KKsrdjHa.kSIK3i2xgbX0u2xbrEdxiac4Qelk.sYJRRxIo1lhHecS', 1000.00),
(10, 'hu', 'hu', '123348465', '222222256465', 'hu@hu.hus', '$2y$10$cVv6vp.geodKpylL6WudWOn0ii6JQ4JZzZgcHYMvINYoqogYWgB4u', '$2y$10$Jb6zrlBGZ1pVaiK/NuxSQeyQSNiZNjXLnlpmeBNivy/m4xPvxbVH6', 1000.00);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
