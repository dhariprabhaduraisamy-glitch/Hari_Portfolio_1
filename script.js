/* =====================================================
   CONFIG
===================================================== */
const REMOTE_DATA_URL = ""; // e.g. "https://raw.githubusercontent.com/USER/REPO/main/data.json"
const LOCAL_DATA_URL = "data.json";

const INLINE_FALLBACK = {
  personal_info: {
    name: "Hariprabha Duraisamy",
    title: "AI / ML Engineer",
    tagline: "Portfolio data source unavailable — showing minimal offline snapshot.",
    email: "", phone: "", location: "", linkedin: "", github: "",
    profile_photo_url: "", intro_video_url: "", resume_url: ""
  },
  career_objective: "", professional_summary: "",
  skills: {}, software_proficiency: {}, work_experience: [], projects: [], education: []
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =====================================================
   ICONS (inline SVG / monogram badges — no external libs)
===================================================== */
function icon(name) {
  const icons = {
    linkedin: `<span class="icon-badge">in</span>`,
    github: `<span class="icon-badge">GH</span>`,
    mail: `<svg viewBox="0 0 24 24" class="icon"><path d="M4 6h16v12H4z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    resume: `<svg viewBox="0 0 24 24" class="icon"><path d="M6 2h9l5 5v15H6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 13h6M9 17h6M9 9h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" class="icon"><path d="M6 3h4l2 5-2.5 1.5a11 11 0 005 5L16 12l5 2v4a2 2 0 01-2 2C10.5 20 4 13.5 4 5a2 2 0 012-2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    location: `<svg viewBox="0 0 24 24" class="icon"><path d="M12 22s7-7.58 7-12a7 7 0 10-14 0c0 4.42 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`
  };
  return icons[name] || "";
}

/* =====================================================
   DATA LOADING
===================================================== */
async function loadData() {
  if (REMOTE_DATA_URL) {
    try {
      const res = await fetch(REMOTE_DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("bad status " + res.status);
      return { data: await res.json(), source: "github (live)" };
    } catch (e) {
      console.warn("Remote fetch failed, trying local data.json:", e);
    }
  }
  try {
    const res = await fetch(LOCAL_DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("bad status " + res.status);
    return { data: await res.json(), source: "local data.json" };
  } catch (e) {
    console.warn("Local fetch failed, using inline fallback:", e);
    return { data: INLINE_FALLBACK, source: "inline fallback" };
  }
}

/* =====================================================
   HERO NEURAL MESH BACKGROUND
===================================================== */
function renderMesh() {
  const points = [
    [60,80],[180,40],[300,120],[420,60],[560,110],[680,50],[760,140],
    [100,220],[240,260],[380,210],[520,250],[660,220],
    [40,360],[190,400],[340,370],[480,410],[620,380],[740,420],
    [120,500],[300,530],[470,500],[640,540]
  ];
  const nodesG = document.getElementById("meshNodes");
  const linesG = document.getElementById("meshLines");
  if (!nodesG || !linesG) return;

  const dist = (a,b) => Math.hypot(a[0]-b[0], a[1]-b[1]);
  let lineHTML = "";
  for (let i=0;i<points.length;i++){
    for (let j=i+1;j<points.length;j++){
      if (dist(points[i], points[j]) < 150) {
        lineHTML += `<line x1="${points[i][0]}" y1="${points[i][1]}" x2="${points[j][0]}" y2="${points[j][1]}"/>`;
      }
    }
  }
  linesG.innerHTML = lineHTML;
  nodesG.innerHTML = points.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" opacity="0.7"/>`).join("");
}

/* =====================================================
   RENDER: NAV + HERO
===================================================== */
function renderNavAndHero(info) {
  document.title = `${info.name || "Portfolio"} — ${info.title || ""}`;

  // Nav action icons
  const navActions = document.getElementById("navActions");
  const navItems = [];
  if (info.resume_url) navItems.push(`<a class="iconbtn" href="${info.resume_url}" download title="Download Resume">${icon("resume")}</a>`);
  if (info.github) navItems.push(`<a class="iconbtn" href="${info.github}" target="_blank" rel="noopener" title="GitHub">${icon("github")}</a>`);
  if (info.linkedin) navItems.push(`<a class="iconbtn" href="${info.linkedin}" target="_blank" rel="noopener" title="LinkedIn">${icon("linkedin")}</a>`);
  if (info.email) navItems.push(`<a class="iconbtn" href="mailto:${info.email}" title="Email">${icon("mail")}</a>`);
  navActions.innerHTML = navItems.join("");

  document.getElementById("heroName").textContent = info.name || "";
  document.getElementById("heroTagline").textContent = info.tagline || "";

  const photo = document.getElementById("profilePhoto");
  if (info.profile_photo_url) {
    photo.src = info.profile_photo_url;
    photo.onerror = () => { photo.closest(".hero__photo-ring").style.display = "none"; };
  } else {
    photo.closest(".hero__photo-ring").style.display = "none";
  }

  const video = document.getElementById("introVideo");
  const videoSection = document.getElementById("intro");
  if (info.intro_video_url) {
    video.src = info.intro_video_url;
  } else {
    videoSection.style.display = "none";
  }

  // quicklinks near photo
  const quick = document.getElementById("heroQuicklinks");
  const quickItems = [];
  if (info.linkedin) quickItems.push(`<a class="iconbtn" href="${info.linkedin}" target="_blank" rel="noopener" title="LinkedIn">${icon("linkedin")}</a>`);
  if (info.github) quickItems.push(`<a class="iconbtn" href="${info.github}" target="_blank" rel="noopener" title="GitHub">${icon("github")}</a>`);
  if (info.resume_url) quickItems.push(`<a class="iconbtn" href="${info.resume_url}" download title="Download Resume">${icon("resume")}</a>`);
  if (info.email) quickItems.push(`<a class="iconbtn" href="mailto:${info.email}" title="Email">${icon("mail")}</a>`);
  quick.innerHTML = quickItems.join("");

  // small text row under CTA
  const social = document.getElementById("heroSocial");
  const socialItems = [];
  if (info.phone) socialItems.push(`<span>${icon("phone")} ${info.phone}</span>`);
  if (info.location) socialItems.push(`<span>${icon("location")} ${info.location}</span>`);
  social.innerHTML = socialItems.map(s => `<span style="display:flex;align-items:center;gap:6px;">${s.replace(/^<span>|<\/span>$/g,"")}</span>`).join("");
}

function renderStats(data) {
  const skillCount = Object.values(data.skills || {}).reduce((sum, arr) => sum + arr.length, 0);
  const stats = [
    { value: (data.projects || []).length, label: "Projects Built" },
    { value: Object.keys(data.skills || {}).length, label: "Skill Domains" },
    { value: skillCount, label: "Tracked Skills" },
    { value: (data.work_experience || []).length, label: "Professional Roles" }
  ];
  document.getElementById("heroStats").innerHTML = stats.map(s => `
    <div class="stat reveal">
      <div class="stat__value">${s.value}</div>
      <div class="stat__label">${s.label}</div>
    </div>
  `).join("");
}

/* =====================================================
   RENDER: ABOUT
===================================================== */
function renderAbout(data) {
  document.getElementById("aboutObjective").textContent = data.career_objective || "";
  document.getElementById("aboutSummary").textContent = data.professional_summary || "";
}

/* =====================================================
   RENDER: CORE COMPETENCY RINGS
===================================================== */
function renderRings(skills) {
  const all = Object.values(skills || {}).flat();
  const top = [...all].sort((a,b) => b.level - a.level).slice(0, 5);
  const wrap = document.getElementById("coreRings");
  const R = 34, C = 2 * Math.PI * R;

  wrap.innerHTML = top.map(item => {
    const offset = C - (item.level / 100) * C;
    return `
      <div class="ring reveal">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="${R}" fill="none" stroke="var(--surface-2)" stroke-width="8"/>
          <circle cx="44" cy="44" r="${R}" fill="none" stroke="url(#ringGrad)" stroke-width="8"
                  stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"
                  data-offset="${offset}" class="ring__progress"/>
          <text x="44" y="49" text-anchor="middle" class="ring__pct">${item.level}%</text>
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7C6FF0"/>
              <stop offset="100%" stop-color="#45D9C8"/>
            </linearGradient>
          </defs>
        </svg>
        <span class="ring__label">${item.name}</span>
      </div>
    `;
  }).join("");
}

function animateRings() {
  document.querySelectorAll(".ring__progress").forEach(circle => {
    const offset = circle.dataset.offset;
    requestAnimationFrame(() => {
      circle.style.transition = "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)";
      circle.style.strokeDashoffset = offset;
    });
  });
}

/* =====================================================
   RENDER: SKILLS TABS + BARS
===================================================== */
function labelize(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function renderSkills(skills) {
  const tabsEl = document.getElementById("skillTabs");
  const panelsEl = document.getElementById("skillPanels");
  const keys = Object.keys(skills || {});
  if (!keys.length) return;

  tabsEl.innerHTML = keys.map((k, i) =>
    `<button class="skill-tab${i === 0 ? " active" : ""}" data-key="${k}">${labelize(k)}</button>`
  ).join("");

  panelsEl.innerHTML = keys.map((k, i) => `
    <div class="skill-panel${i === 0 ? " active" : ""}" data-panel="${k}">
      ${skills[k].map(item => `
        <div class="skillbar">
          <div class="skillbar__label"><span>${item.name}</span><span>${item.level}%</span></div>
          <div class="skillbar__track"><div class="skillbar__fill" data-level="${item.level}"></div></div>
        </div>
      `).join("")}
    </div>
  `).join("");

  tabsEl.querySelectorAll(".skill-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      tabsEl.querySelectorAll(".skill-tab").forEach(t => t.classList.remove("active"));
      panelsEl.querySelectorAll(".skill-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = panelsEl.querySelector(`[data-panel="${tab.dataset.key}"]`);
      panel.classList.add("active");
      animateBarsIn(panel);
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBarsIn(panelsEl.querySelector(".skill-panel.active"));
        animateRings();
        io.disconnect();
      }
    });
  }, { threshold: 0.25 });
  io.observe(panelsEl);
}

