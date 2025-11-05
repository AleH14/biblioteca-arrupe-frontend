'use client';

import React from 'react';
import styles from '@/styles/LoginForm.module.css';

const LoginContent = React.memo(({ 
  formData, 
  errors, 
  isSubmitting, 
  showAlert, 
  alertMessage, 
  alertType, 
  handleChange, 
  onSubmit, 
  setShowAlert 
}) => {  
  return (
    <div className={styles.loginBox}>
      <h2>LOGIN</h2>

      {showAlert && (
        <div
          className={`alert ${
            alertType === 'success' ? 'alert-success' : 'alert-danger'
          } alert-dismissible fade show`}
          role="alert"
        >
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAlert(false)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Ingresa tu correo"
          className={`${styles.inputField} ${errors.email ? 'is-invalid' : ''}`}
          disabled={isSubmitting}
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Ingresa tu contraseña"
          className={`${styles.inputField} ${errors.password ? 'is-invalid' : ''}`}
          disabled={isSubmitting}
        />

        <button type="submit" className={styles.btn} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Iniciando sesión...
            </>
          ) : (
            'Entrar'
          )}
        </button>

        <a href="#" className={styles.forgotPassword}>
          ¿Olvidaste tu contraseña?
        </a>
      </form>
    </div>
  );
});

LoginContent.displayName = 'LoginContent';

export default LoginContent;