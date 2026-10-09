# PRD Template

# PRD di ScuolaChill

---

## Informazioni sul documento

|  |  |
| --- | --- |
| **Prodotto** | ScuolaChill |
| **Autori** | Francesco Candeago |
| **Versione** | *1.0* |
| **Data** | *30/09/2026* |
| **Stato** | *Validato* |

### Storico delle versioni

| Versione | Data | Autore | Cosa è cambiato e perché |
| --- | --- | --- | --- |
| 1.0 | *30/09/2026* | Francesco | Prima stesura completa del PRD (Carico, Architettura, ER, User Stories) |

---

# Prima parte · Il cosa

## Scopo e perimetro

### Perché esiste ScuolaChill

**Dal lato business.** ScuolaChill riunisce in un’unica piattaforma tutto ciò che serve per la scuola. Permette di gestire facilmente lezioni, materiali e verifiche, senza usare email e file sparsi.

**Dal lato tecnico.** Il sistema gestisce l'intero ciclo di vita delle attività scolastiche: profilazione e associazione utenti/classi, erogazione di materiale didattico, svolgimento di verifiche sincrone e registrazione/consultazione dei voti con relative medie.

### Cosa è incluso

- Gestione completa di utenti (Direttore, Docenti, Studenti), classi e materie.
- Caricamento e distribuzione centralizzata del materiale didattico.
- Creazione, erogazione con timer e consegna automatizzata/manuale delle verifiche online.
- Valutazione, correzione, registrazione dei voti e calcolo automatico delle medie per gli studenti.

### Cosa non è incluso

- Gestione delle assenze, presenze e giustificazioni.
- Comunicazione diretta tra istituto e famiglie (registro presenze/note disciplinari).
- Integrazione con i sistemi di pagamento scolastici o mensa.

---

## Stakeholder

| Stakeholder | Cosa fa | Cosa gli interessa | Come lo coinvolgete |
| --- | --- | --- | --- |
| Direttore | Amministra l'istituto, crea account e compone le classi. | Sicurezza dei dati, isolamento perimetro classi, conformità GDPR. | Revisione iniziale e collaudo permessi. |
| Docenti | Caricano materiale, creano ed erogano verifiche, valutano. | Semplicità d'uso, stabilità durante le verifiche, correzione rapida. | Demo delle funzionalità e sessioni di feedback. |
| Studenti | Consultano materiali, svolgono verifiche e vedono i voti. | Interfaccia responsive, chiarezza dei tempi e salvataggio sicuro. | Collaudo pratico e test di usabilità. |
| Docente del corso | Valida il PRD | Qualità del codice, scelte architetturali, rispetto dei vincoli. | Presentazione e domande |
| Collaudatori del primo anno | Usano ScuolaChill come utenti reali | Usabilità intuitiva da smartphone e assenza di bug bloccanti. | Test su campo in aula e questionari. |

---

## Destinatari e contesto d'uso

### La scuola che avete immaginato

*Descrivi la scuola per cui progettate. Che tipo di istituto è, dove si trova, come si organizza la giornata. Questi dati tornano nella stima del carico, quindi scegli numeri che poi userai davvero.*

|  | Valore |
| --- | --- |
| Numero di studenti | 800 studenti |
| Numero di docenti | 50 docenti |
| Numero di classi | 44 classi |
| Orario scolastico | 08:00 – 13:00, dal lunedì al sabato |
| Connettività | Wi-Fi scolastico condiviso e rete mobile 4G/5G degli studenti |

### Gli archetipi

Arricchisci gli archetipi della traccia.

| ID | Archetipo | Contesto d'uso | Competenze digitali | Dispositivo principale | Frequenza d'uso |
| --- | --- | --- | --- | --- | --- |
| ARC-001 | Direttore | Ufficio di presidenza / Segreteria | Medio-alte | PC Desktop | Saltuaria (Picchi ad inizio anno) |
| ARC-002 | Docente | Cattedra in aula, laboratorio, casa | Medie | Laptop / Tablet | Quotidiana |
| ARC-003 | Studente | Banco di scuola, corridoio, casa | Medio-alte (Mobile-first) | Smartphone / Laptop | Quotidiana |

