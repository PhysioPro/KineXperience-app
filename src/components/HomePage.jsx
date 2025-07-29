import React from "react";

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#e8f0fe 0%,#fff 100%)',
      padding: 0,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif'
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '28px 18px 10px 18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo-kinexperience.png" alt="KineXpérience logo" style={{ width: 52, height: 52, marginRight: 14, borderRadius: 16, boxShadow: '0 2px 14px #1674ea18' }}/>
          <span style={{ fontWeight: 700, color: '#144178', fontSize: 28, letterSpacing: '.01em' }}>
            KineXpérience
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <a href="#pourqui" style={{ color: '#2451c9', fontWeight: 500, textDecoration: 'none', fontSize: 17 }}>Pour qui ?</a>
          <a href="#features" style={{ color: '#2451c9', fontWeight: 500, textDecoration: 'none', fontSize: 17 }}>Fonctionnalités</a>
          <a href="#tarifs" style={{ color: '#2451c9', fontWeight: 500, textDecoration: 'none', fontSize: 17 }}>Tarifs</a>
          <a href="#login" style={{ color: '#2451c9', fontWeight: 500, textDecoration: 'none', fontSize: 17 }}>Connexion</a>
          <a href="/generator" style={{
            marginLeft: 8, padding: '10px 26px', borderRadius: 14,
            background: 'linear-gradient(90deg,#1674ea 0%,#0046ad 100%)',
            color: '#fff', fontWeight: 700, fontSize: 17,
            boxShadow: '0 2px 10px #1674ea22',
            letterSpacing: '.01em',
            textDecoration: 'none'
          }}>
            Commencer
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginTop: 40, marginBottom: 48 }}>
        <img src="/logo-kinexperience.png" alt="Logo KineXpérience" style={{ width: 110, height: 110, margin: '0 auto 15px auto', borderRadius: 20, boxShadow: '0 4px 30px #17408024' }} draggable={false}/>
        <h1 style={{
          fontWeight: 800, fontSize: 38, color: '#174080', letterSpacing: '.01em', marginBottom: 12, marginTop: 0
        }}>
          Anticiper, renforcer, performer,<br />chaque détail compte.
        </h1>
        <div style={{ fontSize: 21, color: '#2256a6', marginBottom: 26, fontWeight: 500, maxWidth: 540, margin: '0 auto' }}>
          Génère des programmes d’exercices sur-mesure, validés par des kinés & coachs sportifs d’élite. <br />
          <span style={{ color: '#1451a0', fontWeight: 600 }}>La référence SaaS sport & santé.</span>
        </div>
        <a href="/generator" style={{
          display: 'inline-block',
          margin: '20px auto 0 auto',
          padding: '16px 46px',
          borderRadius: 18,
          background: 'linear-gradient(90deg,#1674ea 0%,#0046ad 100%)',
          color: '#fff',
          fontWeight: 800,
          fontSize: 22,
          boxShadow: '0 4px 20px #1674ea33',
          letterSpacing: '.03em',
          textDecoration: 'none',
          transition: 'all 0.15s cubic-bezier(.4,0,.2,1)'
        }}>
          Créer mon programme
        </a>
      </section>

      {/* Section: Pour Qui */}
      <section id="pourqui" style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 34, marginBottom: 44
      }}>
        {[
          { label: "Sportifs pros", emoji: "🏆" },
          { label: "Clubs & équipes", emoji: "⚽️" },
          { label: "Kinés & coachs", emoji: "🧑‍⚕️" },
          { label: "Particuliers", emoji: "🏠" }
        ].map(({ label, emoji }) => (
          <div key={label} style={{
            minWidth: 170, minHeight: 115, background: '#f5f8ff', borderRadius: 20,
            boxShadow: '0 2px 10px #2451c915', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 20, color: '#134084', margin: 8
          }}>
            <div style={{ fontSize: 34 }}>{emoji}</div>
            {label}
          </div>
        ))}
      </section>

      {/* Section: Features */}
      <section id="features" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 26, maxWidth: 1050, margin: '0 auto 55px auto'
      }}>
        {[
          { icon: "⚡️", title: "Génération instantanée", desc: "Programme sur-mesure, en un clic, selon objectifs & pathologies." },
          { icon: "📚", title: "Base d’exercices validés", desc: "Bibliothèque complète, mise à jour par des experts du sport et santé." },
          { icon: "🏥", title: "Adapté kiné & prévention", desc: "Protocoles pro pour rééducation, prévention et optimisation." },
          { icon: "📊", title: "Suivi & historique", desc: "Visualisez vos progrès, adaptez votre routine selon vos résultats." },
          { icon: "📲", title: "Accessible partout", desc: "Web app responsive. Utilisable sur mobile, tablette, PC." },
          { icon: "🤝", title: "Partage & export", desc: "Envoyez votre programme à un coach ou imprimez-le facilement." }
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{
            background: '#fff',
            borderRadius: 19,
            boxShadow: '0 3px 18px #2451c91c',
            padding: '30px 18px 24px 18px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 33, marginBottom: 13 }}>{icon}</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#174080', marginBottom: 5 }}>{title}</div>
            <div style={{ color: '#425670', fontSize: 15, fontWeight: 500 }}>{desc}</div>
          </div>
        ))}
      </section>

      {/* Section: Confiance */}
      <section style={{
        maxWidth: 700, margin: '0 auto 42px auto', textAlign: 'center'
      }}>
        <div style={{
          color: '#144178', fontWeight: 700, fontSize: 18, marginBottom: 9, letterSpacing: '.02em'
        }}>
          Validé par des clubs, kinés et athlètes d’élite.
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 13 }}>
          {/* Remplace les logos ici si tu as des partenaires */}
          <span style={{
            background: '#fff', padding: '12px 22px', borderRadius: 12, color: '#2256a6', fontWeight: 600, fontSize: 16, border: '1.5px solid #e2e6f0'
          }}>
            👨‍⚕️ Kinés diplômés
          </span>
          <span style={{
            background: '#fff', padding: '12px 22px', borderRadius: 12, color: '#2256a6', fontWeight: 600, fontSize: 16, border: '1.5px solid #e2e6f0'
          }}>
            🏅 Clubs partenaires
          </span>
          <span style={{
            background: '#fff', padding: '12px 22px', borderRadius: 12, color: '#2256a6', fontWeight: 600, fontSize: 16, border: '1.5px solid #e2e6f0'
          }}>
            🤝 Coachs experts
          </span>
        </div>
        <div style={{ fontSize: 16, color: '#374b67', marginBottom: 2, fontWeight: 400, fontStyle: 'italic' }}>
          “Simple, rapide et précis. On l’utilise au quotidien avec nos athlètes !”
        </div>
        <div style={{ fontSize: 15, color: '#8ea5be', fontWeight: 500 }}>
          <span style={{ color: '#1674ea', fontWeight: 700 }}>— Club KinéSport Pro</span>
        </div>
      </section>

      {/* Big Call To Action */}
      <section style={{ textAlign: 'center', margin: '0 auto 34px auto', padding: '36px 0 0 0' }}>
        <div style={{
          background: 'linear-gradient(90deg,#1674ea0c 0%,#0046ad07 100%)',
          borderRadius: 26,
          boxShadow: '0 2px 14px #1674ea11',
          maxWidth: 630,
          margin: '0 auto',
          padding: '30px 12px 36px 12px'
        }}>
          <div style={{ fontWeight: 800, color: '#144178', fontSize: 25, marginBottom: 11 }}>
            Prêt à passer à la vitesse supérieure ?
          </div>
          <div style={{ color: '#2b425c', fontSize: 16, marginBottom: 16 }}>
            Teste gratuitement KineXpérience, sans engagement, et découvre l’avenir du sport santé.
          </div>
          <a href="/generator" style={{
            display: 'inline-block',
            padding: '15px 44px',
            borderRadius: 16,
            background: 'linear-gradient(90deg,#1674ea 0%,#0046ad 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 20,
            boxShadow: '0 2px 10px #1674ea33',
            letterSpacing: '.02em',
            textDecoration: 'none'
          }}>
            Je commence gratuitement
          </a>
        </div>
      </section>

      <footer style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '28px 10px 18px 10px',
        color: '#98adc9',
        display: 'flex',
        alignItems: 'center',
        fontSize: 15,
        justifyContent: 'space-between',
        borderTop: '1px solid #e2e6f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo-kinexperience.png" alt="KineXpérience logo" style={{ width: 30, height: 30, borderRadius: 7, boxShadow: '0 1px 8px #1674ea12' }} />
          <span>KineXpérience © {new Date().getFullYear()}</span>
        </div>
        <div>
          <a href="#" style={{ color: '#6f82a7', textDecoration: 'none', marginRight: 15 }}>Mentions légales</a>
          <a href="#" style={{ color: '#6f82a7', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
