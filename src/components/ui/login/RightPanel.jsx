'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../../../styles/LoginForm.module.css';

const RightPanel = React.memo(() => {
  return (
    <div className={styles.rightPanel}>
      <div className={styles.logo}>
        <Image
          src="/images/logo_1000px.png"
          alt="Logo Colegio"
          width={500}
          height={500}
          priority
          className={styles.logoImg}
        />
      </div>
    </div>
  );
});

RightPanel.displayName = 'RightPanel';

export default RightPanel;