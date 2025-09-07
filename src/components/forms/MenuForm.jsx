import React from 'react';
import styles from  '../../styles/MenuForm.module.css'; 
import NoteIcon from '../svg/note.jsx';
import ButtonIcon from '../ui/ButtonIcon';
import CatalogoIcon from '../svg/catalogo.jsx';
import ChartIcon from '../svg/Chart.jsx';
import UserIcon from '../svg/User.jsx';
import Ayuda from '../svg/Ayuda.jsx';
import CerraSesion from '../svg/CerraSesion';
export default function MenuForm(){
    return(

            <div className={styles.backgroundWrapper}>
                <div className={styles.logo}>
                    <img src="/images/logo_1000px.png" alt="Logo Colegio" />
                </div>

                <div className={styles.header}>
                    <img src="/images/complemento-1.png" alt="Complemento" className={styles.complemento} />
                    <h1 className={styles.title}>Panel de Administración</h1>
                </div>

                {/* Botón Cerrar Sesión - Superior Derecha */}
                <div className={styles.logoutButton}>
                    <CerraSesion className={styles.buttonIcon} />
                    <span className={styles.buttonText}>Cerrar Sesión</span>
                </div>
                
                <div className={styles.container}>
                    <ButtonIcon titulo={<>Préstamos/<br/>Devolución</>} IconComponent={NoteIcon} />
                    <ButtonIcon titulo="Catálogo" IconComponent={CatalogoIcon} />
                    <ButtonIcon titulo="Estadísticas" IconComponent={ChartIcon} />
                    <ButtonIcon titulo="Usuarios" IconComponent={UserIcon} />
                </div>

                {/* Botón Ayuda - Inferior Derecha */}
                <div className={styles.helpButton}>
                    <Ayuda className={styles.buttonIcon} />
                    <span className={styles.buttonText}>Ayuda</span>
                </div>
            </div>


    )
}