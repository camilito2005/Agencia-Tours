// Paleta oficial de marca R&G Travel (tomada del logo)
export const COLORS = {
  bg: "#F5F6F8",
  paper: "#FFFFFF",
  navy: "#152C55",      // azul marino principal
  navyDark: "#0D1B38",
  navyLight: "#274270",
  gold: "#C9A24A",      // dorado de marca
  goldDark: "#A8842F",
  ink: "#1A1A1A",
  sub: "#5C6270",
  line: "#E2E5EA",
};

// Mapeo de id_cargo -> nombre de rol, según tu tabla Cargos
// 1 = Cliente, 2 = Operador, 3 = Administrador
export const CARGOS = {
  1: "cliente",
  2: "operador",
  3: "administrador",
};

export function money(n) {
  return "$" + Number(n || 0).toLocaleString("es-CO") + " COP";
}

export function waLink(phone, text) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
