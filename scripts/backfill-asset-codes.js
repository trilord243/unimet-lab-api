/**
 * Backfill de assetCodes para items de inventario creados antes de Sprint 4.
 * Idempotente: limpia duplicados previos y asigna códigos únicos.
 *
 * Ejecutar: node scripts/backfill-asset-codes.js
 */
const { MongoClient } = require("mongodb");

async function nextCode(db, counterName, prefix) {
  await db
    .collection("counters")
    .updateOne(
      { name: counterName },
      { $inc: { value: 1 } },
      { upsert: true },
    );
  const current = await db
    .collection("counters")
    .findOne({ name: counterName });
  const num = current?.value ?? 1;
  return `${prefix}-${String(num).padStart(4, "0")}`;
}

(async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/unimet-lab";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // 1. Limpiar duplicados del intento anterior (todos con -0001)
  const cleanup = [
    { col: "reagents", prefix: "REAC" },
    { col: "equipments", prefix: "EQUIP" },
    { col: "materials", prefix: "MAT" },
  ];
  for (const c of cleanup) {
    const dupRegex = new RegExp(`^${c.prefix}-0001$`);
    const dupCount = await db
      .collection(c.col)
      .countDocuments({ assetCode: dupRegex });
    if (dupCount > 1) {
      console.log(
        `→ ${c.col}: ${dupCount} duplicados de ${c.prefix}-0001, limpiando`,
      );
      await db
        .collection(c.col)
        .updateMany({ assetCode: dupRegex }, { $unset: { assetCode: "" } });
      await db
        .collection("counters")
        .updateOne(
          { name: c.col },
          { $set: { value: 0 } },
          { upsert: true },
        );
    }
  }

  // 2. Asignar códigos a los que no tienen
  for (const cfg of cleanup) {
    const col = db.collection(cfg.col);
    const items = await col
      .find({ $or: [{ assetCode: { $exists: false } }, { assetCode: null }] })
      .sort({ createdAt: 1 })
      .toArray();
    if (items.length === 0) {
      console.log(`→ ${cfg.col}: nada que backfillear`);
      continue;
    }
    console.log(`→ ${cfg.col}: ${items.length} ítems sin assetCode`);
    for (const item of items) {
      const code = await nextCode(db, cfg.col, cfg.prefix);
      await col.updateOne({ _id: item._id }, { $set: { assetCode: code } });
      console.log(`   ${code} → ${item.name}`);
    }
  }

  console.log("✔ Backfill completo");
  await client.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
