-- MySQL dump 10.13  Distrib 5.1.73, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: firefly
-- ------------------------------------------------------
-- Server version	5.1.73

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
-- Table structure for table `Algorithm`
--

DROP TABLE IF EXISTS `Algorithm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Algorithm` (
  `algorithmID` int(10) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `annotationID` int(10) unsigned NOT NULL,
  `userID` int(10) unsigned NOT NULL,
  `value` varchar(100) NOT NULL,
  PRIMARY KEY (`algorithmID`,`name`),
  KEY `fk_datasetID` (`annotationID`),
  KEY `fk_userID` (`userID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Annotation`
--

DROP TABLE IF EXISTS `Annotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Annotation` (
  `annotationID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `projectID` int(10) unsigned NOT NULL,
  `title` varchar(45) NOT NULL,
  `type` enum('frameset','pyramid') NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `editDate` datetime DEFAULT NULL,
  `lock` binary(1) NOT NULL DEFAULT '0',
  `userID` int(11) DEFAULT NULL,
  PRIMARY KEY (`annotationID`),
  KEY `fk_dataSetProject` (`projectID`)
) ENGINE=MyISAM AUTO_INCREMENT=2760 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Attribute`
--

DROP TABLE IF EXISTS `Attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Attribute` (
  `markedObjectID` int(10) unsigned NOT NULL,
  `name` varchar(45) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`markedObjectID`,`name`),
  KEY `fk_attributeMarkedObject` (`markedObjectID`),
  KEY `attributeName` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Authorization`
--

DROP TABLE IF EXISTS `Authorization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Authorization` (
  `authID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `authNotes` varchar(1000) DEFAULT NULL,
  `contact` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`authID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `BadFrame`
--

DROP TABLE IF EXISTS `BadFrame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BadFrame` (
  `frameNumber` int(11) NOT NULL,
  `annotationID` int(10) unsigned NOT NULL,
  `badFrameID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`badFrameID`),
  KEY `fk_BadFrame_Dataset1` (`annotationID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `BoxObject`
--

DROP TABLE IF EXISTS `BoxObject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BoxObject` (
  `markedObjectID` int(10) unsigned NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `width` double NOT NULL,
  `height` double NOT NULL,
  PRIMARY KEY (`markedObjectID`),
  KEY `fk_markedSquare` (`markedObjectID`),
  CONSTRAINT `fk_markedSquare` FOREIGN KEY (`markedObjectID`) REFERENCES `MarkedObject` (`markedObjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Bspline`
--

DROP TABLE IF EXISTS `Bspline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Bspline` (
  `markedObjectID` int(10) unsigned NOT NULL,
  `order` int(10) unsigned NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  PRIMARY KEY (`markedObjectID`,`order`),
  KEY `fk_markedbspline` (`markedObjectID`),
  CONSTRAINT `fk_markedbspline` FOREIGN KEY (`markedObjectID`) REFERENCES `MarkedObject` (`markedObjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Circle`
--

DROP TABLE IF EXISTS `Circle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Circle` (
  `markedObjectID` int(10) unsigned NOT NULL,
  `x1` double NOT NULL,
  `y1` double NOT NULL,
  `x2` double NOT NULL,
  `y2` double NOT NULL,
  PRIMARY KEY (`markedObjectID`),
  KEY `fk_markedCircle` (`markedObjectID`),
  CONSTRAINT `fk_markedCircle` FOREIGN KEY (`markedObjectID`) REFERENCES `MarkedObject` (`markedObjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ClassLayer`
--

DROP TABLE IF EXISTS `ClassLayer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ClassLayer` (
  `classLayerID` int(11) NOT NULL AUTO_INCREMENT,
  `className` varchar(45) NOT NULL,
  `projectID` int(10) unsigned NOT NULL,
  `color` int(10) unsigned DEFAULT NULL,
  `baseString` varchar(45) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`classLayerID`),
  KEY `fk_classLayerProject` (`projectID`),
  CONSTRAINT `fk_classLayerProject` FOREIGN KEY (`projectID`) REFERENCES `Project` (`projectID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=289 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DatasetUser`
--

DROP TABLE IF EXISTS `DatasetUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DatasetUser` (
  `userID` int(10) unsigned NOT NULL,
  `annotationID` int(10) unsigned NOT NULL,
  `permissions` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userID`,`annotationID`),
  KEY `fk_User_has_Dataset_Dataset1` (`annotationID`),
  KEY `fk_User_has_Dataset_User1` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FrameID2Name`
--

DROP TABLE IF EXISTS `FrameID2Name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FrameID2Name` (
  `annotationID` int(10) NOT NULL DEFAULT '0',
  `frameID` int(10) NOT NULL DEFAULT '0',
  `frameName` varchar(500) NOT NULL,
  PRIMARY KEY (`annotationID`,`frameID`),
  KEY `fk_annotationID` (`annotationID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FreeFormPoint`
--

DROP TABLE IF EXISTS `FreeFormPoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FreeFormPoint` (
  `markedObjectID` int(10) unsigned NOT NULL,
  `order` int(10) unsigned NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  PRIMARY KEY (`order`,`markedObjectID`),
  KEY `fk_markedFree` (`markedObjectID`),
  CONSTRAINT `fk_markedFree` FOREIGN KEY (`markedObjectID`) REFERENCES `MarkedObject` (`markedObjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FreeFormPoly`
--

DROP TABLE IF EXISTS `FreeFormPoly`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FreeFormPoly` (
  `markedObjectID` int(10) unsigned NOT NULL,
  `order` int(10) unsigned NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  PRIMARY KEY (`order`,`markedObjectID`),
  KEY `fk_markedFreePoly` (`markedObjectID`),
  CONSTRAINT `fk_markedFreePoly` FOREIGN KEY (`markedObjectID`) REFERENCES `MarkedObject` (`markedObjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Image_info`
--

DROP TABLE IF EXISTS `Image_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Image_info` (
  `IM_No` int(11) NOT NULL AUTO_INCREMENT,
  `annotationID` int(11) NOT NULL,
  `frame_No` int(11) NOT NULL,
  `resolution_Height` int(11) NOT NULL,
  `resolution_Width` int(11) NOT NULL,
  `frame_name` varchar(255) NOT NULL,
  `info` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`IM_No`),
  KEY `annotationID` (`annotationID`)
) ENGINE=MyISAM AUTO_INCREMENT=167 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Imageset`
--

DROP TABLE IF EXISTS `Imageset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Imageset` (
  `annotationID` int(10) unsigned NOT NULL COMMENT 'The primary key of the Imagset.',
  `resolutionWidth` int(10) unsigned DEFAULT NULL COMMENT 'The width of the frames.',
  `resolutionHeight` int(10) unsigned DEFAULT NULL COMMENT 'The height of the frames.',
  `fileType` enum('JPEG','BMP','TIFF','PNG','GIF') DEFAULT NULL COMMENT 'The compression used with the frames (TIFF, PNG, etc.)',
  `colorPalette` int(10) unsigned DEFAULT NULL COMMENT 'The color depth of the images.',
  `dateCreated` datetime DEFAULT NULL COMMENT 'The date that the frames were created.',
  `numFrames` int(10) unsigned NOT NULL COMMENT 'The total number of frames that exist in the set.',
  `path` varchar(500) NOT NULL,
  `prefix` varchar(45) NOT NULL,
  `suffix` varchar(45) NOT NULL,
  `padding` int(11) NOT NULL,
  `maxResolution` int(2) unsigned DEFAULT '4',
  PRIMARY KEY (`annotationID`),
  KEY `fk_framesetDataset` (`annotationID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Keyword`
--

DROP TABLE IF EXISTS `Keyword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Keyword` (
  `keyword` varchar(45) NOT NULL,
  `projectID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`keyword`),
  KEY `Keyword` (`keyword`),
  KEY `fk_keywordProject` (`projectID`),
  CONSTRAINT `fk_keywordProject` FOREIGN KEY (`projectID`) REFERENCES `Project` (`projectID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Lab`
--

DROP TABLE IF EXISTS `Lab`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Lab` (
  `labID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `labTitle` varchar(45) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `icon` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`labID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `LabUser`
--

DROP TABLE IF EXISTS `LabUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LabUser` (
  `labID` int(10) unsigned NOT NULL,
  `userID` int(10) unsigned NOT NULL,
  `permissions` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`labID`,`userID`),
  KEY `fk_labUser` (`labID`),
  KEY `fk_userLab` (`userID`),
  CONSTRAINT `fk_labUser` FOREIGN KEY (`labID`) REFERENCES `Lab` (`labID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_userLab` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `LineObject`
--

DROP TABLE IF EXISTS `LineObject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LineObject` (
  `markedObjectID` int(10) unsigned NOT NULL,
  `x1` double NOT NULL,
  `y1` double NOT NULL,
  `x2` double NOT NULL,
  `y2` double NOT NULL,
  PRIMARY KEY (`markedObjectID`),
  KEY `fk_markedLine` (`markedObjectID`),
  CONSTRAINT `fk_markedLine` FOREIGN KEY (`markedObjectID`) REFERENCES `MarkedObject` (`markedObjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MarkedObject`
--

DROP TABLE IF EXISTS `MarkedObject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MarkedObject` (
  `markedObjectID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `frameObjectID` varchar(50) DEFAULT NULL,
  `annotationID` int(10) unsigned NOT NULL,
  `classLayerID` int(11) NOT NULL,
  `label` varchar(45) DEFAULT NULL,
  `createdBy` int(10) unsigned NOT NULL,
  `editDate` datetime DEFAULT NULL,
  `type` enum('point','line','box','freeForm','freeFormPoly','circle','bspline') NOT NULL,
  `frameNumber` int(11) NOT NULL DEFAULT '0',
  `algorithmID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`markedObjectID`)
) ENGINE=InnoDB AUTO_INCREMENT=3751906 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MarkedObjectClassLayer`
--

DROP TABLE IF EXISTS `MarkedObjectClassLayer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MarkedObjectClassLayer` (
  `classLayerID` int(11) NOT NULL,
  `markedObjectID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`classLayerID`,`markedObjectID`),
  KEY `fk_ClassLayer_has_MarkedObject_MarkedObject1` (`markedObjectID`),
  KEY `fk_ClassLayer_has_MarkedObject_ClassLayer1` (`classLayerID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MarkedObjectss`
--

DROP TABLE IF EXISTS `MarkedObjectss`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MarkedObjectss` (
  `markedObjectID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `frameObjectID` varchar(50) DEFAULT NULL,
  `annotationID` int(10) unsigned NOT NULL,
  `classLayerID` int(11) NOT NULL,
  `label` varchar(45) DEFAULT NULL,
  `createdBy` int(10) unsigned NOT NULL,
  `editDate` datetime DEFAULT NULL,
  `type` enum('point','line','box','freeForm','freeFormPoly') NOT NULL,
  `frameNumber` int(11) NOT NULL DEFAULT '0',
  `algorithmID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`markedObjectID`),
  KEY `fk_markedDataset` (`annotationID`),
  CONSTRAINT `fk_markedDataset` FOREIGN KEY (`annotationID`) REFERENCES `Annotation` (`datasetID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=108906 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PointObject`
--

DROP TABLE IF EXISTS `PointObject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PointObject` (
  `markedObjectID` int(10) unsigned NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  PRIMARY KEY (`markedObjectID`),
  KEY `fk_markedPoint` (`markedObjectID`),
  CONSTRAINT `fk_markedPoint` FOREIGN KEY (`markedObjectID`) REFERENCES `MarkedObject` (`markedObjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Project`
--

DROP TABLE IF EXISTS `Project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Project` (
  `projectID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `labID` int(10) unsigned NOT NULL,
  `authID` int(10) unsigned DEFAULT NULL,
  `creator` int(10) unsigned NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `locationShot` varchar(45) DEFAULT NULL,
  `captureDate` date DEFAULT NULL,
  `cameraType` varchar(20) DEFAULT NULL,
  `cameraNotes` varchar(255) DEFAULT NULL,
  `recordMedium` varchar(20) DEFAULT NULL,
  `source` varchar(45) DEFAULT NULL,
  `citation` varchar(255) DEFAULT NULL,
  `notes` varchar(4000) DEFAULT NULL,
  `authContact` varchar(255) DEFAULT NULL,
  `icon` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`projectID`),
  KEY `fk_projectLab` (`labID`),
  KEY `fk_projectAuth` (`authID`),
  KEY `fk_projectCreator` (`creator`),
  CONSTRAINT `fk_projectAuth` FOREIGN KEY (`authID`) REFERENCES `Authorization` (`authID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_projectCreator` FOREIGN KEY (`creator`) REFERENCES `User` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_projectLab` FOREIGN KEY (`labID`) REFERENCES `Lab` (`labID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Pyramid`
--

DROP TABLE IF EXISTS `Pyramid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Pyramid` (
  `annotationID` int(10) unsigned NOT NULL,
  `filename` varchar(45) NOT NULL,
  `path` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`annotationID`),
  KEY `fk_pyramidDataset` (`annotationID`),
  CONSTRAINT `fk_pyramidDataset` FOREIGN KEY (`annotationID`) REFERENCES `Annotation` (`datasetID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Url`
--

DROP TABLE IF EXISTS `Url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Url` (
  `projectID` int(10) unsigned NOT NULL,
  `TileService` varchar(500) DEFAULT NULL,
  `AnnotationService` varchar(500) DEFAULT NULL,
  `MultiplayerService` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`projectID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `userID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `firstName` varchar(25) NOT NULL,
  `lastName` varchar(25) NOT NULL,
  `passHash` varchar(45) NOT NULL,
  `uploadPermission` int(11) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `myview`
--

DROP TABLE IF EXISTS `myview`;
/*!50001 DROP VIEW IF EXISTS `myview`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `myview` (
 `markedObjectID` tinyint NOT NULL,
  `value` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `seglbl`
--

DROP TABLE IF EXISTS `seglbl`;
/*!50001 DROP VIEW IF EXISTS `seglbl`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `seglbl` (
 `markedobjectID` tinyint NOT NULL,
  `value` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `slbl`
--

DROP TABLE IF EXISTS `slbl`;
/*!50001 DROP VIEW IF EXISTS `slbl`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `slbl` (
 `markedObjectID` tinyint NOT NULL,
  `value` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `value`
--

DROP TABLE IF EXISTS `value`;
/*!50001 DROP VIEW IF EXISTS `value`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `value` (
 `markedobjectID` tinyint NOT NULL,
  `value` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `myview`
--

/*!50001 DROP TABLE IF EXISTS `myview`*/;
/*!50001 DROP VIEW IF EXISTS `myview`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`firefly`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `myview` AS select `Attribute`.`markedObjectID` AS `markedObjectID`,`Attribute`.`value` AS `value` from `Attribute` where (`Attribute`.`name` = 'segID') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `seglbl`
--

/*!50001 DROP TABLE IF EXISTS `seglbl`*/;
/*!50001 DROP VIEW IF EXISTS `seglbl`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`firefly`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `seglbl` AS select `Attribute`.`markedObjectID` AS `markedobjectID`,`Attribute`.`value` AS `value` from `Attribute` where (`Attribute`.`name` = 'seglbl') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `slbl`
--

/*!50001 DROP TABLE IF EXISTS `slbl`*/;
/*!50001 DROP VIEW IF EXISTS `slbl`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`firefly`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `slbl` AS select `Attribute`.`markedObjectID` AS `markedObjectID`,`Attribute`.`value` AS `value` from `Attribute` where (`Attribute`.`name` = 'seglbl') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `value`
--

/*!50001 DROP TABLE IF EXISTS `value`*/;
/*!50001 DROP VIEW IF EXISTS `value`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`firefly`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `value` AS select `Attribute`.`markedObjectID` AS `markedobjectID`,`Attribute`.`value` AS `value` from `Attribute` where (`Attribute`.`name` = 'seglbl') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-05 12:58:30
