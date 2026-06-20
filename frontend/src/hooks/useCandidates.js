import { useState, useCallback } from "react";
import { apiFetch } from "../utils/api";

export function useCandidates(token) {
  const [candidates, setCandidates] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [candidateData, dashboardData] = await Promise.all([
        apiFetch("/candidates", {}, token),
        apiFetch("/candidates/dashboard", {}, token),
      ]);
      setCandidates(candidateData);
      setDashboard(dashboardData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createCandidate = async (payload) => {
    const saved = await apiFetch("/candidates", {
      method: "POST",
      body: JSON.stringify(payload),
    }, token);
    await loadData();
    return saved;
  };

  const updateCandidate = async (id, payload) => {
    const saved = await apiFetch(`/candidates/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }, token);
    await loadData();
    return saved;
  };

  const deleteCandidate = async (id) => {
    await apiFetch(`/candidates/${id}`, { method: "DELETE" }, token);
    await loadData();
  };

  return {
    candidates,
    dashboard,
    loading,
    error,
    setError,
    loadData,
    createCandidate,
    updateCandidate,
    deleteCandidate,
  };
}
