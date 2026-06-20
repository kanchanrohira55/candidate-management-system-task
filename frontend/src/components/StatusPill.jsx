export function StatusPill({ status }) {
  return (
    <em className={`status ${status.toLowerCase()}`}>
      {status}
    </em>
  );
}
