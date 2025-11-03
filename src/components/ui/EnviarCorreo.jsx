//componente de notifiaciones FORM DE ENVIAR CORREO
import React, { useState, useCallback } from 'react';
import { FiSend } from "react-icons/fi";
import styles from '../../styles/NotificacionesCorreo.module.css';
import global from '../../styles/Global.module.css';

const EnviarCorreo = React.memo(({ 
  prestamo,
  onEnviarCorreo 
}) => {
  
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [destinatario, setDestinatario] = useState("");

  // Inicializar asunto basado en el préstamo
  React.useEffect(() => {
    if (prestamo) {
      setAsunto(`Recordatorio de devolución - ${prestamo.libro}`);
    }
  }, [prestamo]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!asunto.trim() || !mensaje.trim() || !destinatario.trim()) {
      alert("Por favor complete todos los campos");
      return;
    }

    const nuevoCorreo = {
      id: `correo-${Date.now()}`,
      asunto,
      destinatario,
      fecha: new Date().toLocaleString('es-ES'),
      mensaje,
      estado: "Enviado"
    };

    onEnviarCorreo(nuevoCorreo);
    setMensaje("");
    setDestinatario("");
  }, [asunto, mensaje, destinatario, onEnviarCorreo]);

  const handleAsuntoChange = useCallback((value) => {
    setAsunto(value);
  }, []);

  const handleMensajeChange = useCallback((value) => {
    setMensaje(value);
  }, []);

  const handleDestinatarioChange = useCallback((value) => {
    setDestinatario(value);
  }, []);

  return (
    <div className={styles.emailForm}>
      <h3 className={styles.sectionTitle}>Enviar Correo</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className={styles.formLabel}>Destinatario</label>
          <input
            type="email"
            className={styles.formInput}
            value={destinatario}
            onChange={(e) => handleDestinatarioChange(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className="mb-3">
          <label className={styles.formLabel}>Asunto</label>
          <input
            type="text"
            className={styles.formInput}
            value={asunto}
            onChange={(e) => handleAsuntoChange(e.target.value)}
            placeholder="Asunto del correo"
            required
          />
        </div>
        
        <div className="mb-3">
          <label className={styles.formLabel}>Mensaje</label>
          <textarea
            className={styles.formTextarea}
            value={mensaje}
            onChange={(e) => handleMensajeChange(e.target.value)}
            placeholder="Escriba su mensaje aquí..."
            rows="6"
            required
          />
        </div>

        <button type="submit" className={`${global.btnPrimary} ${styles.sendButton}`}>
          <FiSend className="me-2" />
          Enviar Correo
        </button>
      </form>
    </div>
  );
});

EnviarCorreo.displayName = 'EnviarCorreo';

export default EnviarCorreo;