function animateBarsIn(panel) {
  if (!panel) return;
  panel.querySelectorAll(".skillbar__fill").forEach(fill => {
    const level = fill.dataset.level;
    requestAnimationFrame(() => { fill.style.width = level + "%"; });
  });
}

function renderTools(software) {
  const grid = document.getElementById("toolsGrid");
  const entries = Object.entries(software || {});
  grid.innerHTML = entries.map(([cat, tools]) => `
    <div class="tool-card reveal">
      <div class="tool-card__title">${cat}</div>
      <div class="tool-card__list">${tools.join(" · ")}</div>
    </div>
  `).join("");
}

/* =====================================================
   RENDER: TIMELINES
===================================================== */
function renderExperience(jobs) {
  const el = document.getElementById("experienceTimeline");
  el.innerHTML = (jobs || []).map(job => `
    <div class="tl-entry reveal">
      <div class="tl-entry__rail"><div class="tl-entry__dot"></div><div class="tl-entry__line"></div></div>
      <div class="tl-entry__card">
        <div class="tl-entry__top">
          <span class="tl-entry__role">${job.role}</span>
          <span class="tl-entry__company">${job.company}${job.location ? " · " + job.location : ""}</span>
          <span class="tl-entry__time">${job.duration}</span>
        </div>
        <ul>${(job.responsibilities || []).map(r => `<li>${r}</li>`).join("")}</ul>
      </div>
    </div>
  `).join("");
}

