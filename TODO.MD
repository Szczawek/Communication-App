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


# Api

-- UserContection Map() zmienić na db

# FireFox

-- Bez żadnego powodu na firefox po kliknięciu enter by otworzył sub okno w na, to aktywuję onBlur w ul(zamyka okno) #50% powodzenia naprawy

# Settings

-- Zrobić w CreateAcount, AccountSetting drugi input password na potwierdzenia prawidłowości hasło;
-- W AccountSetting w puste inputy do zmiany danych stawić aktualne dane;
-- dodać w CreateAccount, AccountSettings ikone oka, która pokazuję hasło;

# Secure
-- Aktualnie każdy użytkownik za pomoćą np. POST MAN może czytać każdego wiadomości, zmienić to:
#idea
-- błędna: zrobienie pobierania id z cookies
-- samo wysłanie przez body

        --ok(50%): wysłanie przez body, potwierdzenie zalogowania uzytwonika z tym id

# Four

-- Usunięcie samemu cookies lub sessionStorage o nazwie session spowoduję "rozwaleniu" konta w danej przeglądarce:
-- Poprawić to
-- Wystarczy usunąć cookie i sessionStroage jednocześnie
-- Trzeba się postarć żeby to zrobić, zrobić #idioto-odporność


# Five 
        -- skończyć component do edytowania zdjęć: 
                -- dodać funckje zmniejszania rozmiaru zdjęć 
                -- zapisaywać w firebase storage 
                -- zmienić w storage reguły