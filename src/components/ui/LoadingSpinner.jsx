import React from 'react';

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <h5 className="text-muted">{message}</h5>
        <div className="mt-3">
          <img 
            src="/images/logo_1000px.png" 
            alt="Logo Biblioteca Arrupe" 
            style={{ maxWidth: '150px', opacity: 0.7 }}
          />
        </div>
      </div>
    </div>
  );
}