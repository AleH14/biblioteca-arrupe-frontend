'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginForm } from '@/hooks/useAuth';
import styles from "@/styles/LoginForm.module.css";
import LoginContent from '@/components/ui/login/LoginContent';
import RightPanel from '@/components/ui/login/RightPanel';
import PasswordResetModal from '@/components/ui/login/PasswordResetModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LoginForm() {
  const router = useRouter();
  const { status, login, user } = useAuth(); // Asegúrate que useAuth devuelva 'user'
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useLoginForm();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      // Verificar si tenemos información del usuario
      if (user && user.role) {
        // Redirigir según el rol
        if (user.role === 'estudiante' || user.role === 'user') {
          router.push('/estudiante');
        } else if (user.role === 'admin' || user.role === 'bibliotecario') {
          router.push('/dashboard');
        } else {
          // Rol por defecto
          router.push('/estudiante');
        }
      } else {
        // Si no hay información de rol
        router.push('/estudiante');
      }
    }
  }, [status, user, router]);

  const showMessage = (message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleForgotPassword = () => {
    setShowPasswordModal(true);
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
  };

  // Si está cargando, mostrar loading
 if (status === 'loading') {
    return <LoadingSpinner/>; // ← USAR COMPONENTE
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!formData.email.trim() || !formData.password.trim()) {
      showMessage('Por favor ingresa email y contraseña', 'error');
      return;
    }

    // Usar el login del hook (que ya maneja tanto validación como AuthContext)
    const result = await handleSubmit(e);
    
    if (result.success) {
      //showMessage('¡Bienvenido! Redirigiendo...', 'success');
      // La redirección se manejará automáticamente en el useEffect
    } else {
      showMessage(result.error || 'Credenciales inválidas', 'error');
    }
  };

  const loginContentProps = {
    formData,
    errors,
    isSubmitting,
    showAlert,
    alertMessage,
    alertType,
    handleChange,
    onSubmit,
    setShowAlert,
    onForgotPassword: handleForgotPassword
  };

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

        <PasswordResetModal 
          isOpen={showPasswordModal}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}