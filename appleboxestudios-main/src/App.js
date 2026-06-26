import { useState, useEffect } from "react";
import "./App.css";
import Facturas from "./components/Facturas";




const HERO_PROJECTS = [
  { title: "Un poema a la decadencia",       year: "2024" },
  { title: "Un payasito en el centro",     year: "2024" },
  { title: "Montañas",    year: "2024" },
  { title: "Angel",      year: "2024" },
];

const HERO_BG = [
  "poema1.png",
  "payasocentro.png",
  "montaña.png",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1600&q=90",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=90",
];

const FRAMES = [
  { msg: "La imagen antes del corte es la verdad.",          img: "poema1.png" },
  { msg: "Producir es creer antes que nadie.",               img: "poema.png" },
  { msg: "El silencio también es narrativa.",                img: "montaña.png" },
  { msg: "Quito como escenario, el mundo como audiencia.",   img: "payasocentro.png" },
  { msg: "No hacemos contenido. Hacemos momentos.",         img: "payasocentro1.png" },
  { msg: "La luz no miente.",                               img: "payasocentro2.png" },
];  

// Clientes con logo de imagen
const CLIENTS = [
  { name: "Banco Pichincha", logo: "logo_OF_hor_rgb_SIN_fondoTRASN.png" },
  { name: "Quifatex",        logo: "logo_OF_hor_rgb_SIN_fondoTRASN.png" },
  { name: "Alpina",          logo: "logo_OF_hor_rgb_SIN_fondoTRASN.png" },
  { name: "CNT",             logo: "logo_OF_hor_rgb_SIN_fondoTRASN.png" },
  { name: "Yanbal",          logo: "logo_OF_hor_rgb_SIN_fondoTRASN.png" },
  { name: "Diners Club",     logo: "logo_OF_hor_rgb_SIN_fondoTRASN.png" },
  { name: "Coca-Cola",       logo: "logo_OF_hor_rgb_SIN_fondoTRASN.png" },
  { name: "Samsung",         logo: "logo_OF_hor_rgb_SIN_fondoTRASN.png" },
  { name: "Nestlé",          logo: "logo_OF_hor_rgb_SIN_fondoTRASN.png" },
  { name: "Claro",           logo: "logo_OF_hor_rgb_SIN_fondoTRASN.png" },
];

