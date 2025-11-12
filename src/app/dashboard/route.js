// /src/app/api/dashboard/route.js

export async function GET() {
  // Aquí podrías consultar una base de datos, por ahora usamos datos simulados:
  const stats = {
    totalUsuarios: 42,
    totalLibros: 128,
    prestamosActivos: 10,
  };

  return Response.json(stats);
}
