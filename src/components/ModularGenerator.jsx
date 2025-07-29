import React, { useState, useRef } from "react";

// Spinner Apple-style
const Spinner = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: 52,
    paddingTop: 18, paddingBottom: 18,
  }}>
    <div style={{
      width: 34, height: 34, border: '4px solid #e0e7ef', borderTop: '4px solid #1674ea',
      borderRadius: '50%', animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}</style>
  </div>
);

const AIRTABLE_BASE_ID = 'appCatoxz4qIqiY6F';
const AIRTABLE_TABLE_NAME = 'Exercices';
const AIRTABLE_TOKEN = 'pat1UfGk7GFtte5eK.5813713a385f0da49ddb462c197767bb25f980cda9e8e1e804d6f562caed7637';

const DIFFICULTY_ORDER = { 'débutant': 1, 'intermédiaire': 2, 'avancé': 3 };

// Matching tolérant & nom d’exo exhaustif
const normalize = (str) =>
  str == null
    ? ''
    : String(str)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim();

const parseTags = (val) => !val
  ? []
  : Array.isArray(val)
    ? val.filter(Boolean).map(normalize)
    : typeof val === 'string'
      ? val.split(/[,;/|]/).map((tag) => normalize(tag.trim())).filter(Boolean)
      : [normalize(val)].filter(Boolean);

const parseSportField = (sportValue) => parseTags(sportValue);

const getExerciseTitle = (exercise) => {
  // Champs standards
  const candidates = [
    "Nom de l'exercice", "Nom", "name", "titre", "Titre", "Exercise", "Exercice", "Name", "title"
  ];
  for (const field of candidates) {
    const value = exercise[field];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (Array.isArray(value) && value[0] && typeof value[0] === 'string' && value[0].trim()) return value[0].trim();
  }
  // Recherche clé partielle ou inattendue
  for (const k of Object.keys(exercise)) {
    if (typeof exercise[k] === 'string' && k.toLowerCase().includes('nom') && exercise[k].trim()) {
      return exercise[k].trim();
    }
    if (typeof exercise[k] === 'string' && k.toLowerCase().includes('exerc') && exercise[k].trim()) {
      return exercise[k].trim();
    }
    if (Array.isArray(exercise[k]) && exercise[k][0] && typeof exercise[k][0] === 'string' && exercise[k][0].trim() && (k.toLowerCase().includes('nom') || k.toLowerCase().includes('exerc'))) {
      return exercise[k][0].trim();
    }
  }
  // Recherche dans les valeurs textuelles (fallback total)
  for (const v of Object.values(exercise)) {
    if (typeof v === 'string' && v.trim().length > 4) return v.trim();
    if (Array.isArray(v) && typeof v[0] === 'string' && v[0].trim().length > 4) return v[0].trim();
  }
  return 'Exercice sans nom';
};

const calculateRelevanceScore = (exercise, filters) => {
  let score = 0, maxScore = 0;
  maxScore += 4;
  if (filters.objectif.length > 0) {
    const exerciseTypes = parseTags(exercise.Type);
    const matches = filters.objectif.filter(obj =>
      exerciseTypes.some(type => type.includes(obj) || obj.includes(type))
    );
    score += (matches.length / filters.objectif.length) * 4;
  } else score += 4;
  maxScore += 3;
  if (filters.sport && filters.sport !== 'aucun') {
    const exerciseSports = parseSportField(exercise.Sport);
    const sportMatch = exerciseSports.some(sport =>
      sport.includes(filters.sport) || filters.sport.includes(sport)
    );
    if (sportMatch) score += 3;
  } else score += 3;
  maxScore += 2;
  if (filters.niveau) {
    const exerciseLevel = normalize(exercise.Niveau);
    if (exerciseLevel === filters.niveau || exerciseLevel.includes(filters.niveau)) score += 2;
  } else score += 2;
  const otherCriteria = [
    { filter: filters.lieu, field: exercise.Lieu },
    { filter: filters.materiel, field: exercise['Matériel'] },
    { filter: filters.douleur, field: exercise['Douleur ciblée'] },
    { filter: filters.frequence, field: exercise['Fréquence'] }
  ];
  otherCriteria.forEach(({ filter, field }) => {
    maxScore += 0.25;
    if (Array.isArray(filter) && filter.length > 0 && !filter.includes('aucune')) {
      const fieldTags = parseTags(field);
      const hasMatch = filter.some(f =>
        fieldTags.some(tag => tag.includes(f) || f.includes(tag))
      );
      if (hasMatch) score += 0.25;
    } else if (typeof filter === 'string' && filter && filter !== 'aucun') {
      const fieldValue = normalize(field);
      if (fieldValue.includes(filter) || filter.includes(fieldValue)) score += 0.25;
    } else score += 0.25;
  });
  return Math.round((score / maxScore) * 100);
};

