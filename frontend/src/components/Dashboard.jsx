function Metric({ label, value, icon, iconClass }) {
	return (
		<article className="metric">
			<div className={`metric-icon ${iconClass}`}>{icon}</div>
			<div className="metric-content">
				<span>{label}</span>
				<strong>{value}</strong>
			</div>
		</article>
	);
}

export function Dashboard({ data }) {
	return (
		<section className="metrics" aria-label="Dashboard metrics">
			<Metric
				label="Total Candidates"
				value={data?.totalCandidates ?? 0}
				icon="👥"
				iconClass="blue"
			/>
			<Metric
				label="Selected"
				value={data?.selectedCandidates ?? 0}
				icon="✅"
				iconClass="green"
			/>
			<Metric
				label="Rejected"
				value={data?.rejectedCandidates ?? 0}
				icon="❌"
				iconClass="red"
			/>
			<Metric
				label="Avg Technical"
				value={data?.avgScores?.technical ?? 0}
				icon="📊"
				iconClass="purple"
			/>
		</section>
	);
}
