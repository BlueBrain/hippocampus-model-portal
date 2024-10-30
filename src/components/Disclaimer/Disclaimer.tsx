import React from "react";

import styles from "./disclaimer.module.css";
import { useSessionStorageState } from "@/hooks/session-storage-state";

export function Disclaimer() {
  const [show, setShow] = useSessionStorageState(true, "Show disclaimer");
  if (show === false) return null;

  return (
    <div className={styles.main}>
      <div>
        <header>
          <div>Disclaimer</div>
          <button onClick={() => setShow(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>window-close</title>
              <path
                fill="currentColor"
                d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"
              />
            </svg>
          </button>
        </header>
        <p>
          We are currently updating and improving this section. Please note that
          some information may be subject to change. We are working to ensure
          all data is up-to-date, and we appreciate your patience and
          understanding.
        </p>
      </div>
    </div>
  );
}
