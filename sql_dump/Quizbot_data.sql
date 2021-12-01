
CREATE DATABASE Quizbot;

USE Quizbot;

DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` int(11) DEFAULT NULL,
  `question` text,
  `ans_1` text,
  `ans_2` text,
  `ans_3` text,
  `ans_4` text,
  `correct_ans` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
LOCK TABLES `questions` WRITE;

INSERT INTO `questions` VALUES (0,'change directory','cd','ch','c','c-d',1),(1,'autocomplete filename','ENTER','TAB','SHIFT+ENTER','ESC',2),(2,'show all files including hidden files','ls -h','sh -h','ls -a','sh -a',3),(3,'create new directory','cnd','dir','mk','mkdir',4),(4,'delete empty directory','rmdir','delete','remove','delete-directory',1),(5,'move file or directory','move','mv','mvdir','mvfile',2),(6,'copy file','copy','cf','cp','cpy',3),(7,'copy directory with contents','cp -d','cpy -d','cpy -r','cp -r',4),(8,'delete file','rm','rm -f','remove','remove -f',1),(9,'update existing files OR create empty files','update','touch','create','updt',2),(10,'ancestor to all directories','/home','/ancestor','/Root','/Start',3),(11,'general system admin files','/admin','/system','/sys-admin','/etc',4),(12,'dynamic files (log files)','/var','/log','/dyn','/dynamic',1),(13,'temporary files for programs','/temp','/tmp','/temporary','/tmpf',2),(14,'common system binaries (commands)','/cmn','/common','/bin','/binaries',3),(15,'go to the beginning of a line','CTRL + L','CTRL + B','CTRL + N','CTRL + A',4),(16,'go to the end of a line','CTRL + E','CTRL + B','CTRL + R','CTRL + N',1),(17,'delete a word before the cursor','CTRL -d','CTRL -w','CTRL -b','CTRL -rm',2),(18,'delete all from the beginning of line','CTRL -d','CTRL -n','CTRL -u','CTRL -a',3),(19,'clear the screen','CTRL -c','CTRL -d','CTRL -n','CTRL -l',4),(20,'start a vi session','vi','vi -s','vi start','vi session',1),(21,'left (command mode)','l','h','s','a',2),(22,'down (command mode)','v','n','j','d',3),(23,'up (command mode)','s','a','w','u',4),(24,'right (command mode)','l','r','e','n',1),(25,'beginning of line (command mode)','1','0','b','w',2),(26,'end of line (command mode)','d','e','$','n',3),(27,'undo previous edit (editing)','z','n','r','u',4),(28,'save work and exit from command mode','ZZ','SS','SV','SW',1),(29,'save without exiting (command mode)',':s',':w',':z',':k',2);

UNLOCK TABLES;

DROP TABLE IF EXISTS `user_scores`;
CREATE TABLE `user_scores` (
  `score_id` int(11) DEFAULT NULL,
  `user_name` text,
  `quiz_score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `user_scores` WRITE;

UNLOCK TABLES;