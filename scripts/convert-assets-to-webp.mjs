import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assetDirs = ["public/assets/diary", "public/assets/ui"];

for (const dir of assetDirs) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".png") {
      continue;
    }

    const source = path.join(dir, entry.name);
    const target = path.join(dir, `${path.basename(entry.name, ".png")}.webp`);

    await sharp(source)
      .webp({ quality: 82, effort: 6 })
      .toFile(target);

    console.log(`${source} -> ${target}`);
  }
}
