import React, { useState } from 'react';
import './style.css';

export default function App() {
  // Stato utente simulato (null = non loggato)
  const [currentUser, setCurrentUser] = useState(null);

  // Dati mockati coerenti con il SEED DATA SQL
  const [voti, setVoti] = useState([
    { id: 1, materia: 'Informatica', voto: 8.5, data: '2026-10-16', note: 'Ottima conoscenza query JOIN' },
    { id: 2, materia: 'Informatica', voto: 6.0, data: '2026-10-16', note: 'Sufficiente, rivedere FK' },
    { id: 3, materia: 'Matematica', voto: 7.5, data: '2026-10-21', note: 'Buona risoluzione dei limiti' },
  ]);

  const [materiali, setMateriali] = useState([
    { id: 1, titolo: 'Introduzione a SQL', materia: 'Informatica', url: '#' },
    { id: 2, titolo: 'Algebra Lineare - Dispense', materia: 'Matematica', url: '#' },
  ]);

  // Gestione Login Simulato
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const ruolo = e.target.ruolo.value;
    setCurrentUser({ email, ruolo });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // 1. SCHERMATA LOGIN
  if (!currentUser) {
    return (
      <div className="login-box card">
        <h2 style={{ textAlign: 'center', color: '#4f46e5' }}>ScuolaChill 🚀</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
          Accedi alla piattaforma scolastica
        </p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Istituzionale</label>
            <input type="email" name="email" placeholder="nome@scuolachill.it" required />
          </div>
          <div className="form-group">
            <label>Ruolo Utente (per testing)</label>
            <select name="ruolo">
              <option value="STUDENTE">Studente</option>
              <option value="DOCENTE">Docente</option>
              <option value="DIRETTORE">Direttore</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Entra nel Sistema
          </button>
        </form>
      </div>
    );
  }

  // 2. LAYOUT PRINCIPALE CON NAVBAR
  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>ScuolaChill</h1>
        <div className="user-badge">
          <span className="role-tag">{currentUser.ruolo}</span>
          <span style={{ fontSize: '0.9rem' }}>{currentUser.email}</span>
          <button onClick={handleLogout} className="btn-logout">Esci</button>
        </div>
      </nav>

      <main className="main-content">
        {currentUser.ruolo === 'STUDENTE' && (
          <DashboardStudente voti={voti} materiali={materiali} />
        )}

        {currentUser.ruolo === 'DOCENTE' && (
          <DashboardDocente 
            voti={voti} 
            setVoti={setVoti} 
            materiali={materiali}
            setMateriali={setMateriali}
          />
        )}

        {currentUser.ruolo === 'DIRETTORE' && (
          <DashboardDirettore />
        )}
      </main>
    </div>
  );
}

