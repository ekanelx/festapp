import fs from "node:fs";
import path from "node:path";

const PROJECT_ENV_FILES = [".env.local", ".env"];

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseEnvFile(content) {
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = stripWrappingQuotes(line.slice(separatorIndex + 1).trim());

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

export function loadProjectEnv(baseDir = process.cwd()) {
  PROJECT_ENV_FILES.forEach((fileName) => {
    const filePath = path.join(baseDir, fileName);

    if (!fs.existsSync(filePath)) {
      return;
    }

    parseEnvFile(fs.readFileSync(filePath, "utf8"));
  });
}

export function readRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}.`);
  }

  return value;
}
