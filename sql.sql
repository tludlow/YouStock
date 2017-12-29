-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.18-log - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table yousell.bans
CREATE TABLE IF NOT EXISTS `bans` (
  `ban_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `banned_by` varchar(30) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reason` text NOT NULL,
  `unban_date` date NOT NULL,
  PRIMARY KEY (`ban_id`),
  KEY `FK_bans_users` (`username`),
  KEY `FK_bans_users_2` (`banned_by`),
  CONSTRAINT `FK_bans_users` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_bans_users_2` FOREIGN KEY (`banned_by`) REFERENCES `users` (`username`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table yousell.comments
CREATE TABLE IF NOT EXISTS `comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `posted_by` varchar(30) NOT NULL,
  `text` text NOT NULL,
  `posted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `FK_comments_posts` (`post_id`),
  KEY `FK_comments_users` (`posted_by`),
  CONSTRAINT `FK_comments_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comments_users` FOREIGN KEY (`posted_by`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table yousell.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(40) NOT NULL,
  `posted_by` varchar(30) NOT NULL,
  `body` text NOT NULL,
  `image` varchar(200) NOT NULL DEFAULT 'default',
  `posted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cost` varchar(20) NOT NULL,
  `sold` tinyint(4) NOT NULL DEFAULT '0',
  `removed` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`post_id`),
  KEY `FK_posts_users` (`posted_by`),
  CONSTRAINT `FK_posts_users` FOREIGN KEY (`posted_by`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table yousell.post_removals
CREATE TABLE IF NOT EXISTS `post_removals` (
  `removal_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `reason` varchar(300) NOT NULL,
  `removed_by` varchar(30) NOT NULL,
  UNIQUE KEY `removal_id` (`removal_id`),
  KEY `FK__posts5` (`post_id`),
  KEY `FK_post_removals_users` (`removed_by`),
  CONSTRAINT `FK__posts5` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_post_removals_users` FOREIGN KEY (`removed_by`) REFERENCES `users` (`username`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table yousell.sales
CREATE TABLE IF NOT EXISTS `sales` (
  `sale_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `sold_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(50) NOT NULL,
  `address` varchar(300) NOT NULL,
  `postcode` varchar(10) NOT NULL,
  PRIMARY KEY (`sale_id`),
  KEY `FK__posts` (`post_id`),
  KEY `FK__users` (`username`),
  CONSTRAINT `FK__posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK__users` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table yousell.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `email` varchar(70) NOT NULL,
  `password` varchar(70) NOT NULL,
  `banned` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rank` enum('user','admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
