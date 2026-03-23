import React from 'react';
import styles from './AnimatedBackground.module.scss';

export function AnimatedBackground() {
  return (
    <div className={styles.container}>
      <div className={styles.gradientBg}></div>
      <div className={styles.blobs}>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
      </div>
    </div>
  );
}