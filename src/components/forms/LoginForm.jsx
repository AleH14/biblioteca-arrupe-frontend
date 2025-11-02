'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../../styles/LoginForm.module.css';

// Componente memoizado para el spinner de carga
const LoadingSpinner = React.memo(() => {
  console.count('🔄 LoadingSpinner render'); // Para verificar renders
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
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Componente memoizado para las alertas
const AlertMessage = React.memo(({ show, message, type, onClose }) => {
  console.count('🚨 AlertMessage render'); // Para verificar renders
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

// 🎯 Input de Email con estado local y validación
const EmailInput = React.memo(({ onValueChange, error, disabled, initialValue = '' }) => {
  console.count('📧 EmailInput render'); // Para verificar renders
  
  // Estado local del input - no afecta al componente padre
  const [localValue, setLocalValue] = useState(initialValue);
  
  // Sincronizar cambios locales con el padre de forma optimizada
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Notificar al padre solo el valor, no todo el evento
    onValueChange(newValue);
  }, [onValueChange]);

  return (
    <>
      <label htmlFor="email">Email</label>
      <input 
        id="email"
        type="email" 
        name="email"
        value={localValue}
        onChange={handleChange}
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
  );
});

EmailInput.displayName = 'EmailInput';

// 🎯 Input de Password con estado local y validación
const PasswordInput = React.memo(({ onValueChange, error, disabled, initialValue = '' }) => {
  console.count('🔐 PasswordInput render'); // Para verificar renders
  
  // Estado local del input - no afecta al componente padre
  const [localValue, setLocalValue] = useState(initialValue);
  
  // Sincronizar cambios locales con el padre de forma optimizada
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Notificar al padre solo el valor, no todo el evento
    onValueChange(newValue);
  }, [onValueChange]);

  return (
    <>
      <label htmlFor="password">Contraseña</label>
      <input 
        id="password"
        type="password" 
        name="password"
        value={localValue}
        onChange={handleChange}
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
  );
});

PasswordInput.displayName = 'PasswordInput';

// 🎯 Componente estático memoizado para el contenido del formulario
const FormContent = React.memo(({ 
  onEmailChange, 
  onPasswordChange, 
  emailError, 
  passwordError, 
  isSubmitting, 
  onSubmit 
}) => {
  console.count('📝 FormContent render'); // Para verificar renders
  
  return (
    <div className={styles.loginBox}>
      <h2>LOGIN</h2>
      
      <form onSubmit={onSubmit}>
        <EmailInput 
          onValueChange={onEmailChange}
          error={emailError}
          disabled={isSubmitting}
        />

        <PasswordInput 
          onValueChange={onPasswordChange}
          error={passwordError}
          disabled={isSubmitting}
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
  );
});

FormContent.displayName = 'FormContent';

// 🎯 Componente estático memoizado para el layout
const StaticLayout = React.memo(({ children }) => {
  console.count('🏠 StaticLayout render'); // Para verificar renders
  
  return (
    <div className={styles.backgroundWrapper}>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.letras}>
            <h1 className={styles.title}>Biblioteca Arrupe</h1>
            <h2 className={styles.subtitle}>El poder de gestionar el conocimiento</h2>
          </div>
          {children}
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.logo}>
            <Image 
              src="/images/logo_1000px.png" 
              alt="Logo Colegio Arrupe"
              width={400}
              height={400}
              priority={true}
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
});

StaticLayout.displayName = 'StaticLayout';

export default function LoginForm({ loginExitoso }) {
  console.count('🎯 LoginForm render'); // Para verificar renders del componente principal
  
  const router = useRouter();
  const { login, status } = useAuth();
  
  // 🎯 Estados de UI - separados de los datos del formulario
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🎯 Estados de validación - solo se actualizan en submit o blur
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // 🎯 Referencias para los valores actuales - no causan re-renders
  const emailValueRef = useRef('');
  const passwordValueRef = useRef('');
  const loginExitosoRef = useRef(loginExitoso);
  const alertTimeoutRef = useRef(null);
  
  // Actualizar ref cuando cambie la prop
  useEffect(() => {
    loginExitosoRef.current = loginExitoso;
  }, [loginExitoso]);

  // 🎯 Funciones de manejo de cambios - ESTABLES y no causan re-renders del padre
  const handleEmailChange = useCallback((value) => {
    // Solo actualizar la referencia, no el estado
    emailValueRef.current = value;
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (emailError) {
      setEmailError('');
    }
  }, [emailError]);

  const handlePasswordChange = useCallback((value) => {
    // Solo actualizar la referencia, no el estado
    passwordValueRef.current = value;
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (passwordError) {
      setPasswordError('');
    }
  }, [passwordError]);

  // 🎯 Validación del formulario - solo ejecutada en submit
  const validateForm = useCallback(() => {
    const email = emailValueRef.current.trim();
    const password = passwordValueRef.current.trim();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 3) {
      newErrors.password = 'La contraseña debe tener al menos 3 caracteres';
    }

    setEmailError(newErrors.email || '');
    setPasswordError(newErrors.password || '');
    
    return Object.keys(newErrors).length === 0;
  }, []);

  // 🎯 Función para mostrar mensajes con cleanup automático
  const showMessage = useCallback((message, type = 'error') => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    alertTimeoutRef.current = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, []);

  // 🎯 Función para cerrar alertas manualmente
  const closeAlert = useCallback(() => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setShowAlert(false);
  }, []);

  // 🎯 Submit del formulario - optimizado
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showMessage('Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = {
        email: emailValueRef.current.trim(),
        password: passwordValueRef.current.trim()
      };
      
      const result = await login(formData);
      
      if (result.success) {
        showMessage('¡Bienvenido! Redirigiendo...', 'success');
        // La redirección se maneja automáticamente en useEffect cuando status cambie
      } else {
        setEmailError('');
        setPasswordError('');
        showMessage(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      showMessage('Error inesperado al iniciar sesión');
      
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, showMessage, login]);

  // 🎯 Función de redirección estabilizada
  const handleRedirect = useCallback(() => {
    if (loginExitosoRef.current) {
      loginExitosoRef.current();
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  // 🎯 Estado derivado para loading
  const shouldShowLoading = useMemo(() => 
    status === 'authenticated', [status]
  );

  // 🎯 Manejar redirección cuando el usuario está autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      handleRedirect();
    }
  }, [status, handleRedirect]);

  // 🎯 Cleanup de timeouts al desmontar
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  // Si ya está autenticado, mostrar loading
  if (shouldShowLoading) {
    return <LoadingSpinner />;
  }

  return (
    <StaticLayout>
      {/* Alert Messages - Solo se re-renderiza cuando cambia la alerta */}
      <AlertMessage 
        show={showAlert}
        message={alertMessage}
        type={alertType}
        onClose={closeAlert}
      />

      {/* Form Content - Solo se re-renderiza cuando cambian errores o isSubmitting */}
      <FormContent
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        emailError={emailError}
        passwordError={passwordError}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </StaticLayout>
  );
}
