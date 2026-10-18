const fs = require('fs');
const { PNG } = require('pngjs');

// Extract chain links from between banners (y: 125..157 in left_strip)
const stripData = fs.readFileSync('public/images/chained/left_strip.png');
const strip = PNG.sync.read(stripData);

const width = strip.width;
const height = 32;
const chainPng = new PNG({ width, height });

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const srcY = 126 + y;
    const srcIdx = (srcY * width + x) * 4;
    const dstIdx = (y * width + x) * 4;

    const inLeft = x >= 23 && x <= 36;
    const inRight = x >= 83 && x <= 96;

    if (inLeft || inRight) {
      const r = strip.data[srcIdx];
      const g = strip.data[srcIdx + 1];
      const b = strip.data[srcIdx + 2];
      const isDarkBg = r < 55 && g < 50 && b < 50;

      if (isDarkBg) {
        chainPng.data[dstIdx + 3] = 0;
      } else {
        chainPng.data[dstIdx] = r;
        chainPng.data[dstIdx + 1] = g;
        chainPng.data[dstIdx + 2] = b;
        chainPng.data[dstIdx + 3] = strip.data[srcIdx + 3];
      }
    } else {
      chainPng.data[dstIdx + 3] = 0;
    }
  }
}

fs.writeFileSync('public/images/chained/chain_segment.png', PNG.sync.write(chainPng));
console.log('Saved chain_segment.png');
