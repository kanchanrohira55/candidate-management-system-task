import { useState, useEffect, useMemo } from "react";
import { Dashboard } from "../components/Dashboard";
import { CandidateList } from "../components/CandidateList";
import { CandidateEditor } from "../components/CandidateEditor";
import { useCandidates } from "../hooks/useCandidates";

export function HomePage({ token, userEmail, onLogout }) {
	const {
		candidates,
		dashboard,
		loading,
		error,
		setError,
		loadData,
		createCandidate,
		updateCandidate,
		deleteCandidate,
	} = useCandidates(token);

	const [selectedId, setSelectedId] = useState("");
	const [notice, setNotice] = useState("");
	const [saving, setSaving] = useState(false);
	const [editorError, setEditorError] = useState("");

	useEffect(() => {
		loadData();
	}, [loadData]);

	useEffect(() => {
		if (!selectedId && candidates.length > 0) {
			setSelectedId(candidates[0].id);
		}
	}, [candidates]);

	const selectedCandidate = useMemo(
		() => candidates.find((c) => c.id === selectedId) || null,
		[candidates, selectedId],
	);

	const handleSave = async (payload) => {
		setSaving(true);
		setEditorError("");
		setNotice("");
		try {
			if (selectedId) {
				await updateCandidate(selectedId, payload);
				setNotice("✅ Candidate updated");
			} else {
				const saved = await createCandidate(payload);
				setSelectedId(saved.id);
				setNotice("✅ Candidate created");
			}
		} catch (err) {
			setEditorError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		setSaving(true);
		setEditorError("");
		setNotice("");
		try {
			await deleteCandidate(selectedId);
			setSelectedId("");
			setNotice("🗑️ Candidate deleted");
		} catch (err) {
			setEditorError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const handleNew = () => {
		setSelectedId("");
		setNotice("");
		setEditorError("");
	};

	return (
		<main className="app-shell">
			<header className="topbar">
				<div className="topbar-left">
					<div className="topbar-logo-icon">FS</div>
					<div>
						<h1>Fresh Shifts</h1>
						<p className="eyebrow">Candidate Management</p>
					</div>
				</div>
				<div className="user-tools">
					<span>👤 {userEmail}</span>
					<button type="button" className="secondary" onClick={onLogout}>
						🚪 Logout
					</button>
				</div>
			</header>

			<Dashboard data={dashboard} />

			<section className="workspace">
				<CandidateList
					candidates={candidates}
					selectedId={selectedId}
					loading={loading}
					onSelect={(id) => {
						setSelectedId(id);
						setNotice("");
						setEditorError("");
					}}
					onNew={handleNew}
				/>
				<CandidateEditor
					candidate={selectedCandidate}
					onSave={handleSave}
					onDelete={handleDelete}
					saving={saving}
					error={editorError}
					notice={notice}
				/>
			</section>
		</main>
	);
}
