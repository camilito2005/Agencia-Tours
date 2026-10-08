import {
  ObtenerDestinos,
  BuscarDestinoPorId,
  CrearDestino,
  ActualizarDestino,
  EliminarDestino,
} from "../Modelos/Destinos.modelo.mjs";

export async function ListarDestinos(req, res) {
  const destinos = await ObtenerDestinos();
  return res.json(destinos);
}

export async function ObtenerDestino(req, res) {
  const destino = await BuscarDestinoPorId(req.params.id);
  if (!destino) {
    return res.status(404).json({
      showModal: true,
      modal: { title: "No encontrado", message: "El destino no existe", type: "error" },
    });
  }
  return res.json(destino);
}

export async function CrearDestinoController(req, res) {
  try {
    if (!req.body.pais || !req.body.ciudad) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Datos incompletos", message: "País y ciudad son obligatorios", type: "error" },
      });
    }
    const destino = await CrearDestino(req.body);
    return res.status(201).json({
      showModal: true,
      modal: { title: "Éxito", message: "Destino creado correctamente", type: "success" },
      destino,
    });
  } catch (error) {
    console.error("Error en CrearDestinoController:", error);
    return res.status(500).json({
      showModal: true,
      modal: { title: "Error del servidor", message: "No se pudo crear el destino", type: "error" },
    });
  }
}

export async function EditarDestino(req, res) {
  const destino = await ActualizarDestino(req.params.id, req.body);
  if (!destino) {
    return res.status(404).json({
      showModal: true,
      modal: { title: "No encontrado", message: "El destino no existe", type: "error" },
    });
  }
  return res.json({
    showModal: true,
    modal: { title: "Actualizado", message: "Destino actualizado correctamente", type: "success" },
    destino,
  });
}

export async function DesactivarDestino(req, res) {
  await EliminarDestino(req.params.id);
  return res.json({
    showModal: true,
    modal: { title: "Destino desactivado", message: "El destino fue desactivado", type: "success" },
  });
}