'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginForm } from '@/hooks/useAuth';
import styles from '../../styles/LoginForm.module.css';

// Componente memoizado para el spinner de carga
const LoadingSpinner = React.memo(() => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Redirigiendo...</span>
      </div>
      <h5 className="text-muted">Redirigiendo...</h5>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Componente memoizado para las alertas
const AlertMessage = React.memo(({ show, message, type, onClose }) => {
  if (!show) return null;
  
  return (
    <div 
      className={`alert ${type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} 
      role="alert"
    >
      {message}
      <button 
        type="button" 
        className="btn-close" 
        onClick={onClose}
        aria-label="Cerrar alerta"
      />
    </div>
  );
});

AlertMessage.displayName = 'AlertMessage';

// Componente memoizado para input de email
const EmailInput = React.memo(({ value, onChange, error, disabled, styles }) => (
  <>
    <label htmlFor="email">Email</label>
    <input 
      id="email"
      type="email" 
      name="email"
      value={value}
      onChange={onChange}
      placeholder="Ingresa tu correo" 
      className={`${styles.inputField} ${error ? 'is-invalid' : ''}`}
      disabled={disabled}
      autoComplete="email"
      aria-describedby={error ? 'email-error' : undefined}
      required
    />
    {error && (
      <div id="email-error" className="invalid-feedback" role="alert">
        {error}
      </div>
    )}
  </>
));

EmailInput.displayName = 'EmailInput';

// Componente memoizado para input de contraseña
const PasswordInput = React.memo(({ value, onChange, error, disabled, styles }) => (
  <>
    <label htmlFor="password">Contraseña</label>
    <input 
      id="password"
      type="password" 
      name="password"
      value={value}
      onChange={onChange}
      placeholder="Ingresa tu contraseña" 
      className={`${styles.inputField} ${error ? 'is-invalid' : ''}`}
      disabled={disabled}
      autoComplete="current-password"
      aria-describedby={error ? 'password-error' : undefined}
      required
    />
    {error && (
      <div id="password-error" className="invalid-feedback" role="alert">
        {error}
      </div>
    )}
  </>
));

PasswordInput.displayName = 'PasswordInput';

export default function LoginForm({ loginExitoso }) {
  const router = useRouter();
  const { status } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error'); // 'error' | 'success'
  
  // Usar ref para mantener referencia estable a loginExitoso
  const loginExitosoRef = useRef(loginExitoso);
  const alertTimeoutRef = useRef(null);
  
  // Actualizar ref cuando cambie la prop
  useEffect(() => {
    loginExitosoRef.current = loginExitoso;
  }, [loginExitoso]);

  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useLoginForm();

  // Función memoizada para mostrar mensajes con cleanup automático
  const showMessage = useCallback((message, type = 'error') => {
    // Limpiar timeout previo si existe
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Auto-hide después de 5 segundos con cleanup
    alertTimeoutRef.current = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, []);

  // Función memoizada para cerrar alertas manualmente
  const closeAlert = useCallback(() => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setShowAlert(false);
  }, []);

  // Función memoizada para manejar el submit
  const onSubmit = useCallback(async (e) => {
    const result = await handleSubmit(e);
    
    // Eliminar console.log en producción
    if (process.env.NODE_ENV === 'development') {
      console.log('LoginForm result:', result);
    }
    
    if (result.success) {
      showMessage('¡Bienvenido! Redirigiendo...', 'success');
      // La redirección se maneja automáticamente en useEffect cuando status cambie a 'authenticated'
    } else {
      showMessage(result.error || 'Error al iniciar sesión');
    }
  }, [handleSubmit, showMessage]);

  // Función estabilizada de redirección
  const handleRedirect = useCallback(() => {
    if (loginExitosoRef.current) {
      loginExitosoRef.current();
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  // Estado derivado: si debe mostrar loading
  const shouldShowLoading = useMemo(() => 
    status === 'authenticated', [status]
  );

  // Manejar redirección cuando el usuario está autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      // Redirección inmediata sin delay artificial para mejor UX
      handleRedirect();
    }
  }, [status, handleRedirect]);

  // Cleanup de timeouts al desmontar
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  // Si ya está autenticado, mostrar mensaje de carga
  if (shouldShowLoading) {
    return <LoadingSpinner />;
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
            
            {/* Alert Messages - Componente memoizado */}
            <AlertMessage 
              show={showAlert}
              message={alertMessage}
              type={alertType}
              onClose={closeAlert}
            />

            <form onSubmit={onSubmit}>
              <EmailInput 
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={isSubmitting}
                styles={styles}
              />

              <PasswordInput 
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                disabled={isSubmitting}
                styles={styles}
              />

              <button 
                type="submit" 
                className={styles.btn}
                disabled={isSubmitting}
                aria-describedby="submit-status"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span id="submit-status">Iniciando sesión...</span>
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
              
              <a href="#" className={styles.forgotPassword} tabIndex={isSubmitting ? -1 : 0}>
                ¿Olvidaste tu contraseña?
              </a>
            </form>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.logo}>
            {/* Optimización con Next.js Image para mejor rendimiento */}
            <Image 
              src="/images/logo_1000px.png" 
              alt="Logo Colegio Arrupe"
              width={400}
              height={400}
              priority={true} // Crítico para LCP - carga con prioridad alta
              sizes="(max-width: 768px) 200px, 400px"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
