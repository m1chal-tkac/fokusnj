/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `rezerv_sys`;
CREATE DATABASE IF NOT EXISTS `rezerv_sys` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `rezerv_sys`;

DROP TABLE IF EXISTS `pridavne_pole`;
CREATE TABLE IF NOT EXISTS `pridavne_pole` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_souteze` int unsigned NOT NULL,
  `nazev` varchar(50) DEFAULT NULL,
  `kategorie` enum('SKOLA','STUDENT') NOT NULL,
  `typ` enum('CISLO','TEXT') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pridavne_pole_id_souteze_foreign` (`id_souteze`),
  CONSTRAINT `pridavne_pole_id_souteze_foreign` FOREIGN KEY (`id_souteze`) REFERENCES `souteze` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `pridavne_pole`;

DROP TABLE IF EXISTS `skoly`;
CREATE TABLE IF NOT EXISTS `skoly` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `mesto` varchar(25) NOT NULL,
  `jmeno` varchar(75) NOT NULL,
  `adresa` varchar(25) NOT NULL,
  `nazev` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nazev` (`nazev`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `skoly`;
INSERT INTO `skoly` (`id`, `nazev`) VALUES
	(3, 'EDUCA, Nový Jičín'),
	(4, 'Gymnázium a SPŠEI, Frenštát pod Radhoštěm'),
	(5, 'Gymnázium Mikuláše Koperníka, Bílovec'),
	(6, 'Gymnázium, Nový Jičín'),
	(7, 'Hotelová škola, Frenštát pod Radhoštěm'),
	(9, 'Masarykovo gymnázium, Příbor'),
	(12, 'SPgŠ a SŠ, Odry'),
	(13, 'SŠ a VOŠ Kopřivnice'),
	(14, 'SŠ ekonomická Studénka'),
	(10, 'SŠ Mendelova IT, Nový Jičín'),
	(89, 'SŠ Mendelova obchodní, Nový Jičín'),
	(88, 'SŠ Mendelova zdravotní, Nový Jičín'),
	(16, 'SŠ Odry'),
	(15, 'SŠ technická a zemědělská, Nový Jičín'),
	(23, 'ZŠ a MŠ Frenštát pod Radhoštěm, Tyršova 913'),
	(18, 'ZŠ Albrechtičky'),
	(59, 'ZŠ Bartošovice'),
	(19, 'ZŠ Bernatice nad Odrou'),
	(20, 'ZŠ Bílovec, Komenského'),
	(47, 'ZŠ Bílovec, TGM'),
	(21, 'ZŠ Bravantice'),
	(85, 'ZŠ Frenštát pod Radhoštěm, Tyršova'),
	(24, 'ZŠ Frenštát pod Radhoštěm, Záhuní'),
	(66, 'ZŠ Fulnek, J. A. Komenského'),
	(82, 'ZŠ Fulnek, TGM'),
	(65, 'ZŠ Heřmanice u Oder'),
	(26, 'ZŠ Hladké Životice'),
	(22, 'ZŠ Hodslavice'),
	(27, 'ZŠ Hoštašovice'),
	(28, 'ZŠ Jakubčovice nad Odrou'),
	(29, 'ZŠ Jeseník nad Odrou'),
	(83, 'ZŠ Jistebník'),
	(30, 'ZŠ Kopřivnice, 17. listopadu'),
	(69, 'ZŠ Kopřivnice, Alšova'),
	(60, 'ZŠ Kopřivnice, dr. Milady Horákové'),
	(61, 'ZŠ Kopřivnice, Emila Zátopka'),
	(81, 'ZŠ Kopřivnice, svaté Zdislavy'),
	(31, 'ZŠ Kujavy'),
	(32, 'ZŠ Kunín'),
	(56, 'ZŠ Libhošť'),
	(33, 'ZŠ Lichnov'),
	(67, 'ZŠ Lubina'),
	(34, 'ZŠ Mankovice'),
	(68, 'ZŠ Mniší'),
	(35, 'ZŠ Mořkov'),
	(36, 'ZŠ Mošnov'),
	(64, 'ZŠ Nový Jičín, Galaxie'),
	(38, 'ZŠ Nový Jičín, Jubilejní'),
	(57, 'ZŠ Nový Jičín, Jubilejní - pracoviště Dlouhá'),
	(70, 'ZŠ Nový Jičín, Komenského 66'),
	(71, 'ZŠ Nový Jičín, Komenského 68'),
	(72, 'ZŠ Nový Jičín, Tyršova'),
	(74, 'ZŠ Odry, Komenského'),
	(75, 'ZŠ Odry, Pohořská'),
	(39, 'ZŠ Petřvald'),
	(25, 'ZŠ Příbor, Gaudi'),
	(76, 'ZŠ Příbor, Jičinská'),
	(73, 'ZŠ Příbor, Npor. Loma'),
	(40, 'ZŠ Pustějov'),
	(58, 'ZŠ Rybí'),
	(41, 'ZŠ Sedlnice'),
	(45, 'ZŠ Šenov'),
	(42, 'ZŠ Slatina'),
	(43, 'ZŠ Spálov'),
	(78, 'ZŠ Starý Jičín'),
	(46, 'ZŠ Štramberk'),
	(87, 'ZŠ Studénka, Butovická'),
	(63, 'ZŠ Studénka, Františka kardinála Tomáška'),
	(86, 'ZŠ Studénka, Sjednocení'),
	(44, 'ZŠ Suchdol nad Odrou'),
	(48, 'ZŠ Tichá'),
	(49, 'ZŠ Tísek'),
	(84, 'ZŠ Trnávka'),
	(8, 'ZŠ Trojanovice'),
	(50, 'ZŠ Velké Albrechtice'),
	(51, 'ZŠ Veřovice'),
	(52, 'ZŠ Vražné'),
	(53, 'ZŠ Závišice'),
	(54, 'ZŠ Ženklava'),
	(55, 'ZŠ Životice');

DROP TABLE IF EXISTS `souteze`;
CREATE TABLE IF NOT EXISTS `souteze` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(13) NOT NULL,
  `nazev` varchar(50) NOT NULL,
  `pocet_prihlasek` tinyint unsigned NOT NULL DEFAULT '0',
  `prihlasovani_od` date NOT NULL,
  `prihlasovani_do` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `souteze`;
INSERT INTO `souteze` (`id`, `url`, `nazev`, `pocet_prihlasek`, `prihlasovani_od`, `prihlasovani_do`) VALUES
	(147, '6638692b84165', 'Soutěž 1', 2, '2000-01-01', '2100-01-01');

DROP TABLE IF EXISTS `uzivatele`;
CREATE TABLE IF NOT EXISTS `uzivatele` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `heslo` char(60) DEFAULT NULL,
  `jmeno` varchar(20) NOT NULL,
  `prijmeni` varchar(20) NOT NULL,
  `spravce_systemu` tinyint(1) NOT NULL DEFAULT '0',
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `recovery_token` char(60) DEFAULT NULL,
  `create_token` char(60) DEFAULT NULL,
  `login_valid` int NOT NULL DEFAULT (unix_timestamp()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uzivatel_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `uzivatele`;
INSERT INTO `uzivatele` (`id`, `email`, `heslo`, `jmeno`, `prijmeni`, `spravce_systemu`, `admin`, `recovery_token`, `create_token`, `login_valid`) VALUES
	(1, 'admin@example.com', '$2y$10$.wnlSXED/rVkI8u6ukwm3e5lakBbJXjZ4cnM6OHS3iBLPcyZ0w.VS', 'Admin', '', 1, 1, NULL, NULL, 1714934917);

DROP DATABASE IF EXISTS `souteze`;
CREATE DATABASE IF NOT EXISTS `souteze` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `souteze`;

DROP TABLE IF EXISTS `147_soutez`;
CREATE TABLE IF NOT EXISTS `147_soutez` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `skola` int unsigned NOT NULL,
  `soutezici_skolni_kolo` tinyint unsigned NOT NULL,
  `ucitel_email` varchar(50) NOT NULL,
  `ucitel_telefon` char(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `skola` (`skola`),
  CONSTRAINT `147_soutez_ibfk_1` FOREIGN KEY (`skola`) REFERENCES `rezerv_sys`.`skoly` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `147_soutez`;
INSERT INTO `147_soutez` (`id`, `skola`, `soutezici_skolni_kolo`, `ucitel_email`, `ucitel_telefon`) VALUES
	(4, 18, 5, 'ucitel@example.com', '777888999');

DROP TABLE IF EXISTS `147_studenti`;
CREATE TABLE IF NOT EXISTS `147_studenti` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_prihlasky` int unsigned NOT NULL,
  `jmeno` varchar(20) NOT NULL,
  `prijmeni` varchar(20) NOT NULL,
  `datum_narozeni` date NOT NULL,
  `trida` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_prihlasky` (`id_prihlasky`),
  CONSTRAINT `147_studenti_ibfk_1` FOREIGN KEY (`id_prihlasky`) REFERENCES `147_soutez` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `147_studenti`;
INSERT INTO `147_studenti` (`id`, `id_prihlasky`, `jmeno`, `prijmeni`, `datum_narozeni`, `trida`) VALUES
	(7, 4, 'Jan', 'Novák', '2009-08-10', '8.A'),
	(8, 4, 'Eva', 'Novotná', '2009-04-07', '8.B');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
