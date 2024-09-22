CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nick` varchar(255) DEFAULT NULL,
  `avatar` text,
  `date` datetime DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `unqiue_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `banner` text,
  PRIMARY KEY (`id`)
);
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ownerID` int DEFAULT NULL,
  `recipientID` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `message` text,
  PRIMARY KEY (`id`),
  KEY `ownerID` (`ownerID`),
  KEY `recipientID` (`recipientID`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`ownerID`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`recipientID`) REFERENCES `users` (`id`)
);
CREATE TABLE `user_friends` (
  `id` int NOT NULL AUTO_INCREMENT,
  `personID` int DEFAULT NULL,
  `friendID` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `personID` (`personID`),
  KEY `friendID` (`friendID`),
  CONSTRAINT `user_friends_ibfk_1` FOREIGN KEY (`personID`) REFERENCES `users` (`id`),
  CONSTRAINT `user_friends_ibfk_2` FOREIGN KEY (`friendID`) REFERENCES `users` (`id`)
);