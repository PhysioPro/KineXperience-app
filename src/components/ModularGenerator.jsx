import { useState } from 'react';
import axios from 'axios';

const AIRTABLE_BASE_ID = 'appCatoxz4qIqiY6F';
const AIRTABLE_TABLE_NAME = 'Exercices';
const AIRTABLE_TOKEN = 'pat1UfGk7GFtte5eK.5813713a385f0da49ddb462c197767bb25f980cda9e8e1e804d6f562caed7637';

function ModularGenerator() {
  const [form, setForm] = useState({
    sport: '',
    objectif: [],
    niveau: '',
    douleur: [],
    frequence: '',
    lieu: [],
    materiel: []
  });

  const [exercices, setExercices] = useState(null);

  const toggleSelection = (name, value, isMulti = false) => {
    setForm(prev => {
      if (isMulti) {
        const arr = prev[name];
        const newArr = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
        return { ...prev, [name]: newArr };
      } else {
        return { ...prev, [name]: prev[name] === value ? '' : value };
      }
    });
  };

  const normalize = (str) =>
    str?.toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim() || '';

  const parseTags = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(v => normalize(v));
    return String(val).split(',').map(tag => normalize(tag.trim()));
  };

  const genererProgramme = async () => {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=200`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`
        }
      });

      const allRecords = response.data.records.map(r => r.fields);

      const filtres = {
        tags: form.objectif.map(normalize),
        lieu: form.lieu.map(normalize),
        materiel: form.materiel.map(normalize),
        douleur: form.douleur.map(normalize),
        sport: normalize(form.sport),
        niveau: normalize(form.niveau),
        frequence: normalize(form.frequence)
      };

      const results = allRecords.filter(e => {
        const typeTags = parseTags(e.Type);
        const lieux = parseTags(e.Lieu);
        const materiels = parseTags(e.Matériel);
        const douleurs = parseTags(e['Douleur ciblée']);
        const sports = parseTags(e.Sport);
        const niveau = normalize(e.Niveau);
        const frequence = normalize(e['Fréquence']);

        let score = 0;

        if (filtres.tags.length === 0 || filtres.tags.some(tag => typeTags.includes(tag))) score++;
        if (filtres.lieu.length === 0 || filtres.lieu.some(l => lieux.includes(l))) score++;
        if (filtres.materiel.length === 0 || filtres.materiel.some(m => materiels.includes(m))) score++;
        if (filtres.douleur.length === 0 || filtres.douleur.some(d => douleurs.includes(d))) score++;
        if (!filtres.sport || sports.includes(filtres.sport)) score++;
        if (!filtres.niveau || niveau === filtres.niveau) score++;
        if (!filtres.frequence || frequence === filtres.frequence) score++;

        return score > 0;
      });

      results.forEach(e => {
        if (!Array.isArray(e.Sport)) {
          if (typeof e.Sport === 'string') {
            e.Sport = e.Sport.split(',').map(s => s.trim());
          } else {
            e.Sport = [];
          }
        }
      });

      setExercices(results);
    } catch (error) {
      console.error('Erreur lors de la récupération Airtable :', error);
    }
  };

  const fields = [
    { name: 'sport', label: 'Sport', options: ['Football', 'Basketball', 'Golf', 'Moto cross', 'Sport automobile', 'Course à pied', 'Padel/Tenis', 'Aucun'] },
    { name: 'objectif', label: 'Objectif', options: ['Mobilité', 'Activation', 'Renforcement', 'Gainage', 'Proprioception', 'Étirement', 'Récupération', 'Technique', 'Endurance', 'Explosivité', 'Vitesse', 'Agilité', 'Pliométrie', 'Échauffement'], multi: true },
    { name: 'niveau', label: 'Niveau', options: ['Débutant', 'Intermédiaire', 'Avancé'] },
    { name: 'frequence', label: 'Fréquence', options: ['1x/semaine', '2-3x/semaine', '3-5x/semaine', 'Quotidien'] }
  ];

  const multiFields = [
    { name: 'douleur', label: 'Douleur ciblée', options: ['Aucune', 'Cheville', 'Genou', 'Tendon D\'Achille', 'Fascia Plantaire', 'Hanches', 'Quadriceps', 'Ischio-Jambiers', 'Fessiers', 'Adducteurs', 'Psoas', 'Épaules', 'Coiffe Des Rotateurs', 'Tronc', 'Mollets', 'Lombaires', 'Abdominaux', 'Dos', 'Pectoraux', 'Tibias', 'Obliques', 'Triceps', 'Biceps', 'Poignets', 'Avant-Bras'] },
    { name: 'lieu', label: 'Lieu', options: ['Terrain', 'Domicile', 'Intérieur', 'Extérieur', 'Bureau', 'Partout', 'Salle de sport'] },
    { name: 'materiel', label: 'Matériel', options: ['Aucun', 'Tapis de sol', 'Step', 'Box pliométrique', 'Plots + Échelle', 'Ballon', 'Machines de renforcement', 'Medecine Ball', 'Bâton', 'Rouleau de massage', 'Élastiques', 'Sangle d’étirement', 'Banc de musculation', 'Swiss Ball', 'Haltères', 'BOSU', 'Balance Board', 'Bain froid', 'Appareil d’électrostimulation'] }
  ];

  const renderButtonGroup = (name, label, options, multi = false) => (
    <div key={name} style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>{label} :</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {options.map(opt => {
          const isSelected = multi ? form[name].includes(opt) : form[name] === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleSelection(name, opt, multi)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: '1px solid #ccc',
                backgroundColor: isSelected ? '#007bff' : '#f0f0f0',
                color: isSelected ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>🎯 Générateur de programme connecté à Airtable</h2>

      {fields.map(field => renderButtonGroup(field.name, field.label, field.options, field.multi || false))}
      {multiFields.map(field => renderButtonGroup(field.name, field.label, field.options, true))}

      <button onClick={genererProgramme} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Générer
      </button>

      {exercices !== null && exercices.length === 0 && (
        <p style={{ marginTop: '1rem', color: 'red' }}>⚠️ Aucun exercice trouvé. Relâche les filtres ou vérifie la base.</p>
      )}

      <div style={{ marginTop: '2rem' }}>
        {exercices && exercices.length > 0 && (
          <div>
            <h3>📋 Résultats :</h3>
            {exercices.map((e, index) => (
              <div key={index} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>{e['Nom de l’exercice']}</h4>
                {e.Variant && <p><strong>Variante :</strong> {e.Variant}</p>}
                <p><strong>Types :</strong> {Array.isArray(e.Type) ? e.Type.join(', ') : e.Type || '—'}</p>
                <p><strong>Niveau :</strong> {Array.isArray(e.Niveau) ? e.Niveau.join(', ') : e.Niveau || '—'}</p>
                <p><strong>Fréquence :</strong> {e['Fréquence'] || '—'}</p>
                <p><strong>Douleur ciblée :</strong> {Array.isArray(e['Douleur ciblée']) ? e['Douleur ciblée'].join(', ') : e['Douleur ciblée'] || '—'}</p>
                <p><strong>Lieux :</strong> {Array.isArray(e.Lieu) ? e.Lieu.join(', ') : e.Lieu || '—'}</p>
                <p><strong>Matériel :</strong> {Array.isArray(e.Matériel) ? e.Matériel.join(', ') : e.Matériel || '—'}</p>
                <p><strong>Sports :</strong> {Array.isArray(e.Sport) ? e.Sport.join(', ') : (typeof e.Sport === 'string' ? e.Sport : '—')}</p>
                <p><strong>Description :</strong> {e.Description || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModularGenerator;
