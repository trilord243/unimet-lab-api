/**
 * Crea (o actualiza) un usuario superadmin en la BD.
 * Uso:
 *   node scripts/create-superadmin.js <email> <password> <name>
 *
 * Requiere MONGODB_URI en el entorno.
 */
const crypto = require("crypto");
const { MongoClient } = require("mongodb");

function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(plain, salt, 10000, 64, "sha512")
    .toString("hex");
  return `${salt}$${hash}`;
}

(async () => {
  const [, , email, password, name] = process.argv;
  if (!email || !password || !name) {
    console.error("Uso: node scripts/create-superadmin.js <email> <password> <name>");
    process.exit(1);
  }
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/unimet-lab";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const users = db.collection("users");

  const existing = await users.findOne({ email });
  const doc = {
    name,
    email,
    password: hashPassword(password),
    role: "superadmin",
    emailVerified: true,
    updatedAt: new Date(),
  };
  if (existing) {
    await users.updateOne({ email }, { $set: doc });
    console.log(`Actualizado superadmin: ${email}`);
  } else {
    await users.insertOne({ ...doc, createdAt: new Date() });
    console.log(`Creado superadmin: ${email}`);
  }
  await client.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
