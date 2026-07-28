import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const srcLogo = 'c:/NH2/public/logo-512.png';
const targetIco = 'c:/NH2/public/favicon.ico';
const tempDir = 'c:/NH2/scratch/favicon-temp';

async function generateFavicon() {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const sizes = [16, 32, 48];
  const pngPaths = [];

  for (const size of sizes) {
    const pngPath = path.join(tempDir, `favicon-${size}.png`);
    await sharp(srcLogo)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(pngPath);
    pngPaths.push(pngPath);
  }

  console.log('Generated PNG sizes:', sizes.join(', '));

  // Combine 16x16, 32x32, 48x48 PNGs into a multi-resolution ICO file
  const icoBuffer = await pngToIco(pngPaths);

  fs.writeFileSync(targetIco, icoBuffer);

  // Clean up temp files
  pngPaths.forEach(p => fs.unlinkSync(p));
  fs.rmdirSync(tempDir);

  const stats = fs.statSync(targetIco);
  const header = icoBuffer.slice(0, 4).toString('hex');

  console.log(`\nFavicon generation complete!`);
  console.log(`Target path: ${targetIco}`);
  console.log(`New file size: ${stats.size} bytes`);
  console.log(`File header hex: ${header} (00000100 indicates valid Windows ICO container format)`);
}

generateFavicon().catch(err => {
  console.error('Error generating favicon:', err);
  process.exit(1);
});
