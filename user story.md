# USER STORY

## 4.2 Decomposizione degli Epic (Spezzare le storie complesse)

Una richiesta generica come *"Gestire le verifiche"* costituisce un **Epic** (un contenitore troppo ampio da stimare o implementare in una sola volta). È stata quindi effettuata una scomposizione lungo l'intero ciclo di vita dell'operazione, creando sotto-storie atomiche:

**EPIC: Gestione delle Verifiche e delle Valutazioni**

```text
├── DOC-02: Creare la bozza di una verifica
├── DOC-04: Modificare la verifica prima dello svolgimento
├── STU-02: Svolgere e consegnare la verifica online
├── DOC-05: Vedere chi ha consegnato in tempo reale
├── DOC-06: Correggere le risposte degli studenti
└── DOC-03: Assegnare e registrare il voto finale
```

## 4.3 Catalogo delle User Story e Criteri di Accettazione

### Area Direttore (Ruolo Amministrativo)

#### DIR-01 — Creazione Account Docente

* **User Story:** *Come Direttore, voglio creare gli account del personale docente inserendo i dati anagrafici e la mail istituzionale, così da dare al personale l'accesso al sistema con il ruolo corretto ed evitare ritardi operativi ad inizio anno.*

* **Criteri di Accettazione (Given-When-Then):**

**Scenario 1: Creazione riuscita di un account docente (Happy Path)**

* Dato che sono autenticato come Direttore
* Quando inserisco i dati del docente con email "[mario.rossi@scuolachill.it](mailto:mario.rossi@scuolachill.it)" e confermo
* Allora l'account viene creato nel database con ruolo "DOCENTE"
* E il sistema genera e invia un'email al docente con le credenziali provvisorie.

**Scenario 2: Tentativo di creazione con email duplicata (Gestione Errore)**

* Dato che esiste già un utente registrato con l'email "[mario.rossi@scuolachill.it](mailto:mario.rossi@scuolachill.it)"
* E sono autenticato come Direttore
* Quando provo a creare un nuovo docente con la stessa email
* Allora la richiesta viene bloccata
* E il sistema mostra il messaggio d'errore: "Email già presente nel sistema".

#### DIR-03 — Composizione Classi e Assegnazioni

* **User Story:** *Come Direttore, voglio associare studenti e docenti alle rispettive classi e materie, così da definire con precisione i perimetri di visibilità dei dati e garantire la privacy tra le diverse sezioni.*

* **Criteri di Accettazione (Given-When-Then):**

**Scenario 1: Assegnazione docente a classe e materia**

* Dato che la classe "3A" e il docente "Prof. Bianchi" esistono a sistema
* Quando associo il "Prof. Bianchi" alla classe "3A" per la materia "Informatica"
* Allora la tabella "docente_materia_classe" viene aggiornata
* E il docente visualizzerà la classe "3A" esclusivamente per le attività di Informatica.

### Area Docente

#### DOC-01 — Caricamento Materiale Didattico

* **User Story:** *Come Docente, voglio caricare i file didattici selezionando la classe e la materia di destinazione, così da centralizzare la distribuzione dei documenti ufficiali ed evitare l'invio dispersivo tramite email.*

* **Criteri di Accettazione (Given-When-Then):**

**Scenario 1: Upload file valido su propria classe (Happy Path)**

* Dato che sono autenticato come Docente e insegno "Informatica" nella classe "3A"
* Quando carico un file PDF di dimensione pari a 4 MB per la classe "3A"
* Allora il file viene salvato nell'Object Storage esterno
* E il link viene registrato nella tabella "materiali_didattici"
* E gli studenti della "3A" vedono subito il documento nella propria dashboard.

**Scenario 2: Tentativo di upload su classe non assegnata (Sicurezza)**

* Dato che sono autenticato come Docente
* E NON insegno nella classe "5B"
* Quando provo a inviare un file destinato alla classe "5B"
* Allora il backend risponde con codice d'errore 403 Forbidden
* E nessun file viene salvato nello storage.

#### DOC-03 — Assegnazione Voti

* **User Story:** *Come Docente, voglio registrare i voti ottenuti dagli studenti nelle verifiche, così da formalizzare la valutazione e permettere alle famiglie e agli studenti di monitorare l'andamento didattico.*

* **Criteri di Accettazione (Given-When-Then):**

**Scenario 1: Registrazione voto con esito positivo**

* Dato che la verifica di "Informatica" è stata svolta dallo studente "Mario Rossi"
* Quando inserisco il voto "8.5" con la nota "Ottima esposizione"
* Allora il voto viene salvato nella tabella "voti"
* E lo studente "Mario Rossi" riceve la notifica dell'avvenuta valutazione.

**Scenario 2: Validazione del range numerico (Caso Limite)**

* Dato che sto correggendo una verifica
* Quando tento di inserire il valore "12" oppure "-2" nel campo voto
* Allora l'interfaccia blocca l'invio mostrando l'errore: "Il voto deve essere compreso tra 1 e 10".

### Area Studente

#### STU-02 — Svolgimento della Verifica Online

* **User Story:** *Come Studente, voglio accedere e svolgere la verifica online nell'orario previsto salvando le mie risposte, così da completare la prova assegnata e inviarla per la valutazione.*

* **Criteri di Accettazione (Given-When-Then):**

**Scenario 1: Svolgimento e consegna regolari (Happy Path)**

* Dato che sono autenticato come Studente e la verifica della classe "3A" è attiva
* Quando inserisco le risposte e clicco su "Consegna Definita"
* Allora il sistema imposta lo stato della verifica su "CONSEGNATA"
* E registra le mie risposte impedendo modifiche successive.

**Scenario 2: Gestione della scadenza del tempo (Timeout)**

* Dato che sto svolgendo la verifica online
* Quando il timer dell'esame raggiunge lo "00:00"
* Allora il sistema blocca automaticamente l'input dell'utente
* E invia al server tutte le risposte salvate fino a quel momento.

**Scenario 3: Blocco di una seconda consegna (Caso d'Errore / Sicurezza)**

* Dato che la mia verifica risulta già nello stato "CONSEGNATA"
* Quando tento di riaprire la prova o inviare nuove risposte
* Allora il sistema rifiuta la richiesta restituendo un messaggio di errore.

#### STU-03 — Consultazione Voti e Medie

* **User Story:** *Come Studente, voglio consultare lo storico dei miei voti raggruppati per materia con il calcolo della media, così da individuare subito le discipline in cui sono in difficoltà e organizzare lo studio per i recuperi.*

* **Criteri di Accettazione (Given-When-Then):**

**Scenario 1: Visualizzazione prospetto voti e media aritmetica**

* Dato che sono autenticato come Studente e ho i voti (6, 8, 7) nella materia "Matematica"
* Quando accedo alla sezione "I miei Voti"
* Allora il sistema calcola e mostra la media "7.0" per la materia "Matematica"
* E mostra la lista dettagliata con le singole date ed eventuali note del docente.

**Scenario 2: Protezione della privacy sui voti altrui (Sicurezza)**

* Dato che sono autenticato come Studente "A"
* Quando tento di richiamare l'API `/api/v1/studenti/B/voti` inserendo l'ID dello Studente "B"
* Allora il sistema risponde con errore 403 Forbidden e nega l'accesso ai dati.