import {
  ObtenerHoteles,
  BuscarHotelPorId,
  CrearHotel,
  ActualizarHotel,
  EliminarHotel,
} from "../Modelos/Hoteles.modelo.mjs";

export async function ListarHoteles(req, res) {
  const hoteles = await ObtenerHoteles();
  return res.json(hoteles);
}

export async function ObtenerHotel(req, res) {
  const hotel = await BuscarHotelPorId(req.params.id);
  if (!hotel) {
    return res.status(404).json({
      showModal: true,
      modal: { title: "No encontrado", message: "El hotel no existe", type: "error" },
    });
  }
  return res.json(hotel);
}

export async function CrearHotelController(req, res) {
  try {
    if (!req.body.nombre || !req.body.pais || !req.body.ciudad) {
      return res.status(400).json({
        showModal: true,
        modal: { title: "Datos incompletos", message: "Nombre, país y ciudad son obligatorios", type: "error" },
      });
    }
    const hotel = await CrearHotel(req.body);
    return res.status(201).json({
      showModal: true,
      modal: { title: "Éxito", message: "Hotel creado correctamente", type: "success" },
      hotel,
    });
  } catch (error) {
    console.error("Error en CrearHotelController:", error);
    return res.status(500).json({
      showModal: true,
      modal: { title: "Error del servidor", message: "No se pudo crear el hotel", type: "error" },
    });
  }
}

export async function EditarHotel(req, res) {
  const hotel = await ActualizarHotel(req.params.id, req.body);
  if (!hotel) {
    return res.status(404).json({
      showModal: true,
      modal: { title: "No encontrado", message: "El hotel no existe", type: "error" },
    });
  }
  return res.json({
    showModal: true,
    modal: { title: "Actualizado", message: "Hotel actualizado correctamente", type: "success" },
    hotel,
  });
}

export async function DesactivarHotel(req, res) {
  await EliminarHotel(req.params.id);
  return res.json({
    showModal: true,
    modal: { title: "Hotel desactivado", message: "El hotel fue desactivado", type: "success" },
  });
}