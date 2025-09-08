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
            {/* Header con Bootstrap */}
            <div className="container-fluid">
                {/* Navbar responsivo */}
                <nav className="navbar navbar-expand-lg position-relative py-3">
                    <div className="container-fluid">
                        {/* Logo */}
                        <div className={`${styles.logo} d-flex align-items-center`}>
                            <img src="/images/logo_1000px.png" alt="Logo Colegio" className="img-fluid" style={{maxHeight: '80px'}} />
                        </div>

                        {/* Título centrado */}
                        <div className="position-absolute start-50 translate-middle-x d-none d-md-flex align-items-center">
                            <img src="/images/complemento-1.png" alt="Complemento" className="me-3" style={{width: '40px', height: '40px'}} />
                            <h1 className={`${styles.title} mb-0`}>Panel de Administración</h1>
                        </div>

                        {/* Botón Cerrar Sesión */}
                        <div className="ms-auto me-3">
                            <button className="btn btn-light d-flex align-items-center" style={{color: '#000000'}}>
                                <CerraSesion className="me-2" style={{width: '20px', height: '20px'}} />
                                <span className="d-none d-md-inline">Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Título móvil */}
                <div className="d-md-none text-center mb-4">
                    <div className="d-flex justify-content-center align-items-center mb-2">
                        <img src="/images/complemento-1.png" alt="Complemento" className="me-2" style={{width: '30px', height: '30px'}} />
                        <h2 className={`${styles.title} mb-0`} style={{fontSize: '1.5rem'}}>Panel de Administración</h2>
                    </div>
                </div>

                {/* Grid de botones con Bootstrap */}
                <div className="container" style={{marginTop: '4rem', marginBottom: '6rem', paddingBottom: '2rem'}}>
                    <div className="row g-3 justify-content-center">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center">
                            <ButtonIcon titulo={<>Préstamos/<br/>Devolución</>} IconComponent={NoteIcon} />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center">
                            <ButtonIcon titulo="Catálogo" IconComponent={CatalogoIcon} />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center">
                            <ButtonIcon titulo="Estadísticas" IconComponent={ChartIcon} />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center">
                            <ButtonIcon titulo="Usuarios" IconComponent={UserIcon} />
                        </div>
                    </div>
                </div>

                {/* Botón Ayuda - Responsivo */}
                <div className="position-fixed d-block" 
                     style={{
                         right: '2rem', 
                         bottom: '6rem', 
                         zIndex: 1050
                     }}>
                    <button className="btn btn-light d-flex flex-column align-items-center p-2 rounded-circle shadow-lg" 
                            style={{
                                width: '75px', 
                                height: '75px', 
                                color: '#000000',
                                minWidth: '75px',
                                minHeight: '75px'
                            }}>
                        <Ayuda style={{width: '40px', height: '40px'}} />
                        <small style={{fontSize: '0.7rem', lineHeight: '1', marginTop: '2px'}}>Ayuda</small>
                    </button>
                </div>
            </div>
        </div>
    )
}