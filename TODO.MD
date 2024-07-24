# ONE

- dodać możliwość wyszukiwania po samej nazwię, gdy nie ma użytownniką z danym unqiue name
- w badzie danych dodać tabele na: - linki do zdjęć/filów - powiadomienia

# Two

-- W menage friends dodać useMemo na coponenice Invite, żeby nie renderało się ponownie podczas zmian w jego rodzicu
-- to samo w componencie z aktywnymi zaproszeniami od użytkownika 
-- usuwać zaproszenie po ich zatwierdzeniu

# three
    - Zmienic miejsce useMessagesTunel(WebSocket) na app, sposoduję to, że będzie się łączył tylko raz i będzie działał na całej stronie;
    - Dodać sesje użytkownika(na razie tylko przy wychodzeniu ze strony), po wyjściu aktywuje się event window.addEventListener('beforeunload'). Wyśle on całą date do db
        - "wymaga tego u góry" Przy logowaniu pobrać powiadomienia wszystkich wiadomości, które zostały wysłałane w czasie późniejszy, niż sesja, którą jest dodana do db, po pobraniu usunąć ją 
        