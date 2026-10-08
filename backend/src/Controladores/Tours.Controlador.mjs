import {
  ObtenerTours,
  BuscarTourPorId,
  ObtenerIdOperadorDeTour,
  CrearTour,
  ActualizarTour,
  EliminarTour,
  ObtenerToursPorOperador,
} from "../Modelos/Tours.Modelo.mjs";

export async function ListarTours(req, res) {
  const tours = await ObtenerTours();
  return res.json(tours);
}

export async function ObtenerTour(req, res) {
  const tour = await BuscarTourPorId(req.params.id);
  if (!tour) {
    return res.status(404).json({
      showModal: true,
      modal: { title: "No encontrado", message: "El tour no existe", type: "error" },
    });
  }
  return res.json(tour);
}

// ADMIN u OPERADOR. Si es operador, el tour SIEMPRE queda a su propio nombre
// (nunca puede crear un tour "a nombre de" otro operador).
export async function CrearTourController(req, res) {
  try {
    const { nombre_tour, id_destino, precio, duracion, cupos } = req.body;
    if (!nombre_tour || !id_destino || !precio || !duracion || !cupos) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Datos incompletos", message: "Nombre, destino, precio, duración y cupos son obligatorios", type: "error" },
      });
    }

    const idOperador = req.usuario.rol === 2 ? req.usuario.id : (req.body.id_operador || req.usuario.id);
    const tour = await CrearTour(req.body, idOperador);

    return res.status(201).json({
      showModal: true,
      modal: { title: "Éxito", message: "Tour creado correctamente", type: "success" },
      tour,
    });
  } catch (error) {
    console.error("Error en CrearTourController:", error);
    return res.status(500).json({
      showModal: true,
      modal: { title: "Error del servidor", message: "No se pudo crear el tour", type: "error" },
    });
  }
}

// ADMIN puede editar cualquier tour. OPERADOR solo los suyos.
export async function EditarTour(req, res) {
  const idOperadorDelTour = await ObtenerIdOperadorDeTour(req.params.id);
  if (idOperadorDelTour === null) {
    return res.status(404).json({
      showModal: true,
      modal: { title: "No encontrado", message: "El tour no existe", type: "error" },
    });
  }
  if (req.usuario.rol === 2 && idOperadorDelTour !== req.usuario.id) {
    return res.status(403).json({
      showModal: true,
      modal: { title: "Acceso denegado", message: "No puedes editar tours de otro operador", type: "error" },
    });
  }

  const tour = await ActualizarTour(req.params.id, req.body);
  return res.json({
    showModal: true,
    modal: { title: "Actualizado", message: "Tour actualizado correctamente", type: "success" },
    tour,
  });
}

// Solo ADMIN puede eliminar (el operador solo crea/edita/consulta, según el alcance)
export async function EliminarTourController(req, res) {
  await EliminarTour(req.params.id);
  return res.json({
    showModal: true,
    modal: { title: "Tour eliminado", message: "El tour fue eliminado", type: "success" },
  });
}

// Panel del operador: solo sus propios tours. Panel admin: todos (usa ListarTours
// sin filtrar por estado sería ideal para admin, pero de momento reutilizamos
// ObtenerToursPorOperador solo para el caso operador).
export async function MisTours(req, res) {
  const tours = await ObtenerToursPorOperador(req.usuario.id);
  return res.json(tours);
}