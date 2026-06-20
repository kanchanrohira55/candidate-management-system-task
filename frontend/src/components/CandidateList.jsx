import { StatusPill } from "./StatusPill";

export function CandidateList({
	candidates,
	selectedId,
	loading,
	onSelect,
	onNew,
}) {
	return (
		<aside className="candidate-list" aria-label="Candidates">
			<div className="list-head">
				<h2>📋 Candidates</h2>
				<button type="button" onClick={onNew} title="Add new candidate">
					+
				</button>
			</div>

			{loading && (
				<p className="muted" style={{ padding: "12px 16px" }}>
					⏳ Loading...
				</p>
			)}

			<div className="list-items">
				{candidates.map((c) => (
					<button
						type="button"
						key={c.id}
						className={
							c.id === selectedId ? "candidate-row active" : "candidate-row"
						}
						onClick={() => onSelect(c.id)}
					>
						<span className="info">
							<strong>{c.name}</strong>
							<small>{c.email}</small>
						</span>
						<StatusPill status={c.status} />
					</button>
				))}

				{!loading && candidates.length === 0 && (
					<p
						className="muted"
						style={{ padding: "12px 16px", fontSize: "13px" }}
					>
						📭 No candidates yet. Add one!
					</p>
				)}
			</div>
		</aside>
	);
}
