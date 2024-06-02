# Wymiana wiadomości 
 -pobrać z messages wiadomości użytwonika, którego sprawdzamy profil i nasze do tego użytkownika np:
 personID = 11;
 OwnerID = 34;
 "SELECT * FROM messages where ownerID = 34 AND personID 11 OR ownerID = 11 AND personID 34"
 - powinno zadziałać;