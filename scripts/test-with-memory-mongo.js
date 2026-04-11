/**
 * Smoke test runner: arranca un MongoDB en memoria, exporta MONGODB_URI
 * y lanza el backend compilado. Útil para validar que la app bootea sin
 * depender de un Mongo externo.
 *
 * Uso: node scripts/test-with-memory-mongo.js
 */
const { MongoMemoryServer } = require("mongodb-memory-server");
const { spawn } = require("child_process");
const path = require("path");

(async () => {
  console.log("→ Iniciando MongoDB in-memory...");
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log("✔ MongoDB in-memory listo en", uri);

  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = "development";

  const child = spawn(
    process.execPath,
    [path.join(__dirname, "..", "dist", "main.js")],
    { env: process.env, stdio: "inherit" },
  );

  const shutdown = async () => {
    console.log("\n→ Apagando...");
    child.kill();
    await mongod.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  child.on("exit", async (code) => {
    console.log(`Backend salió con código ${code}`);
    await mongod.stop();
    process.exit(code || 0);
  });
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
