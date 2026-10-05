// info.mjs — horarios reales de Karduto y "datos" rotativos (sin promesas de velocidad ni comparaciones)
// Horario confirmado: L–V 08:30–20:00 · sábado 08:30–16:00 · domingo cerrado.
// weekday: 0=domingo ... 6=sábado
export function hoursNote(weekday, hour) {
  if (weekday === 0) return "Hoy domingo no operamos: lo que ingreses se procesa el lunes desde las 8:30";
  if (weekday === 6) return hour < 9 ? "Abrimos hoy a las 8:30 · atendemos hasta las 16:00" : "Hoy atendemos hasta las 16:00";
  return hour < 9 ? "Abrimos hoy a las 8:30 · atendemos hasta las 20:00" : "Hoy atendemos hasta las 20:00";
}

const TIPS = [
  "sube tu comprobante completo: monto, fecha y destino bien visibles.",
  "todo se puede hacer desde tu teléfono: cotiza, transfiere y sube tu comprobante.",
  "puedes subir varios comprobantes, en JPG, JPEG o PDF.",
  "tenemos más corredores: revisa karduto.com para ver todos.",
  "revisa el número de cuenta del destinatario antes de enviar.",
  "sigue tu envío: Inicio, En proceso y Finalizado.",
  "guarda a tu destinatario y tu próximo envío será más simple de armar.",
  "el monto que transfieres debe ser igual al de tu solicitud.",
  "te avisamos por correo cada vez que cambia el estado de tu envío.",
  "antes de pagar ves cuánto recibe tu contacto.",
  "cédula y cuenta del destinatario: revísalas dos veces.",
  "lo que ingreses fuera de horario se procesa el siguiente día operativo.",
  "si un dato no coincide, puedes corregirlo y tu envío vuelve a empezar.",
];
export const tipFor = (dayOfYear, slotIndex) => TIPS[(dayOfYear + slotIndex) % TIPS.length];

// Dato fijo confirmado por Karduto para el corredor Colombia
export const COLOMBIA_TIP = "tu familia recibe por Nequi o por transferencia a cualquier banco.";

export const disclaimer = (hh) =>
  `Tasa del momento de publicación (${hh}). Se actualiza automáticamente en tiempo real: la tasa real es la que ves en karduto.com.`;
