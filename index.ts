import { readdirSync, readFileSync } from "fs";
import { join } from "path";

interface Technology {
  cats: number[];
  website: string;
  description?: string;
  icon?: string;
  cpe?: string;
  saas?: boolean;
  oss?: boolean;
  pricing?: string[];
  implies?: string | string[];
  requires?: string | string[];
  requiresCategory?: string | string[];
  excludes?: string | string[];

  // technology detection patterns
  cookies?: { [x: string]: string };
  dom?: unknown; // I'll deal with this later
  dns?: { [x: string]: string };
  js?: { [x: string]: string };
  headers?: { [x: string]: string };
  html?: unknown; // I'll deal with this later
  text?: string | string[];
  css?: string | string[];
  robots?: string | string[];
  url?: string | string[];
  xhr?: string | string[];
  meta?: { [x: string]: string };
  scriptSrc?: string | string[];
  scripts?: string | string[];
}

interface Technologies {
  [x: string]: Technology;
}

// this feels dirty... :(
function main() {
  let technologies: Technologies = {};
  const technologiesPath = join(__dirname, "technologies");

  const files = readdirSync(technologiesPath);
  files.forEach((file) => {
    const filePath = join(technologiesPath, file);
    const fileData = readFileSync(filePath, "utf-8");
    const dataObj = JSON.parse(fileData) as Technologies;

    technologies = { ...technologies, ...dataObj };
  });

  const techs: Technology[] = Object.values(technologies);

  // spoofed window obj
  let window = {};

  techs.forEach((tech) => {
    const js = tech.js;
    if (js) {
      // if a key string contains periods it's a nested object it seems
      // if a value contains a regex string we need to generate a usable string
      window = { ...window, ...js };
    }
  });
}

main();
