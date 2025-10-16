'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook personalizado para manejar el formulario de login
 * @returns {Object} Objeto con estado y funciones del formulario
 */
export const useLoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 3) {
      newErrors.password = 'La contraseña debe tener al menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return {
        success: false,
        error: 'Por favor corrige los errores en el formulario'
      };
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(formData);
      
      if (!result.success) {
        // No establecer error general aquí, dejar que el componente lo maneje
        // Solo limpiar errores de campos específicos si los hay
        setErrors(prevErrors => ({
          ...prevErrors,
          email: '',
          password: ''
        }));
      }
      
      return result;
    } catch (error) {
      const errorResult = {
        success: false,
        error: 'Error inesperado al iniciar sesión'
      };
      
      return errorResult;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      email: '',
      password: ''
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    clearForm
  };
};

/**
 * Hook para proteger rutas que requieren autenticación
 * @param {string} requiredRole - Rol requerido (opcional)
 * @returns {Object} Estado de autenticación y autorización
 */
export const useAuthGuard = (requiredRole = null) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  
  const isAuthorized = () => {
    if (!isAuthenticated()) return false;
    if (!requiredRole) return true;
    return hasRole(requiredRole);
  };

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    isAuthorized: isAuthorized(),
    hasRequiredRole: requiredRole ? hasRole(requiredRole) : true
  };
};