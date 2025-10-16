'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuth';

export default function DashboardExample() {
  const { user, logout } = useAuth();
  const { loading, isAuthenticated, isAuthorized } = useAuthGuard();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Redirigir se maneja automáticamente por next-auth
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Acceso no autorizado</h4>
          <p>Debes iniciar sesión para acceder a esta página.</p>
          <hr />
          <p className="mb-0">
            <a href="/login" className="btn btn-primary">Ir al Login</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Dashboard - Biblioteca Arrupe</h2>
              <button 
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm"
              >
                Cerrar Sesión
              </button>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Información del Usuario</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Nombre:</strong> {user?.name}
                    </li>
                    <li className="list-group-item">
                      <strong>Email:</strong> {user?.email}
                    </li>
                    <li className="list-group-item">
                      <strong>Rol:</strong> 
                      <span className={`badge ms-2 ${user?.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {user?.role}
                      </span>
                    </li>
                    <li className="list-group-item">
                      <strong>Estado:</strong> 
                      <span className={`badge ms-2 ${user?.active ? 'bg-success' : 'bg-secondary'}`}>
                        {user?.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Acciones Disponibles</h5>
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary" type="button">
                      Gestión de Libros
                    </button>
                    <button className="btn btn-info" type="button">
                      Gestión de Préstamos
                    </button>
                    {user?.role === 'admin' && (
                      <button className="btn btn-warning" type="button">
                        Gestión de Usuarios (Admin)
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="alert alert-success" role="alert">
                <h6 className="alert-heading">¡Conexión exitosa!</h6>
                <p className="mb-0">
                  El sistema de autenticación está funcionando correctamente. 
                  El usuario está autenticado y conectado al backend en 
                  <code>http://localhost:4000/api/auth/login</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}