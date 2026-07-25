const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const inputPath = path.join(__dirname, '../public/kalrav_icon.png');
  const publicDir = path.join(__dirname, '../public');

  const sizes = [
    { size: 48, name: 'favicon-48x48.png' },
    { size: 96, name: 'favicon-96x96.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'favicon-192x192.png' },
    { size: 192, name: 'favicon.png' },
    { size: 512, name: 'favicon-512x512.png' },
  ];

  for (const item of sizes) {
    const outputPath = path.join(publicDir, item.name);
    
    // Resize image nicely centered in a square canvas with small padding
    const padding = Math.round(item.size * 0.05); // 5% padding around icon
    const iconSize = item.size - (padding * 2);

    const resizedIcon = await sharp(inputPath)
      .resize(iconSize, iconSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    await sharp({
      create: {
        width: item.size,
        height: item.size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      }
    })
      .composite([{ input: resizedIcon, gravity: 'center' }])
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(outputPath);

    console.log(`Generated ${item.name} (${item.size}x${item.size})`);
  }

  // Also create high-res root favicon.ico (copy 512x512 PNG to favicon.ico so browser tab inspection is HD sharp)
  const icoPath = path.join(publicDir, 'favicon.ico');
  fs.copyFileSync(path.join(publicDir, 'favicon-512x512.png'), icoPath);
  console.log('Copied favicon-512x512.png to favicon.ico');
}

generateFavicons().catch(console.error);
