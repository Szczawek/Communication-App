# ZDJĘCIA 
# Visaul Only
        -- Dla lepszego "USER PERFORMENCE" można zrobić dwa pobrania zdjęcie, jedno te co ma być docelowe, drugie copia orginału pomniejszona do najmniejszego rozmiaru zablurowana. 
        -- Copia będzie 100x mniej ważyć, szybciej się załaduję 


# IMPORTANT
# AUTH
        -- Dodać możliwość logowania dwu-stopniowego:
                -- wymagać tego przy każdym nowym logowaniu / 5 miesięcy
                 


# Dodać do Auth w server

        --  dodać wygenerowane hasło, żeby nie można było wysyłąć żądań z nieautoryzowanych miejsc

# logged-in END Potin 
--// Dodać sprawdzenie czy id zostało storzone przez server, czy przez "intruza", każde cookies ma szyfrowanie
# Login With Google

        -- Głowne problemy:
                -- w Google nie ma niczego do wypełnienia unqiue-name, dodać jakoś mechanizm wyboru unqiue-name po zalogowaniu
                -- google przesyła, czy email jest zweryfikowany, dodać mechanizm wysyłania kodów do potwierdzenia email
                -- w danych jest zdjęcie użytkownika można z linkiem, zmienić to na link do storage, lub zmienić sposób dodawania zdjęć
                # correct, nie będzie z tym problemu. Przy tworzeniu konta można dodać obojętnie jaki link, inczej jest z edytowaniem

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
-- W AccountSetting w puste inputy do zmiany danych stawić aktualne dane;

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

# Six

        -- W EditProfile, gdy funkcja compresImage wykryje inny format niż image/* dodać komunikat o tym (działa bez tego)

# Seven 
        -- Dodać do wszystkiego limitu:
                -- max kont stworzonych jednego dnia 5;
                -- max prób logowania się przez 1h 10 razy;
                -- max wysłanych wiadomości 200 przez jeden dzień;
# Eight 
        -- Poprawić inputy w create-account/Account-setting, żeby unqiue name nie mogło mieć specjalnych znaków, spacji 

# nine 
-- Po wysłaniu email z codem, gdy użytkownik wejdzie w link stara karta strony przestaje działa
-- Nie zmienić narazie 

# TEN 
-- Account Setting:
        --  Przy zmianie email, trzeba go potwierdzić kodem
        -- naprawić hasła';