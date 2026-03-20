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

const DEMO_USERS = [
  {
    email: "admin@festapp.local",
    role: "admin",
    isActive: true,
    fullName: "Admin Demo",
  },
  {
    email: "editor@festapp.local",
    role: "editor",
    isActive: true,
    fullName: "Editor Demo",
  },
  {
    email: "inactive@festapp.local",
    role: "editor",
    isActive: false,
    fullName: "Inactive Demo",
  },
];

async function main() {
  const password = readArg("password");

  if (!password) {
    throw new Error(
      "Uso: npm run cms:seed-users -- --password Secret123!",
    );
  }

  const supabase = createSupabaseAdminClient();

  for (const demoUser of DEMO_USERS) {
    const result = await ensureInternalUser({
      supabase,
      password,
      ...demoUser,
    });

    console.log(
      `${demoUser.email} -> ${result.authAction === "created" ? "created" : "updated"} / role=${demoUser.role} / active=${demoUser.isActive}`,
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
