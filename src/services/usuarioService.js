import apiClient from "./api";

const USERS_API_URL = "/api/usuarios";

/**
 * Obtener todos los usuarios
 */
export const getUsers = async () => {
  try {
    const response = await apiClient.get(USERS_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

/**
 * Obtener un usuario por ID
 */
export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`${USERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

/**
 * Actualizar usuario
 */
export const updateUser = async (id, data) => {
  try {
    const response = await apiClient.put(`${USERS_API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

/**
 * Eliminar usuario
 */
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`${USERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};
