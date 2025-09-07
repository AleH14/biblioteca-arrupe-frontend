import React from "react";
import styles from "../../styles/ButtonIcon.module.css";


export default function ButtonIcon({ titulo, IconComponent }) {
  return (
    <div className={styles.cardButton}>
        {IconComponent && <IconComponent className={styles.icon} />}
        <span className={styles.title}>{titulo}</span>
    </div>
  );
}
