import axios from "axios"; 

export async function buscarLibroPorISBN(isbn) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );

    if (response.data.totalItems > 0) {
      const libro = response.data.items[0].volumeInfo;
      const portadaLinks = libro.imageLinks || {};

      return {
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
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al consultar Google Books API:", error);
    return null;
  }
}
