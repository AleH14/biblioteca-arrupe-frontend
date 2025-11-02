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
  
  // 🎯 OPTIMIZACIÓN #1: useRef para referencia estable
  // ✅ Problema resuelto: loginExitoso como prop causaba re-renders
  // ✅ Solución: useRef mantiene referencia sin causar re-renders
  const loginExitosoRef = useRef(loginExitoso);
  
  // 🔄 Actualizar ref cuando cambie la prop (sin causar re-render)
  useEffect(() => {
    loginExitosoRef.current = loginExitoso;
  }, [loginExitoso]);

  // 🎯 OPTIMIZACIÓN #2: Hook personalizado para estado del formulario
  // ✅ Problema resuelto: Estado local del formulario causaba re-renders masivos
  // ✅ Solución: useLoginForm encapsula y optimiza todo el manejo del estado
  const {
    formData,        // Estado memoizado del formulario
    errors,          // Errores memoizados
    isSubmitting,    // Estado de envío
    handleChange,    // 🚀 Función memoizada - NO se recrea en cada render
    handleSubmit,    // 🚀 Función memoizada - NO se recrea en cada render
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

  // 🎯 OPTIMIZACIÓN #3: useCallback para función estable
  // ✅ Problema resuelto: Función se recreaba en cada render
  // ✅ Solución: useCallback + useRef evita recreaciones innecesarias
  const handleRedirect = useCallback(() => {
    if (loginExitosoRef.current) {
      loginExitosoRef.current();  // Usa referencia estable
    } else {
      router.push('/dashboard');
    }
  }, [router]); // 🔥 Solo se recrea si router cambia (casi nunca)

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
              {/* 🎯 OPTIMIZACIÓN #4: Inputs optimizados */}
              {/* ✅ handleChange está memoizado en useLoginForm */}
              {/* ✅ formData.email NO causa re-renders innecesarios */}
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
            <img src="/images/logo_1000px.png" alt="Logo Colegio" />
          </div>
        </div>
      </div>
    </div>
  );
}