const sortExercises = (exercises) =>
  [...exercises].sort((a, b) => {
    const scoreDiff = (b.score || 0) - (a.score || 0);
    if (scoreDiff !== 0) return scoreDiff;
    const aLevel = normalize(a.Niveau || '');
    const bLevel = normalize(b.Niveau || '');
    const aOrder = DIFFICULTY_ORDER[aLevel] || 999;
    const bOrder = DIFFICULTY_ORDER[bLevel] || 999;
    return aOrder - bOrder;
  });

const filterSections = [
  { name: 'sport', label: '🏃 Sport', options: ['Football', 'Basketball', 'Golf', 'Moto cross', 'Sport automobile', 'Course à pied', 'Padel/Tennis', 'Aucun'], multi: false },
  { name: 'objectif', label: '🎯 Objectif', options: ['Mobilité', 'Activation', 'Renforcement', 'Gainage', 'Proprioception', 'Étirement', 'Récupération', 'Technique', 'Endurance', 'Explosivité', 'Vitesse', 'Agilité', 'Plyométrie', 'Échauffement'], multi: true },
  { name: 'niveau', label: '📊 Niveau', options: ['Débutant', 'Intermédiaire', 'Avancé'], multi: false },
  { name: 'frequence', label: '📅 Fréquence', options: ['1x/semaine', '2-3x/semaine', '3-5x/semaine', 'Quotidienne'], multi: false },
  { name: 'douleur', label: '🩹 Douleur ciblée', options: ['Aucune', 'Cheville', 'Genou', "Tendon d'Achille", 'Fascia Plantaire', 'Hanches', 'Quadriceps', 'Ischio-Jambiers', 'Fessiers', 'Adducteurs', 'Psoas', 'Épaules', 'Coiffe des Rotateurs', 'Tronc', 'Mollets', 'Lombaires', 'Abdominaux', 'Dos', 'Pectoraux', 'Tibias', 'Obliques', 'Triceps', 'Biceps', 'Poignets', 'Avant-Bras'], multi: true },
  { name: 'lieu', label: '📍 Lieu', options: ['Terrain', 'Domicile', 'Intérieur', 'Extérieur', 'Bureau', 'Partout', 'Salle de sport'], multi: true },
  { name: 'materiel', label: '🛠️ Matériel', options: ['Aucun', 'Tapis de sol', 'Step', 'Box pliométrique', 'Plots + Échelle', 'Ballon', 'Machines de renforcement', 'Medicine Ball', 'Bâton', 'Rouleau de massage', 'Élastiques', "Sangle d'étirement", 'Banc de musculation', 'Swiss Ball', 'Haltères', 'BOSU', 'Balance Board', 'Bain froid', "Appareil d'électrostimulation"], multi: true }
];

