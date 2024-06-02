-- Active: 1697937413972@@127.0.0.1@3306@senderson

SELECT nick,unqiue_name as unqiueName FROM users


SELECT * from messages

SELECT * FROM users


DELETE from messages where id > 56


CREATE TABLE user_friends(id int AUTO_INCREMENT, personID int, friendID int,   UNIQUE KEY unique_person_friend (personID, friendID), FOREIGN KEY(personID) REFERENCES users(id), FOREIGN KEY(friendID) REFERENCES users(id), PRIMARY KEY(id))


SELECT * FROM user_friends

SELECT id FROM user_friends where `personID` = 11;


    SELECT id, nick,avatar,date, unqiue_name as unqiueName,(SELECT id FROM user_friends where `personID` = 11) as friends FROM users where id = 11


    SELECT id FROM user_friends where `personID` = 11