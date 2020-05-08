-- MySQL dump 10.13  Distrib 5.6.48, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: boilerplate
-- ------------------------------------------------------
-- Server version	5.6.48

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `boilerplate`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `boilerplate` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `boilerplate`;

--
-- Table structure for table `auth_assignment`
--

DROP TABLE IF EXISTS `auth_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_assignment` (
  `item_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`item_name`,`user_id`),
  KEY `idx-auth_assignment-user_id` (`user_id`),
  CONSTRAINT `auth_assignment_ibfk_1` FOREIGN KEY (`item_name`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_assignment`
--

LOCK TABLES `auth_assignment` WRITE;
/*!40000 ALTER TABLE `auth_assignment` DISABLE KEYS */;
INSERT INTO `auth_assignment` VALUES ('admin','1',1588923261),('manageSettings','2',1588923261),('manageStaffs','2',1588923261),('manageUsers','2',1588923261),('staff','2',1588923261),('user','3',1588923261);
/*!40000 ALTER TABLE `auth_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_item`
--

DROP TABLE IF EXISTS `auth_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_item` (
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `type` smallint(6) NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `rule_name` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `data` blob,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`name`),
  KEY `rule_name` (`rule_name`),
  KEY `idx-auth_item-type` (`type`),
  CONSTRAINT `auth_item_ibfk_1` FOREIGN KEY (`rule_name`) REFERENCES `auth_rule` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_item`
--

LOCK TABLES `auth_item` WRITE;
/*!40000 ALTER TABLE `auth_item` DISABLE KEYS */;
INSERT INTO `auth_item` VALUES ('admin',1,'Administrator',NULL,NULL,1588923261,1588923261),('manageSettings',2,'Manage settings',NULL,NULL,1588923261,1588923261),('manageStaffs',2,'Manage staffs',NULL,NULL,1588923261,1588923261),('manageUsers',2,'Manage users',NULL,NULL,1588923261,1588923261),('staff',1,'Staff',NULL,NULL,1588923261,1588923261),('user',1,'User',NULL,NULL,1588923261,1588923261);
/*!40000 ALTER TABLE `auth_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_item_child`
--

DROP TABLE IF EXISTS `auth_item_child`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_item_child` (
  `parent` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `child` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`parent`,`child`),
  KEY `child` (`child`),
  CONSTRAINT `auth_item_child_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `auth_item_child_ibfk_2` FOREIGN KEY (`child`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_item_child`
--

LOCK TABLES `auth_item_child` WRITE;
/*!40000 ALTER TABLE `auth_item_child` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_item_child` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_rule`
--

DROP TABLE IF EXISTS `auth_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_rule` (
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `data` blob,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_rule`
--

LOCK TABLES `auth_rule` WRITE;
/*!40000 ALTER TABLE `auth_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migration`
--

DROP TABLE IF EXISTS `migration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migration` (
  `version` varchar(180) NOT NULL,
  `apply_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migration`
--

LOCK TABLES `migration` WRITE;
/*!40000 ALTER TABLE `migration` DISABLE KEYS */;
INSERT INTO `migration` VALUES ('m000000_000000_base',1588923261),('m140506_102106_rbac_init',1588923261),('m170125_081951_create_setting_table',1588923261),('m170125_082006_create_user_table',1588923261),('m170506_004517_init_rbac',1588923261),('m170907_052038_rbac_add_index_on_auth_assignment_user_id',1588923261),('m180523_151638_rbac_updates_indexes_without_prefix',1588923261),('m200409_110543_rbac_update_mssql_trigger',1588923261);
/*!40000 ALTER TABLE `migration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_name` varchar(255) DEFAULT NULL,
  `meta_type` varchar(50) DEFAULT NULL,
  `meta_desc` text,
  `meta_attribute` text,
  `meta_value` longtext,
  `is_public` tinyint(1) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx-setting` (`meta_key`,`meta_type`,`is_public`,`status`,`created_at`,`updated_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES (1,'timezone','Timezone','select','Set the time zone of the application','{\"list\":[{\"value\":\"Australia/Adelaide\",\"label\":\"Australia/Adelaide\"},{\"value\":\"Australia/Brisbane\",\"label\":\"Australia/Brisbane\"},{\"value\":\"Australia/Canberra\",\"label\":\"Australia/Canberra\"},{\"value\":\"Australia/Hobart\",\"label\":\"Australia/Hobart\"},{\"value\":\"Australia/Melbourne\",\"label\":\"Australia/Melbourne\"},{\"value\":\"Australia/Perth\",\"label\":\"Australia/Perth\"},{\"value\":\"Australia/Sydney\",\"label\":\"Australia/Sydney\"}]}','Australia/Melbourne',1,1,'2020-05-08 07:34:21','2020-05-08 07:34:21'),(2,'test_setting1','Test Setting1','number','Test Setting Description','','15',1,1,'2020-05-08 07:34:21','2020-05-08 07:34:21'),(3,'test_setting2','Test Setting2','text','Test Setting Description','','value',1,1,'2020-05-08 07:34:21','2020-05-08 07:34:21');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `auth_key` varchar(255) DEFAULT NULL,
  `access_token_expired_at` int(11) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `unconfirmed_email` varchar(255) DEFAULT NULL,
  `confirmed_at` int(11) DEFAULT NULL,
  `registration_ip` varchar(20) DEFAULT NULL,
  `last_login_at` int(11) DEFAULT NULL,
  `last_login_ip` varchar(20) DEFAULT NULL,
  `blocked_at` int(11) DEFAULT NULL,
  `status` int(2) DEFAULT '10',
  `role` int(11) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx-user` (`username`,`auth_key`,`password_hash`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','dVN8fzR_KzJ_lBrymfXI6qyH2QzyXYUU',1589009685,'$2y$13$9Gouh1ZbewVEh4bQIGsifOs8/RWW/7RIs0CAGNd7tapXFm9.WxiXS',NULL,'admin@demo.com','admin@demo.com',1588923261,'127.0.0.1',1588923285,'172.26.0.7',NULL,10,99,1588923261,1588923285),(2,'staff','Xm-zZRREtAIKsFlINVRLSw3U7llbx_5a',1588923261,'$2y$13$TKh5pEy0RFTmkC9Kjvb9A.WR/I1QVzYHdfYDw0m7MnHnN0bsv96Jq',NULL,'staff@demo.com','staff@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,50,1588923261,1588923261),(4,'user1','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user1@demo.com','user1@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(5,'user2','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user2@demo.com','user2@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(6,'user3','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user3@demo.com','user3@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(7,'user4','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user4@demo.com','user4@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(8,'user5','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user5@demo.com','user5@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(9,'user6','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user6@demo.com','user6@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(10,'user7','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user7@demo.com','user7@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(11,'user8','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user8@demo.com','user8@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(12,'user9','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user9@demo.com','user9@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(13,'user10','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user10@demo.com','user10@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(14,'user11','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user11@demo.com','user11@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(15,'user12','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user12@demo.com','user12@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(16,'user13','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user13@demo.com','user13@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(17,'user14','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user14@demo.com','user14@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(18,'user15','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user15@demo.com','user15@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(19,'user16','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user16@demo.com','user16@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(20,'user17','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user17@demo.com','user17@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(21,'user18','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user18@demo.com','user18@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(22,'user19','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user19@demo.com','user19@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(23,'user20','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user20@demo.com','user20@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(24,'user21','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user21@demo.com','user21@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(25,'user22','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user22@demo.com','user22@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(26,'user23','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user23@demo.com','user23@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(27,'user24','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user24@demo.com','user24@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(28,'user25','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user25@demo.com','user25@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(29,'user26','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user26@demo.com','user26@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(30,'user27','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user27@demo.com','user27@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(31,'user28','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user28@demo.com','user28@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(32,'user29','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user29@demo.com','user29@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(33,'user30','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user30@demo.com','user30@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(34,'user31','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user31@demo.com','user31@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(35,'user32','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user32@demo.com','user32@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(36,'user33','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user33@demo.com','user33@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(37,'user34','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user34@demo.com','user34@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(38,'user35','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user35@demo.com','user35@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(39,'user36','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user36@demo.com','user36@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(40,'user37','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user37@demo.com','user37@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(41,'user38','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user38@demo.com','user38@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(42,'user39','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user39@demo.com','user39@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(43,'user40','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user40@demo.com','user40@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(44,'user41','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user41@demo.com','user41@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(45,'user42','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user42@demo.com','user42@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(46,'user43','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user43@demo.com','user43@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(47,'user44','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user44@demo.com','user44@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(48,'user45','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user45@demo.com','user45@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(49,'user46','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user46@demo.com','user46@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(50,'user47','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user47@demo.com','user47@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(51,'user48','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user48@demo.com','user48@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(52,'user49','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user49@demo.com','user49@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(53,'user50','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user50@demo.com','user50@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(54,'user51','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user51@demo.com','user51@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(55,'user52','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user52@demo.com','user52@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(56,'user53','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user53@demo.com','user53@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(57,'user54','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user54@demo.com','user54@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(58,'user55','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user55@demo.com','user55@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(59,'user56','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user56@demo.com','user56@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(60,'user57','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user57@demo.com','user57@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(61,'user58','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user58@demo.com','user58@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(62,'user59','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user59@demo.com','user59@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(63,'user60','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user60@demo.com','user60@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(64,'user61','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user61@demo.com','user61@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(65,'user62','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user62@demo.com','user62@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(66,'user63','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user63@demo.com','user63@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(67,'user64','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user64@demo.com','user64@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(68,'user65','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user65@demo.com','user65@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(69,'user66','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user66@demo.com','user66@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(70,'user67','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user67@demo.com','user67@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(71,'user68','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user68@demo.com','user68@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(72,'user69','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user69@demo.com','user69@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(73,'user70','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user70@demo.com','user70@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(74,'user71','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user71@demo.com','user71@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(75,'user72','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user72@demo.com','user72@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(76,'user73','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user73@demo.com','user73@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(77,'user74','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user74@demo.com','user74@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(78,'user75','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user75@demo.com','user75@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(79,'user76','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user76@demo.com','user76@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(80,'user77','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user77@demo.com','user77@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(81,'user78','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user78@demo.com','user78@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(82,'user79','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user79@demo.com','user79@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(83,'user80','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user80@demo.com','user80@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(84,'user81','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user81@demo.com','user81@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(85,'user82','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user82@demo.com','user82@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(86,'user83','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user83@demo.com','user83@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(87,'user84','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user84@demo.com','user84@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(88,'user85','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user85@demo.com','user85@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(89,'user86','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user86@demo.com','user86@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(90,'user87','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user87@demo.com','user87@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(91,'user88','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user88@demo.com','user88@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(92,'user89','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user89@demo.com','user89@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(93,'user90','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user90@demo.com','user90@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(94,'user91','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user91@demo.com','user91@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(95,'user92','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user92@demo.com','user92@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(96,'user93','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user93@demo.com','user93@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(97,'user94','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user94@demo.com','user94@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(98,'user95','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user95@demo.com','user95@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(99,'user96','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user96@demo.com','user96@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(100,'user97','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user97@demo.com','user97@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(101,'user98','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user98@demo.com','user98@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(102,'user99','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user99@demo.com','user99@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261),(103,'user100','rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',1588923261,'$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',NULL,'user100@demo.com','user100@demo.com',1588923261,'127.0.0.1',1588923261,'127.0.0.1',NULL,10,10,1588923261,1588923261);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-08  7:38:05
