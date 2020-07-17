CREATE TABLE `class` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `class` varchar(45) NOT NULL,
  `class_code` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `class_UNIQUE` (`class`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

CREATE TABLE `train` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `Start_point` varchar(45) NOT NULL,
  `End_point` varchar(45) NOT NULL,
  `train_type` varchar(45) NOT NULL,
  `train_code` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `Name_UNIQUE` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `phone_num` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;


CREATE TABLE `stations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 ;


CREATE TABLE `train_stations` (
  `station_id` int unsigned NOT NULL,
  `train_id` int unsigned NOT NULL,
  `distance` int NOT NULL,
  `duration` varchar(45) NOT NULL,
  `arrival_time` varchar(45) NOT NULL,
  `departure_time` varchar(45) NOT NULL,
  `train_availability` varchar(45) NOT NULL,
  PRIMARY KEY (`station_id`,`train_id`),
  KEY `train_id_idx` (`train_id`),
  KEY `station_id_idx` (`station_id`),
  CONSTRAINT `station_id` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `train_id` FOREIGN KEY (`train_id`) REFERENCES `train` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;


CREATE TABLE `class_details` (
  `trains_id` int unsigned NOT NULL,
  `class_id` int unsigned NOT NULL,
  `max_seats` int NOT NULL,
  `no_of_coaches` int NOT NULL,
  `wl_max` int NOT NULL,
  PRIMARY KEY (`trains_id`,`class_id`),
  KEY `class_id_idx` (`class_id`),
  CONSTRAINT `class_id` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trains_id` FOREIGN KEY (`trains_id`) REFERENCES `train` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `ticket` (
  `ticket_id` int unsigned NOT NULL AUTO_INCREMENT,
  `pnr` varchar(45) NOT NULL,
  `source` varchar(45) NOT NULL,
  `destination` varchar(45) NOT NULL,
  `time` time NOT NULL,
  `Date` varchar(45) NOT NULL,
  `distance` int NOT NULL,
  `user_id` int NOT NULL,
  `train_id` int unsigned NOT NULL,
  `price` int NOT NULL,
  `class` varchar(45) NOT NULL,
  `no_of_seats` int NOT NULL,
  `journey_date` varchar(45) NOT NULL,
  `duration` varchar(45) NOT NULL,
  `departure_time` varchar(45) NOT NULL,
  `arrival_time` varchar(45) NOT NULL,
  `arrival_date` varchar(45) NOT NULL,
  PRIMARY KEY (`ticket_id`),
  UNIQUE KEY `ticket_id_UNIQUE` (`ticket_id`),
  UNIQUE KEY `pnr_UNIQUE` (`pnr`),
  KEY `user_id_idx` (`user_id`),
  KEY `train_id_idx` (`train_id`),
  CONSTRAINT `train-id` FOREIGN KEY (`train_id`) REFERENCES `train` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 ;


CREATE TABLE `passengers` (
  `id` int unsigned NOT NULL,
  `name` varchar(45) NOT NULL,
  `age` int NOT NULL,
  `tick_id` int unsigned NOT NULL,
  `gender` varchar(45) NOT NULL,
  `ticket_status` varchar(45) NOT NULL,
  `status_num` int NOT NULL,
  `coach_no` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `tick_id_idx` (`tick_id`),
  CONSTRAINT `tick_id` FOREIGN KEY (`tick_id`) REFERENCES `ticket` (`ticket_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;


LOCK TABLES `class` WRITE;

insert into class values(1,'1A','H');
insert into class values(2,'EC','E');
insert into class values(3,'2A','A');
insert into class values(4,'3A','B');
insert into class values(5,'3E','3E');
insert into class values(6,'CC','C');
insert into class values(7,'SL','S');
insert into class values(8,'2S','D');

LOCK TABLES `train` WRITE;

insert into train values(1234,'Hubbali Jan-ShatabDhi Express','Bengaluru','Hubballi','Super-fast','H-Jan-Shatabdhi EXP');
insert into train values(1235,'Talguppa Intercity Express','Bengaluru','Talguppa','InterCity','Talguppa Intercity EXP');
insert into train values(1236,'Dadar Central Express','Puducherry','Dadar Central','Express','Dadar-C EXP');
insert into train values(1237,'Hazrat Nizamuddin Rajdhani Express','Bengaluru','Hazrat Nizamuddin','Rajdhani','SBC-NZM');
insert into train values(1238,'Talguppa-Mysuru Express','Talguppa','Mysuru JN','Express','TLGP-MYS EXP');
insert into train values(1239,'Yeshwanthpur Duronto Express','Howrah','Yeshwanthpur','Duronto','HWH-YPR Duronto EXP');

LOCK TABLES `stations` WRITE;

insert into stations values(1,'Bengaluru');
insert into stations values(2,'Tumkur');
insert into stations values(3,'Tiptur');
insert into stations values(4,'Arsikere');
insert into stations values(5,'Birur JN');
insert into stations values(6,'Yeshwanthpur');
insert into stations values(7,'Dadar Central');
insert into stations values(8,'Puducherry');
insert into stations values(9,'Villupuram JN');
insert into stations values(10,'Thirukkovilur');
insert into stations values(11,'Howrah');
insert into stations values(12,'Bhubaneswar');
insert into stations values(13,'Vizianagaram JN');
insert into stations values(14,'Vijayawada JN');
insert into stations values(15,'Renigunta JN');
insert into stations values(16,'Sri Sathya Prashanthi Nilayam');
insert into stations values(17,'Dharmavaram JN');
insert into stations values(18,'Anantapur');
insert into stations values(19,'Guntakal JN');
insert into stations values(20,'Raichur JN');
insert into stations values(21,'Sedam');
insert into stations values(22,'Secunderabad JN');
insert into stations values(23,'Kazipet JN');
insert into stations values(24,'Balharshah JN');
insert into stations values(25,'Nagpur JN');
insert into stations values(26,'Itarsi JN');
insert into stations values(27,'Bhopal JN');
insert into stations values(28,'Jhansi JN');
insert into stations values(29,'Gwalior JN');
insert into stations values(30,'Agra Cantt.');
insert into stations values(31,'Hazrat Nizamuddin');
insert into stations values(32,'Tiruvannamalai');
insert into stations values(33,'Polur');
insert into stations values(34,'Arni Road');
insert into stations values(35,'Vellore Cantt.');
insert into stations values(36,'Katpadi JN');
insert into stations values(37,'Jolarpettai JN');
insert into stations values(38,'Bangarapet JN');
insert into stations values(39,'Krishnarajapuram');
insert into stations values(40,'Banaswadi');
insert into stations values(41,'Kadur');
insert into stations values(42,'Davangere');
insert into stations values(43,'Harihar');
insert into stations values(44,'Ranibennur');
insert into stations values(45,'Haveri');
insert into stations values(46,'Hubballi JN');
insert into stations values(47,'Dharwad');
insert into stations values(48,'Alnavar JN');
insert into stations values(49,'Londa JN');
insert into stations values(50,'Khanapur');
insert into stations values(51,'Belagavi');
insert into stations values(52,'Ghataprabha');
insert into stations values(53,'Rayabag');
insert into stations values(54,'Kudachi');
insert into stations values(55,'Miraj JN');
insert into stations values(56,'Sangli');
insert into stations values(57,'Takari');
insert into stations values(58,'Karad');
insert into stations values(59,'Satara');
insert into stations values(60,'Pune JN');
insert into stations values(61,'Lonavala');
insert into stations values(62,'Kalyan JN');
insert into stations values(63,'Chikjajur JN');



LOCK TABLES `class_details` WRITE;

insert into class_details values(1234,6,73,2,100);
insert into class_details values(1234,7,72,2,200);
insert into class_details values(1234,8,106,10,200);
insert into class_details values(1235,6,75,1,100);
insert into class_details values(1235,8,108,4,200);
insert into class_details values(1236,3,48,1,50);
insert into class_details values(1236,4,64,3,70);
insert into class_details values(1236,7,72,9,100);
insert into class_details values(1237,1,26,1,20);
insert into class_details values(1237,3,54,5,50);
insert into class_details values(1237,4,72,11,100);
insert into class_details values(1238,1,18,1,20);
insert into class_details values(1238,3,48,1,50);
insert into class_details values(1238,4,64,2,70);
insert into class_details values(1238,7,72,11,150);
insert into class_details values(1239,1,26,1,20);
insert into class_details values(1239,3,54,1,50);
insert into class_details values(1239,4,72,5,70);
insert into class_details values(1239,7,80,11,150);


LOCK TABLES `train_stations` WRITE;

insert into train_stations values(1,1234,0,'00:00:00','00:00:00','06:00:00','0123456');
insert into train_stations values(1,1235,0,'00:00:00','00:00:00','15:00:00','0123456');
insert into train_stations values(1,1237,0,'00:00:00','00:00:00','20:00:00','0123456');
insert into train_stations values(1,1238,371,'08:00:00','04:20:00','04:30:00','0123456');
insert into train_stations values(2,1234,69,'01:03:00','07:03:00','07:05:00','0123456');
insert into train_stations values(2,1235,69,'01:03:00','16:03:00','16:05:00','0123456');
insert into train_stations values(2,1236,498,'10:43:00','07:28:00','07:30:00','9193499');
insert into train_stations values(2,1238,301,'06:13:00','02:33:00','02:35:00','0123456');
insert into train_stations values(3,1236,569,'11:43:00','08:28:00','08:30:00','9193499');
insert into train_stations values(4,1234,165,'02:30:00','08:30:00','08:35:00','0123456');
insert into train_stations values(5,1234,211,'03:13:00','09:13:00','09:15:00','0123456');
insert into train_stations values(6,1236,434,'09:15:00','06:00:00','06:30:00','9193499');
insert into train_stations values(6,1239,1953,'29:10:00','16:00:00','00:00:00','9999999');
insert into train_stations values(7,1236,1637,'32:55:00','05:40:00','00:00:00','9999999');
insert into train_stations values(8,1236,0,'00:00:00','00:00:00','20:45:00','0923999');
insert into train_stations values(9,1236,37,'00:35:00','21:20:00','21:25:00','0923999');
insert into train_stations values(10,1236,71,'01:14:00','21:59:00','22:00:00','0923999');
insert into train_stations values(11,1239,0,'00:00:00','00:00:00','10:50:00','0923956');
insert into train_stations values(12,1239,436,'06:00:00','16:50:00','17:00:00','0923956');
insert into train_stations values(13,1239,820,'11:20:00','22:00:00','22:10:00','0923956');
insert into train_stations values(14,1239,1215,'17:30:00','04:20:00','04:25:00','0193496');
insert into train_stations values(15,1239,1592,'23:20:00','10:10:00','10:15:00','0193496');
insert into train_stations values(16,1237,159,'02:33:00','22:33:00','22:35:00','0123456');
insert into train_stations values(17,1237,193,'03:13:00','23:13:00','23:15:00','0123456');
insert into train_stations values(18,1237,226,'03:48:00','23:48:00','23:50:00','0123456');
insert into train_stations values(19,1237,295,'05:05:00','01:05:00','01:10:00','0123456');
insert into train_stations values(20,1237,416,'06:43:00','02:43:00','02:45:00','0123456');
insert into train_stations values(21,1237,559,'08:49:00','04:49:00','04:50:00','0123456');
insert into train_stations values(22,1237,707,'11:35:00','07:35:00','07:50:00','0123456');
insert into train_stations values(23,1237,838,'13:28:00','09:28:00','09:30:00','0123456');
insert into train_stations values(24,1237,1073,'16:45:00','12:45:00','12:50:00','0123456');
insert into train_stations values(25,1237,1282,'19:15:00','15:25:00','15:30:00','0123456');
insert into train_stations values(26,1237,1580,'23:48:00','19:48:00','19:50:00','0123456');
insert into train_stations values(27,1237,1672,'25:20:00','21:20:00','21:30:00','0123456');
insert into train_stations values(28,1237,1964,'28:51:00','00:51:00','00:56:00','0123456');
insert into train_stations values(29,1237,2061,'29:55:00','01:55:00','01:57:00','0123456');
insert into train_stations values(30,1237,2179,'31:28:00','03:28:00','03:30:00','0123456');
insert into train_stations values(31,1237,2367,'33:55:00','05:55:00','00:00:00','9999999');
insert into train_stations values(42,1234,325,'04:48:00','10:48:00','10:50:00','0123456');
insert into train_stations values(43,1234,338,'05:03:00','11:03:00','11:05:00','0123456');
insert into train_stations values(44,1234,362,'05:25:00','11:25:00','11:26:00','0123456');
insert into train_stations values(45,1234,394,'05:51:00','11:51:00','11:52:00','0123456');
insert into train_stations values(46,1234,469,'07:45:00','13:45:00','00:00:00','0123456');
insert into train_stations values(63,1234,279,'04:09:00','10:09:00','10:10:00','0123456');

UNLOCK TABLES;


/*192.168.1.102 */