function renderEducation(edu) {
  const el = document.getElementById("educationTimeline");
  el.innerHTML = (edu || []).map(e => `
    <div class="tl-entry reveal">
      <div class="tl-entry__rail"><div class="tl-entry__dot"></div><div class="tl-entry__line"></div></div>
      <div class="tl-entry__card">
        <div class="tl-entry__top">
          <span class="tl-entry__role">${e.degree}</span>
          <span class="tl-entry__time">${e.duration}</span>
        </div>
        <span class="tl-entry__company">${e.institution}</span>
      </div>
    </div>
  `).join("");
}

/* =====================================================
   RENDER: PROJECTS
===================================================== */
function renderProjects(projects) {
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = (projects || []).map(p => `
    <div class="project-card reveal">
      <div class="project-card__top">
        <span class="project-card__name">${p.name}</span>
        <span class="status-pill status-pill--${p.status === 'running' ? 'running' : 'completed'}">
          ${p.status === 'running' ? 'Live' : 'Completed'}
        </span>
      </div>
      <p class="project-card__desc">${p.description || ""}</p>
      ${p.highlights && p.highlights.length ? `<ul class="project-card__list">${p.highlights.map(h => `<li>${h}</li>`).join("")}</ul>` : ""}
      ${p.tech_stack && p.tech_stack.length ? `<div class="project-card__stack">${p.tech_stack.map(t => `<span class="chip">${t}</span>`).join("")}</div>` : ""}
      ${p.link ? `<a class="project-card__link" href="${p.link}" target="_blank" rel="noopener">View project →</a>` : ""}
    </div>
  `).join("");
}

/* =====================================================
   FOOTER
===================================================== */
function renderFooter(info) {
  document.getElementById("footerName").textContent = info.name || "";

  const el = document.getElementById("footerLinks");
  const items = [];
  if (info.email) items.push(`<a href="mailto:${info.email}">${icon("mail")} ${info.email}</a>`);
  if (info.phone) items.push(`<span>${icon("phone")} ${info.phone}</span>`);
  if (info.linkedin) items.push(`<a href="${info.linkedin}" target="_blank" rel="noopener">${icon("linkedin")} LinkedIn</a>`);
  if (info.github) items.push(`<a href="${info.github}" target="_blank" rel="noopener">${icon("github")} GitHub</a>`);
  el.innerHTML = items.join("");

  document.getElementById("footerCopy").textContent =
    `© ${new Date().getFullYear()} ${info.name || ""}. All rights reserved.`;
}

/* =====================================================
   SCROLL REVEALS
===================================================== */
function initReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

/* =====================================================
   INIT
===================================================== */
(async function init() {
  renderMesh();

  const { data } = await loadData();
  const info = data.personal_info || {};

  renderNavAndHero(info);
  renderStats(data);
  renderAbout(data);
  renderRings(data.skills);
  renderSkills(data.skills);
  renderTools(data.software_proficiency);
  renderExperience(data.work_experience);
  renderProjects(data.projects);
  renderEducation(data.education);
  renderFooter(info);

  initReveals();
})();
