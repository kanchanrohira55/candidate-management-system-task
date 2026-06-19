import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUSES = [
  "Applied",
  "Shortlisted",
  "Interviewed",
  "Selected",
  "Rejected",
];

const emptyForm = {
  name: "",
  email: "",
  status: "Applied",
  technicalScore: 0,
  communicationScore: 0,
  reliabilityScore: 0,
  notes: "",
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("fs_token") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("fs_email") || "");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [candidates, setCandidates] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedId),
    [candidates, selectedId],
  );

  useEffect(() => {
    if (token) {
      void loadData(token);
    }
  }, [token]);

  useEffect(() => {
    if (selectedCandidate) {
      setForm({
        name: selectedCandidate.name || "",
        email: selectedCandidate.email || "",
        status: selectedCandidate.status || "Applied",
        technicalScore: selectedCandidate.technicalScore ?? 0,
        communicationScore: selectedCandidate.communicationScore ?? 0,
        reliabilityScore: selectedCandidate.reliabilityScore ?? 0,
        notes: selectedCandidate.notes || "",
      });
    }
  }, [selectedCandidate]);

  const apiFetch = async (path, options = {}, activeToken = token) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  };

  const loadData = async (activeToken = token) => {
    setLoading(true);
    setError("");

    try {
      const [candidateData, dashboardData] = await Promise.all([
        apiFetch("/candidates", {}, activeToken),
        apiFetch("/candidates/dashboard", {}, activeToken),
      ]);

      setCandidates(candidateData);
      setDashboard(dashboardData);

      if (!selectedId && candidateData.length > 0) {
        setSelectedId(candidateData[0].id);
      }
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoadingAuth(true);
    setAuthError("");

    try {
      const data = await apiFetch(`/auth/${authMode}`, {
        method: "POST",
        body: JSON.stringify(authForm),
      }, "");

      localStorage.setItem("fs_token", data.token);
      localStorage.setItem("fs_email", data.email);
      setToken(data.token);
      setUserEmail(data.email);
      setAuthForm({ email: "", password: "" });
    } catch (authRequestError) {
      setAuthError(authRequestError.message);
    } finally {
      setLoadingAuth(false);
    }
  };

  const startNewCandidate = () => {
    setSelectedId("");
    setForm(emptyForm);
    setError("");
    setNotice("");
  };

  const saveCandidate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...form,
      technicalScore: Number(form.technicalScore),
      communicationScore: Number(form.communicationScore),
      reliabilityScore: Number(form.reliabilityScore),
    };

    try {
      const saved = selectedId
        ? await apiFetch(`/candidates/${selectedId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          })
        : await apiFetch("/candidates", {
            method: "POST",
            body: JSON.stringify(payload),
          });

      setSelectedId(saved.id);
      setNotice(selectedId ? "Candidate updated" : "Candidate created");
      await loadData();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCandidate = async () => {
    if (!selectedId) {
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await apiFetch(`/candidates/${selectedId}`, { method: "DELETE" });
      setSelectedId("");
      setForm(emptyForm);
      setNotice("Candidate deleted");
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("fs_token");
    localStorage.removeItem("fs_email");
    setToken("");
    setUserEmail("");
    setCandidates([]);
    setDashboard(null);
    setSelectedId("");
    setForm(emptyForm);
  };

  if (!token) {
    return (
      <main className="auth-shell">
        <section className="auth-panel" aria-labelledby="auth-title">
          <div>
            <p className="eyebrow">Fresh Shifts</p>
            <h1 id="auth-title">Candidate Management</h1>
            <p className="muted">Sign in or create a local assessment account.</p>
          </div>

          <form onSubmit={handleAuth} className="form-stack">
            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(event) =>
                  setAuthForm({ ...authForm, email: event.target.value })
                }
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={authForm.password}
                onChange={(event) =>
                  setAuthForm({ ...authForm, password: event.target.value })
                }
                required
              />
            </label>

            {authError ? <p className="alert">{authError}</p> : null}

            <button type="submit" disabled={loadingAuth}>
              {loadingAuth ? "Working..." : authMode === "login" ? "Login" : "Register"}
            </button>
          </form>

          <button
            type="button"
            className="link-button"
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");
              setAuthError("");
            }}
          >
            {authMode === "login"
              ? "Need account? Register"
              : "Already registered? Login"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Fresh Shifts</p>
          <h1>Candidate Management</h1>
        </div>
        <div className="user-tools">
          <span>{userEmail}</span>
          <button type="button" className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="metrics" aria-label="Dashboard metrics">
        <Metric label="Total" value={dashboard?.totalCandidates ?? 0} />
        <Metric label="Selected" value={dashboard?.selectedCandidates ?? 0} />
        <Metric label="Rejected" value={dashboard?.rejectedCandidates ?? 0} />
        <Metric label="Avg technical" value={dashboard?.avgScores?.technical ?? 0} />
      </section>

      <section className="workspace">
        <aside className="candidate-list" aria-label="Candidates">
          <div className="list-head">
            <h2>Candidates</h2>
            <button type="button" onClick={startNewCandidate}>
              New
            </button>
          </div>

          {loading ? <p className="muted">Loading candidates...</p> : null}

          <div className="list-items">
            {candidates.map((candidate) => (
              <button
                type="button"
                key={candidate.id}
                className={candidate.id === selectedId ? "candidate-row active" : "candidate-row"}
                onClick={() => setSelectedId(candidate.id)}
              >
                <span>
                  <strong>{candidate.name}</strong>
                  <small>{candidate.email}</small>
                </span>
                <StatusPill status={candidate.status} />
              </button>
            ))}
          </div>
        </aside>

        <section className="editor" aria-label="Candidate editor">
          <div className="editor-head">
            <div>
              <h2>{selectedId ? "Candidate Details" : "Create Candidate"}</h2>
              <p className="muted">
                Manage status, interview notes, and scoring.
              </p>
            </div>
            {selectedId ? (
              <button
                type="button"
                className="danger"
                onClick={deleteCandidate}
                disabled={saving}
              >
                Delete
              </button>
            ) : null}
          </div>

          {notice ? <p className="success">{notice}</p> : null}
          {error ? <p className="alert">{error}</p> : null}

          <form onSubmit={saveCandidate} className="candidate-form">
            <div className="grid-two">
              <label>
                Name
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                />
              </label>
            </div>

            <label>
              Status
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <div className="score-grid">
              <ScoreInput
                label="Technical Skills"
                value={form.technicalScore}
                onChange={(value) => setForm({ ...form, technicalScore: value })}
              />
              <ScoreInput
                label="Communication Skills"
                value={form.communicationScore}
                onChange={(value) => setForm({ ...form, communicationScore: value })}
              />
              <ScoreInput
                label="Reliability"
                value={form.reliabilityScore}
                onChange={(value) => setForm({ ...form, reliabilityScore: value })}
              />
            </div>

            <label>
              Interview Notes
              <textarea
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                rows="6"
              />
            </label>

            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : selectedId ? "Save Changes" : "Create Candidate"}
              </button>
              <button type="button" className="secondary" onClick={startNewCandidate}>
                Clear
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function StatusPill({ status }) {
  return <em className={`status ${status.toLowerCase()}`}>{status}</em>;
}

function ScoreInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input
        type="number"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

createRoot(document.getElementById("root")).render(<App />);
