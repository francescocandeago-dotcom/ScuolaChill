1. Contesto dell'Istituto e Dimensionamento del Carico
1.1 Profilo dell'Istituto (ScuolaChill)

La piattaforma gestionale ScuolaChill è progettata per servire un istituto scolastico secondario di secondo grado di medie dimensioni, caratterizzato dalle seguenti metriche anagrafiche:

Studenti totali: 800

Docenti totali: 50

Classi totali: 44 (con una media di ~18 studenti per classe)

Direzione: 2 account amministrative/direttoriali

1.2 Modello di Carico e Utenti Concorrenti

L'analisi del carico si suddivide in due scenari operativi principali:

Scenario Ordinario (Condizioni Normali)

Utenti concorrenti attesi: $100 - 200$ utenti contemporanei.

Comportamento tipico: Durante il normale orario scolastico, docenti e studenti accedono al sistema per consultazioni rapide, verifica dei voti, lettura degli avvisi o download sporadico di materiale didattico.

Tipologia di traffico: Prevalentemente operazioni di lettura (HTTP GET), a basso impatto sulla CPU e sulla memoria del server.

Scenario di Picco Massimo (Stress Test)

Utenti concorrenti attesi: $400 - 500$ utenti contemporanei (fino al 60% della popolazione totale dell'istituto).

Finestre temporali critiche:

Inizio ora di lezione / Avvio verifiche (es. ore 09:00): Più classi contemporaneamente accedono alla piattaforma per scaricare la traccia dell'esame o iniziare un test online.

Chiusura consegne o termine lezione: Invio simultaneo delle risposte/elaborati da parte degli studenti.

Tipologia di traffico: Misto di lettura intensiva e scrittura (HTTP POST / PUT), con transazioni di database e salvataggi concorrenti.

1.3 Analisi delle Operazioni Critiche

Il sistema deve essere dimensionato identificando quali operazioni generano maggior stress sull'infrastruttura:

Operazione	Attore	Frequenza	Frequenza Picco	Impatto Risorse
Caricamento materiale didattico	Docente	Media	Bassa	I/O e Storage (Banda/Disco): Rischio di saturazione della banda se i file vengono salvati direttamente sull'applicazione backend.
Consegna/Svolgimento verifica	Studente	Bassa	Molto Alta (es. 09:00 o a fine ora)	Database & CPU: Elevato numero di query concorrenti in scrittura per il salvataggio dei risultati nel database relazionale.
Consultazione Voti e Dashboard	Studente / Direttore	Alta	Media	Database & Cache: Molte query di aggregazione; mitigabile con strategie di paginazione o viste lette denormalizzate.
1.4 Impatto sulle Scelte Architetturali (Derivazione dei Requisiti)

Da questa stima derivano tre decisioni fondamentali da adottare nelle sezioni successive del PRD:

Gestione dei File (Materiale Didattico):
Per evitare che il caricamento di file pesanti da parte dei docenti rallenti le API di sistema o saturi la RAM/disco della macchina backend, i file non verranno salvati come BLOB nel database né nel file system del server app, ma tramite un Object Storage dedicato (es. AWS S3, Azure Blob Storage o Supabase Storage).

Concorrenza sul Database (Verifiche):
Il database deve gestire un pool di connessioni (connection pooling) dimensionato per supportare fino a 500 richieste simultanee al secondo nei momenti di picco, evitando il blocco delle tabelle (table locking).

Paginazione Obbligatoria:
Qualsiasi endpoint che restituisce elenchi (es. lista di 800 studenti o storico voti) dovrà implementare la paginazione obbligatoria per evitare risposte JSON da decine di megabyte.

2. Scelte Tecnologiche e Stack Architetturale

Per lo sviluppo di ScuolaChill, ho selezionato uno stack tecnologico solido, ad alte prestazioni e con un'ampia documentazione, mirato a garantire manutenibilità e rapidità di sviluppo.

2.1 Tabella Sinottica dello Stack
Layer	Tecnologia Scelta	Strumenti di Supporto
Frontend	HTML5, CSS3, JavaScript (Vanilla JS)	Fetch API / Axios per chiamate HTTP
Backend	Python (Framework FastAPI)	Uvicorn (ASGI server), Node.js (Tooling / Build)
Database	MySQL	HeidiSQL (Client di gestione & query GUI)
Documentazione API	OpenAPI 3.0 / Swagger	Generazione automatica integrata in FastAPI
2.2 Motivazione delle Scelte e Confronto con le Alternative

Backend: Python (FastAPI) vs Node.js (Express)

Scelta: Python con framework FastAPI.

Motivazione: FastAPI offre prestazioni paragonabili a Node.js grazie al supporto asincrono (async/await), ma garantisce una validazione dei dati nativa (tramite Pydantic) e genera automaticamente la documentazione OpenAPI/Swagger obbligatoria. La familiarità del team con Python riduce drasticamente il rischio di errori architetturali.

Alternativa scartata (Node.js/Express): Sebbene fosse stata valutata la creazione del backend in Node.js, l'esigenza di dover integrare manualmente librerie esterne per la validazione degli schemi e la documentazione Swagger ha portato a preferire l'ecosistema Python FastAPI. Node.js viene comunque mantenuto nella pipeline di sviluppo locale per la gestione delle dipendenze frontend e script di build.

Frontend: HTML/CSS/JavaScript Vanilla vs React

Scelta: HTML5, CSS3 puro e JavaScript moderno (ES6+).

Motivazione: Eliminando i framework Single Page Application (SPA) complessi come React o Angular, si riducono le dimensioni del pacchetto inviato ai dispositivi degli studenti (minore latenza e consumo di dati su dispositivi mobili o datati). Le chiamate API vengono effettuate in modo asincrono tramite fetch().

Alternativa scartata (React): Scartata per evitare l'overhead di configurazione e la gestione complessa dello stato globale, focalizzando le energie del team sulla robustezza delle API e del modello dati.

Database: MySQL (gestito con HeidiSQL)

Scelta: MySQL gestito tramite HeidiSQL.

Motivazione: Il dominio scolastico è intrinsecamente relazionale (es. Uno studente appartiene a una sola classe, Un voto è legato a uno studente, una verifica e un docente). L'uso di un RDBMS garantisce vincoli di integrità referenziale (ACID) e previene dati orfani o incoerenti. HeidiSQL viene impiegato dal team per la modellazione, la gestione degli indici e l'ottimizzazione delle query.

3. Modellazione Dati e Schema Relazionale (ER)
3.1 Entità e Relazioni

Il modello concettuale del database di ScuolaChill rispetta i principi di normalizzazione (Terza Forma Normale - 3NF) per garantire l'integrità dei dati ed evitare ridondanze.

       +------------------+
       |     UTENTI       |
       | (Login & Ruoli)  |
       +--------+---------+
                |
     +----------+----------+
     | 1:1                 | 1:1
+----v-----+          +----v-----+
| DOCENTI  |          | STUDENTI |
+----+-----+          +----+-----+
     |                     |
     | 1:N                 | N:1
+----v---------------+     |
| DOCENTE_MATERIA_   |     |
| CLASSE (Pivot)     |     |
+----+---------------+     |
     |                     |
     | N:1                 |
+----v-----+               |
| CLASSI   |<--------------+
+----+-----+
     |
     | 1:N
+----v-----+          +----------+
|VERIFICHE |<---------|   VOTI   |
+----------+ 1:N   N:1+----------+

3.2 Struttura Dettagliata delle Tabelle (DDL / Schema)
1. Tabella utenti

Gestisce l'autenticazione centralizzata e la distinzione dei ruoli.

id (INT, PK, Auto Increment)

email (VARCHAR(255), UNIQUE, NOT NULL)

password_hash (VARCHAR(255), NOT NULL) — Password cifrata con Argon2/Bcrypt

ruolo (ENUM('DIRETTORE', 'DOCENTE', 'STUDENTE'), NOT NULL)

created_at (TIMESTAMP)

2. Tabella studenti

id (INT, PK, Auto Increment)

utente_id (INT, FK -> utenti.id, UNIQUE)

nome (VARCHAR(100), NOT NULL)

cognome (VARCHAR(100), NOT NULL)

matricola (VARCHAR(50), UNIQUE)

classe_id (INT, FK -> classi.id, NULLABLE) — Unico vincolo: uno studente appartiene a una sola classe

3. Tabella docenti

id (INT, PK, Auto Increment)

utente_id (INT, FK -> utenti.id, UNIQUE)

nome (VARCHAR(100), NOT NULL)

cognome (VARCHAR(100), NOT NULL)

4. Tabella classi

id (INT, PK, Auto Increment)

nome (VARCHAR(10), NOT NULL) — Es. "1A", "3B"

anno_scolastico (VARCHAR(20)) — Es. "2025/2026"

5. Tabella materie

id (INT, PK, Auto Increment)

nome (VARCHAR(100), NOT NULL) — Es. "Matematica", "Informatica"

6. Tabella docente_materia_classe (Pivot)

Lega l'insegnamento di una specifica materia in una specifica classe ad un docente.

id (INT, PK, Auto Increment)

docente_id (INT, FK -> docenti.id)

materia_id (INT, FK -> materie.id)

classe_id (INT, FK -> classi.id)

7. Tabella verifiche

id (INT, PK, Auto Increment)

titolo (VARCHAR(255), NOT NULL)

descrizione (TEXT)

data_svolgimento (DATETIME, NOT NULL)

docente_id (INT, FK -> docenti.id)

materia_id (INT, FK -> materie.id)

classe_id (INT, FK -> classi.id)

8. Tabella voti

id (INT, PK, Auto Increment)

voto (DECIMAL(4,2), NOT NULL) — Valore numerico (es. 7.50)

data_emissione (DATE, NOT NULL)

note (TEXT, NULLABLE) — Commento del docente

studente_id (INT, FK -> studenti.id)

verifica_id (INT, FK -> verifiche.id)

9. Tabella materiali_didattici

id (INT, PK, Auto Increment)

titolo (VARCHAR(255), NOT NULL)

file_url (VARCHAR(512), NOT NULL) — URL del file caricato su storage esterno

docente_id (INT, FK -> docenti.id)

materia_id (INT, FK -> materie.id)

classe_id (INT, FK -> classi.id)

created_at (TIMESTAMP)