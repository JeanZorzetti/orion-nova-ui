import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error('Usage: node convert-image.mjs <input> <output>');
  process.exit(1);
}

console.log(`Converting ${inputPath} to ${outputPath}...`);

try {
  await sharp(inputPath)
    .webp({ quality: 85, effort: 6 })
    .toFile(outputPath);

  const stats = await sharp(outputPath).metadata();
  console.log(`✓ Converted successfully!`);
  console.log(`  Dimensions: ${stats.width}x${stats.height}`);
  console.log(`  Format: ${stats.format}`);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
