import React from "react";
import styles from "../../styles/ButtonIcon.module.css";

export default function ButtonIcon({ titulo, IconComponent }) {
  return (
    <div className={`${styles.cardButton} card border-0 shadow-lg`} 
         style={{maxWidth: '200px', cursor: 'pointer', transition: 'transform 0.3s ease'}}>
      <div className="card-body d-flex flex-column align-items-center justify-content-between text-center p-4">
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          {IconComponent && (
            <IconComponent 
              className={`${styles.icon}`} 
              style={{width: '80px', height: '80px', flexShrink: 0}}
            />
          )}
        </div>
        <span className={`${styles.title} card-title h6 mb-3`}>{titulo}</span>
      </div>
    </div>
  );
}
