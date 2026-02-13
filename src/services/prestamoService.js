import axios from "axios";
import apiClient from "./api";

const PRESTAMO_API_URL = "/api/prestamos";

//Obtener pretamos por nombre de usuario 
export const getPrestamosByUsername = async (nombre) => {
  try {
    const response = await apiClient.get(`${PRESTAMO_API_URL}/buscar`, {
      params: { nombre},
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los préstamos por nombre de usuario:", error);
    throw error;
  } 
};


// GET /api/prestamos/buscar-libros — buscarLibrosParaPrestamo
export const buscarLibrosParaPrestamo = async (query) => {
    try {
        const response = await apiClient.get(`${PRESTAMO_API_URL}/buscar-libros`, {
            params: { nombre: query },
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar libros para préstamo:", error);
        throw error;
    }   
};


//GET /api/prestamos/buscar-usuarios — buscarUsuariosParaPrestamo
export const buscarUsuariosParaPrestamo = async (query) => {
    try {
        const response = await apiClient.get(`${PRESTAMO_API_URL}/buscar-usuarios`, {
            params: { nombre: query },
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar usuarios para préstamo:", error);
        throw error;
    }   

};


//GET /api/prestamos/reservas — obtenerTodasLasReservas
export const obtenerTodasLasReservas = async () => {
    try {
        const response = await apiClient.get(`${PRESTAMO_API_URL}/reservas`);   
        return response.data;
    } catch (error) {
        console.error("Error al obtener todas las reservas:", error);
        throw error;
    }   

};

//GET /api/prestamos — obtenerTodos
export const obtenerTodosLosPrestamos = async () => {
    try {
        const response = await apiClient.get(`${PRESTAMO_API_URL}`);   
        return response.data;
    }
    catch (error) {
        console.error("Error al obtener todos los préstamos:", error);
        throw error;
    }
};



//PUT /api/prestamos/:id/cerrar — cerrarPrestamo
export const cerrarPrestamo = async (id) => {
    try {
        const response = await apiClient.put(`${PRESTAMO_API_URL}/${id}/cerrar`);   
        return response.data;
    } catch (error) {
        console.error("Error al cerrar el préstamo:", error);
        throw error;
    }


};


//POST /api/prestamos/crear — crearPrestamoConBusqueda
export const crearPrestamoConBusqueda = async (libroId, ejemplarId, usuarioId, fechaPrestamo, fechaDevolucionEstimada, tipoPrestamo) => {
    try {
        const prestamoData = {
            libroId,
            ejemplarId,
            usuarioId,
            fechaPrestamo,
            fechaDevolucionEstimada,
            tipoPrestamo
        };
        const response = await apiClient.post(`${PRESTAMO_API_URL}/crear`, prestamoData);   
        return response.data;
    }   catch (error) {
        console.error("Error al crear el préstamo con búsqueda:", error);
        throw error;
    }

};

//POST /api/prestamos — crearPrestamo
export const crearPrestamo = async (libroId,usuarioId,fechaDevolucionEstimada,tipoPrestamo) => {
    try {
        const prestamoData = {
            libroId,
            usuarioId,
            fechaDevolucionEstimada,
            tipoPrestamo
        };
        const response = await apiClient.post(`${PRESTAMO_API_URL}`, prestamoData);   
        return response.data;
    }   catch (error) {
        console.error("Error al crear el préstamo:", error);
        throw error;
    }
};



//POST /api/prestamos/renovar/:id — renovarPrestamo
export const renovarPrestamo = async (id, nuevaFechaDevolucionEstimada) => {
    try {
        const response = await apiClient.post(`${PRESTAMO_API_URL}/renovar/${id}`, {
            nuevaFechaDevolucionEstimada
        });
        return response.data;
    } catch (error) {
        console.error("Error al renovar el préstamo:", error);
        throw error;
    }   
};

//POST /api/prestamos/:id/activar-reserva — activarReserva
export const activarReserva = async (id, fechaDevolucionEstimada) => {
  try {
        const response = await apiClient.post(
            `${PRESTAMO_API_URL}/${id}/activar-reserva`,
            { fechaDevolucionEstimada }
        );
        return response.data;
    } catch (error) {
        console.error("Error al activar la reserva:", error);
        throw error;
    }
};


//GET /api/prestamos/reservas/vigentes — obtenerReservasVigentes
export const obtenerReservasVigentes = async () => {
    try {
        const response = await apiClient.get(`${PRESTAMO_API_URL}/reservas/vigentes`);   
        return response.data;
    }
    catch (error) {
        console.error("Error al obtener las reservas vigentes:", error);
        throw error;
    }
};


// POST /api/prestamos/reservar-libro

// POST /api/prestamos/reservar-libro
export const reservarLibro = async (
  libroId,
  fechaExpiracion,
  tipoPrestamo,
  usuarioId
) => {
  try {
    const fechaFormateada = new Date(fechaExpiracion)
      .toISOString()
      .split("T")[0];

    const datos = {
      libroId,
      usuarioId,
      fechaExpiracion: fechaFormateada,
      tipoPrestamo
    };

    console.log("DATOS ENVIADOS AL BACKEND:", datos);

    const response = await apiClient.post(
      `${PRESTAMO_API_URL}/reservar-libro`,
      datos
    );

    return response.data;

  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("BACKEND MESSAGE:", error.response?.data);
    console.log("ERRORES DETALLADOS:", error.response?.data?.errores);
    throw error;
  }
};
export const obtenerMisReservas = async () => {
  try {
    const response = await apiClient.get(
      `${PRESTAMO_API_URL}/reservas/mis-reservas`
    );

    return response.data.data; // 👈 OJO: porque tu backend responde { success, data }
  } catch (error) {
    console.error("Error obteniendo mis reservas:", error);
    throw error;
  }
};






