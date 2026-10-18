const fs = require('fs');
const { PNG } = require('pngjs');

function cleanBanner(srcStrip, cropY, fileOut, isRight) {
  const stripData = fs.readFileSync(srcStrip);
  const strip = PNG.sync.read(stripData);
  const width = strip.width;
  const height = 143;

  const outPng = new PNG({ width, height });

  const bannerLeft = isRight ? 15 : 11;
  const bannerRight = isRight ? 109 : 108;
  const bannerTop = 15;
  const bannerBottom = 126;

  const leftChainMin = isRight ? 26 : 22;
  const leftChainMax = isRight ? 39 : 35;
  const rightChainMin = isRight ? 86 : 82;
  const rightChainMax = isRight ? 99 : 95;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = ((cropY + y) * width + x) * 4;
      const dstIdx = (y * width + x) * 4;

      const r = strip.data[srcIdx];
      const g = strip.data[srcIdx + 1];
      const b = strip.data[srcIdx + 2];
      const a = strip.data[srcIdx + 3];

      const inBanner = x >= bannerLeft && x <= bannerRight && y >= bannerTop && y <= bannerBottom;
      const inChain = (x >= leftChainMin && x <= leftChainMax) || (x >= rightChainMin && x <= rightChainMax);
      const inChainY = y < bannerTop || y > bannerBottom;

      if (inBanner) {
        outPng.data[dstIdx] = r;
        outPng.data[dstIdx + 1] = g;
        outPng.data[dstIdx + 2] = b;
        outPng.data[dstIdx + 3] = a;
      } else if (inChain && inChainY) {
        // Metallic chain
        const isDarkBg = r < 55 && g < 50 && b < 50;
        if (isDarkBg) {
          outPng.data[dstIdx + 3] = 0;
        } else {
          outPng.data[dstIdx] = r;
          outPng.data[dstIdx + 1] = g;
          outPng.data[dstIdx + 2] = b;
          outPng.data[dstIdx + 3] = a;
        }
      } else {
        outPng.data[dstIdx + 3] = 0;
      }
    }
  }

  const outBuf = PNG.sync.write(outPng);
  fs.writeFileSync(fileOut, outBuf);
  console.log(`Saved pixel-perfect banner -> ${fileOut}`);
}

const leftStrip = 'public/images/chained/left_strip.png';
const rightStrip = 'public/images/chained/right_strip.png';

const leftNames = ['warwick', 'montblanc', 'dover', 'eyras'];
leftNames.forEach((name, i) => {
  cleanBanner(leftStrip, i * 143, `public/images/chained/${name}.png`, false);
});

const rightNames = ['thornhill', 'bloodstone', 'armagnac', 'blackfort'];
rightNames.forEach((name, i) => {
  cleanBanner(rightStrip, i * 143, `public/images/chained/${name}.png`, true);
});
