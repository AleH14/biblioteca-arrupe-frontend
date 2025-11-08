'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginForm } from '@/hooks/useAuth';
import styles from "../../styles/LoginForm.module.css";
import LoginContent from '../ui/login/LoginContent';
import RightPanel from '../ui/login/RightPanel';
import PasswordResetModal from '../ui/login/PasswordResetModal';

const LoadingScreen = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Redirigiendo...</span>
      </div>
      <h5 className="text-muted">Redirigiendo...</h5>
    </div>
  </div>
);

export default function LoginForm({ loginExitoso }) {
  const router = useRouter();
  const { status } = useAuth();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [redirecting, setRedirecting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false); // Estado para el modal

  const loginExitosoRef = useRef(loginExitoso);
  useEffect(() => {
    loginExitosoRef.current = loginExitoso;
  }, [loginExitoso]);

  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useLoginForm();

  const showMessage = useCallback((message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validar campos vacíos
    if (!formData.email.trim() || !formData.password) {
      showMessage('Credenciales inválidas', 'error');
      return;
    }

    const result = await handleSubmit(e);

    if (result.success) {
      showMessage('¡Bienvenido! Redirigiendo...', 'success');
    } else {
      // Mostrar siempre "Credenciales inválidas" para cualquier error
      showMessage('Credenciales inválidas', 'error');
    }
  }, [handleSubmit, showMessage, formData.email, formData.password]);

  const handleRedirect = useCallback(() => {
    if (loginExitosoRef.current) loginExitosoRef.current();
    else router.push('/dashboard');
  }, [router]);

   // Handler para abrir el modal
  const handleForgotPassword = useCallback(() => {
    setShowPasswordModal(true);
  }, []);

  // Handler para cerrar el modal
  const handleCloseModal = useCallback(() => {
    setShowPasswordModal(false);
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && !redirecting) {
      setRedirecting(true);
      const timer = setTimeout(handleRedirect, 100);
      return () => clearTimeout(timer);
    }
  }, [status, redirecting, handleRedirect]);

  // Memoizar handlers estables
  const stableHandleChange = useCallback((e) => {
    handleChange(e);
  }, [handleChange]);

  const stableSetShowAlert = useCallback((value) => {
    setShowAlert(value);
  }, []);

  // Separar props que cambian frecuentemente de las que son estables
  const loginContentProps = useMemo(() => ({
    // Props que cambian frecuentemente
    formData,
    errors,
    isSubmitting,
    showAlert,
    alertMessage,
    alertType,
    // Handlers estables (memoizados)
    handleChange: stableHandleChange,
    onSubmit,
    setShowAlert: stableSetShowAlert,
    onForgotPassword: handleForgotPassword 
  }), [
   formData, errors, isSubmitting, showAlert, alertMessage, alertType,
    stableHandleChange, onSubmit, stableSetShowAlert, handleForgotPassword
  ]);

  if (status === 'authenticated' || redirecting) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.backgroundWrapper}>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.letras}>
            <h1 className={styles.title}>Biblioteca Arrupe</h1>
            <h2 className={styles.subtitle}>El poder de gestionar el conocimiento</h2>
          </div>

          <LoginContent {...loginContentProps} />
        </div>

        <RightPanel />

         {/* Modal de recuperación de contraseña */}
        <PasswordResetModal 
          isOpen={showPasswordModal}
          onClose={handleCloseModal}
        />

        
      </div>
    </div>
  );
}