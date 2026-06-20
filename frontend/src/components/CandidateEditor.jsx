import { useState, useEffect } from "react";

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

function ScoreInput({ label, value, onChange, icon }) {
	return (
		<label>
			{icon} {label}
			<input
				type="number"
				min="0"
				max="100"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</label>
	);
}

export function CandidateEditor({
	candidate,
	onSave,
	onDelete,
	saving,
	error,
	notice,
}) {
	const [form, setForm] = useState(emptyForm);

	useEffect(() => {
		if (candidate) {
			setForm({
				name: candidate.name || "",
				email: candidate.email || "",
				status: candidate.status || "Applied",
				technicalScore: candidate.technicalScore ?? 0,
				communicationScore: candidate.communicationScore ?? 0,
				reliabilityScore: candidate.reliabilityScore ?? 0,
				notes: candidate.notes || "",
			});
		} else {
			setForm(emptyForm);
		}
	}, [candidate]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = {
			...form,
			technicalScore: Number(form.technicalScore),
			communicationScore: Number(form.communicationScore),
			reliabilityScore: Number(form.reliabilityScore),
		};
		onSave(payload);
	};

	return (
		<section className="editor" aria-label="Candidate editor">
			<div className="editor-head">
				<div>
					<h2>{candidate ? "✏️ Candidate Details" : "➕ New Candidate"}</h2>
					<p className="muted">Manage status, interview notes, and scoring.</p>
				</div>
				{candidate && (
					<button
						type="button"
						className="danger"
						onClick={onDelete}
						disabled={saving}
					>
						🗑️ Delete
					</button>
				)}
			</div>

			{notice && <p className="success">{notice}</p>}
			{error && <p className="alert">{error}</p>}

			<form onSubmit={handleSubmit} className="candidate-form">
				<div className="grid-two">
					<label>
						👤 Name
						<input
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							required
							placeholder="Full name"
						/>
					</label>
					<label>
						📧 Email
						<input
							type="email"
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
							required
							placeholder="email@company.com"
						/>
					</label>
				</div>

				<label>
					📌 Status
					<select
						value={form.status}
						onChange={(e) => setForm({ ...form, status: e.target.value })}
					>
						{STATUSES.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</label>

				<div className="score-grid">
					<ScoreInput
						label="Technical Skills"
						value={form.technicalScore}
						onChange={(v) => setForm({ ...form, technicalScore: v })}
						icon="💻"
					/>
					<ScoreInput
						label="Communication"
						value={form.communicationScore}
						onChange={(v) => setForm({ ...form, communicationScore: v })}
						icon="💬"
					/>
					<ScoreInput
						label="Reliability"
						value={form.reliabilityScore}
						onChange={(v) => setForm({ ...form, reliabilityScore: v })}
						icon="🛡️"
					/>
				</div>

				<label>
					📝 Interview Notes
					<textarea
						value={form.notes}
						onChange={(e) => setForm({ ...form, notes: e.target.value })}
						rows="4"
						placeholder="Add interview notes here..."
					/>
				</label>

				<div className="form-actions">
					<button type="submit" disabled={saving}>
						{saving
							? "⏳ Saving..."
							: candidate
								? "💾 Save Changes"
								: "✨ Create Candidate"}
					</button>
					<button
						type="button"
						className="secondary"
						onClick={() => setForm(emptyForm)}
					>
						🔄 Clear
					</button>
				</div>
			</form>
		</section>
	);
}
