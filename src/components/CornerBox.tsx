interface CornerBoxProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
  thickness?: number;
  color?: string;
  padding?: string;
}

export default function CornerBox({
  children,
  className = '',
  size = 8,
  thickness = 1,
  color = 'rgba(255,255,255,0.2)',
  padding = 'p-3',
}: CornerBoxProps) {
  const corner = `${size}px`;
  const t = `${thickness}px`;
  const shared: React.CSSProperties = { position: 'absolute', width: corner, height: corner };
  const b = `${t} solid ${color}`;

  return (
    <div
      className={`relative inline-block ${padding} ${className}`}
      style={{ background: 'rgba(0,0,0,0.75)' }}
    >
      <span style={{ ...shared, top: 0, left: 0, borderTop: b, borderLeft: b }} />
      <span style={{ ...shared, top: 0, right: 0, borderTop: b, borderRight: b }} />
      <span style={{ ...shared, bottom: 0, left: 0, borderBottom: b, borderLeft: b }} />
      <span style={{ ...shared, bottom: 0, right: 0, borderBottom: b, borderRight: b }} />
      {children}
    </div>
  );
}
