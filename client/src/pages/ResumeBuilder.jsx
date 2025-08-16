import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Sidebar from "../components/Sidebar";

/* =================== Inline CSS (scoped) =================== */
const styles = `
:root{
  --bg:#f5f7fb;
  --card:#ffffff;
  --ink:#0f172a;
  --muted:#64748b;
  --border:#e5e9f2;
  --accent:#2563eb;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;background:var(--bg);color:var(--ink)}
a{color:var(--accent);text-decoration:none}
.rb-wrap{min-height:100vh;padding:24px}
.rb-grid{display:grid;grid-template-columns:minmax(320px,520px) 1fr;gap:24px}
@media(max-width:1100px){.rb-grid{grid-template-columns:1fr}}
.rb-card{background:var(--card);border:1px solid var(--border);border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.rb-pane{padding:18px}
.rb-title{margin:0 0 12px;font-size:22px;font-weight:800}
.rb-sub{margin:4px 0 14px;color:var(--muted);font-size:13px}
.rb-row{display:flex;gap:10px;flex-wrap:wrap}
.rb-input,.rb-select,.rb-textarea{width:100%;border:1px solid var(--border);border-radius:10px;background:#fff;padding:10px 12px;font-size:14px;color:var(--ink)}
.rb-textarea{min-height:90px;resize:vertical}
.rb-chip{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);padding:6px 10px;border-radius:999px;font-size:12px;margin:4px 6px 0 0;background:#fff}
.rb-chip button{border:0;background:transparent;cursor:pointer;color:#ef4444}
.rb-btn{border:1px solid var(--border);background:#fff;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}
.rb-btn:hover{background:#f8fafc}
.rb-btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.rb-btn.ghost{background:transparent}
.rb-toolbar{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0 14px}
.rb-section-h{margin:16px 0 8px;padding-bottom:6px;border-bottom:1px solid var(--border);font-weight:800;letter-spacing:.2px}
.rb-item{border:1px dashed var(--border);border-radius:12px;padding:12px;margin:10px 0;background:#fff}
.rb-item-actions{display:flex;gap:8px;justify-content:flex-end}
.rb-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:560px){.rb-two{grid-template-columns:1fr}}
/* Preview */
.preview-wrap{position:sticky;top:24px;padding:18px}
.preview-sheet{width:100%;max-width:794px; /* A4 width at 96dpi ~ 794px / margin:auto;background:#fff;border:1px solid var(--border);border-radius:14px;min-height:1123px; / A4 height ~ 1123px */padding:36px}
.preview-dark{background:#0b1222;color:#e5e7eb;border-color:#0b1020}
.preview-h1{margin:0;font-size:28px;font-weight:900;letter-spacing:.2px}
.preview-role{margin:2px 0 0;color:var(--muted);font-weight:700}
.preview-meta{margin:6px 0 0;color:var(--muted);font-size:13px}
.preview-divider{height:1px;background:var(--border);margin:14px 0}
.preview-h2{margin:16px 0 8px;font-size:16px;font-weight:900;letter-spacing:.2px}
.preview-item{margin:8px 0}
.preview-item .title{font-weight:800}
.preview-item .dates{font-size:12px;color:var(--muted)}
.preview-skill{display:inline-block;margin:4px 6px 0 0;padding:6px 10px;border:1px solid var(--border);border-radius:999px;font-size:12px}
.preview-header{display:flex;gap:16px;align-items:center}
.preview-photo{width:96px;height:96px;border-radius:50%;overflow:hidden;border:1px solid var(--border)}
/* Theme toggles */
.toggle{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);border-radius:999px;padding:6px 10px}
.color-swatch{width:20px;height:20px;border-radius:6px;border:1px solid var(--border);cursor:pointer}
.small{font-size:12px;color:var(--muted)}
/* Reorder buttons */
.order-btn{border:1px solid var(--border);background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer}
.order-btn:disabled{opacity:.4;cursor:not-allowed}
`;

/* =================== Helpers =================== */
const uid = () => Math.random().toString(36).slice(2, 9);

const emptyState = {
  personal: {
    name: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    photo: "",
  },
  experience: [],
  education: [],
  projects: [],
  languages: [],
  skills: [],
  sections: [], // user-defined additional sections
};

const LS_KEY = "rb_pro_v2";

