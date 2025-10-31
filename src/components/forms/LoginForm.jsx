'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginForm } from '@/hooks/useAuth';
import styles from '../../styles/LoginForm.module.css';

export default function LoginForm({ loginExitoso }) {
  const router = useRouter();
  const { status } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error'); // 'error' | 'success'
  const [redirecting, setRedirecting] = useState(false);
  
  // Usar ref para mantener referencia estable a loginExitoso
  const loginExitosoRef = useRef(loginExitoso);
  
  // Actualizar ref cuando cambie la prop
  useEffect(() => {
    loginExitosoRef.current = loginExitoso;
  }, [loginExitoso]);

  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    clearForm
  } = useLoginForm();

  const showMessage = (message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const onSubmit = async (e) => {
    const result = await handleSubmit(e);
    
    console.log('LoginForm onSubmit result:', result);
    
    if (result.success) {
      showMessage('¡Bienvenido! Redirigiendo...', 'success');
      // La redirección se maneja automáticamente en useEffect cuando status cambie a 'authenticated'
    } else {
      console.log('LoginForm showing error:', result.error);
      showMessage(result.error || 'Error al iniciar sesión');
    }
  };

  // Estabilizar la función de redirección
  const handleRedirect = useCallback(() => {
    if (loginExitosoRef.current) {
      loginExitosoRef.current();
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  // Manejar redirección cuando el usuario está autenticado
  useEffect(() => {
    if (status === 'authenticated' && !redirecting) {
      setRedirecting(true);
      
      // Pequeño delay para evitar conflictos de estado
      const timer = setTimeout(() => {
        handleRedirect();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [status, redirecting, handleRedirect]);

  // Si ya está autenticado o redirigiendo, mostrar mensaje de carga
  if (status === 'authenticated' || redirecting) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Redirigiendo...</span>
          </div>
          <h5 className="text-muted">Redirigiendo...</h5>
        </div>
      </div>
    );
  }

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
            
            {/* Alert Messages */}
            {showAlert && (
              <div className={`alert ${alertType === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
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
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}

              <label>Contraseña</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña" 
                className={`${styles.inputField} ${errors.password ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}

              <button 
                type="submit" 
                className={styles.btn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
              
              <a href="#" className={styles.forgotPassword}>¿Olvidaste tu contraseña?</a>
            </form>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.logo}>
            <img src="/images/logo_1000px.png" loading="lazy" alt="Logo Colegio" />
          </div>
        </div>
      </div>
    </div>
  );
}
