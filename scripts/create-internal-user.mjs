import { createSupabaseAdminClient, ensureInternalUser } from "./lib/supabase-admin.mjs";

function readArg(name) {
  const prefix = `--${name}=`;
  const exactIndex = process.argv.indexOf(`--${name}`);

  if (exactIndex >= 0) {
    return process.argv[exactIndex + 1];
  }

  const withValue = process.argv.find((arg) => arg.startsWith(prefix));
  return withValue ? withValue.slice(prefix.length) : undefined;
}

function parseRole(value) {
  if (value !== "admin" && value !== "editor") {
    throw new Error("`--role` debe ser `admin` o `editor`.");
  }

  return value;
}

function parseActive(value) {
  if (value === undefined) {
    return true;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error("`--active` debe ser `true` o `false`.");
}

async function main() {
  const email = readArg("email");
  const password = readArg("password");
  const role = parseRole(readArg("role") ?? "editor");
  const isActive = parseActive(readArg("active"));
  const fullName = readArg("name") ?? null;

  if (!email || !password) {
    throw new Error(
      "Uso: npm run cms:create-user -- --email usuario@demo.local --password Secret123! --role admin --active true --name \"Usuario Demo\"",
    );
  }

  const supabase = createSupabaseAdminClient();
  const result = await ensureInternalUser({
    supabase,
    email,
    password,
    role,
    isActive,
    fullName,
  });

  console.log(`Usuario interno ${result.authAction === "created" ? "creado" : "sincronizado"} correctamente.`);
  console.log(`- id: ${result.userId}`);
  console.log(`- email: ${result.email}`);
  console.log(`- role: ${result.role}`);
  console.log(`- active: ${result.isActive}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
