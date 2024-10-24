import styles from "./legend.module.css";

export function Legend({
  values,
}: {
  values:
    | Array<{ label: string; color: string }>
    | {
        labelMin: string;
        labelMax: string;
        colorRamp: string[];
      };
}) {
  return (
    <div className={styles.legend}>
      {Array.isArray(values) && (
        <div className={styles.discrete}>
          {values.map(({ label, color }) => (
            <div key={label}>
              <div style={{ background: color }} />
              <div>{label}</div>
            </div>
          ))}
        </div>
      )}
      {!Array.isArray(values) && (
        <div className={styles.continue}>
          <div>{values.labelMin}</div>
          <div
            className={styles.colorramp}
            style={{
              background: `linear-gradient(to right,${values.colorRamp.join(
                ","
              )})`,
            }}
          ></div>
          <div>{values.labelMax}</div>
        </div>
      )}
    </div>
  );
}
