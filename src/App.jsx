import { useState, useContext, createContext, useEffect, useCallback } from "react";
import BotsModule from "./BotsModule";

// ============================================================
// THEME
// ============================================================
const ThemeContext = createContext(null);
function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);
  return <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</ThemeContext.Provider>;
}
function useTheme() { return useContext(ThemeContext); }

// ============================================================
// CSS
// ============================================================
function GlobalStyles({ dark }) {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { width: 100%; min-height: 100vh; margin: 0; padding: 0; }
    :root {
      --red: #E8293A; --red-dark: #c01f2e; --red-light: rgba(232,41,58,0.12);
      --bg: ${dark ? '#1a1a1f' : '#f0f0f2'};
      --bg2: ${dark ? '#202028' : '#ffffff'};
      --bg3: ${dark ? '#28282f' : '#e8e8ec'};
      --card: ${dark ? '#22222a' : '#ffffff'};
      --border: ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'};
      --text: ${dark ? '#f0f0f0' : '#111'};
      --text2: ${dark ? '#8888a0' : '#666'};
      --text3: ${dark ? '#55556a' : '#999'};
      --nav: #111116;
      --shadow: ${dark ? '0 4px 24px rgba(0,0,0,0.5)' : '0 4px 24px rgba(0,0,0,0.1)'};
      --shadow-sm: ${dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)'};
    }
    html { font-family: 'Manrope', sans-serif; background: var(--bg); color: var(--text); }
    body { background: var(--bg); transition: background 0.25s, color 0.25s; }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--red); border-radius: 3px; }

    /* NAV */
    .nav { position: sticky; top: 0; z-index: 200; background: var(--nav); height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; border-bottom: 1px solid rgba(255,255,255,0.05); width: 100%; }
    .nav-brand { font-size: 20px; font-weight: 800; color: #fff; cursor: pointer; letter-spacing: -0.5px; }
    .nav-brand span { color: var(--red); }
    .nav-links { display: flex; gap: 2px; }
    .nav-link { color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 500; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: all 0.15s; }
    .nav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
    .nav-link.active { color: #fff; background: rgba(255,255,255,0.1); }
    .nav-right { display: flex; align-items: center; gap: 10px; }

    /* LAYOUT */
    .layout { display: flex; min-height: calc(100vh - 56px); }
    .sidebar { width: 240px; min-width: 240px; background: var(--bg2); border-right: 1px solid var(--border); padding: 20px 0; display: flex; flex-direction: column; position: sticky; top: 56px; height: calc(100vh - 56px); overflow-y: auto; }
    .main-area { flex: 1; padding: 28px 32px; min-width: 0; background: var(--bg); }

    /* SIDEBAR */
    .sb-section { margin-bottom: 24px; }
    .sb-title { font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; padding: 0 16px; margin-bottom: 6px; }
    .sb-item { display: flex; align-items: center; gap: 10px; padding: 8px 16px; font-size: 13px; font-weight: 500; color: var(--text2); cursor: pointer; transition: all 0.15s; border-radius: 0; }
    .sb-item:hover { color: var(--text); background: var(--bg3); }
    .sb-item.active { color: var(--red); background: var(--red-light); border-right: 2px solid var(--red); }
    .sb-item-icon { font-size: 15px; width: 18px; text-align: center; }
    .sb-fav { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sb-divider { height: 1px; background: var(--border); margin: 8px 16px; }
    .sb-tag { display: inline-flex; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: var(--bg3); color: var(--text2); cursor: pointer; transition: all 0.15s; margin: 2px; }
    .sb-tag:hover { background: var(--red-light); color: var(--red); }
    .sb-tags { padding: 4px 12px; display: flex; flex-wrap: wrap; gap: 4px; }

    /* BUTTONS */
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 7px; border: none; font-family: 'Manrope',sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
    .btn-primary { background: var(--red); color: #fff; }
    .btn-primary:hover { background: var(--red-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(232,41,58,0.3); }
    .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
    .btn-ghost:hover { color: var(--text); border-color: var(--text3); }
    .btn-danger { background: var(--red-light); color: var(--red); border: 1px solid rgba(232,41,58,0.2); }
    .btn-danger:hover { background: var(--red); color: #fff; }
    .btn-success { background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
    .btn-success:hover { background: #22c55e; color: #fff; }
    .btn-sm { padding: 5px 11px; font-size: 12px; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
    .btn-nav { background: var(--red); color: #fff; padding: 6px 16px; border-radius: 7px; border: none; font-family: 'Manrope',sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; }
    .btn-nav:hover { background: var(--red-dark); }
    .theme-btn { width: 40px; height: 22px; background: rgba(255,255,255,0.1); border-radius: 11px; border: none; cursor: pointer; position: relative; transition: background 0.2s; }
    .theme-btn.on { background: var(--red); }
    .theme-btn::after { content:''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: transform 0.2s; }
    .theme-btn.on::after { transform: translateX(18px); }

    /* CARDS */
    .card { background: var(--card); border-radius: 10px; border: 1px solid var(--border); padding: 20px; }
    .card + .card { margin-top: 12px; }

    /* ARTICLE CARD */
    .a-card { background: var(--card); border-radius: 10px; border: 1px solid var(--border); padding: 20px; margin-bottom: 10px; cursor: pointer; transition: all 0.18s; }
    .a-card:hover { border-color: rgba(232,41,58,0.25); box-shadow: var(--shadow); transform: translateY(-1px); }
    .a-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; line-height: 1.35; }
    .a-meta { font-size: 12px; color: var(--text3); display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .a-meta-sep { color: var(--border); }

    /* BADGES */
    .badge { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-right: 4px; }
    .badge-published { background: rgba(34,197,94,0.12); color: #22c55e; }
    .badge-draft { background: rgba(234,179,8,0.12); color: #ca8a04; }
    .badge-admin { background: var(--red-light); color: var(--red); }
    .badge-editor { background: rgba(59,130,246,0.12); color: #3b82f6; }
    .badge-viewer { background: var(--bg3); color: var(--text2); }

    /* FORM */
    .fg { margin-bottom: 16px; }
    .fl { display: block; font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
    .fi { width: 100%; padding: 9px 13px; border-radius: 7px; border: 1.5px solid var(--border); background: var(--bg3); color: var(--text); font-family: 'Manrope',sans-serif; font-size: 14px; transition: border-color 0.15s; }
    .fi:focus { outline: none; border-color: var(--red); }
    .fi-ta { min-height: 160px; resize: vertical; line-height: 1.6; }

    /* PAGE */
    .page-title { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.3px; margin-bottom: 20px; }
    .section-title { font-size: 13px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .divider { height: 1px; background: var(--border); margin: 16px 0; }
    .flex-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .flex-between { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

    /* STATS */
    .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }
    .stat { background: var(--card); border-radius: 10px; border: 1px solid var(--border); padding: 20px; }
    .stat-n { font-size: 32px; font-weight: 800; color: var(--red); }
    .stat-l { font-size: 12px; color: var(--text2); margin-top: 2px; }

    /* HERO */
    .hero { background: linear-gradient(135deg, #0f0f14 0%, #1a1020 100%); border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); padding: 32px; margin-bottom: 20px; position: relative; overflow: hidden; }
    .hero::before { content:''; position:absolute; top:-30px; right:-30px; width:180px; height:180px; background: radial-gradient(circle, rgba(232,41,58,0.18) 0%, transparent 70%); }
    .hero-title { font-size: 22px; font-weight: 800; color: #fff; }
    .hero-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px; }
    .red-bar { width: 36px; height: 3px; background: var(--red); border-radius: 2px; margin-bottom: 12px; }

    /* HOME GRID */
    .home-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    .cat-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); cursor: pointer; font-size: 14px; font-weight: 500; transition: color 0.15s; }
    .cat-row:hover { color: var(--red); }
    .cat-row:last-child { border: none; }

    /* FILTER */
    .filter-bar { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
    .f-btn { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border); background: var(--bg3); color: var(--text2); transition: all 0.15s; }
    .f-btn.active { background: var(--red); color: #fff; border-color: var(--red); }

    /* TAG TOGGLE */
    .tag-tog { padding: 5px 13px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border); background: var(--bg3); color: var(--text2); transition: all 0.15s; }
    .tag-tog.on { background: var(--red); color: #fff; border-color: var(--red); }

    /* COMMENT */
    .cmt { padding: 14px 0; border-bottom: 1px solid var(--border); }
    .cmt-author { font-size: 13px; font-weight: 700; }
    .cmt-date { font-size: 11px; color: var(--text3); margin-left: 8px; }
    .cmt-text { font-size: 14px; color: var(--text2); margin-top: 6px; line-height: 1.6; }

    /* ADMIN TABS */
    .adm-tabs { display: flex; border-bottom: 2px solid var(--border); margin-bottom: 20px; }
    .adm-tab { padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--text2); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.15s; }
    .adm-tab.active { color: var(--red); border-bottom-color: var(--red); }
    .adm-tab:hover:not(.active) { color: var(--text); }
    .u-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); }

    /* EMPTY / SPINNER */
    .empty { text-align: center; padding: 48px 20px; color: var(--text3); }
    .empty-icon { font-size: 40px; margin-bottom: 10px; }
    .empty-text { font-size: 14px; }
    .spin { display: flex; justify-content: center; padding: 48px; }
    .spin-r { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--red); border-radius: 50%; animation: sp 0.8s linear infinite; }
    @keyframes sp { to { transform: rotate(360deg); } }
    .err { color: var(--red); font-size: 13px; padding: 8px 12px; background: var(--red-light); border-radius: 6px; border-left: 3px solid var(--red); margin-top: 8px; }

    /* LOGIN */
    .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0d0d12; }
    .login-box { width: 380px; background: #18181f; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 36px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
    .login-logo { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 4px; }
    .login-logo span { color: var(--red); }
    .login-sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 28px; }
    .login-lbl { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px; margin-top: 12px; }
    .login-inp { width: 100%; padding: 10px 13px; border-radius: 7px; border: 1.5px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: #fff; font-family: 'Manrope',sans-serif; font-size: 14px; transition: border-color 0.15s; }
    .login-inp:focus { outline: none; border-color: var(--red); }
    .login-inp::placeholder { color: rgba(255,255,255,0.18); }
    .login-hint { font-size: 11px; color: rgba(255,255,255,0.2); text-align: center; margin-top: 14px; line-height: 1.7; }

    /* ARTICLE CONTENT */
    .art-content { font-size: 15px; line-height: 1.8; color: var(--text); white-space: pre-wrap; }

    /* FOOTER */
    .footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 32px; margin-top: 40px; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 32px; }
    .footer-brand { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
    .footer-brand span { color: var(--red); }
    .footer-desc { font-size: 13px; color: var(--text2); line-height: 1.6; }
    .footer-title { font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .footer-link { display: block; font-size: 13px; color: var(--text2); cursor: pointer; margin-bottom: 8px; transition: color 0.15s; }
    .footer-link:hover { color: var(--red); }
    .footer-bottom { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text3); display: flex; justify-content: space-between; }

    /* ABOUT / CONTACT PAGES */
    .info-page { max-width: 800px; }
    .info-hero { background: linear-gradient(135deg, #0f0f14, #1a1020); border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); padding: 36px; margin-bottom: 20px; }
    .info-hero-title { font-size: 26px; font-weight: 800; color: #fff; margin-top: 10px; }
    .info-hero-sub { font-size: 14px; color: rgba(255,255,255,0.4); margin-top: 6px; line-height: 1.6; }
    .contact-card { display: flex; align-items: center; gap: 14px; padding: 16px; background: var(--bg3); border-radius: 10px; margin-bottom: 10px; cursor: pointer; transition: all 0.15s; }
    .contact-card:hover { background: var(--red-light); }
    .contact-icon { font-size: 28px; }
    .contact-label { font-size: 11px; color: var(--text3); font-weight: 600; text-transform: uppercase; }
    .contact-val { font-size: 15px; font-weight: 600; color: var(--text); }

    /* SEARCH RESULT */
    .s-res { background: var(--card); border-radius: 10px; border: 1px solid var(--border); padding: 18px; margin-bottom: 10px; cursor: pointer; transition: all 0.18s; }
    .s-res:hover { border-color: rgba(232,41,58,0.25); box-shadow: var(--shadow); }

    /* 404 */
    .notfound { text-align: center; padding: 80px 20px; }
    .nf-code { font-size: 90px; font-weight: 800; color: var(--red); opacity: 0.25; line-height: 1; }
    .nf-title { font-size: 22px; font-weight: 700; margin-top: 12px; }
    .nf-sub { color: var(--text2); margin: 8px 0 24px; font-size: 14px; }

    /* CHIP */
    .chip { display: inline-flex; align-items: center; gap: 6px; background: var(--bg3); border-radius: 7px; padding: 5px 12px; font-size: 12px; font-weight: 500; color: var(--text); margin: 3px; }
  `;
  useEffect(() => {
    let el = document.getElementById('kms-css');
    if (!el) { el = document.createElement('style'); el.id = 'kms-css'; document.head.appendChild(el); }
    el.textContent = css;
  }, [dark]);
  return null;
}

// ============================================================
// API
// ============================================================
const API = "http://localhost:5000/api";
async function api(method, path, body, token) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка");
  return data;
}

// ============================================================
// AUTH
// ============================================================
const AuthCtx = createContext(null);
function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("kms_token"));
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (token) api("GET", "/auth/me", null, token).then(setCurrentUser).catch(() => { localStorage.removeItem("kms_token"); setToken(null); }).finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  const login = async (u, p) => { const d = await api("POST", "/auth/login", { username: u, password: p }); localStorage.setItem("kms_token", d.token); setToken(d.token); setCurrentUser(d.user); };
  const logout = () => { localStorage.removeItem("kms_token"); setToken(null); setCurrentUser(null); };
  const can = (a) => {
    if (!currentUser) return false;
    const rules = { createArticle:["editor","admin"], editArticle:["editor","admin"], deleteArticle:["admin"], publishArticle:["editor","admin"], manageUsers:["admin"], manageCategories:["admin"], moderateComments:["admin"], comment:["viewer","editor","admin"], favorite:["viewer","editor","admin"] };
    return rules[a]?.includes(currentUser.role) ?? false;
  };
  const call = useCallback((m, p, b) => api(m, p, b, token), [token]);
  return <AuthCtx.Provider value={{ currentUser, token, login, logout, can, call, loading }}>{children}</AuthCtx.Provider>;
}
function useAuth() { return useContext(AuthCtx); }

// ============================================================
// ROUTER
// ============================================================
function useRouter() {
  const [route, setRoute] = useState({ page: "home", params: {} });
  return { route, navigate: (page, params = {}) => setRoute({ page, params }) };
}

// ============================================================
// UI ATOMS
// ============================================================
function Btn({ v="primary", sm, onClick, children, disabled }) {
  return <button className={`btn btn-${v}${sm?" btn-sm":""}`} onClick={onClick} disabled={disabled}>{children}</button>;
}
function Badge({ type, children }) { return <span className={`badge badge-${type}`}>{children}</span>; }
function Spin() { return <div className="spin"><div className="spin-r"/></div>; }
function Empty({ icon="📭", text="Пусто" }) { return <div className="empty"><div className="empty-icon">{icon}</div><div className="empty-text">{text}</div></div>; }
function Err({ msg }) { return msg ? <div className="err">{msg}</div> : null; }
function cd(msg, fn) { if (window.confirm(msg)) fn(); }
function FI({ label, value, onChange, type="text", placeholder, onKeyDown }) {
  return <div className="fg">{label&&<label className="fl">{label}</label>}<input className="fi" type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onKeyDown={onKeyDown}/></div>;
}
function FT({ label, value, onChange, placeholder }) {
  return <div className="fg">{label&&<label className="fl">{label}</label>}<textarea className="fi fi-ta" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>;
}
function FS({ label, value, onChange, options }) {
  return <div className="fg">{label&&<label className="fl">{label}</label>}<select className="fi" value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ navigate, currentPage }) {
  const { call, currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    call("GET", "/categories").then(setCategories).catch(() => {});
    call("GET", "/tags").then(setTags).catch(() => {});
    call("GET", "/favorites").then(setFavs).catch(() => {});
  }, []);

  const navItems = [
    { page: "home", icon: "🏠", label: "Главная" },
    { page: "articles", icon: "📄", label: "Все статьи" },
    { page: "search", icon: "🔍", label: "Поиск" },
    { page: "favorites", icon: "★", label: "Избранное" },
    { page: "bots", icon: "🤖", label: "Конструктор ботов" },
  ];

  return (
    <aside className="sidebar">
      <div className="sb-section">
        {navItems.map(item => (
          <div key={item.page} className={`sb-item${currentPage===item.page?" active":""}`} onClick={() => navigate(item.page)}>
            <span className="sb-item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="sb-divider"/>

      <div className="sb-section">
        <div className="sb-title">Категории</div>
        {categories.map(c => (
          <div key={c.id} className="sb-item" onClick={() => navigate("search", { categoryId: c.id })}>
            <span className="sb-item-icon">📁</span>
            <span>{c.name}</span>
          </div>
        ))}
      </div>

      {tags.length > 0 && (
        <>
          <div className="sb-divider"/>
          <div className="sb-section">
            <div className="sb-title">Теги</div>
            <div className="sb-tags">
              {tags.map(t => (
                <span key={t.id} className="sb-tag" onClick={() => navigate("search", { tagId: t.id })}>{t.name}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {favs.length > 0 && (
        <>
          <div className="sb-divider"/>
          <div className="sb-section">
            <div className="sb-title">Избранное</div>
            {favs.slice(0, 5).map(a => (
              <div key={a.id} className="sb-item" onClick={() => navigate("article", { id: a.id })}>
                <span className="sb-item-icon">★</span>
                <span className="sb-fav">{a.title}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ flex: 1 }}/>
      <div className="sb-divider"/>
      <div className="sb-section" style={{ marginBottom: 0 }}>
        <div className="sb-item" onClick={() => navigate("about")}><span className="sb-item-icon">ℹ️</span><span>О нас</span></div>
        <div className="sb-item" onClick={() => navigate("contact")}><span className="sb-item-icon">✉️</span><span>Связаться</span></div>
      </div>
    </aside>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ navigate, currentPage }) {
  const { currentUser, logout, can } = useAuth();
  const { dark, toggle } = useTheme();
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => navigate("home")}>KMS<span>.</span></div>
      <div className="nav-links">
        {[
          { page:"home", label:"Главная" },
          { page:"articles", label:"Статьи" },
          { page:"search", label:"Поиск" },
          { page:"bots", label:"🤖 Боты" },
          ...(can("createArticle")?[{page:"article-new",label:"+ Статья"}]:[]),
          ...(can("manageUsers")?[{page:"admin",label:"Панель"}]:[]),
        ].map(l => <span key={l.page} className={`nav-link${currentPage===l.page?" active":""}`} onClick={() => navigate(l.page)}>{l.label}</span>)}
      </div>
      <div className="nav-right">
        <button className={`theme-btn${dark?" on":""}`} onClick={toggle}/>
        <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>{currentUser?.username}</span>
        <Badge type={currentUser?.role}>{currentUser?.role}</Badge>
        <button className="btn-nav" onClick={logout}>Выйти</button>
      </div>
    </nav>
  );
}

// ============================================================
// LOGIN
// ============================================================
function LoginPage() {
  const { login } = useAuth();
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const go = async () => {
    if (!u||!p) { setErr("Заполните все поля"); return; }
    setLoading(true);
    try { await login(u, p); } catch(e) { setErr(e.message); } finally { setLoading(false); }
  };
  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">KMS<span>.</span></div>
        <div className="login-sub">Система управления знаниями</div>
        <label className="login-lbl">Логин</label>
        <input className="login-inp" value={u} onChange={e=>setU(e.target.value)} placeholder="Введите логин" onKeyDown={e=>e.key==="Enter"&&go()}/>
        <label className="login-lbl">Пароль</label>
        <input className="login-inp" type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="Введите пароль" onKeyDown={e=>e.key==="Enter"&&go()}/>
        {err && <div style={{color:"#ff4d5e",fontSize:13,marginTop:8}}>{err}</div>}
        <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",marginTop:16}} onClick={go} disabled={loading}>{loading?"Вход...":"Войти"}</button>
        <div className="login-hint">admin / admin123 · editor / editor123 · viewer / viewer123</div>
      </div>
    </div>
  );
}

// ============================================================
// HOME
// ============================================================
function HomePage({ navigate }) {
  const { call, currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    call("GET","/stats").then(setStats).catch(()=>{});
    call("GET","/articles?status=published").then(d=>setArticles(d.slice(0,5))).catch(()=>{});
    call("GET","/categories").then(setCategories).catch(()=>{});
  }, []);
  return (
    <div>
      <div className="hero">
        <div style={{position:"relative",zIndex:1}}>
          <div className="red-bar"/>
          <div className="hero-title">Добро пожаловать, {currentUser?.username}</div>
          <div className="hero-sub">База корпоративных знаний · {new Date().toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
      </div>
      {stats && (
        <div className="stats">
          {[{icon:"📄",n:stats.articles,l:"Всего статей"},{icon:"✅",n:stats.published,l:"Опубликовано"},{icon:"👥",n:stats.users,l:"Пользователей"},{icon:"💬",n:stats.comments,l:"Комментариев"}].map((s,i)=>(
            <div key={i} className="stat"><div style={{fontSize:18,marginBottom:4}}>{s.icon}</div><div className="stat-n">{s.n}</div><div className="stat-l">{s.l}</div></div>
          ))}
        </div>
      )}
      <div className="card">
        <div className="section-title">Последние статьи</div>
        {articles.length===0 ? <Empty icon="📝" text="Статей пока нет"/> : articles.map(a=>(
          <div key={a.id} className="cat-row" onClick={()=>navigate("article",{id:a.id})}>
            <span style={{fontWeight:600,fontSize:14}}>{a.title}</span>
            <span style={{fontSize:12,color:"var(--text3)"}}>{a.createdAt} · 👁 {a.views}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ARTICLES
// ============================================================
function ArticlesPage({ navigate }) {
  const { call, can, currentUser } = useAuth();
  const [articles, setArticles] = useState([]); const [loading, setLoading] = useState(true); const [filter, setFilter] = useState("published");
  const load = () => { setLoading(true); call("GET",`/articles?status=${filter}`).then(setArticles).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[filter]);
  const del = (a) => cd(`Удалить "${a.title}"?`, async()=>{ await call("DELETE",`/articles/${a.id}`); load(); });
  const pub = async(a) => { await call("PATCH",`/articles/${a.id}/publish`); load(); };
  const unpub = async(a) => { await call("PATCH",`/articles/${a.id}/unpublish`); load(); };
  return (
    <div>
      <div className="flex-between" style={{marginBottom:16}}>
        <div className="page-title">Статьи</div>
        {can("createArticle") && <Btn onClick={()=>navigate("article-new")}>+ Новая статья</Btn>}
      </div>
      <div className="filter-bar">
        {["published","draft"].map(f=><button key={f} className={`f-btn${filter===f?" active":""}`} onClick={()=>setFilter(f)}>{f==="published"?"✅ Опубликованные":"📝 Черновики"}</button>)}
      </div>
      {loading ? <Spin/> : articles.length===0 ? <Empty/> : articles.map(a=>(
        <div key={a.id} className="a-card">
          <div className="flex-between">
            <div style={{flex:1,cursor:"pointer"}} onClick={()=>navigate("article",{id:a.id})}>
              <div className="a-title">{a.title}</div>
              <div className="a-meta"><span>{a.categoryName}</span><span className="a-meta-sep">·</span><span>{a.authorName}</span><span className="a-meta-sep">·</span><span>{a.createdAt}</span><span className="a-meta-sep">·</span><span>👁 {a.views}</span></div>
              <div style={{marginTop:8}}><Badge type={a.status}>{a.status==="published"?"Опубликовано":"Черновик"}</Badge>{(a.tagNames||[]).map(t=><Badge key={t} type="viewer">{t}</Badge>)}</div>
            </div>
            <div className="flex-row" style={{marginLeft:12}}>
              {(can("editArticle")||a.authorId===currentUser.id)&&<Btn v="ghost" sm onClick={()=>navigate("article-edit",{id:a.id})}>Ред.</Btn>}
              {can("publishArticle")&&(a.status==="draft"?<Btn v="success" sm onClick={()=>pub(a)}>Опубл.</Btn>:<Btn v="ghost" sm onClick={()=>unpub(a)}>В черновик</Btn>)}
              {can("deleteArticle")&&<Btn v="danger" sm onClick={()=>del(a)}>Удал.</Btn>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ARTICLE VIEW
// ============================================================
function ArticleViewPage({ navigate, params }) {
  const { call, currentUser, can } = useAuth();
  const [article, setArticle] = useState(null); const [comments, setComments] = useState([]); const [isFav, setIsFav] = useState(false);
  const [cText, setCText] = useState(""); const [editId, setEditId] = useState(null); const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true); const [err, setErr] = useState("");
  useEffect(()=>{
    Promise.all([call("GET",`/articles/${params.id}`),call("GET",`/comments?articleId=${params.id}`),call("GET",`/favorites/${params.id}/check`)])
      .then(([a,c,f])=>{ setArticle(a); setComments(c); setIsFav(f.isFavorite); }).catch(e=>setErr(e.message)).finally(()=>setLoading(false));
  },[params.id]);
  const togFav = async()=>{ if(isFav){await call("DELETE",`/favorites/${params.id}`);setIsFav(false);}else{await call("POST",`/favorites/${params.id}`);setIsFav(true);} };
  const sendCmt = async()=>{ if(!cText.trim())return; const c=await call("POST","/comments",{articleId:params.id,content:cText}); setComments(p=>[...p,c]); setCText(""); };
  const saveCmt = async(id)=>{ await call("PUT",`/comments/${id}`,{content:editText}); setComments(p=>p.map(c=>c.id===id?{...c,content:editText}:c)); setEditId(null); };
  const delCmt = (id)=>cd("Удалить?",async()=>{ await call("DELETE",`/comments/${id}`); setComments(p=>p.filter(c=>c.id!==id)); });
  if(loading)return <Spin/>;
  if(err)return <div className="card" style={{color:"var(--red)",padding:32}}>{err}</div>;
  if(!article)return <NotFoundPage navigate={navigate}/>;
  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{marginBottom:16}} onClick={()=>navigate("articles")}>← Назад</button>
      <div className="card" style={{marginBottom:12}}>
        <div className="flex-between" style={{marginBottom:12}}>
          <div style={{flex:1}}>
            <div className="red-bar"/>
            <h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.3px",lineHeight:1.3}}>{article.title}</h1>
            <div className="a-meta" style={{marginTop:8}}><span>{article.categoryName}</span><span>·</span><span>{article.authorName}</span><span>·</span><span>{article.createdAt}</span><span>·</span><span>👁 {article.views}</span></div>
            <div style={{marginTop:8}}><Badge type={article.status}>{article.status==="published"?"Опубликовано":"Черновик"}</Badge>{(article.tagNames||[]).map(t=><Badge key={t} type="viewer">{t}</Badge>)}</div>
          </div>
          <div className="flex-row">
            {can("favorite")&&<Btn v={isFav?"danger":"ghost"} sm onClick={togFav}>{isFav?"★ Убрать":"☆ В избранное"}</Btn>}
            {(can("editArticle")||article.authorId===currentUser.id)&&<Btn v="ghost" sm onClick={()=>navigate("article-edit",{id:article.id})}>Ред.</Btn>}
          </div>
        </div>
        <div className="divider"/>
        <div className="art-content">{article.content}</div>
      </div>
      <div className="card">
        <div className="section-title">💬 Комментарии ({comments.length})</div>
        {comments.length===0&&<Empty icon="💬" text="Комментариев пока нет"/>}
        {comments.map(c=>(
          <div key={c.id} className="cmt">
            <div className="flex-between"><div><span className="cmt-author">{c.authorName}</span><span className="cmt-date">{c.createdAt}</span></div>
            <div className="flex-row">
              {c.authorId===currentUser.id&&<Btn v="ghost" sm onClick={()=>{setEditId(c.id);setEditText(c.content);}}>Ред.</Btn>}
              {(c.authorId===currentUser.id||can("moderateComments"))&&<Btn v="danger" sm onClick={()=>delCmt(c.id)}>Удал.</Btn>}
            </div></div>
            {editId===c.id?<div style={{marginTop:8}}><textarea className="fi fi-ta" style={{minHeight:70}} value={editText} onChange={e=>setEditText(e.target.value)}/><div className="flex-row" style={{marginTop:6}}><Btn sm onClick={()=>saveCmt(c.id)}>Сохранить</Btn><Btn v="ghost" sm onClick={()=>setEditId(null)}>Отмена</Btn></div></div>
            :<div className="cmt-text">{c.content}</div>}
          </div>
        ))}
        {can("comment")&&<div style={{marginTop:16}}><textarea className="fi fi-ta" style={{minHeight:80}} value={cText} onChange={e=>setCText(e.target.value)} placeholder="Написать комментарий..."/><Btn style={{marginTop:8}} onClick={sendCmt}>Отправить</Btn></div>}
      </div>
    </div>
  );
}

// ============================================================
// ARTICLE FORM
// ============================================================
function ArticleFormPage({ navigate, params }) {
  const { call, can } = useAuth();
  const isEdit = !!params.id;
  const [title,setTitle]=useState(""); const [content,setContent]=useState(""); const [catId,setCatId]=useState(""); const [tags,setTags]=useState([]); const [selTags,setSelTags]=useState([]); const [status,setStatus]=useState("draft"); const [cats,setCats]=useState([]); const [err,setErr]=useState(""); const [saving,setSaving]=useState(false);
  useEffect(()=>{
    Promise.all([call("GET","/categories"),call("GET","/tags")]).then(([c,t])=>{ setCats(c); setTags(t); if(!isEdit&&c.length) setCatId(String(c[0].id)); });
    if(isEdit) call("GET",`/articles/${params.id}`).then(a=>{ setTitle(a.title);setContent(a.content);setCatId(String(a.categoryId));setSelTags(a.tagIds);setStatus(a.status); });
  },[params.id]);
  if(!can("createArticle")) return <Empty icon="🔒" text="Нет доступа"/>;
  const togTag=(id)=>setSelTags(p=>p.includes(id)?p.filter(t=>t!==id):[...p,id]);
  const save=async()=>{
    if(!title.trim()){setErr("Введите заголовок");return;} if(!content.trim()){setErr("Введите содержимое");return;}
    setSaving(true);
    try { const d={title,content,categoryId:Number(catId),tagIds:selTags,status}; if(isEdit) await call("PUT",`/articles/${params.id}`,d); else await call("POST","/articles",d); navigate("articles"); }
    catch(e){setErr(e.message);} finally{setSaving(false);}
  };
  return (
    <div>
      <div className="page-title">{isEdit?"Редактировать статью":"Новая статья"}</div>
      <div className="card">
        <FI label="Заголовок" value={title} onChange={setTitle} placeholder="Введите заголовок"/>
        <FT label="Содержимое" value={content} onChange={setContent} placeholder="Текст статьи..."/>
        <div className="grid-2">
          <FS label="Категория" value={catId} onChange={setCatId} options={cats.map(c=>({value:c.id,label:c.name}))}/>
          <FS label="Статус" value={status} onChange={setStatus} options={[{value:"draft",label:"📝 Черновик"},{value:"published",label:"✅ Опубликовать"}]}/>
        </div>
        <div className="fg"><label className="fl">Теги</label><div className="flex-row">{tags.map(t=><button key={t.id} className={`tag-tog${selTags.includes(t.id)?" on":""}`} onClick={()=>togTag(t.id)}>{t.name}</button>)}</div></div>
        <Err msg={err}/>
        <div className="flex-row" style={{marginTop:8}}><Btn onClick={save} disabled={saving}>{saving?"Сохранение...":isEdit?"Сохранить":"Создать"}</Btn><Btn v="ghost" onClick={()=>navigate("articles")}>Отмена</Btn></div>
      </div>
    </div>
  );
}

// ============================================================
// SEARCH
// ============================================================
function SearchPage({ navigate, params }) {
  const { call } = useAuth();
  const [q,setQ]=useState(""); const [catId,setCatId]=useState(params?.categoryId?String(params.categoryId):""); const [tagId,setTagId]=useState(params?.tagId?String(params.tagId):"");
  const [results,setResults]=useState(null); const [cats,setCats]=useState([]); const [tags,setTags]=useState([]); const [loading,setLoading]=useState(false);
  useEffect(()=>{ call("GET","/categories").then(setCats).catch(()=>{}); call("GET","/tags").then(setTags).catch(()=>{}); if(params?.categoryId||params?.tagId) doSearch(); },[]);
  const doSearch=async()=>{ setLoading(true); const p=new URLSearchParams(); if(q)p.set("search",q); if(catId)p.set("categoryId",catId); if(tagId)p.set("tagId",tagId); const d=await call("GET",`/articles?${p}`); setResults(d.filter(a=>a.status==="published")); setLoading(false); };
  return (
    <div>
      <div className="page-title">Поиск</div>
      <div className="card" style={{marginBottom:16}}>
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <input className="fi" style={{flex:1}} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="Поиск по статьям..."/>
          <Btn onClick={doSearch}>Найти</Btn>
        </div>
        <div className="grid-2">
          <FS label="Категория" value={catId} onChange={setCatId} options={[{value:"",label:"Все категории"},...cats.map(c=>({value:String(c.id),label:c.name}))]}/>
          <FS label="Тег" value={tagId} onChange={setTagId} options={[{value:"",label:"Все теги"},...tags.map(t=>({value:String(t.id),label:t.name}))]}/>
        </div>
      </div>
      {loading&&<Spin/>}
      {results!==null&&!loading&&(
        <div>
          <div style={{fontSize:12,color:"var(--text3)",marginBottom:10}}>{results.length>0?`Найдено: ${results.length}`:"Ничего не найдено"}</div>
          {results.map(a=>(
            <div key={a.id} className="s-res" onClick={()=>navigate("article",{id:a.id})}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>{a.title}</div>
              <div className="a-meta"><span>{a.categoryName}</span><span>·</span><span>{a.authorName}</span><span>·</span><span>{a.createdAt}</span></div>
              <div style={{marginTop:8,fontSize:13,color:"var(--text2)",lineHeight:1.6}}>{a.content.slice(0,140)}...</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// FAVORITES
// ============================================================
function FavoritesPage({ navigate }) {
  const { call } = useAuth();
  const [favs,setFavs]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{ call("GET","/favorites").then(setFavs).catch(()=>{}).finally(()=>setLoading(false)); },[]);
  const rem=(id)=>cd("Убрать?",async()=>{ await call("DELETE",`/favorites/${id}`); setFavs(p=>p.filter(a=>a.id!==id)); });
  return (
    <div>
      <div className="page-title">Избранное</div>
      {loading?<Spin/>:favs.length===0?<Empty icon="★" text="Избранных статей нет"/>:favs.map(a=>(
        <div key={a.id} className="a-card">
          <div className="flex-between">
            <div style={{cursor:"pointer",flex:1}} onClick={()=>navigate("article",{id:a.id})}>
              <div className="a-title">{a.title}</div>
              <div className="a-meta"><span>{a.categoryName}</span><span>·</span><span>{a.createdAt}</span></div>
            </div>
            <Btn v="danger" sm onClick={()=>rem(a.id)}>Убрать</Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ADMIN
// ============================================================
function AdminPage() {
  const { call, can } = useAuth();
  const [tab,setTab]=useState("users");
  const [users,setUsers]=useState([]); const [articles,setArticles]=useState([]); const [cats,setCats]=useState([]); const [tags,setTags]=useState([]); const [cmts,setCmts]=useState([]);
  const [nu,setNu]=useState({username:"",email:"",password:"",role:"viewer"});
  const [nCat,setNCat]=useState(""); const [nTag,setNTag]=useState("");
  useEffect(()=>{
    call("GET","/users").then(setUsers).catch(()=>{});
    call("GET","/articles").then(setArticles).catch(()=>{});
    call("GET","/categories").then(setCats).catch(()=>{});
    call("GET","/tags").then(setTags).catch(()=>{});
    call("GET","/comments").then(setCmts).catch(()=>{});
  },[]);
  if(!can("manageUsers")) return <Empty icon="🔒" text="Нет доступа"/>;
  const addUser=async()=>{ if(!nu.username||!nu.password)return; const u=await call("POST","/users",nu); setUsers(p=>[...p,u]); setNu({username:"",email:"",password:"",role:"viewer"}); };
  const togUser=async(id)=>{ const r=await call("PATCH",`/users/${id}/toggle`); setUsers(p=>p.map(u=>u.id===id?{...u,active:r.active}:u)); };
  const delArt=(a)=>cd(`Удалить "${a.title}"?`,async()=>{ await call("DELETE",`/articles/${a.id}`); setArticles(p=>p.filter(x=>x.id!==a.id)); });
  const pubArt=async(id)=>{ await call("PATCH",`/articles/${id}/publish`); setArticles(p=>p.map(a=>a.id===id?{...a,status:"published"}:a)); };
  const addCat=async()=>{ if(!nCat.trim())return; const c=await call("POST","/categories",{name:nCat}); setCats(p=>[...p,c]); setNCat(""); };
  const delCat=(id)=>cd("Удалить?",async()=>{ await call("DELETE",`/categories/${id}`); setCats(p=>p.filter(c=>c.id!==id)); });
  const addTag=async()=>{ if(!nTag.trim())return; const t=await call("POST","/tags",{name:nTag}); setTags(p=>[...p,t]); setNTag(""); };
  const delTag=(id)=>cd("Удалить?",async()=>{ await call("DELETE",`/tags/${id}`); setTags(p=>p.filter(t=>t.id!==id)); });
  const delCmt=(id)=>cd("Удалить?",async()=>{ await call("DELETE",`/comments/${id}`); setCmts(p=>p.filter(c=>c.id!==id)); });
  const TABS=[{id:"users",l:"👥 Пользователи"},{id:"articles",l:"📄 Статьи"},{id:"categories",l:"📁 Категории"},{id:"tags",l:"🏷 Теги"},{id:"comments",l:"💬 Комментарии"}];
  return (
    <div>
      <div className="page-title">Панель администратора</div>
      <div className="adm-tabs">{TABS.map(t=><div key={t.id} className={`adm-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.l}</div>)}</div>
      {tab==="users"&&<div>
        <div className="card" style={{marginBottom:12}}>
          <div className="section-title">Добавить пользователя</div>
          <div className="grid-2"><FI label="Логин" value={nu.username} onChange={v=>setNu(p=>({...p,username:v}))} placeholder="username"/><FI label="Email" value={nu.email} onChange={v=>setNu(p=>({...p,email:v}))} placeholder="email@example.com"/><FI label="Пароль" value={nu.password} onChange={v=>setNu(p=>({...p,password:v}))} type="password" placeholder="пароль"/><FS label="Роль" value={nu.role} onChange={v=>setNu(p=>({...p,role:v}))} options={[{value:"viewer",label:"viewer"},{value:"editor",label:"editor"},{value:"admin",label:"admin"}]}/></div>
          <Btn onClick={addUser}>Добавить</Btn>
        </div>
        <div className="card"><div className="section-title">Пользователи ({users.length})</div>{users.map(u=><div key={u.id} className="u-row"><div className="flex-row"><span style={{fontWeight:700}}>{u.username}</span><Badge type={u.role}>{u.role}</Badge><span style={{fontSize:12,color:"var(--text2)"}}>{u.email}</span>{!u.active&&<Badge type="draft">Заблокирован</Badge>}</div><Btn v={u.active?"danger":"success"} sm onClick={()=>togUser(u.id)}>{u.active?"Заблокировать":"Разблокировать"}</Btn></div>)}</div>
      </div>}
      {tab==="articles"&&<div className="card"><div className="section-title">Все статьи ({articles.length})</div>{articles.length===0&&<Empty/>}{articles.map(a=><div key={a.id} className="u-row"><div><span style={{fontWeight:600}}>{a.title}</span> <Badge type={a.status}>{a.status==="published"?"Опубл.":"Черновик"}</Badge> <span style={{fontSize:12,color:"var(--text2)"}}>{a.authorName}</span></div><div className="flex-row">{a.status==="draft"&&<Btn v="success" sm onClick={()=>pubArt(a.id)}>Опубл.</Btn>}<Btn v="danger" sm onClick={()=>delArt(a)}>Удалить</Btn></div></div>)}</div>}
      {tab==="categories"&&<div>
        <div className="card" style={{marginBottom:12}}><div className="section-title">Добавить категорию</div><div style={{display:"flex",gap:10}}><input className="fi" style={{flex:1}} value={nCat} onChange={e=>setNCat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCat()} placeholder="Название"/><Btn onClick={addCat}>Добавить</Btn></div></div>
        <div className="card"><div className="section-title">Категории ({cats.length})</div>{cats.map(c=><div key={c.id} className="u-row"><span style={{fontWeight:500}}>{c.name}</span><Btn v="danger" sm onClick={()=>delCat(c.id)}>Удалить</Btn></div>)}</div>
      </div>}
      {tab==="tags"&&<div>
        <div className="card" style={{marginBottom:12}}><div className="section-title">Добавить тег</div><div style={{display:"flex",gap:10}}><input className="fi" style={{flex:1}} value={nTag} onChange={e=>setNTag(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag()} placeholder="Название"/><Btn onClick={addTag}>Добавить</Btn></div></div>
        <div className="card"><div className="section-title">Теги ({tags.length})</div><div className="flex-row">{tags.map(t=><div key={t.id} className="chip">{t.name}<span style={{cursor:"pointer",color:"var(--red)",fontWeight:700,marginLeft:4}} onClick={()=>delTag(t.id)}>×</span></div>)}</div></div>
      </div>}
      {tab==="comments"&&<div className="card"><div className="section-title">Комментарии ({cmts.length})</div>{cmts.length===0&&<Empty icon="💬"/>}{cmts.map(c=><div key={c.id} className="u-row" style={{alignItems:"flex-start"}}><div><span style={{fontWeight:600}}>{c.authorName}</span><span style={{fontSize:12,color:"var(--text2)",marginLeft:8}}>{c.createdAt}</span><div style={{fontSize:13,color:"var(--text2)",marginTop:4}}>{c.content}</div></div><Btn v="danger" sm onClick={()=>delCmt(c.id)}>Удалить</Btn></div>)}</div>}
    </div>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function AboutPage() {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="red-bar"/>
        <div className="info-hero-title">О нас</div>
        <div className="info-hero-sub">KMS — система управления знаниями, разработанная в рамках производственной практики</div>
      </div>
      <div className="card" style={{marginBottom:12}}>
        <div className="section-title">Об авторе</div>
        <div style={{fontSize:15,lineHeight:1.8,color:"var(--text)"}}>
          Сайт создавал студент <strong>РАНХиГС</strong>, 3 курс, группа <strong>И-2-23-02</strong><br/>
          <strong>Колесников Семён Андреевич</strong><br/><br/>
          Проект разработан в рамках <strong>Производственной практики ПП 03.01</strong><br/>
          Специальность: <strong>09.02.07 — Информационные системы и программирование</strong><br/>
          Руководитель практики: <strong>Вилков Владислав Евгеньевич</strong>
        </div>
      </div>
      <div className="card">
        <div className="section-title">О системе</div>
        <div style={{fontSize:14,lineHeight:1.8,color:"var(--text2)"}}>
          KMS (Knowledge Management System) — система управления знаниями, предназначенная для хранения, организации и поиска корпоративной информации. Система поддерживает ролевую модель доступа, полнотекстовый поиск, категоризацию по тегам и категориям, систему комментариев и избранного.<br/><br/>
          Стек разработки: React, Node.js, Express, lowdb (JSON-база данных), JWT-авторизация.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONTACT PAGE
// ============================================================
function ContactPage() {
  const contacts = [
    { icon: "✈️", label: "Telegram", val: "@SemgaFissh", href: "https://t.me/SemgaFissh" },
    { icon: "📧", label: "Gmail", val: "SemgaFissh@gmail.com", href: "mailto:SemgaFissh@gmail.com" },
  ];
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="red-bar"/>
        <div className="info-hero-title">Связаться с нами</div>
        <div className="info-hero-sub">Есть вопросы или предложения? Напишите нам удобным способом</div>
      </div>
      <div className="card">
        <div className="section-title">Контакты</div>
        {contacts.map((c,i) => (
          <a key={i} href={c.href} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
            <div className="contact-card">
              <div className="contact-icon">{c.icon}</div>
              <div><div className="contact-label">{c.label}</div><div className="contact-val">{c.val}</div></div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">KMS<span>.</span></div>
          <div className="footer-desc">Система управления корпоративными знаниями. Разработана студентом СЗИУ РАНХиГС в рамках производственной практики.</div>
        </div>
        <div>
          <div className="footer-title">Навигация</div>
          <span className="footer-link" onClick={() => navigate("home")}>Главная</span>
          <span className="footer-link" onClick={() => navigate("articles")}>Статьи</span>
          <span className="footer-link" onClick={() => navigate("search")}>Поиск</span>
          <span className="footer-link" onClick={() => navigate("favorites")}>Избранное</span>
        </div>
        <div>
          <div className="footer-title">Информация</div>
          <span className="footer-link" onClick={() => navigate("about")}>О нас</span>
          <span className="footer-link" onClick={() => navigate("contact")}>Связаться с нами</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 KMS · Колесников С.А. · РАНХиГС И-2-23-02</span>
        <span>ПП 03.01 · Специальность 09.02.07</span>
      </div>
    </footer>
  );
}

// ============================================================
// NOT FOUND
// ============================================================
function NotFoundPage({ navigate }) {
  return <div className="notfound"><div className="nf-code">404</div><div className="nf-title">Страница не найдена</div><div className="nf-sub">Ресурс не существует или был удалён</div><Btn onClick={()=>navigate("home")}>На главную</Btn></div>;
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const { route, navigate } = useRouter();
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner route={route} navigate={navigate}/>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppInner({ route, navigate }) {
  const { currentUser, loading } = useAuth();
  const { dark } = useTheme();
  const PAGES = ["home","articles","article","article-new","article-edit","search","favorites","admin","about","contact"];

  if (loading) return (
    <>
      <GlobalStyles dark={dark}/>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0d0d12"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:800,color:"#fff",marginBottom:20}}>KMS<span style={{color:"#E8293A"}}>.</span></div><div className="spin-r" style={{margin:"0 auto"}}/></div>
      </div>
    </>
  );
  if (!currentUser) return <><GlobalStyles dark={dark}/><LoginPage/></>;

  const renderPage = () => {
    switch(route.page) {
      case "home": return <HomePage navigate={navigate}/>;
      case "articles": return <ArticlesPage navigate={navigate}/>;
      case "article": return <ArticleViewPage navigate={navigate} params={route.params}/>;
      case "article-new": return <ArticleFormPage navigate={navigate} params={{}}/>;
      case "article-edit": return <ArticleFormPage navigate={navigate} params={route.params}/>;
      case "search": return <SearchPage navigate={navigate} params={route.params}/>;
      case "favorites": return <FavoritesPage navigate={navigate}/>;
      case "admin": return <AdminPage/>;
      case "about": return <AboutPage/>;
      case "contact": return <ContactPage/>;
      case "bots": return <BotsModule />;
      default: return <NotFoundPage navigate={navigate}/>;
    }
  };

  return (
    <>
      <GlobalStyles dark={dark}/>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <Navbar navigate={navigate} currentPage={route.page}/>
        <div className="layout">
          <Sidebar navigate={navigate} currentPage={route.page}/>
          <div style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div className="main-area">{renderPage()}</div>
            <Footer navigate={navigate}/>
          </div>
        </div>
      </div>
    </>
  );
}