// BUTTONS & BADGES
const FilterButton = ({ option, isSelected, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '10px 20px', margin: '5px 8px 5px 0',
      borderRadius: '2rem', border: '1.7px solid',
      borderColor: isSelected ? '#1674ea' : '#e2e7ef',
      background: isSelected ? 'linear-gradient(90deg, #1674ea 0%, #1d7fff 100%)' : '#f6f8fa',
      color: isSelected ? '#fff' : '#234',
      fontWeight: 500, fontSize: '16px',
      transition: 'all .22s cubic-bezier(.5,0,.2,1)',
      boxShadow: isSelected ? '0 2px 16px #1674ea22' : '0 0px 0px #0000',
      outline: isSelected ? 'none' : undefined,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.7 : 1,
      filter: isSelected ? 'brightness(1.09)' : 'none',
      letterSpacing: '.02em'
    }}
  >
    {option}
  </button>
);

const badgeStyle = (score) => {
  if (score >= 80) return { background: '#eafff3', color: '#119b4c', border: '1.5px solid #c5f5de' };
  if (score >= 60) return { background: '#fff7e0', color: '#ba910b', border: '1.5px solid #ffe7a1' };
  return { background: '#ffeaea', color: '#d2372d', border: '1.5px solid #ffc0c0' };
};

const ExerciseCard = ({ exercise }) => (
  <div style={{
    border: '1.3px solid #e8eaf5',
    borderRadius: '24px',
    background: '#fff',
    margin: '14px 0',
    padding: '24px 25px 18px 25px',
    boxShadow: '0 6px 28px #e2eaff45',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'box-shadow .23s cubic-bezier(.3,0,.2,1), transform .18s cubic-bezier(.4,0,.2,1)',
    cursor: 'pointer',
    willChange: 'box-shadow, transform',
    position: 'relative'
  }}
    tabIndex={0}
    onMouseOver={e => { e.currentTarget.style.boxShadow = '0 12px 38px #1674ea22'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.015)'; }}
    onMouseOut={e => { e.currentTarget.style.boxShadow = '0 6px 28px #e2eaff45'; e.currentTarget.style.transform = 'none'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
      <h4 style={{ margin: 0, fontWeight: 800, fontSize: 21, flex: 1, color: '#15326c', lineHeight: 1.16 }}>
        {getExerciseTitle(exercise)}
      </h4>
      {typeof exercise.score === 'number' && (
        <span style={{
          ...badgeStyle(exercise.score),
          fontWeight: 800,
          fontSize: 15,
          borderRadius: 14,
          padding: '6px 19px',
          minWidth: 54,
          textAlign: 'center',
          letterSpacing: '.02em',
          marginLeft: 10,
        }}>
          {exercise.score}%
        </span>
      )}
    </div>
    {exercise.Variant && (
      <div style={{ fontStyle: 'italic', color: '#8694a8', fontSize: 15, marginBottom: 2 }}>{exercise.Variant}</div>
    )}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px 9px', margin: '7px 0 2px 0' }}>
      {[...(Array.isArray(exercise.Type) ? exercise.Type : [exercise.Type])]
        .filter(Boolean)
        .map((type, i) => (
          <span key={i} style={{
            background: '#e8f0ff', color: '#2356b5',
            borderRadius: 11, fontSize: 14, padding: '3px 12px', fontWeight: 600
          }}>{type}</span>
        ))}
      {exercise.Niveau && (
        <span style={{
          background: '#ede9ff', color: '#6c40ad',
          borderRadius: 11, fontSize: 14, padding: '3px 12px', fontWeight: 600
        }}>{exercise.Niveau}</span>
      )}
      {(Array.isArray(exercise.Sport) ? exercise.Sport : [])
        .filter(Boolean)
        .map((sport, i) => (
          <span key={i} style={{
            background: '#fff4e1', color: '#b97126',
            borderRadius: 11, fontSize: 14, padding: '3px 12px', fontWeight: 600
          }}>{sport}</span>
        ))}
    </div>
    {exercise.Description && (
      <div style={{
        color: '#546187', fontSize: 15.5, margin: '6px 0 0 0',
        lineHeight: 1.5, maxHeight: 90, overflow: 'hidden', textOverflow: 'ellipsis'
      }}>{exercise.Description}</div>
    )}
    {exercise.Lien && (
      <a
        href={exercise.Lien}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block', marginTop: 11,
          background: 'linear-gradient(90deg,#1674ea 0%,#0046ad 100%)',
          color: '#fff', borderRadius: 13, padding: '9px 24px',
          textDecoration: 'none', fontWeight: 700,
          boxShadow: '0 2px 10px #1674ea23', fontSize: 15,
          transition: 'filter .17s cubic-bezier(.3,0,.2,1)',
        }}
        onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.13)'}
        onMouseOut={e => e.currentTarget.style.filter = ''}
      >
        Voir la vidéo
      </a>
    )}
  </div>
);

