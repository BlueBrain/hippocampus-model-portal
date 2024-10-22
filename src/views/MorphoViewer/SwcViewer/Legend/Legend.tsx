import styles from "./legend.module.css";

export function Legend({
  values,
}: {
  values: Array<{ label: string; color: string }>;
}) {
  return (
    <div className={styles.legend}>
      <div>
        {values.map(({ label, color }) => (
          <div key={label}>
            <div style={{ background: color }} />
            <div>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
