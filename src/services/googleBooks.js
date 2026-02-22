import axios from "axios";

export async function buscarLibroPorISBN(isbn, signal) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
      { signal }
    );

    if (response.data.totalItems > 0) {
      const libro = response.data.items[0].volumeInfo;
      const portadaLinks = libro.imageLinks || {};

      return {
        success: true,
        data: {
          titulo: libro.title || "",
          autor: libro.authors ? libro.authors.join(", ") : "",
          editorial: libro.publisher || "",
          portada:
            portadaLinks.extraLarge ||
            portadaLinks.large ||
            portadaLinks.medium ||
            portadaLinks.thumbnail ||
            "/images/libro-placeholder.jpg",
          descripcion: libro.description || "",
          infoLink: libro.infoLink || "",
        }
      };
    } else {
      return {
        success: true,
        data: null
      };
    }
  } catch (error) {
    
    
    // Verificar si es error 429 (límite de cuota)
    if (error.response && error.response.status === 429) {
      throw {
        type: "QUOTA_EXCEEDED",
        message: "El servicio de Google Books no está disponible temporalmente. Por favor, ingresa los datos manualmente.",
        status: 429
      };
    }
    
    // Si es un abort error
    if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
      throw error;
    }
    
    // Otros errores
    throw {
      type: "API_ERROR",
      message: "Error al consultar el servicio de Google Books. Por favor, ingresa los datos manualmente.",
      originalError: error
    };
  }
}