---

## Panoramica e casi d'uso

### ScuolaChill in poche righe

ScuolaChill è la piattaforma scolastica che semplifica la giornata di studenti e professori: un unico posto dove trovare i documenti delle lezioni, svolgere le verifiche dal proprio dispositivo e controllare la propria media voti in tempo reale, senza il rischio di smarrire file o saltare le consegne.

### User flow e scenari

### Area Direttore (ARC-001)

#### 1. Storia: DIR-01 · Creare account docente

- **User flow:**
    1. Il Direttore accede alla sezione *Gestione Personale*.
    2. Clicca su *"Aggiungi Nuovo Docente"*.
    3. Compila il form inserendo Nome, Cognome ed Email istituzionale.
    4. Clicca su *"Crea Account"*.
    5. Il sistema valida i dati, salva l'utente e invia un'email con credenziali temporanee.
- **Scenario principale:**
    
    Il Direttore crea l'account per il "Prof. Bianchi" con la mail mario.bianchi@scuolachill.it. Il sistema salva l'utente con ruolo DOCENTE e mostra il messaggio di conferma.
    
- **Scenari alternativi:**
    - *Email duplicata:* L'email inserita esiste già nel database; il sistema mostra l'errore *"Email già presente"* e non crea l'account.
    - *Servizio Email non disponibile:* L'account viene creato, ma l'invio dell'email fallisce; il sistema mostra a schermo la password temporanea generata affinché il Direttore possa comunicarla a voce.

#### 2. Storia: DIR-03 · Creare classi e comporle

- **User flow:**
    1. Il Direttore apre la sezione *Gestione Classi*.
    2. Seleziona una classe (es. "3A") o ne crea una nuova.
    3. Assegna gli studenti alla classe e associa i docenti per ciascuna materia.
    4. Conferma la composizione.
    5. Il sistema aggiorna le associazioni nel database.
- **Scenario principale:**
    
    Il Direttore seleziona la classe "3A", vi assegna 20 studenti e associa il "Prof. Bianchi" per la materia "Informatica". Da quel momento il docente vede la classe "3A" nella sua dashboard.
    
- **Scenari alternativi:**
    - *Studente già assegnato:* Se il Direttore tenta di inserire uno studente già appartenente alla "2B", il sistema blocca l'azione e richiede di confermare il *Trasferimento di Classe*.

#### 3. Storia: DIR-04 · Vista complessiva dell'istituto (Dashboard)