// PRINCIPAL COMPONENT
function ModularGenerator() {
  const [form, setForm] = useState(filterSections.reduce((a, s) => ({ ...a, [s.name]: s.multi ? [] : '' }), {}));
  const [exercises, setExercises] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [limit, setLimit] = useState(20);
  const resultsRef = useRef(null);

  const toggleSelection = (name, value, isMulti = false) => {
    setForm(prev => ({
      ...prev,
      [name]: isMulti
        ? prev[name].includes(value)
          ? prev[name].filter(v => v !== value)
          : [...prev[name], value]
        : prev[name] === value ? '' : value
    }));
  };

  const generateProgram = async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setLimit(20);
    try {
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=300`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      const data = await response.json();
      const allRecords = data.records.map(r => r.fields);
      const filters = {
        objectif: (form.objectif || []).map(normalize),
        lieu: (form.lieu || []).map(normalize),
        materiel: (form.materiel || []).map(normalize),
        douleur: (form.douleur || []).map(normalize),
        sport: normalize(form.sport),
        niveau: normalize(form.niveau),
        frequence: normalize(form.frequence)
      };
      const scoredExercises = allRecords
        .map(exercise => ({ ...exercise, score: calculateRelevanceScore(exercise, filters) }))
        .filter(exercise => exercise.score >= 20);
      scoredExercises.forEach(exercise => { exercise.Sport = parseSportField(exercise.Sport) });
      setExercises(sortExercises(scoredExercises));
      setTimeout(() => { resultsRef.current?.scrollIntoView({ behavior: 'smooth' }) }, 300);
    } catch (err) {
      setError('Impossible de récupérer les exercices. Vérifiez votre connexion.');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setForm(filterSections.reduce((a, s) => ({ ...a, [s.name]: s.multi ? [] : '' }), {}));
    setExercises(null);
    setError(null);
    setSearched(false);
    setLimit(20);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(130deg,#e8f0fe 0%,#fafdff 60%,#fff 100%)', padding: 0, fontFamily: 'Inter,Segoe UI,Arial,sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 8px 58px 8px' }}>
        <div style={{ textAlign: 'center', marginBottom: 38, marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <img
              src="/logo-kinexperience.png"
              alt="Logo KineXperience"
              style={{ width: 92, height: 92, objectFit: 'contain', borderRadius: 20, boxShadow: '0 7px 24px #1674ea18' }}
              draggable={false}
            />
          </div>
          <h1 style={{
            fontWeight: 900, fontSize: 35, margin: 0, color: '#174080', letterSpacing: '.01em', textShadow: '0 1.5px 0 #fff'
          }}>
            🏋️ Générateur de Programme KineXpérience
          </h1>
          <div style={{ color: '#466091', fontSize: 18.5, marginTop: 10, fontWeight: 500 }}>
            Génère ton programme d'exercices sur-mesure.
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 33,
          boxShadow: '0 8px 44px #1674ea13',
          padding: '37px 24px 32px 24px',
          marginBottom: 46,
          transition: 'box-shadow .18s cubic-bezier(.3,0,.2,1)',
        }}>
          {filterSections.map(section => (
            <div key={section.name} style={{ marginBottom: 19 }}>
              <div style={{
                fontWeight: 800,
                color: '#144178',
                fontSize: 17,
                marginBottom: 8,
                letterSpacing: '.01em'
              }}>
                {section.label}
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0
              }}>
                {section.options.map(option => (
                  <FilterButton
                    key={option}
                    option={option}
                    isSelected={section.multi
                      ? form[section.name]?.includes(option)
                      : form[section.name] === option}
                    onClick={() => toggleSelection(section.name, option, section.multi)}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 28, borderTop: '1px solid #eee', paddingTop: 26 }}>
            <button
              onClick={clearFilters}
              disabled={loading}
              style={{
                padding: '13px 32px',
                background: '#ececec',
                color: '#304060',
                fontWeight: 700,
                border: 'none',
                borderRadius: 17,
                fontSize: 17,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.19s cubic-bezier(.4,0,.2,1)',
                boxShadow: '0 1.5px 8px #00000007'
              }}>
              Effacer les filtres
            </button>
            <button
              onClick={generateProgram}
              disabled={loading}
              style={{
                padding: '13px 36px',
                background: 'linear-gradient(90deg,#1674ea 0%,#0046ad 100%)',
                color: '#fff',
                fontWeight: 800,
                border: 'none',
                borderRadius: 17,
                fontSize: 17.2,
                boxShadow: '0 2.5px 18px #1674ea33',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '.03em',
                transition: 'all 0.17s cubic-bezier(.4,0,.2,1)'
              }}>
              {loading ? <Spinner /> : "Générer le programme"}
            </button>
          </div>
        </div>

        <div ref={resultsRef}></div>
        {error && (
          <div style={{ background: '#ffe9e9', border: '1.5px solid #ffc0c0', color: '#b43232', borderRadius: 18, padding: 22, margin: '24px 0', textAlign: 'center', fontWeight: 700, fontSize: 18 }}>
            ⚠️ {error}
          </div>
        )}
        {exercises !== null && exercises.length === 0 && !error && searched && (
          <div style={{ background: '#fffbe6', border: '1.5px solid #ffe7a1', color: '#b49b1b', borderRadius: 18, padding: 22, margin: '24px 0', textAlign: 'center', fontWeight: 700, fontSize: 18 }}>
            Aucun exercice trouvé.<br />
            Modifie tes filtres pour obtenir plus de résultats.
          </div>
        )}
        {exercises && exercises.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <span style={{
                background: '#dcfbe4',
                color: '#157349',
                fontWeight: 700,
                fontSize: 19,
                borderRadius: 19,
                padding: '11px 29px',
                display: 'inline-block',
                letterSpacing: '.01em'
              }}>
                {exercises.slice(0, limit).length} exercice{exercises.slice(0, limit).length > 1 ? 's' : ''} trouvé{exercises.slice(0, limit).length > 1 ? 's' : ''}
              </span>
            </div>
            <div>
              {exercises.slice(0, limit).map((exercise, index) => (
                <ExerciseCard key={index} exercise={exercise} />
              ))}
            </div>
            {limit < exercises.length && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
                <button
                  onClick={() => setLimit(limit + 20)}
                  style={{
                    padding: '15px 40px',
                    background: 'linear-gradient(90deg,#1674ea 0%,#0046ad 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    border: 'none',
                    borderRadius: 17,
                    fontSize: 18,
                    boxShadow: '0 2.5px 15px #1674ea22',
                    cursor: 'pointer',
                    margin: 'auto',
                    transition: 'filter .14s cubic-bezier(.3,0,.2,1)'
                  }}
                  onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.11)'}
                  onMouseOut={e => e.currentTarget.style.filter = ''}
                >
                  Voir plus
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModularGenerator;
