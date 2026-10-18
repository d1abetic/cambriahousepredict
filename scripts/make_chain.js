const fs = require('fs');
const { PNG } = require('pngjs');

function extractChain(srcPath, isRight, outFile) {
  const src = PNG.sync.read(fs.readFileSync(srcPath));
  let cropY = 127;
  let cropH = 32;
  let out = new PNG({ width: 120, height: cropH });

  const leftMin = isRight ? 26 : 22;
  const leftMax = isRight ? 40 : 36;
  const rightMin = isRight ? 86 : 82;
  const rightMax = isRight ? 100 : 96;

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < 120; x++) {
      let sIdx = ((cropY + y) * 120 + x) * 4;
      let dIdx = (y * 120 + x) * 4;
      let r = src.data[sIdx], g = src.data[sIdx + 1], b = src.data[sIdx + 2];
      
      const inChain = (x >= leftMin && x <= leftMax) || (x >= rightMin && x <= rightMax);
      const isDarkBg = r < 55 && g < 50 && b < 50;

      if (inChain && !isDarkBg) {
        out.data[dIdx] = r;
        out.data[dIdx + 1] = g;
        out.data[dIdx + 2] = b;
        out.data[dIdx + 3] = src.data[sIdx + 3];
      } else {
        out.data[dIdx + 3] = 0;
      }
    }
  }

  const buf = PNG.sync.write(out);
  fs.writeFileSync(outFile, buf);
  const mirrored = outFile.replace('public/images/chained/', 'public/chained/');
  if (mirrored !== outFile) {
    fs.mkdirSync('public/chained', { recursive: true });
    fs.writeFileSync(mirrored, buf);
  }
}

extractChain('public/images/chained/left_strip.png', false, 'public/images/chained/chain_left.png');
extractChain('public/images/chained/right_strip.png', true, 'public/images/chained/chain_right.png');
console.log('Saved chain_left and chain_right PNGs');