// ==========================================
// PANNELLO STUDENTE (STU-01, STU-02, STU-03)
// ==========================================
function DashboardStudente({ voti, materiali }) {
  // Calcolo Media Aritmetica (STU-03)
  const mediaVoti = voti.length > 0 
    ? (voti.reduce((acc, curr) => acc + curr.voto, 0) / voti.length).toFixed(2)
    : 'N/D';

  return (
    <div>
      <h2>Dashboard Studente</h2>
      
      <div className="grid-2">
        <div className="card">
          <h3>Media Generale Voti</h3>
          <div className="metric-value">{mediaVoti}</div>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Calcolata su {voti.length} valutazioni</p>
        </div>

        <div className="card">
          <h3>Verifiche Programmate</h3>
          <p><strong>Verifica Finale SQL</strong> - Informatica</p>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Data: 15 Ottobre 2026 ore 09:00</p>
          <button className="btn-primary" style={{ marginTop: '0.5rem' }}>Avvia Prova Online</button>
        </div>
      </div>

      <div className="card">
        <h3>Storico Voti e Valutazioni (STU-03)</h3>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Materia</th>
              <th>Voto</th>
              <th>Note del Docente</th>
            </tr>
          </thead>
          <tbody>
            {voti.map((v) => (
              <tr key={v.id}>
                <td>{v.data}</td>
                <td>{v.materia}</td>
                <td><strong>{v.voto}</strong></td>
                <td>{v.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Materiali Didattici (STU-01)</h3>
        <ul>
          {materiali.map((m) => (
            <li key={m.id} style={{ marginBottom: '0.5rem' }}>
              <strong>[{m.materia}]</strong> {m.titolo} — <a href={m.url} style={{ color: '#4f46e5' }}>Scarica PDF</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ==========================================
// PANNELLO DOCENTE (DOC-01, DOC-02, DOC-03)
// ==========================================
function DashboardDocente({ voti, setVoti, materiali, setMateriali }) {
  const [nuovoVoto, setNuovoVoto] = useState({ materia: 'Informatica', voto: '', note: '' });
  const [nuovoMateriale, setNuovoMateriale] = useState({ titolo: '', materia: 'Informatica' });

  // Aggiunta Voto (DOC-03)
  const handleAddVoto = (e) => {
    e.preventDefault();
    const val = parseFloat(nuovoVoto.voto);
    if (val < 1 || val > 10) {
      alert("Errore: Il voto deve essere compreso tra 1.0 e 10.0!");
      return;
    }

    const item = {
      id: Date.now(),
      materia: nuovoVoto.materia,
      voto: val,
      data: new Date().toISOString().split('T')[0],
      note: nuovoVoto.note
    };

    setVoti([item, ...voti]);
    setNuovoVoto({ materia: 'Informatica', voto: '', note: '' });
  };

  // Aggiunta Materiale (DOC-01)
  const handleAddMateriale = (e) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      titolo: nuovoMateriale.titolo,
      materia: nuovoMateriale.materia,
      url: '#'
    };
    setMateriali([...materiali, item]);
    setNuovoMateriale({ titolo: '', materia: 'Informatica' });
  };

  return (
    <div>
      <h2>Dashboard Docente (Prof. Rossi)</h2>

      <div className="grid-2">
        {/* Registrazione Voti (DOC-03) */}
        <div className="card">
          <h3>Assegna e Registra Voto (DOC-03)</h3>
          <form onSubmit={handleAddVoto}>
            <div className="form-group">
              <label>Materia</label>
              <select 
                value={nuovoVoto.materia} 
                onChange={(e) => setNuovoVoto({...nuovoVoto, materia: e.target.value})}
              >
                <option value="Informatica">Informatica (Classe 3A)</option>
                <option value="Matematica">Matematica (Classe 3A)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Voto Numerico (1 - 10)</label>
              <input 
                type="number" 
                step="0.5"
                placeholder="es. 8.5"
                value={nuovoVoto.voto}
                onChange={(e) => setNuovoVoto({...nuovoVoto, voto: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Note o Descrizione</label>
              <input 
                type="text" 
                placeholder="es. Ottima prova pratica"
                value={nuovoVoto.note}
                onChange={(e) => setNuovoVoto({...nuovoVoto, note: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary">Registra Voto</button>
          </form>
        </div>

        {/* Upload Materiali (DOC-01) */}
        <div className="card">
          <h3>Carica Materiale Didattico (DOC-01)</h3>
          <form onSubmit={handleAddMateriale}>
            <div className="form-group">
              <label>Titolo del Documento</label>
              <input 
                type="text" 
                placeholder="es. Dispensa Architettura CPU"
                value={nuovoMateriale.titolo}
                onChange={(e) => setNuovoMateriale({...nuovoMateriale, titolo: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Materia e Classe</label>
              <select 
                value={nuovoMateriale.materia} 
                onChange={(e) => setNuovoMateriale({...nuovoMateriale, materia: e.target.value})}
              >
                <option value="Informatica">Informatica (Classe 3A)</option>
                <option value="Matematica">Matematica (Classe 3A)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Seleziona File (PDF/Docx max 20MB)</label>
              <input type="file" />
            </div>
            <button type="submit" className="btn-primary">Pubblica Documento</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PANNELLO DIRETTORE (DIR-01, DIR-03)
// ==========================================
function DashboardDirettore() {
  return (
    <div>
      <h2>Pannello Amministrativo (Direttore)</h2>

      <div className="grid-2">
        <div className="card">
          <h3>Creazione Account Docente (DIR-01)</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert("Account creato con successo! Inviate le credenziali via mail."); }}>
            <div className="form-group">
              <label>Nome Docente</label>
              <input type="text" placeholder="Mario" required />
            </div>
            <div className="form-group">
              <label>Cognome Docente</label>
              <input type="text" placeholder="Rossi" required />
            </div>
            <div className="form-group">
              <label>Email Istituzionale</label>
              <input type="email" placeholder="mario.rossi@scuolachill.it" required />
            </div>
            <button type="submit" className="btn-primary">Genera Account e Invia Credenziali</button>
          </form>
        </div>

        <div className="card">
          <h3>Statistiche Istituto</h3>
          <p><strong>Studenti Registrati:</strong> 800</p>
          <p><strong>Docenti Attivi:</strong> 60</p>
          <p><strong>Classi Gestite:</strong> 30</p>
        </div>
      </div>
    </div>
  );
}