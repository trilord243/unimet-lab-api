/**
 * Carga datos iniciales del Laboratorio de Procesos de Separación.
 * Contenido extraído de https://unimetprocesslab.vercel.app
 *
 * Uso: node scripts/seed.js
 * Requiere MONGODB_URI en el entorno (o usa el default local).
 *
 * Idempotente: usa upserts por nombre.
 */
const { MongoClient } = require("mongodb");

const PROFESSORS = [
  {
    name: "Miguel Manuel Pérez Hernández",
    email: "mperez@unimet.edu.ve",
    education:
      "Licenciatura en Química, Opción Tecnológica – Universidad Simón Bolívar, Venezuela. Homologado al título universitario oficial español de Licenciado en Química. Diploma de Estudios Avanzados (DEA), Físico-Química, Universidad de Borgoña, Dijon, Francia. Doctor de Tercer Ciclo, Especialidad Físico-Química, Universidad de Borgoña, Dijon, Francia.",
    asignatures: [
      "Reactores",
      "Laboratorio de procesos de separación",
      "Laboratorio de fluidos y transferencias",
      "Principios de procesos industriales",
    ],
    interestAreas: [
      "Desarrollo de un Laboratorio de Instrumentación",
      "Diseño y construcción de un potenciostato/galvanostato de bajo costo",
      "Corrosión, pinturas industriales",
      "Carbón activado, tintas naturales",
    ],
    order: 1,
  },
  {
    name: "Sergio David Rosales Anzola",
    email: "srosales@unimet.edu.ve",
    education:
      "Doctorado en Física, Instituto Venezolano de Investigaciones Científicas (IVIC). Ingeniero Químico, Universidad Nacional Experimental Politécnica Antonio José de Sucre (UNEXPO).",
    asignatures: [
      "Mecánica de Fluidos",
      "Laboratorio de fluidos y transferencias",
      "Principios de procesos industriales II",
    ],
    interestAreas: [
      "Surfactantes y sinergia en mezclas",
      "Fenómenos interfaciales",
      "Reología interfacial dilatacional",
      "Estabilidad de espumas",
      "Realidad aumentada para enseñanza en ingeniería",
    ],
    order: 2,
  },
  {
    name: "Juan Bernardo Tovar Salas",
    email: "juantovar@correo.unimet.edu.ve",
    education:
      "Participación activa en proyectos del Laboratorio de Electroquímica de la Universidad Simón Bolívar (USB). Actualmente en el Laboratorio de Procesos de Separación (Unimet) en proyectos de instrumentación. A cargo del Laboratorio de Máquinas Eléctricas (Unimet).",
    asignatures: [
      "Arquitectura del Computador",
      "Laboratorio de Redes Eléctricas II",
      "Laboratorio de Electromecánica",
      "Laboratorio de Máquinas Eléctricas I",
      "Laboratorio de Máquinas Eléctricas II",
    ],
    interestAreas: [
      "Electroquímica",
      "Almacenamiento y conversión de energía",
      "Sensores e instrumentación",
      "Electrónica de potencia",
      "Tratamiento de agua",
      "Electromagnetismo",
    ],
    order: 3,
  },
  {
    name: "Jose Barriola",
    email: "jbarriola@unimet.edu.ve",
    education:
      "Ingeniero Electricista graduado en la Universidad Central de Venezuela (1973). 15 años en OPSIS, 10 años como Gerente de Controles Texas (Grupo Inelectra), 20 años en Honeywell (último cargo: Vicepresidente Ejecutivo, 2018). Dedicado a la educación superior en UNIMET y UCV.",
    asignatures: [
      "Electrónica 1",
      "Redes 2",
      "Electromecánica",
      "Electrónica Industrial",
      "Automatización y control",
      "Control de Procesos",
    ],
    interestAreas: [
      "Control de procesos",
      "Automatización de laboratorios",
      "Mecatrónica y robótica",
    ],
    order: 4,
  },
];

const SAFETY_RULES = [
  "Al entrar identifique la ubicación de los equipos de Emergencia (Extintor, Salida).",
  "Es obligatorio el uso de bata, pantalón largo, zapato cerrado y el cabello recogido para que el acceso al Laboratorio le sea permitido.",
  "No se permite permanecer en el laboratorio con amigos, acompañantes o visitas.",
  "Antes de usar un equipo debe haber leído el manual del mismo.",
  "Antes de usar un equipo el usuario es responsable del mismo, por lo tanto, si se daña el usuario correrá con los gastos de reparación o reposición.",
  "Consulte con el Encargado la forma adecuada de manejar los desechos antes de hacer el experimento.",
  "Los estudiantes pueden ingresar al laboratorio solo cuando el Encargado del laboratorio está presente.",
  "Informe al Encargado de laboratorio sobre cualquier equipo roto o piezas defectuosas. No abra o intente reparar cualquier equipo.",
  "Los bienes de la Universidad no deben ser sacados del laboratorio.",
  "Al finalizar, todos los equipos eléctricos deben dejarse apagados.",
  "A cualquier persona que viole cualquier regla o reglamento se le negará el acceso a estas instalaciones.",
  "Antes del ingreso al laboratorio lea la información de seguridad del laboratorio.",
];

