import React from 'react';
import styles from '../styles/LoginForm.module.css';

export default function LoginForm() {
  return (
    <div className={styles.backgroundWrapper}>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.letras}>
            <h1 className={styles.title}>Biblioteca Arrupe</h1>
            <h2 className={styles.subtitle}>El poder de gestionar el conocimiento</h2>
          </div>
          <div className={styles.loginBox}>
            <h2>LOGIN</h2>
            <form>
              <label>Email</label>
              <input type="text" placeholder="Ingresa tu correo" className={styles.inputField} />
              <label>Contraseña</label>
              <input type="password" placeholder="Ingresa tu contraseña" className={styles.inputField} />
              <button type="submit" className={styles.btn}>Entrar</button>
              <a href="#" className={styles.forgotPassword}>¿Olvidaste tu contraseña?</a>
            </form>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.logo}>
            <img src="/images/logo_1000px.png" alt="Logo Colegio" />
          </div>
        </div>
      </div>
    </div>
  );
}
