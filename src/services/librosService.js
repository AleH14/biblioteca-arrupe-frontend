import apiClient from "./api";
const PRESTAMO_API_URL = "/api/libros";


//GET /api/libros — getLibros
/*Query params (opcionales):

?isbn=string
?autor=string
?titulo=string
?categoria=string (id de categoría) */
export const getLibros = async (filtros = {}) => {
    try {
        const response = await apiClient.get(`${PRESTAMO_API_URL}`, {
            params: filtros,
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los libros:", error);
        throw error;
    }   
};

//GET /api/libros/:id — getLibroById
export const getLibroById = async (id) => {
    try {
        const response = await apiClient.get(`${PRESTAMO_API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el libro:", error);
        throw error;
    }
};

//POST /api/libros — createLibro

  export const createLibro = async (libroData) =>  {
    try {
        const response = await apiClient.post(`${PRESTAMO_API_URL}`, libroData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el libro:", error);
        throw error;
    }
  };


  /*
  PUT /api/libros/:id — updateLibro
Descripción: Actualiza los datos de un libro. Si se indica categoria valida que exista. Roles: admin.

Path params:

:id = string
Body (parcialmente opcional):

{
  "titulo": "string (opcional)",
  "autor": "string (opcional)",
  "isbn": "string (opcional)",
  "categoria": "string (id) (opcional)",
  "editorial": "string (opcional)",
  "fechaPublicacion": "ISO8601 (opcional)"
} */
    export const updateLibro = async (id, datosActualizados) =>  {  
    try {
        const response = await apiClient.put(`${PRESTAMO_API_URL}/${id}`, datosActualizados);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el libro:", error);
        throw error;
    }   
    };
    /*
    DELETE /api/libros/:id — deleteLibro
Descripción: Elimina (remueve) un libro por su id. Roles: admin. Respuesta 204 en caso de éxito.

Path params:

:id = string
Response:

204 No Content (sin body) si eliminación exitosa.
Lógica:

Llamar a LibroRepository.remove(id).
Si no se encuentra, lanzar error 404.
Si se elimina, responder 204.
 */
    export const deleteLibro = async (id) =>  {  
    try {
        const response = await apiClient.delete(`${PRESTAMO_API_URL}/${id}`);   
        // El backend responde 204 No Content, así que creamos una respuesta exitosa
        return { success: true, message: "Libro eliminado correctamente" };
    } catch (error) {
        console.error("Error al eliminar el libro:", error);
        throw error;
    }   
    };

    /*
    POST /api/libros/:libroId/ejemplares — addEjemplar
Descripción: Agrega un ejemplar a un libro existente. Valida campos obligatorios del ejemplar. Roles: admin. Respuesta 201 con el libro actualizado.

Path params:

:libroId = string
Body:

{
  "cdu": "string",
  "estado": "disponible | prestado | perdido | ...",
  "ubicacionFisica": "string",
  "edificio": "string",
  "origen": "Comprado | Donado",
  "precio": "number",
  "donado_por": "string"
} */
export const addEjemplar = async (libroId, ejemplarData) =>  {  
    try {
        const response = await apiClient.post(`${PRESTAMO_API_URL}/${libroId}/ejemplares`, ejemplarData);
        return response.data;
    } catch (error) {
        console.error("Error al agregar el ejemplar:", error);
        throw error;
    }
};


/**
 DELETE /api/libros/:libroId/ejemplares/:ejemplarId — removeEjemplar
Descripción: Elimina un ejemplar específico de un libro. Roles: admin.

Path params:

:libroId = string
:ejemplarId = string
 */
export const removeEjemplar = async (libroId, ejemplarId) =>  {
    try {
        const response = await apiClient.delete(`${PRESTAMO_API_URL}/${libroId}/ejemplares/${ejemplarId}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el ejemplar:", error);
        throw error;
    }

};  

/*
GET /api/libros/categorias — getAllCategorias
Descripción: Devuelve todas las categorías del sistema. Roles: admin, consultor, docente, estudiante. */
export const getAllCategorias = async () => {
    try {
        const response = await apiClient.get(`${PRESTAMO_API_URL}/categorias`);   
        return response.data;
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        throw error;
    }   
};  

/*
POST /api/libros/categorias — createCategoria
Descripción: Crea una nueva categoría. Valida que no exista otra con la misma descripción (case-insensitive). Roles: admin. Respuesta 201. */
export const createCategoria = async (descripcion) => {
    try {
        const body = { descripcion };
        const response = await apiClient.post(`${PRESTAMO_API_URL}/categorias`, body);
        return response.data;
    } catch (error) {
        console.error("Error al crear la categoría:", error);
        throw error;
    }  
};

/*

GET /api/libros/categorias/:id — getCategoriaById
Descripción: Obtiene una categoría por su id. Roles: admin, consultor, docente, estudiante.

Path params:

:id = string*/
export const getCategoriaById = async (id) => {
    try {
        const response = await apiClient.get(`${PRESTAMO_API_URL}/categorias/${id}`);   
        return response.data;
    } catch (error) {
        console.error("Error al obtener la categoría por ID:", error);
        throw error;
    }
};

/*
PUT /api/libros/categorias/:id — updateCategoria
Descripción: Actualiza una categoría. Valida que no existan duplicados de descripción. Roles: admin.

Path params:

:id = string */


export const updateCategoria = async (id, descripcion) => {
    try {
        const body = { descripcion };   
        const response = await apiClient.put(`${PRESTAMO_API_URL}/categorias/${id}`, body);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        throw error;
    }   

};  


/*
DELETE /api/libros/categorias/:id — deleteCategoria
Descripción: Elimina una categoría si no hay libros asociados. Roles: admin. Responde con la categoría eliminada.

Path params:

:id = string*/


export const deleteCategoria = async (id) => {
    try {
        const response = await apiClient.delete(`${PRESTAMO_API_URL}/categorias/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        throw error;
    }
};