const EQUIPMENTS = [
  { name: "Equipo de Destilación Continua", description: "Equipo para separación por destilación en operación continua." },
  { name: "Equipo de Extracción Líquido-Líquido", description: "Separación de componentes por diferencias de solubilidad." },
  { name: "Equipo de Fluidización", description: "Estudio del comportamiento de partículas en lechos fluidizados." },
  { name: "Refractómetro", description: "Medición del índice de refracción de líquidos." },
  { name: "Equipo de Absorción", description: "Absorción gas-líquido para captura de gases (especialmente CO2)." },
  { name: "Equipo de Destilación por Carga", description: "Destilación batch en laboratorio." },
  { name: "Equipo de Filtración a Presión Constante", description: "Separación mecánica/física de sustancias por filtración." },
  { name: "Equipo de Secado por Convección", description: "Eliminación eficiente de humedad de sólidos por evaporación." },
];

const REAGENTS = [
  { name: "Venotherm 32", quantity: 0, unit: "L" },
  { name: "Hexano", formula: "C6H14", quantity: 0, unit: "L", hazardClass: "Inflamable" },
  { name: "Tierra diatomea", quantity: 0, unit: "kg" },
  { name: "Parafina Refinada", quantity: 0, unit: "kg" },
  { name: "Carbonato de Calcio", formula: "CaCO3", quantity: 0, unit: "kg" },
  { name: "Alcohol Isopropílico", formula: "C3H8O", quantity: 0, unit: "L", hazardClass: "Inflamable" },
  { name: "N-Butanol", formula: "C4H10O", quantity: 0, unit: "L", hazardClass: "Inflamable" },
  { name: "Aceite ISO 46", quantity: 0, unit: "L" },
  { name: "Sal Industrial", formula: "NaCl", quantity: 0, unit: "kg" },
];

const MANUALS = [
  {
    title: "Equipo de absorción",
    subject: "Absorción gas-líquido",
    description:
      "Capacitación en el uso y entendimiento del equipo de absorción gas-líquido para separar y capturar gases específicos, especialmente CO2.",
    fileUrl: "https://example.com/manuales/absorcion.pdf",
    visibility: "students",
    tags: ["absorción", "gas-líquido", "co2"],
  },
  {
    title: "Equipo de secado por convección",
    subject: "Secado por convección",
    description:
      "Eliminación eficiente de humedad de sólidos mediante evaporación, esencial para la conservación y calidad de productos.",
    fileUrl: "https://example.com/manuales/secado.pdf",
    visibility: "students",
    tags: ["secado", "convección", "humedad"],
  },
  {
    title: "Equipo de extracción líquido-líquido",
    subject: "Extracción L-L",
    description:
      "Uso correcto del equipo de extracción líquido-líquido. Separación de componentes basada en diferencias de solubilidad.",
    fileUrl: "https://example.com/manuales/extraccion.pdf",
    visibility: "students",
    tags: ["extracción", "líquido-líquido", "solubilidad"],
  },
  {
    title: "Equipo de filtración a presión constante",
    subject: "Filtración",
    description:
      "Uso adecuado del equipo de filtración a presión constante. Separación mecánica de sustancias.",
    fileUrl: "https://example.com/manuales/filtracion.pdf",
    visibility: "students",
    tags: ["filtración", "presión", "mecánica"],
  },
];

const SPACES = [
  { name: "Mesón A", description: "Mesón de trabajo principal", capacity: 4, isActive: true },
  { name: "Mesón B", description: "Mesón secundario", capacity: 4, isActive: true },
  { name: "Área de Destilación", description: "Zona dedicada a equipos de destilación", capacity: 6, isActive: true },
  { name: "Área de Filtración", description: "Zona dedicada a equipos de filtración", capacity: 4, isActive: true },
];

(async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/unimet-lab";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const now = new Date();

  console.log("→ Sembrando profesores...");
  for (const p of PROFESSORS) {
    await db.collection("public_professors").updateOne(
      { name: p.name },
      { $set: { ...p, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true },
    );
  }

  console.log("→ Sembrando normativas de seguridad...");
  for (let i = 0; i < SAFETY_RULES.length; i++) {
    await db.collection("safety_rules").updateOne(
      { order: i + 1 },
      {
        $set: {
          title: `Norma ${i + 1}`,
          content: SAFETY_RULES[i],
          order: i + 1,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
  }

  console.log("→ Sembrando equipos...");
  for (const e of EQUIPMENTS) {
    await db.collection("equipments").updateOne(
      { name: e.name },
      {
        $set: { ...e, status: "available", updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
  }

  console.log("→ Sembrando reactivos...");
  for (const r of REAGENTS) {
    await db.collection("reagents").updateOne(
      { name: r.name },
      {
        $set: { ...r, lowStockThreshold: 1, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
  }

  console.log("→ Sembrando manuales...");
  for (const m of MANUALS) {
    await db.collection("manuals").updateOne(
      { title: m.title },
      {
        $set: { ...m, uploadedBy: "seed", updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
  }

  console.log("→ Sembrando espacios...");
  for (const s of SPACES) {
    await db.collection("spaces").updateOne(
      { name: s.name },
      {
        $set: { ...s, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
  }

  console.log("✔ Seed completo");
  await client.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