/* =================== Main Component =================== */
export default function ResumeBuilderPro() {
  const [data, setData] = useState(() => {
    try {
      const v = localStorage.getItem(LS_KEY);
      return v ? JSON.parse(v) : emptyState;
    } catch {
      return emptyState;
    }
  });
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState("#2563eb");
  const [font, setFont] = useState(
    "Inter, system-ui, Segoe UI, Roboto, Arial, sans-serif"
  );
  const previewRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data]);

  // Personal updates
  const up = (k, v) =>
    setData((d) => ({ ...d, personal: { ...d.personal, [k]: v } }));

  // Generic list helpers (add, update, remove, move)
  const addItem = (listKey, item) =>
    setData((d) => ({ ...d, [listKey]: [...d[listKey], item] }));
  const updateItem = (listKey, id, patch) =>
    setData((d) => ({
      ...d,
      [listKey]: d[listKey].map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));
  const removeItem = (listKey, id) =>
    setData((d) => ({
      ...d,
      [listKey]: d[listKey].filter((x) => x.id !== id),
    }));
  const moveItem = (listKey, index, dir) =>
    setData((d) => {
      const arr = [...d[listKey]];
      const ni = index + dir;
      if (ni < 0 || ni >= arr.length) return d;
      [arr[index], arr[ni]] = [arr[ni], arr[index]];
      return { ...d, [listKey]: arr };
    });

  // Tag helpers for languages/skills
  const addTag = (key, value) =>
    setData((d) => ({
      ...d,
      [key]: [...new Set([...(d[key] || []), value].filter(Boolean))],
    }));
  const removeTag = (key, value) =>
    setData((d) => ({
      ...d,
      [key]: (d[key] || []).filter((t) => t !== value),
    }));

  // JSON import/export
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const uploadJSON = (file) => {
    const r = new FileReader();
    r.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        setData(parsed);
      } catch {
        alert("Invalid JSON");
      }
    };
    r.readAsText(file);
  };

  // Photo upload
  const onPhoto = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => up("photo", e.target.result);
    reader.readAsDataURL(file);
  };

  // Export PDF
  const exportPDF = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      backgroundColor: null,
    });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(img);
    const imgH = (imgProps.height * pageW) / imgProps.width;
    pdf.addImage(img, "PNG", 0, 0, pageW, imgH);
    pdf.save(`${data.personal.name || "resume"}.pdf`);
  };

  // For controlled accent color in CSS vars
  const dynamicVars = useMemo(() => ({ "--accent": accent }), [accent]);

  return (
    <div className="rb-wrap" style={dynamicVars}>
      <style>{styles}</style>

      <div className="rb-grid">
        {/* ================= Left: Editor ================= */}
        <div className="rb-card rb-pane">
          <h2 className="rb-title">Resume Builder Pro</h2>
          <p className="rb-sub">
            Fully customizable. Add, reorder, theme, and export to PDF.
          </p>

          {/* Toolbar */}
          <div className="rb-toolbar">
            <label className="toggle">
              <input
                type="checkbox"
                checked={dark}
                onChange={(e) => setDark(e.target.checked)}
              />
              <span>Dark preview</span>
            </label>

            <label className="toggle">
              <span className="small">Accent</span>
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                title="Pick accent"
                style={{
                  border: "0",
                  background: "transparent",
                  cursor: "pointer",
                }}
              />
              <span className="color-swatch" style={{ background: accent }} />
            </label>

            <label className="toggle" title="Font family">
              <span className="small">Font</span>
              <select
                className="rb-select"
                onChange={(e) => setFont(e.target.value)}
                defaultValue={font}
              >
                <option value="Inter, system-ui, Segoe UI, Roboto, Arial, sans-serif">
                  Inter / System
                </option>
                <option value="Arial, Helvetica, sans-serif">Arial</option>
                <option value='"Times New Roman", Times, serif'>
                  Times New Roman
                </option>
                <option value="Georgia, serif">Georgia</option>
                <option value='"Helvetica Neue", Helvetica, Arial, sans-serif'>
                  Helvetica
                </option>
                <option value='"IBM Plex Sans", Inter, Arial, sans-serif'>
                  IBM Plex Sans
                </option>
              </select>
            </label>

            <button className="rb-btn" onClick={downloadJSON}>
              Export JSON
            </button>
            <label className="rb-btn ghost" style={{ cursor: "pointer" }}>
              Import JSON
              <input
                type="file"
                accept="application/json"
                onChange={(e) => uploadJSON(e.target.files?.[0])}
                style={{ display: "none" }}
              />
            </label>
            <button
              className="rb-btn"
              onClick={() => {
                if (window.confirm("Clear all data?")) setData(emptyState);
              }}
            >
              Clear
            </button>
            <button className="rb-btn primary" onClick={exportPDF}>
              Export PDF
            </button>
          </div>

          {/* ========== Personal ========== */}
          <div className="rb-section-h">Personal</div>
          <div className="rb-two">
            <input
              className="rb-input"
              placeholder="Full name"
              value={data.personal.name}
              onChange={(e) => up("name", e.target.value)}
            />
            <input
              className="rb-input"
              placeholder="Headline (eg. Full Stack Developer)"
              value={data.personal.headline}
              onChange={(e) => up("headline", e.target.value)}
            />
          </div>
          <div className="rb-two" style={{ marginTop: 8 }}>
            <input
              className="rb-input"
              placeholder="Email"
              value={data.personal.email}
              onChange={(e) => up("email", e.target.value)}
            />
            <input
              className="rb-input"
              placeholder="Phone"
              value={data.personal.phone}
              onChange={(e) => up("phone", e.target.value)}
            />
          </div>
          <input
            className="rb-input"
            style={{ marginTop: 8 }}
            placeholder="Location"
            value={data.personal.location}
            onChange={(e) => up("location", e.target.value)}
          />
          <textarea
            className="rb-textarea"
            style={{ marginTop: 8 }}
            placeholder="Short professional summary"
            value={data.personal.summary}
            onChange={(e) => up("summary", e.target.value)}
          />
          <div className="rb-row" style={{ marginTop: 6 }}>
            <label className="rb-btn ghost" style={{ cursor: "pointer" }}>
              Upload Photo
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => onPhoto(e.target.files?.[0])}
              />
            </label>
            {data.personal.photo && (
              <button className="rb-btn" onClick={() => up("photo", "")}>
                Remove Photo
              </button>
            )}
          </div>

          {/* ========== Experience ========== */}
          <div className="rb-section-h">Experience</div>
          {data.experience.map((ex, idx) => (
            <div key={ex.id} className="rb-item">
              <div className="rb-two">
                <input
                  className="rb-input"
                  placeholder="Role"
                  value={ex.role}
                  onChange={(e) =>
                    updateItem("experience", ex.id, { role: e.target.value })
                  }
                />
                <input
                  className="rb-input"
                  placeholder="Company"
                  value={ex.company}
                  onChange={(e) =>
                    updateItem("experience", ex.id, { company: e.target.value })
                  }
                />
              </div>
              <div className="rb-two">
                <input
                  className="rb-input"
                  placeholder="From (e.g., 2023)"
                  value={ex.from}
                  onChange={(e) =>
                    updateItem("experience", ex.id, { from: e.target.value })
                  }
                />
                <input
                  className="rb-input"
                  placeholder="To (e.g., Present)"
                  value={ex.to}
                  onChange={(e) =>
                    updateItem("experience", ex.id, { to: e.target.value })
                  }
                />
              </div>
              <textarea
                className="rb-textarea"
                placeholder="What did you achieve?"
                value={ex.desc}
                onChange={(e) =>
                  updateItem("experience", ex.id, { desc: e.target.value })
                }
              />
              <div className="rb-item-actions">
                <button
                  className="order-btn"
                  onClick={() => moveItem("experience", idx, -1)}
                  disabled={idx === 0}
                >
                  ↑
                </button>
                <button
                  className="order-btn"
                  onClick={() => moveItem("experience", idx, +1)}
                  disabled={idx === data.experience.length - 1}
                >
                  ↓
                </button>
                <button
                  className="rb-btn"
                  onClick={() => removeItem("experience", ex.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            className="rb-btn"
            onClick={() =>
              addItem("experience", {
                id: uid(),
                role: "",
                company: "",
                from: "",
                to: "",
                desc: "",
              })
            }
          >
            + Add Experience
          </button>

          {/* ========== Education ========== */}
          <div className="rb-section-h">Education</div>
          {data.education.map((ed, idx) => (
            <div key={ed.id} className="rb-item">
              <div className="rb-two">
                <input
                  className="rb-input"
                  placeholder="Degree / Program"
                  value={ed.degree}
                  onChange={(e) =>
                    updateItem("education", ed.id, { degree: e.target.value })
                  }
                />
                <input
                  className="rb-input"
                  placeholder="School / University"
                  value={ed.school}
                  onChange={(e) =>
                    updateItem("education", ed.id, { school: e.target.value })
                  }
                />
              </div>
              <div className="rb-two">
                <input
                  className="rb-input"
                  placeholder="From"
                  value={ed.from}
                  onChange={(e) =>
                    updateItem("education", ed.id, { from: e.target.value })
                  }
                />
                <input
                  className="rb-input"
                  placeholder="To"
                  value={ed.to}
                  onChange={(e) =>
                    updateItem("education", ed.id, { to: e.target.value })
                  }
                />
              </div>
              <textarea
                className="rb-textarea"
                placeholder="Highlights / Coursework"
                value={ed.desc || ""}
                onChange={(e) =>
                  updateItem("education", ed.id, { desc: e.target.value })
                }
              />
              <div className="rb-item-actions">
                <button
                  className="order-btn"
                  onClick={() => moveItem("education", idx, -1)}
                  disabled={idx === 0}
                >
                  ↑
                </button>
                <button
                  className="order-btn"
                  onClick={() => moveItem("education", idx, +1)}
                  disabled={idx === data.education.length - 1}
                >
                  ↓
                </button>
                <button
                  className="rb-btn"
                  onClick={() => removeItem("education", ed.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            className="rb-btn"
            onClick={() =>
              addItem("education", {
                id: uid(),
                degree: "",
                school: "",
                from: "",
                to: "",
                desc: "",
              })
            }
          >
            + Add Education
          </button>

          {/* ========== Projects ========== */}
          <div className="rb-section-h">Projects</div>
          {data.projects.map((p, idx) => (
            <div key={p.id} className="rb-item">
              <div className="rb-two">
                <input
                  className="rb-input"
                  placeholder="Project title"
                  value={p.title}
                  onChange={(e) =>
                    updateItem("projects", p.id, { title: e.target.value })
                  }
                />
                <input
                  className="rb-input"
                  placeholder="Link / Repo (optional)"
                  value={p.link || ""}
                  onChange={(e) =>
                    updateItem("projects", p.id, { link: e.target.value })
                  }
                />
              </div>
              <textarea
                className="rb-textarea"
                placeholder="Summary / Stack / Impact"
                value={p.desc || ""}
                onChange={(e) =>
                  updateItem("projects", p.id, { desc: e.target.value })
                }
              />
              <div className="rb-item-actions">
                <button
                  className="order-btn"
                  onClick={() => moveItem("projects", idx, -1)}
                  disabled={idx === 0}
                >
                  ↑
                </button>
                <button
                  className="order-btn"
                  onClick={() => moveItem("projects", idx, +1)}
                  disabled={idx === data.projects.length - 1}
                >
                  ↓
                </button>
                <button
                  className="rb-btn"
                  onClick={() => removeItem("projects", p.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            className="rb-btn"
            onClick={() =>
              addItem("projects", { id: uid(), title: "", link: "", desc: "" })
            }
          >
            + Add Project
          </button>

          {/* ========== Languages (tags) ========== */}
          <div className="rb-section-h">Languages Known</div>
          <TagEditor
            placeholder="Add a language and press Enter"
            values={data.languages}
            onAdd={(v) => addTag("languages", v)}
            onRemove={(v) => removeTag("languages", v)}
          />

          {/* ========== Skills (tags) ========== */}
          <div className="rb-section-h">Skills</div>
          <TagEditor
            placeholder="Add a skill and press Enter"
            values={data.skills}
            onAdd={(v) => addTag("skills", v)}
            onRemove={(v) => removeTag("skills", v)}
          />

          {/* ========== Custom Sections ========== */}
          <div className="rb-section-h">Custom Sections</div>
          {data.sections.map((s, idx) => (
            <div key={s.id} className="rb-item">
              <input
                className="rb-input"
                placeholder="Section title (e.g., Certifications)"
                value={s.title}
                onChange={(e) =>
                  updateItem("sections", s.id, { title: e.target.value })
                }
              />
              <textarea
                className="rb-textarea"
                placeholder="Content"
                value={s.content || ""}
                onChange={(e) =>
                  updateItem("sections", s.id, { content: e.target.value })
                }
              />
              <div className="rb-item-actions">
                <button
                  className="order-btn"
                  onClick={() => moveItem("sections", idx, -1)}
                  disabled={idx === 0}
                >
                  ↑
                </button>
                <button
                  className="order-btn"
                  onClick={() => moveItem("sections", idx, +1)}
                  disabled={idx === data.sections.length - 1}
                >
                  ↓
                </button>
                <button
                  className="rb-btn"
                  onClick={() => removeItem("sections", s.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            className="rb-btn"
            onClick={() =>
              addItem("sections", { id: uid(), title: "", content: "" })
            }
          >
            + Add Custom Section
          </button>
        </div>

        {/* ================= Right: Preview ================= */}
        <div className="rb-card preview-wrap">
          <div
            ref={previewRef}
            className={`preview-sheet ${dark ? "preview-dark" : ""}`}
            style={{ "--border": "rgba(148,163,184,.35)", fontFamily: font }}
          >
            {/* Header */}
            <div className="preview-header">
              {data.personal.photo && (
                <div className="preview-photo">
                  <img
                    src={data.personal.photo}
                    alt="profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h1 className="preview-h1" style={{ color: "var(--accent)" }}>
                  {data.personal.name || "Your Name"}
                </h1>
                <div className="preview-role">
                  {data.personal.headline || "Title / Role"}
                </div>
                <div className="preview-meta">
                  {data.personal.email}
                  {data.personal.phone ? " · " + data.personal.phone : ""}
                  {data.personal.location ? " · " + data.personal.location : ""}
                </div>
              </div>
            </div>

            <div className="preview-divider" />

            {/* Summary */}
            {data.personal.summary && (
              <>
                <h2 className="preview-h2" style={{ color: "var(--accent)" }}>
                  Summary
                </h2>
                <p style={{ marginTop: 6 }}>{data.personal.summary}</p>
              </>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
              <>
                <h2 className="preview-h2" style={{ color: "var(--accent)" }}>
                  Experience
                </h2>
                {data.experience.map((ex) => (
                  <div key={ex.id} className="preview-item">
                    <div className="title">
                      {ex.role || "Role"}
                      {ex.company ? ` — ${ex.company}` : ""}
                    </div>
                    <div className="dates">
                      {[ex.from, ex.to].filter(Boolean).join(" — ")}
                    </div>
                    {ex.desc && <div style={{ marginTop: 4 }}>{ex.desc}</div>}
                  </div>
                ))}
              </>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <>
                <h2 className="preview-h2" style={{ color: "var(--accent)" }}>
                  Education
                </h2>
                {data.education.map((ed) => (
                  <div key={ed.id} className="preview-item">
                    <div className="title">
                      {ed.degree || "Degree"}
                      {ed.school ? ` — ${ed.school}` : ""}
                    </div>
                    <div className="dates">
                      {[ed.from, ed.to].filter(Boolean).join(" — ")}
                    </div>
                    {ed.desc && <div style={{ marginTop: 4 }}>{ed.desc}</div>}
                  </div>
                ))}
              </>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <>
                <h2 className="preview-h2" style={{ color: "var(--accent)" }}>
                  Projects
                </h2>
                {data.projects.map((p) => (
                  <div key={p.id} className="preview-item">
                    <div className="title">
                      {p.title || "Project"}
                      {p.link ? (
                        <>
                          {" "}
                          -{" "}
                          <a href={p.link} target="_blank" rel="noreferrer">
                            {p.link}
                          </a>
                        </>
                      ) : null}
                    </div>
                    {p.desc && <div style={{ marginTop: 4 }}>{p.desc}</div>}
                  </div>
                ))}
              </>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <>
                <h2 className="preview-h2" style={{ color: "var(--accent)" }}>
                  Languages Known
                </h2>
                <div>
                  {data.languages.map((l, i) => (
                    <span className="preview-skill" key={`${l}-${i}`}>
                      {l}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
              <>
                <h2 className="preview-h2" style={{ color: "var(--accent)" }}>
                  Skills
                </h2>
                <div>
                  {data.skills.map((s, i) => (
                    <span className="preview-skill" key={`${s}-${i}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Custom Sections */}
            {data.sections.map((s) =>
              s.title || s.content ? (
                <div key={s.id}>
                  <h2 className="preview-h2" style={{ color: "var(--accent)" }}>
                    {s.title || "Section"}
                  </h2>
                  {s.content && (
                    <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>
                      {s.content}
                    </div>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== Tag Editor =================== */
function TagEditor({ values = [], onAdd, onRemove, placeholder }) {
  const [val, setVal] = useState("");
  return (
    <>
      <div className="rb-row" style={{ marginBottom: 6 }}>
        <input
          className="rb-input"
          value={val}
          placeholder={placeholder}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && val.trim()) {
              onAdd(val.trim());
              setVal("");
            }
          }}
        />
        <button
          className="rb-btn"
          onClick={() => {
            if (val.trim()) {
              onAdd(val.trim());
              setVal("");
            }
          }}
        >
          Add
        </button>
      </div>
      <div>
        {values.map((t, i) => (
          <span className="rb-chip" key={`${t}-${i}`}>
            {t}
            <button onClick={() => onRemove(t)} title="Remove">
              ×
            </button>
          </span>
        ))}
      </div>
    </>
  );
}