- **User flow:**
    1. Il Direttore accede alla *Dashboard Generale*.
    2. Consulta le metriche aggregate (numero studenti per classe, media voti d'istituto, verifiche svolte).
    3. Applica filtri per classe o materia.
    4. Il sistema recupera i dati paginati e li mostra a schermo.
- **Scenario principale:**
    
    Il Direttore visualizza la panoramica scolastica ad inizio quadrimestre, identificando quali classi hanno medie insufficienti senza dover entrare nei singoli registri.
    
- **Scenari alternativi:**
    - *Carico elevato sul DB:* Se la risposta richiede l'aggregazione di migliaia di voti, il backend utilizza una vista denormalizzata e paginata per restituire la dashboard in meno di 500 ms.

### Area Docente (ARC-002)

#### 1. Storia: DOC-01 · Caricare materiale didattico

- **User flow:**
    1. Il Docente seleziona la classe e la materia (es. "3A - Informatica").
    2. Clicca su *"Carica Materiale"*, inserisce un titolo e allega il file.
    3. Clicca su *"Pubblica"*.
    4. Il sistema invia il file allo storage esterno (AWS S3) e salva il link nel DB.
    5. Gli studenti della classe vedono il file disponibile.
- **Scenario principale:**
    
    Il Prof. Bianchi carica la dispense PDF "Architettura_CPU.pdf" (3 MB) per la 3A. Il file viene salvato nello storage e compare subito nel pannello degli studenti della 3A.
    
- **Scenari alternativi:**
    - *File troppo grande:* Il docente tenta di caricare un video da 50 MB; il sistema blocca l'upload mostrando l'errore *"Limite massimo file: 20 MB"*.
    - *Tentativo di upload su classe non propria:* Se il docente forza l'API per caricare su una classe non sua, il backend restituisce 403 Forbidden.

#### 2. Storia: DOC-02 · Creare le proprie verifiche

- **User flow:**
    1. Il Docente accede alla sezione *Verifiche* e clicca su *"Nuova Verifica"*.
    2. Inserisce titolo, data/ora di inizio, durata (es. 45 min) e le domande.
    3. Salva la verifica come BOZZA o la programma per la pubblicazione.
    4. Il sistema registra la verifica nel DB.
- **Scenario principale:**
    
    Il docente programma la verifica di Informatica per la 3A per il lunedì alle 09:00. Fino a quell'ora gli studenti non vedono i quesiti dell'esame.
    
- **Scenari alternativi:**
    - *Modifica a verifica già svolta:* Il docente tenta di modificare le domande dopo che la verifica è stata erogata; il sistema nega l'operazione in quanto la verifica è congelata.

#### 3. Storia: DOC-03 · Assegnare i voti

- **User flow:**
    1. Il Docente apre l'elenco delle consegne di una verifica completata.
    2. Visualizza le risposte dello studente e inserisce un voto numerico e una nota.
    3. Clicca su *"Salva e Pubblica Voto"*.
    4. Il sistema registra il voto e notifica lo studente.
- **Scenario principale:**
    
    Il docente corregge la verifica dello studente Mario Rossi e assegna il voto "8.5" con la nota "Ottimo". Mario Rossi visualizza il voto nel suo profilo.
    
- **Scenari alternativi:**
    - *Voto fuori scala:* Il docente inserisce per errore "12"; il sistema blocca il salvataggio evidenziando che i voti devono essere compresi tra 1.0 e 10.0.

### Area Studente (ARC-003)

#### 1. Storia: STU-01 · Consultare il materiale didattico

- **User flow:**
    1. Lo Studente si autentica e accede alla sezione *Materiale Didattico*.
    2. Seleziona una materia (es. "Informatica").
    3. Visualizza la lista dei file caricati dai propri docenti.
    4. Clicca sul file per scaricarlo o aprirlo nel browser.
- **Scenario principale:**
    
    Mario Rossi apre la sezione di Informatica e scarica il PDF della lezione spiegata la mattina stessa dal Prof. Bianchi.
    
- **Scenari alternativi:**
    - *Tentativo di accesso a materiali di altre classi:* Se lo studente prova ad accedere direttamente via URL ad un file caricato per la 5B, il sistema nega il download (403 Forbidden).

#### 2. Storia: STU-02 · Svolgere una verifica online

- **User flow:**
    1. Lo studente si autentica da smartphone/PC e apre la sezione *Verifiche*.
    2. Seleziona la verifica attiva per la sua classe.
    3. Risponde ai quesiti mentre il timer mostra il tempo residuo.
    4. Clicca su *"Consegna "* (oppure attende lo scadere del timer).
    5. Il sistema conferma l'invio e blocca ulteriori modifiche.
- **Scenario principale:**
    
    Mario Rossi della 3A apre la verifica alle 09:00, risponde a tutte le domande entro i 60 minuti previsti e clicca su "Consegna". Il sistema registra l'invio e imposta lo stato su CONSEGNATA.
    
- **Scenari alternativi:**
    - *Scadenza del tempo:* Il timer raggiunge lo 00:00; il sistema disabilita la form e invia automaticamente al server tutte le risposte salvate.
    - *Caduta di connessione:* La rete Wi-Fi si disconnette; la Web App salva le bozze in locale e sincronizza i dati non appena la rete torna disponibile.
    - *Doppia scheda aperta / Seconda consegna:* Se lo studente tenta di riconsegnare o aprire una seconda scheda, la sessione precedente viene bloccata per evitare tentativi di frode.

#### 3. Storia: STU-03 · Consultare i propri voti e medie

- **User flow:**
    1. Lo Studente accede alla sezione *I Miei Voti*.
    2. Visualizza il prospetto dei voti raggruppati per materia.
    3. Consulta la media aritmetica calcolata automaticamente dal sistema.
- **Scenario principale:**
    
    Mario Rossi visualizza i suoi tre voti di Matematica (6.0, 8.0, 7.0) e vede la media di materia calcolata a "7.0", capendo subito dove deve recuperare.
    
- **Scenari alternativi:**
    - *Violazione della privacy:* Lo studente tenta di cambiare l'ID dell'utente nelle chiamate API per vedere i voti di un compagno di classe; il backend blocca la richiesta con errore 403 Forbidden.

---

## Requisiti funzionali

### Le user story della traccia

| ID | Storia | AC aggiunti dal team |
| --- | --- | --- |
| DIR-01 | Creare account docente | Controllo univocità email, invio credenziali via mail |
| DIR-02 | Creare account studente | Generazione matricola automatica, associazione classe |
| DIR-03 | Creare classi e comporle | Isolamento perimetro dati per classe/materia |
| DIR-04 | Vedere tutto | Dashboard analitica amministrativa con filtri |
| DOC-01 | Caricare materiale didattico | Blocco upload > 20MB, verifica permessi su classe (403) |
| DOC-02 | Creare le proprie verifiche | Decomposizione Epic in bozza, pubblicazione, erogazione |
| DOC-03 | Assegnare i voti | Validazione range numerico (1-10), notifica allo studente |
| STU-01 | Consultare il materiale didattico | Download sicuro e filtri per materia |
| STU-02 | Svolgere una verifica | Auto-submit al timeout, blocco consegne doppie |
| STU-03 | Consultare i propri voti | Calcolo media aritmetica, blocco accesso ad API altrui |

### Le decisioni lasciate aperte dalla traccia

**FR-DOC-01 · Scala dei Voti (collegato a DOC-03):**
• *Decisione:* Scala numerica decimali con passo $0.5$ (es. $6.0$, $6.5$, $7.0$) da $1.0$ a $10.0$. Non sono ammessi segni $+$ o $-$.
• *Motivazione:* Normalizza il calcolo algebrico delle medie nel database ed evita ambiguità nei voti.

**FR-DIR-01 · Trasferimento Studente (collegato a DIR-03):**
• *Decisione:* Lo studente può essere spostato di classe. I voti pregressi rimangono storicizzati con il riferimento alla vecchia classe/materia.
• *Motivazione:* Preserva l'integrità dello storico scolastico del ragazzo.

**FR-DOC-02 · Modifica Verifica (collegato a DOC-02):**
• *Decisione:* Una verifica è modificabile solo nello stato di bozza. Una volta avviata o svolta, è congelata in sola lettura.
• *Motivazione:* Evita incongruenze nella valutazione di risposte già inviate.

**FR-STU-01 · Caduta Connessione (collegato a STU-02):**
• *Decisione:* Risposte salvate in local storage del browser ogni 30 secondi e auto-submit sincronizzato se riconnesso prima dello scadere del timer.
• *Motivazione:* Protegge lo studente da perdita di dati causa disconnessioni Wi-Fi.

**FR-SYS-01 · Fallimento Servizio Email (collegato a DIR-01):**
• *Decisione:* In caso di errore del provider mail (SendGrid/AWS SES), l'account viene comunque creato e la credenziale provvisoria viene mostrata all'amministratore a schermo.
• *Motivazione:* Garantisce la continuità operativa del Direttore anche in caso di outage esterno.

---

## Requisiti non funzionali

Ogni requisito ha una soglia, una condizione e un modo per verificarlo. Ed è collegato ad almeno una user story.

| ID | Famiglia | Requisito | Soglia e condizione | Come si verifica | Storie collegate |
| --- | --- | --- | --- | --- | --- |
| NFR-01 | Prestazioni | Caricamento verifiche nel picco | Latenza $< 2\text{ s}$ per il 95% delle richieste con 75 utenti concorrenti nello stesso minuto | Test di carico con JMeter | STU-02 |
| NFR-02 | Sicurezza | Isolamento dati e comunicazioni | Cifratura HTTPS (TLS 1.3), Token JWT ed estrazione ID da contesto di sicurezza (HTTP 403 Forbidden) | Penetration Test e Code Review | DIR-03, STU-03 |
| NFR-03 | Usabilità | Responsive e accessibilità | Layout usabile da mobile (min 320px) e conforme WCAG 2.1 AA | Test manuale e Lighthouse Audit | STU-02, STU-03 |
| NFR-04 | Disponibilità | Uptime del servizio | Uptime del 99.5% durante la fascia oraria scolastica (08:00–14:00) | Healthcheck endpoint su Cloudwatch | Tutte |
| NFR-05 | Ambientale | Efficienza energetica | Minimizzazione payload JSON ($< 50\text{ KB}$) e query indicizzate per ridurre la CPU utilizzata | Benchmark di profilazione dati | STU-01, STU-03 |
| NFR-06 | Supporto | Manutenibilità del codice | Copertura dei test unitari e d'integrazione $> 70\%$ | Report JaCoCo / SonarQube | Tutte |
| NFR-07 | Interazione | Feedback di errore uniforme | Errori formattati secondo lo standard RFC 7807 (Problem Details) | Test delle API REST | Tutte |
| NFR-08 | Conformità | Protezione Privacy (GDPR) | Accesso ai voti limitato al solo studente proprietario e ai docenti della classe | Audit di sicurezza sui percorsi API | STU-03 |

### Requisiti impliciti

Prima di chiudere questa sezione, intervista per dieci minuti un ragazzo del primo anno. La domanda è una sola. *"Cosa daresti per scontato che un'app di questo tipo faccia sempre, o non faccia mai?"*

| Chi avete intervistato | Cosa ha detto | Requisito che ne avete ricavato |
| --- | --- | --- |
| Studente del primo anno | Il voto e le risposte non devono sparire mai, anche se chiudo la scheda per sbaglio o se si spegne il telefono. | Persistence & Auto-recovery client-side. Salvataggio locale in background dello stato della verifica per prevenire perdita accidentale dei dati inseriti prima dell'invio. |

---

## Assunzioni, vincoli e dipendenze

### Assunzioni

Quello che date per vero senza poterlo garantire.

| ID | Assunzione | Cosa succede se è falsa |
| --- | --- | --- |
| ASS-01 | La scuola ha una popolazione massima di 800 studenti e 60 docenti. | Occorre ridimensionare le risorse del Database e le istanze backend. |
| ASS-02 | Le verifiche si svolgono prevalentemente durante l'orario scolastico. | Bisogna estendere i monitoraggi e le risorse cloud anche alle ore serali/notturne. |

### Vincoli

I limiti che non potete cambiare.

| ID | Vincolo | Da dove viene |
| --- | --- | --- |
| VIN-01 | Budget Cloud limitato ai crediti forniti dal programma studentesco AWS. | Traccia del progetto |
| VIN-02 | Architettura basata su stack Spring Boot (Backend) e Relational DB (PostgreSQL). | Vincolo tecnologico della didattica |

### Dipendenze

Le cose esterne senza cui non potete andare avanti.

| ID | Dipendenza | Serve entro |
| --- | --- | --- |
| DIP-01 | Account e API Key su servizio SMTP/SendGrid per invio email credenziali. | Fase di Integration Test |
| DIP-02 | Cloud Provider Object Storage (AWS S3) per salvataggio file didattici. | Rilascio v1.0 |

---

# Seconda parte · Il come

## Stima del carico

### Utenti concorrenti

| Situazione | Utenti concorrenti | Da dove viene il numero |
| --- | --- | --- |
| Uso normale durante la giornata | ~15 - 25 | Consultazione sporadica materiali, voti e orario durante le lezioni. |
| Picco delle 9:00 (verifiche) | ~75 | Svolgimento simultaneo di verifiche in circa 2-3 classi in parallelo ($25 \text{ studenti/classe} \times 3 = 75$). |
| Fine quadrimestre (voti) | ~30 | Inserimento intensivo dei voti finali da parte di più docenti contemporaneamente. |

### Profilo di carico

| Operazione | Frequente? | Pesante? | Critica? | Note |
| --- | --- | --- | --- | --- |
| Login | Sì | No | Sì | Richiede generazione e verifica token JWT. |
| Apertura verifica | No (A picchi) | No | Sì | Picco di letture simultanee alle 09:00 (75 utenti). |
| Consegna verifica | No (A picchi) | Medio | Sì | Write intensiva sul DB a fine ora (auto-submit). |
| Dashboard del Direttore | Rara | Medio | No | Query analitiche e aggregazioni su tabelle trasversali. |
| Caricamento materiale | Media | Sì | No | Richiede stream verso l'Object Storage esterno (PDF/Docs). |

---

## Scelte tecnologiche

| Area | Scelta | Alternativa considerata | Perché avete scelto così |
| --- | --- | --- | --- |
| Backend | Python (FastAPI) | Node.js (Express) | FastAPI offre prestazioni paragonabili a Node.js grazie al supporto asincrono (async/await), ma garantisce una validazione dei dati nativa (tramite Pydantic) e genera automaticamente la documentazione OpenAPI/Swagger obbligatoria. La familiarità del team con Python riduce drasticamente il rischio di errori architetturali. |
| Frontend | HTML/CSS/JavaScript Vanilla | React | Eliminando i framework Single Page Application (SPA) complessi come React o Angular, si riducono le dimensioni del pacchetto inviato ai dispositivi degli studenti (minore latenza e consumo di dati su dispositivi mobili o datati). Le chiamate API vengono effettuate in modo asincrono tramite fetch(). |
| Database | MySQL (gestito con HeidiSQL) | MongoDB | Il dominio scolastico è intrinsecamente relazionale (es. Uno studente appartiene a una sola classe, Un voto è legato a uno studente, una verifica e un docente). L'uso di un RDBMS garantisce vincoli di integrità referenziale (ACID) e previene dati orfani o incoerenti. HeidiSQL viene impiegato dal team per la modellazione, la gestione degli indici e l'ottimizzazione delle query. |
| Provider cloud | AWS (Amazon Web Services) | Google Cloud / Azure | Ampia disponibilità di servizi free tier / crediti per studenti ed elevata documentazione. |
| Servizi cloud | AWS ECS (Fargate) + RDS | AWS EC2 Monolitico | Fargate a container gestiti consente scalabilità modulare senza gestire l'OS sottostante. |
| Regione | eu-west-1 (Ireland) | us-east-1 | Garantisce la compliance GDPR sul trattamento dati in territorio europeo con bassa latenza. |
| Servizio esterno | AWS S3 / SendGrid | Storage locale su disco | Archiviazione file scalabile e disaccoppiata dall'applicazione backend stateless. |

---

## Architettura

### Diagramma dei componenti

*Inserisci qui il diagramma. Deve mostrare i componenti principali e come comunicano.*

### I livelli

| Livello | Cosa fa in ScuolaChill | Esempio concreto |
| --- | --- | --- |
| Presentation / API | *…* | *…* |
| Application / Business | *…* | *…* |
| Data access | *…* | *…* |

### Le dipendenze fra i livelli

*Chi può conoscere chi, e in quale direzione. Spiega come questa struttura riduce l'accoppiamento e rende il sistema testabile.*

---

## Le API

### Le risorse

*Elenca le risorse REST principali. Es. `/classi`, `/verifiche`, `/voti`.*

### Il contratto delle API principali

| Verbo | Route | Chi può chiamarla | Payload di esempio | Risposte previste |
| --- | --- | --- | --- | --- |
| `POST` | `*/api/docenti*` | *Direttore* | `*{ "nome": "…", "email": "…" }*` | *201, 400, 403, 409* |
| `GET` | *…* | *…* | *…* | *…* |
| `PUT` | *…* | *…* | *…* | *…* |
| `PATCH` | *…* | *…* | *…* | *…* |
| `DELETE` | *…* | *…* | *…* | *…* |

### Errori, validazione e paginazione

**Formato uniforme degli errori.** *Mostra un esempio di risposta di errore.*

**Validazione degli input.** *Dove avviene e con quali regole.*

**Paginazione.** *Come funziona. Parametri, dimensione di default, formato della risposta.*

**Documentazione e verifica.** *Come userete OpenAPI/Swagger e la collezione Postman.*

---

## Persistenza e modello dei dati

### Diagramma ER

*Inserisci qui il diagramma entità-relazioni con le cardinalità.*

### Identificatori

*Come vengono generati gli ID, e perché. Numeri incrementali, UUID, altro?*

### Tre modelli diversi

| Entità | Nel database | Nel dominio | Esposta dall'API | Dove differiscono e perché |
| --- | --- | --- | --- | --- |
| *es. Voto* | *…* | *…* | *…* | *…* |

### Normalizzazione e letture aggregate

*Come è normalizzato il modello. Dove serve una lettura denormalizzata, per esempio la pagina dei voti per materia o la dashboard del Direttore.*

### Accesso ai dati

*Strategia di accesso ai dati e uso delle query parametrizzate contro la SQL injection.*

---

## Sicurezza e integrazione

### Autenticazione e token

*Come si ottiene il token, cosa contiene, come viaggia il profilo utente.*

### Chi può fare cosa

| Operazione | Direttore | Docente | Studente |
| --- | --- | --- | --- |
| Creare un docente | ✅ | ❌ | ❌ |
| Caricare materiale | *…* | *…* | *…* |
| Vedere i voti di uno studente | *…* | *…* | *…* |
| *…* |  |  |  |

*Spiega dove viene fatto rispettare questo controllo. Ricorda che il frontend non basta mai.*

### L'API esterna

*Quale servizio usate, per cosa, e cosa succede quando non risponde.*

### Configurazione e segreti

*Dove vivono connection string e segreti, e come cambiano fra Development e Production.*

---

## Qualità architetturale

### Organizzazione del codice

*Struttura di progetti, moduli e cartelle, con le motivazioni.*

### Dependency inversion e IoC

*Dove li applicate e a cosa servono in ScuolaChill.*

### Testabilità

*Cosa testerete, e come separate database e API esterne per sostituirli nei test.*

### Development e Production

|  | Development | Production |
| --- | --- | --- |
| Database | *…* | *…* |
| Segreti | *…* | *…* |
| Log | *…* | *…* |
| *…* |  |  |

---

## Dimensionamento e costi

| Componente | Servizio | Taglia (CPU, RAM, storage) | Istanze | Costo mensile stimato |
| --- | --- | --- | --- | --- |
| Backend | *…* | *…* | *…* | *…* |
| Database | *…* | *…* | *…* | *…* |
| Storage dei file | *…* | *…* | *…* | *…* |
| *…* |  |  |  |  |
| **Totale** |  |  |  | ***…*** |

**Strategia di scalabilità.** *Verticale o orizzontale? Manuale o automatica?*

**Se la stima si rivela sbagliata.** *Cosa fate se gli utenti sono il doppio? E se sono la metà?*

---

## Piano di deployment

*Come ScuolaChill arriva sul cloud scelto. Come si passa da una versione alla successiva. Come vengono gestite nel tempo le modifiche allo schema del database.*

---

# Terza parte · Tempi e valutazione

## Milestone

| Milestone | Cosa è pronto | Data prevista | Responsabile |
| --- | --- | --- | --- |
| PRD validato | Questo documento | *…* | *tutto il team* |
| *Prima versione in cloud* | *…* | *…* | *…* |
| *Collaudo con il primo anno* | *…* | *…* | *…* |
| *…* |  |  |  |

<aside>
💡

Stima il tempo di ogni fase come se tutto andasse bene. Poi aggiungi un margine. Non va mai tutto bene.

</aside>

## Piano di valutazione

Come capirete che ScuolaChill funziona e come validerete che la vostra soluzione sta avendo un impatto positivo?

| Metrica | Obiettivo | Come la misurate | Quando |
| --- | --- | --- | --- |
| *es. Collaudatori che completano una verifica senza aiuto* | *90%* | *Osservazione durante il collaudo* | *Collaudo* |
| *es. Voti persi* | *0* | *Confronto fra voti inseriti e voti salvati* | *Primo mese* |
|  |  |  |  |

---