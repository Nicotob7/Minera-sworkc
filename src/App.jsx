import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const iconColors = 'primary:#07117a,secondary:#14c8df';

const platformFeatures = [
  {
    title: 'Control de pagos',
    icon: 'https://cdn.lordicon.com/abwrkdvl.json',
    summary: 'Detecta atrasos antes de que afecten la continuidad operacional.',
    detail: 'Centraliza estados de pago, alertas por vencimiento y trazabilidad para que el equipo tome decisiones sin esperar reportes manuales.'
  },
  {
    title: 'Trazabilidad en terreno',
    icon: 'https://cdn.lordicon.com/ubpgwkmy.json',
    summary: 'Cada gestión queda registrada con respaldo claro y consultable.',
    detail: 'Registra acciones, responsables, fechas y evidencias para respaldar decisiones críticas en faena, operación o administración.'
  },
  {
    title: 'Alertas inteligentes',
    icon: 'https://cdn.lordicon.com/vspbqszr.json',
    summary: 'Notifica riesgos, pendientes y puntos críticos a tiempo.',
    detail: 'El sistema prioriza eventos relevantes para evitar ruido, reducir omisiones y anticipar problemas antes de que escalen.'
  },
  {
    title: 'Dashboard ejecutivo',
    icon: 'https://cdn.lordicon.com/iltqorsz.json',
    summary: 'Visualiza indicadores clave en una interfaz simple y rápida.',
    detail: 'Muestra continuidad, avance, riesgo, cumplimiento y estado de operación con una lectura clara para dirección y equipos técnicos.'
  },
  {
    title: 'Automatización',
    icon: 'https://cdn.lordicon.com/lecprnjb.json',
    summary: 'Reduce tareas repetitivas y acelera la respuesta operacional.',
    detail: 'Transforma procesos manuales en flujos digitales con reglas, estados, asignaciones y seguimiento desde una plataforma unificada.'
  },
  {
    title: 'Seguridad operativa',
    icon: 'https://cdn.lordicon.com/yyecauzv.json',
    summary: 'Protege la información crítica y ordena permisos por rol.',
    detail: 'Permite trabajar con accesos controlados, roles claros y respaldo de información para operaciones que necesitan confianza y continuidad.'
  },
  {
    title: 'Reportabilidad',
    icon: 'https://cdn.lordicon.com/lyrrgrsl.json',
    summary: 'Convierte datos operacionales en reportes accionables.',
    detail: 'Genera una visión ordenada para seguimiento, revisión gerencial y mejora continua sin depender de planillas dispersas.'
  }
];

const actionCards = [
  { label: 'Riesgo de detención', value: '72%', width: '72%' },
  { label: 'Procesos trazables', value: '100%', width: '100%' },
  { label: 'Respuesta operacional', value: '24/7', width: '88%' }
];

const socialCards = [
  { name: 'WhatsApp', value: '+56 9 0000 0000', note: 'Atención comercial' },
  { name: 'Correo', value: 'contacto@swc.cl', note: 'Proyectos y soporte' },
  { name: 'LinkedIn', value: 'SWC Technologies', note: 'Novedades y empresa' }
];