const PORTFOLIO = [
  {
    id:1, cat:"Comercial", title:"Un poema a la decadencia", year:"2024",
    director:"Juan Vinueza", dp:"Juan Vinueza", client:"Alpina Ecuador",
    desc:"Una campaña de verano que captura la frescura del producto a través de planos contemplativos en la costa ecuatoriana. El reto: transmitir calor y frescura al mismo tiempo.",
    thumb:"poema1.png",
    yt:"https://www.youtube.com/embed/E-Y_-Ys0LGg?si=3frZuELQg5wKPbsm",
  },
  {
    id:2, cat:"Comercial", title:"CNT — Conexión", year:"2024",
    director:"Juan Vinueza", dp:"Juan Vinueza", client:"Juan Vinueza",
    desc:"Spot institucional que narra la historia de familias ecuatorianas conectadas a través de la fibra óptica. Rodado en 4 provincias en 5 días.",
    thumb:"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80",
    yt:"https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id:3, cat:"Cine", title:"Latitud Cero", year:"2023",
    director:"Marco Andrade", dp:"Camila Vega", client:"AppleBox Original",
    desc:"Cortometraje documental sobre los mercados del centro histórico de Quito. Selección oficial Mujeres de Cine 2023.",
    thumb:"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&q=80",
    yt:"https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id:4, cat:"Cine", title:"El Último Frame", year:"2022",
    director:"Ana Torres", dp:"Sofía Ruiz", client:"AppleBox Original",
    desc:"Drama de 18 minutos sobre un fotógrafo de prensa en los años 90. Premio al mejor guión — FEA 2022.",
    thumb:"https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900&q=80",
    yt:"https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id:5, cat:"Cine", title:"Montañas", year:"2025",
    director:"Alex Salazar y Juan Vinueza", dp:"Alex Salazar",
    client:"AppleBox, Juan Vinueza y Alex Salazar",
    desc:"Un viaje a las cumbres del Ecuador filmado con mirada contemplativa. Montañas explora el silencio y la inmensidad del paisaje andino como metáfora de la identidad colectiva.",
    thumb:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
    yt:"https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id:6, cat:"Cine", title:"Un Payasito en el Centro", year:"2023",
    director:"Juan Vinueza y Daniel Vinueza", dp:"Juan Vinueza",
    client:"Juan Vinueza",
    desc:"Un retrato íntimo y agridulce de un payaso callejero en el corazón del centro histórico de Quito. La cámara sigue su rutina diaria con una ternura que desafía la distancia entre la risa y la melancolía.",
    thumb:"https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=900&q=80",
    yt:"https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id:7, cat:"Cine", title:"Un Poema a la Decadencia", year:"2023",
    director:"Juan Vinueza", dp:"Juan Vinueza",
    client:"Juan Vinueza",
    desc:"Un ejercicio de estilo que confronta la belleza en la ruina. Con un guión propio y una mirada poética, Juan Vinueza construye una oda visual a todo lo que se deshace con dignidad.",
    thumb:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=80",
    yt:"https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

const TEAM = [
  { name:"Marco Andrade", role:"Director / Fundador",      img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80" },
  { name:"Ana Torres",    role:"Directora / Productora",   img:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&q=80" },
  { name:"Luis Mejía",    role:"Director de Fotografía",   img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80" },
];

const PLANS = [
  { name:"Básico",   price:"$800",    tag:"Starter",       highlight:false,
    items:["1 video hasta 60s","Guión creativo","1 día de rodaje","Edición básica","1 revisión"] },
  { name:"Medio",    price:"$2,400",  tag:"Más popular",   highlight:true,
    items:["Hasta 3 piezas","Producción completa","2 días de rodaje","Color grading","Motion graphics","3 revisiones"] },
  { name:"Premium",  price:"A medida",tag:"Full Production",highlight:false,
    items:["Proyecto completo","Pre y post producción","Crew profesional","Entrega multi-formato","Revisiones ilimitadas"] },
];

const SERVICES = [
  { n:"01", t:"Producción Digital / Social",   d:"Contenido ágil y de alto impacto para redes sociales. Reels, shorts y campañas pensadas para el scroll." },
  { n:"02", t:"Diseño Gráfico & Motion",        d:"Identidad visual, animación 2D y piezas de diseño rápidas. Del brief al archivo final." },
  { n:"03", t:"Publicidad / Comercial",          d:"Producciones de alto impacto para marcas. Spots, campañas 360° y contenido institucional." },
  { n:"04", t:"Cine & Contenido Original",       d:"Desarrollo de proyectos narrativos: cortometrajes, documentales y largometrajes con visión autoral." },
];

const BTS_PHOTOS = [
  "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&q=80",
  "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80",
  "https://images.unsplash.com/photo-1520116468816-95b69f847357?w=600&q=80",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
];

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
function Nav({ setPage, keycloak }) {
  const [open, setOpen] = useState(false);
  
  // Conditionally add 'Facturas' to the navigation links if user is authenticated
  const LINKS = ["Inicio", "Somos", "Portafolio", "Servicios", "Contacto"];
  const PAGES = ["home", "somos", "portafolio", "servicios", "contacto"];
  
  if (keycloak && keycloak.authenticated) {
    LINKS.push("Facturas");
    PAGES.push("facturas");
  }

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const handleLogin = () => {
    keycloak.login({ redirectUri: window.location.origin });
  };

  return (
    <>
      <nav className="nav">
        <button className="nav-menu" onClick={() => setOpen(true)}>
          <span /><span /> MENÚ
        </button>

        {/* Logo como imagen — reemplaza src con tu archivo real */}
        <button className="nav-logo" onClick={() => setPage("home")}>
          <img
            src="/logo applebox.png"
            alt="AppleBox Estudios"
            className="nav-logo-img"
            onError={e => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span className="nav-logo-fallback">AppleBoxEstudios</span>
        </button>

        {/* Botones Derecha: SSO Auth + Contacto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {keycloak && keycloak.authenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontFamily: 'var(--display)', letterSpacing: '0.05em' }}>
                👤 {keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username || "Director"}
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  background: '#c0392b',
                  color: 'white',
                  fontSize: '0.8rem',
                  padding: '6px 12px',
                  borderRadius: '3px',
                  fontFamily: 'var(--display)',
                  letterSpacing: '0.05em',
                  fontWeight: 600
                }}
              >
                CERRAR SESIÓN
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              style={{
                background: '#2980b9',
                color: 'white',
                fontSize: '0.8rem',
                padding: '6px 12px',
                borderRadius: '3px',
                fontFamily: 'var(--display)',
                letterSpacing: '0.05em',
                fontWeight: 600
              }}
            >
              INICIAR SESIÓN
            </button>
          )}

          <button
            className="nav-contact"
            onClick={() => setPage("contacto")}
          >
            Contacto
          </button>
        </div>
      </nav>

      {open && (
        <div className="drawer-bg" onClick={() => setOpen(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setOpen(false)}>✕</button>
            {LINKS.map((l, i) => (
              <button key={l} className="drawer-link"
                onClick={() => { setPage(PAGES[i]); setOpen(false); }}>
                <span className="drawer-num">0{i+1}</span>{l}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}


/* ══════════════════════════════════════════
   HERO  ← réplica A24
══════════════════════════════════════════ */
function Hero() {
  const [active, setActive] = useState(0);
  const [show, setShow]     = useState(false);

  useEffect(() => {
    setShow(true);
    const t = setInterval(() => setActive(p => (p + 1) % HERO_PROJECTS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className={`hero${show ? " hero--in" : ""}`}>
      {/* fondos */}
      {HERO_BG.map((src, i) => (
        <div key={i} className={`hero-bg${i === active ? " hero-bg--on" : ""}`}
          style={{ backgroundImage: `url(${src})` }} />
      ))}
      <div className="hero-vignette" />

      {/* lista de títulos estilo A24 */}
      <div className="hero-titles">
        {HERO_PROJECTS.map((p, i) => (
          <button key={i}
            className={
              `hero-item` +
              (i === active ? " hero-item--active" : "") +
              (i < active  ? " hero-item--past"   : "")
            }
            onClick={() => setActive(i)}>
            {p.title}
            <span className="hero-year">{p.year}</span>
          </button>
        ))}
      </div>

      <button className="hero-down"
        onClick={() => document.getElementById("frames")?.scrollIntoView({ behavior:"smooth" })}>↓</button>
    </section>
  );
}

/* ══════════════════════════════════════════
   FRAMES & MESSAGES
══════════════════════════════════════════ */
function Frames() {
  return (
    <section id="frames" className="section frames-section">
      <p className="label">Frames & Messages</p>
      <div className="frames-grid">
        {FRAMES.map((f, i) => (
          <div key={i} className="frame-card">
            <div className="frame-img" style={{ backgroundImage:`url(${f.img})` }} />
            <div className="frame-overlay">
              <span className="frame-num">0{i+1}</span>
              <p className="frame-msg">{f.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CLIENTES (marquee con logos)
══════════════════════════════════════════ */
function Clients() {
  const doubled = [...CLIENTS, ...CLIENTS];
  return (
    <section className="section clients-section">
      <p className="label">Clientes</p>
      <div className="marquee-wrap">
        <div className="marquee-track">
          {doubled.map((c, i) => (
            <div key={i} className="marquee-item">
              <img
                src={c.logo}
                alt={c.name}
                className="marquee-logo"
                onError={e => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "inline";
                }}
              />
              <span className="marquee-logo-fallback">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="footer">
      <p className="footer-logo">AppleBoxEstudios</p>
      <div className="footer-links">
        {["Instagram","Vimeo","YouTube","LinkedIn"].map(l => <a key={l} href="#top">{l}</a>)}
      </div>
      <div className="footer-copy">
        <span>Based in Quito, Ecuador</span>
        <span>© {new Date().getFullYear()} AppleBox Estudios</span>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   SHOWREEL embed
══════════════════════════════════════════ */
function Showreel({ src }) {
  return (
    <div className="video-wrap">
      <iframe src={src} title="video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen />
    </div>
  );
}

/* ══════════════════════════════════════════
   FICHA TÉCNICA
══════════════════════════════════════════ */
function Ficha({ rows }) {
  return (
    <div className="ficha">
      <p className="ficha-head">Ficha Técnica</p>
      {rows.map(([k, v]) => (
        <div key={k} className="ficha-row">
          <span>{k}</span><span>{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   HOME
══════════════════════════════════════════ */
function Home() {
  return <>
    <Hero />
    <Frames />
    <Clients />
    <Footer />
  </>;
}

/* ══════════════════════════════════════════
   SOMOS
══════════════════════════════════════════ */
function Somos() {
  return (
    <main className="pt-nav">
      {/* Manifiesto */}
      <section className="manifesto"
        style={{ backgroundImage:"url(https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1600&q=80)" }}>
        <div className="manifesto-fog" />
        <div className="manifesto-text">
          <p className="label light">Manifiesto</p>
          <h1 className="manifesto-h">No filmamos lo que se ve.<br />Filmamos lo que se siente.</h1>
          <p className="manifesto-body">
            AppleBoxEstudios nació en Quito con una sola convicción: que la imagen bien hecha transforma
            negocios, mueve audiencias y deja huella. Somos una productora que no diferencia entre
            un comercial y un cortometraje — en ambos hay una historia que merece ser contada con
            rigor, belleza y honestidad.
          </p>
        </div>
      </section>

      {/* Equipo */}
      <section className="section">
        <p className="label">Equipo</p>
        <div className="team-grid">
          {TEAM.map((m,i) => (
            <div key={i} className="team-card">
              <div className="team-photo" style={{ backgroundImage:`url(${m.img})` }} />
              <p className="team-name">{m.name}</p>
              <p className="team-role">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experiencia */}
      <section className="section exp-grid">
        <div>
          <p className="label">Experiencia</p>
          <h2 className="exp-title">Reconocimiento institucional</h2>
          <p className="exp-body">
            Más de 6 años produciendo para marcas líderes del Ecuador y la región.
            Selecciones en festivales de cine independiente, premios de producción
            publicitaria y colaboraciones con directores de fotografía internacionales.
          </p>
          <div className="stats">
            {[["80+","Proyectos"],["40+","Clientes"],["6","Años"]].map(([n,l]) => (
              <div key={l} className="stat">
                <span className="stat-n">{n}</span>
                <span className="stat-l">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <Ficha rows={[
          ["Director","Marco Andrade"],["DP","Sofía Ruiz"],
          ["Producción","AppleBox Estudios"],["Año","2024"],["Formato","4K / ARRI"],
        ]}/>
      </section>

      {/* Showreel */}
      <section className="section">
        <p className="label">Showreel Institucional</p>
        <Showreel src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
      </section>

      <Footer />
    </main>
  );
}

/* ══════════════════════════════════════════
   PORTAFOLIO
══════════════════════════════════════════ */
function Portafolio({ setPage, setProject }) {
  const [filter, setFilter] = useState("Todos");
  const CATS = ["Todos","Comercial","Cine"];
  const list = filter === "Todos" ? PORTFOLIO : PORTFOLIO.filter(p => p.cat === filter);

  return (
    <main className="pt-nav">
      <section className="section">
        <div className="port-header">
          <p className="label mb0">Portafolio</p>
          <div className="filters">
            {CATS.map(c => (
              <button key={c} className={`filter-btn${filter===c?" filter-btn--on":""}`}
                onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>
        <div className="port-grid">
          {list.map(p => (
            <div key={p.id} className="port-card"
              onClick={() => { setProject(p); setPage("project"); }}>
              <div className="port-thumb" style={{ backgroundImage:`url(${p.thumb})` }}>
                <div className="port-play-overlay"><span>▶</span></div>
              </div>
              <div className="port-meta">
                <span className="port-cat">{p.cat}</span>
                <h3 className="port-title">{p.title}</h3>
                <span className="port-year">{p.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

/* ══════════════════════════════════════════
   SINGLE PROJECT
══════════════════════════════════════════ */
function Project({ p, setPage }) {
  if (!p) return null;
  return (
    <main>
      {/* Poster */}
      <section className="sp-poster" style={{ backgroundImage:`url(${p.thumb})` }}>
        <div className="sp-poster-fog" />
        <div className="sp-poster-content">
          <button className="sp-back" onClick={() => setPage("portafolio")}>← Portafolio</button>
          <p className="sp-cat">{p.cat}</p>
          <h1 className="sp-title">{p.title}</h1>
          <p className="sp-year">{p.year}</p>
        </div>
      </section>

      {/* Video principal */}
      <section className="section"><Showreel src={p.yt} /></section>

      {/* Info */}
      <section className="section sp-info">
        <div>
          <p className="label">Sobre el proyecto</p>
          <p className="sp-desc">{p.desc}</p>
        </div>
        <Ficha rows={[
          ["Director", p.director],["DP", p.dp],
          ["Cliente", p.client],["Año", p.year],["Categoría", p.cat],
        ]}/>
      </section>

      {/* BTS */}
      <section className="section">
        <p className="label">Behind The Scenes</p>
        <div className="bts-grid">
          {BTS_PHOTOS.map((src,i) => (
            <div key={i} className="bts-photo" style={{ backgroundImage:`url(${src})` }} />
          ))}
        </div>
        <div style={{ marginTop:"32px" }}>
          <Showreel src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ══════════════════════════════════════════
   SERVICIOS
══════════════════════════════════════════ */
function Servicios() {
  return (
    <main className="pt-nav">
      {/* Planes */}
      <section className="section">
        <p className="label">Planes</p>
        <div className="plans-grid">
          {PLANS.map((pl,i) => (
            <div key={i} className={`plan-card${pl.highlight?" plan-card--on":""}`}>
              {pl.highlight && <span className="plan-badge">{pl.tag}</span>}
              <p className="plan-name">{pl.name}</p>
              <p className="plan-price">{pl.price}</p>
              <ul className="plan-list">
                {pl.items.map(it => <li key={it}>{it}</li>)}
              </ul>
              <button className="plan-btn">Consultar</button>
            </div>
          ))}
        </div>
      </section>

      {/* Divider phrase */}
      <section className="services-divider">
        <p className="services-phrase">
          Más allá del paquete, está la visión.<br/>
          <span>Estos son nuestros focos de trabajo.</span>
        </p>
      </section>

      {/* Servicios específicos */}
      <section className="section">
        <p className="label">Servicios Específicos</p>
        <div className="srv-list">
          {SERVICES.map((s,i) => (
            <div key={i} className="srv-row">
              <span className="srv-n">{s.n}</span>
              <h3 className="srv-t">{s.t}</h3>
              <p className="srv-d">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

/* ══════════════════════════════════════════
   CONTACTO
══════════════════════════════════════════ */
function Contacto() {
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ nombre:"", empresa:"", proyecto:"", presupuesto:"" });
  const change = e => setF({ ...f, [e.target.name]: e.target.value });
  const submit = e => { e.preventDefault(); setSent(true); };

  return (
    <main className="pt-nav">
      <section className="contact-grid">
        {/* Izquierda */}
        <div className="contact-left">
          <p className="label">Contacto</p>
          <h2 className="contact-h">Hablemos de tu<br/>próximo proyecto.</h2>
          <div className="contact-info">
            <p>Based in Quito, Ecuador.</p>
            <p><a href="mailto:hola@applebox.ec">hola@applebox.ec</a></p>
            <p>+593 99 000 0000</p>
          </div>
          <div className="contact-socials">
            {["Instagram","Vimeo","LinkedIn","YouTube"].map(s => (
              <a key={s} href="#top" className="social-link">{s}</a>
            ))}
          </div>
        </div>

        {/* Derecha — formulario */}
        <div className="contact-right">
          {sent ? (
            <div className="sent">
              <span className="sent-icon">✓</span>
              <h3>Mensaje recibido.</h3>
              <p>Nos ponemos en contacto en menos de 24h.</p>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              {[
                ["nombre",      "Nombre",              "Tu nombre",            "text"],
                ["empresa",     "Empresa",             "Empresa o marca",       "text"],
                ["proyecto",    "Proyecto",            "¿Qué necesitas producir?","text"],
              ].map(([name, label, placeholder, type]) => (
                <div key={name} className="form-field">
                  <label>{label}</label>
                  <input name={name} type={type} placeholder={placeholder}
                    value={f[name]} onChange={change}
                    required={name !== "empresa"} />
                </div>
              ))}
              <div className="form-field">
                <label>Presupuesto estimado</label>
                <select name="presupuesto" value={f.presupuesto} onChange={change}>
                  <option value="">Selecciona un rango</option>
                  <option>$500 – $1,500</option>
                  <option>$1,500 – $5,000</option>
                  <option>$5,000 – $15,000</option>
                  <option>$15,000+</option>
                </select>
              </div>
              <button type="submit" className="form-submit">Enviar →</button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

/* ══════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════ */
export default function App({ keycloak }) {
  const [page,    setPage]    = useState("home");
  const [project, setProject] = useState(null);

  // If user log out, automatically return to home page
  useEffect(() => {
    if (keycloak && !keycloak.authenticated && page === "facturas") {
      setPage("home");
    }
  }, [keycloak?.authenticated, page]);

  const screen = () => {
    switch (page) {
      case "home":       return <Home />;
      case "somos":      return <Somos />;
      case "portafolio": return <Portafolio setPage={setPage} setProject={setProject} />;
      case "project":    return <Project p={project} setPage={setPage} />;
      case "servicios":  return <Servicios />;
      case "contacto":   return <Contacto />;
      case "facturas":   return <Facturas keycloak={keycloak} />;
      default:           return <Home />;
    }
  };

  return (
    <div className="app">
      <Nav setPage={p => { setPage(p); window.scrollTo(0,0); }} keycloak={keycloak} />
      {screen()}
    </div>
  );
}