function AnimatedIcon({ src, size = 54 }) {
  return (
    <lord-icon
      src={src}
      trigger="loop"
      delay="1200"
      colors={iconColors}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}

function Header() {
  return (
    <header className="site-header">
      <a href="#hero" className="brand-mark" aria-label="SWC Technologies">
        <span className="brand-main">SWC</span>
        <span className="brand-sub">SYSTEMWORKCONT<br />Technologies</span>
      </a>
      <nav className="desktop-nav" aria-label="Principal">
        <a href="#quienes">Quiénes somos</a>
        <a href="#plataforma">Plataforma</a>
        <a href="#accion">En acción</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <a className="header-cta" href="#contacto">Agenda una demo</a>
      <button className="menu-pill" aria-label="Abrir menú"><span></span><span></span><span></span></button>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-grid container-fluid px-0">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
        >
          <span className="section-kicker light">Continuidad operacional</span>
          <h1>Anticipa riesgos críticos antes de que detengan tu operación.</h1>
          <p>SWC une datos, trazabilidad y automatización para que los equipos visualicen lo importante, actúen rápido y mantengan la continuidad del negocio.</p>
          <div className="hero-actions">
            <a className="btn btn-swc" href="#contacto">Habla con un especialista</a>
            <a className="btn btn-ghost" href="#plataforma">Conoce la plataforma</a>
          </div>
        </motion.div>
        <motion.div
          className="hero-console"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="console-top">
            <span></span><span></span><span></span>
          </div>
          <div className="console-alert">
            <div>
              <small>Monitoreo en vivo</small>
              <strong>Operación Mina Norte</strong>
            </div>
            <b>Activo</b>
          </div>
          {actionCards.map((item) => (
            <div className="metric-card" key={item.label}>
              <div className="metric-head"><span>{item.label}</span><strong>{item.value}</strong></div>
              <div className="progress"><i style={{ width: item.width }} /></div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="quienes" className="about-section section-pad">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="section-kicker">Quiénes somos</span>
            <h2>Diseñamos tecnología para operaciones que no pueden detenerse.</h2>
            <p className="lead-clean">SWC SystemWorkCont Technologies crea soluciones digitales simples, robustas y trazables para equipos que necesitan control, continuidad y decisiones respaldadas por datos reales.</p>
          </div>
          <div className="col-lg-5">
            <motion.div className="about-motion-card" whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 240 }}>
              <div className="pulse-orbit"><span></span><span></span><span></span></div>
              <h3>Una plataforma clara para equipos exigentes.</h3>
              <a href="/quienes-somos" className="btn btn-dark-swc">Conocer más</a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformCarousel() {
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState(null);

  const visible = useMemo(() => {
    return [...platformFeatures, ...platformFeatures].slice(active, active + 5);
  }, [active]);

  const next = () => setActive((prev) => (prev + 1) % platformFeatures.length);
  const prev = () => setActive((prev) => (prev - 1 + platformFeatures.length) % platformFeatures.length);

  return (
    <section id="plataforma" className="platform-section section-pad">
      <div className="container-fluid px-lg-5">
        <div className="section-heading centered light-heading">
          <span className="section-kicker light">Plataforma</span>
          <h2>Características que se mueven al ritmo de tu operación.</h2>
          <p>Un carrusel de módulos pensados para control, seguimiento y respuesta rápida.</p>
        </div>

        <div className="carousel-controls">
          <button onClick={prev} aria-label="Anterior">‹</button>
          <button onClick={next} aria-label="Siguiente">›</button>
        </div>

        <div className="feature-track desktop-track">
          <AnimatePresence mode="popLayout">
            {visible.map((item, index) => (
              <motion.article
                layout
                key={`${item.title}-${active}-${index}`}
                className="feature-card"
                initial={{ opacity: 0, x: 35 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -35 }}
                transition={{ duration: 0.35 }}
              >
                <div className="feature-icon"><AnimatedIcon src={item.icon} /></div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <button className="link-more" onClick={() => setModal(item)}>Ver más</button>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <div className="mobile-snap" aria-label="Características de plataforma">
          {platformFeatures.map((item) => (
            <article className="feature-card" key={item.title}>
              <div className="feature-icon"><AnimatedIcon src={item.icon} /></div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <button className="link-more" onClick={() => setModal(item)}>Ver más</button>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="modal-backdrop-swc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}>
            <motion.div className="modal-card-swc" initial={{ y: 34, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
              <AnimatedIcon src={modal.icon} size={68} />
              <h3>{modal.title}</h3>
              <p>{modal.detail}</p>
              <button className="btn btn-swc" onClick={() => setModal(null)}>Entendido</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ActionPlatform() {
  return (
    <section id="accion" className="action-section section-pad">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <span className="section-kicker">Plataforma en acción</span>
            <h2>Información crítica en una vista diseñada para decidir.</h2>
            <p className="lead-clean">En escritorio se mantiene como panel amplio. En móvil se adapta a una vista compacta con tarjetas animadas para revisar riesgos, avances y alertas sin perder lectura.</p>
          </div>
          <div className="col-lg-7">
            <motion.div className="live-panel" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="live-header"><span>SWC Live Control</span><b>Online</b></div>
              <div className="live-grid">
                <div className="live-main">
                  <small>Riesgo operacional</small>
                  <strong>72%</strong>
                  <div className="wave-bars"><i></i><i></i><i></i><i></i><i></i></div>
                </div>
                <div className="live-side">
                  <span>Pagos pendientes</span><b>8</b>
                </div>
                <div className="live-side cyan">
                  <span>Procesos seguros</span><b>96%</b>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DidYouKnow() {
  return (
    <section className="did-section">
      <div className="container">
        <div className="did-card">
          <div>
            <span className="section-kicker light">Sabías que</span>
            <h2>Un atraso no detectado puede escalar a una detención completa.</h2>
          </div>
          <div className="growing-chart" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contacto" className="contact-section section-pad">
      <div className="container">
        <div className="contact-shell">
          <div className="social-panel">
            <span className="section-kicker">Contacto</span>
            <h2>Conversemos sobre tu operación.</h2>
            <p>Agenda una revisión y evaluamos cómo SWC puede ordenar riesgos, pagos, trazabilidad y continuidad en una sola plataforma.</p>
            <div className="social-list">
              {socialCards.map((item) => (
                <article key={item.name}>
                  <strong>{item.name}</strong>
                  <span>{item.value}</span>
                  <small>{item.note}</small>
                </article>
              ))}
            </div>
          </div>
          <form className="floating-form">
            <div className="mobile-hint">Desliza para ver redes →</div>
            <h3>Solicita una demo</h3>
            <label>Nombre<input type="text" placeholder="Tu nombre" /></label>
            <label>Empresa<input type="text" placeholder="Nombre de la empresa" /></label>
            <label>Correo<input type="email" placeholder="correo@empresa.cl" /></label>
            <label>Mensaje<textarea rows="4" placeholder="Cuéntanos qué necesitas controlar" /></label>
            <button className="btn btn-swc w-100" type="button">Enviar solicitud</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="brand-main">SWC</span>
        <span className="brand-sub">SYSTEMWORKCONT Technologies</span>
      </div>
      <div className="footer-links">
        <a href="#quienes">Quiénes somos</a>
        <a href="#plataforma">Plataforma</a>
        <a href="#contacto">Contacto</a>
      </div>
      <p>contacto@swc.cl · +56 9 0000 0000</p>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <PlatformCarousel />
        <ActionPlatform />
        <DidYouKnow />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
