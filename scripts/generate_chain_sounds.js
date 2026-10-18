const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'sounds');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createWavBuffer(samples, sampleRate = 44100) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Find peak for normalization
  let maxAmp = 0;
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i]);
    if (abs > maxAmp) maxAmp = abs;
  }
  const scale = maxAmp > 0 ? 0.9 / maxAmp : 1.0;

  // Write 16-bit PCM samples
  for (let i = 0; i < samples.length; i++) {
    const val = Math.max(-1, Math.min(1, samples[i] * scale));
    const int16 = Math.floor(val < 0 ? val * 32768 : val * 32767);
    buffer.writeInt16LE(int16, 44 + i * 2);
  }

  return buffer;
}

// Generate realistic metallic chain links collision
function generateChainRattle({
  durationSec = 0.28,
  sampleRate = 44100,
  linkStrikes = [
    { delay: 0.0, baseFreq: 1350, weight: 1.0, decay: 0.14 },
    { delay: 0.032, baseFreq: 1620, weight: 0.75, decay: 0.11 },
    { delay: 0.075, baseFreq: 1200, weight: 0.55, decay: 0.09 },
  ],
}) {
  const totalSamples = Math.floor(durationSec * sampleRate);
  const samples = new Float32Array(totalSamples);

  for (const strike of linkStrikes) {
    const startIdx = Math.floor(strike.delay * sampleRate);
    const strikeSamples = Math.floor(strike.decay * sampleRate);
    const endIdx = Math.min(totalSamples, startIdx + strikeSamples);

    // Inharmonic metallic modal frequencies for an iron ring/chain link
    const modes = [
      { f: strike.baseFreq * 0.42, a: 0.35, d: 0.08 }, // Low iron ring body
      { f: strike.baseFreq * 1.0, a: 1.0, d: strike.decay }, // Fundamental ring
      { f: strike.baseFreq * 1.73, a: 0.65, d: strike.decay * 0.8 }, // Second harmonic
      { f: strike.baseFreq * 2.45, a: 0.45, d: strike.decay * 0.65 }, // High metallic chime
      { f: strike.baseFreq * 3.65, a: 0.3, d: strike.decay * 0.5 }, // Piercing iron ping
    ];

    for (let i = startIdx; i < endIdx; i++) {
      const t = (i - startIdx) / sampleRate;
      let s = 0;

      // Resonant metallic modes
      for (const m of modes) {
        s += Math.sin(2 * Math.PI * m.f * t) * Math.exp(-t / m.d) * m.a;
      }

      // Initial impact transient (burst click)
      if (t < 0.012) {
        const noise = (Math.random() * 2 - 1) * Math.exp(-t / 0.003) * 1.8;
        s += noise;
      }

      samples[i] += s * strike.weight;
    }
  }

  return createWavBuffer(samples, sampleRate);
}

// Variation 1: Crisp double-link rattle (scrolling down)
const soundDown1 = generateChainRattle({
  durationSec: 0.25,
  linkStrikes: [
    { delay: 0.0, baseFreq: 1380, weight: 1.0, decay: 0.13 },
    { delay: 0.028, baseFreq: 1650, weight: 0.8, decay: 0.11 },
    { delay: 0.065, baseFreq: 1220, weight: 0.6, decay: 0.09 },
  ],
});
fs.writeFileSync(path.join(outputDir, 'chain_down_1.wav'), soundDown1);

// Variation 2: Heavier clank (scrolling down fast)
const soundDown2 = generateChainRattle({
  durationSec: 0.28,
  linkStrikes: [
    { delay: 0.0, baseFreq: 1250, weight: 1.1, decay: 0.16 },
    { delay: 0.038, baseFreq: 1480, weight: 0.85, decay: 0.12 },
    { delay: 0.082, baseFreq: 1100, weight: 0.65, decay: 0.1 },
  ],
});
fs.writeFileSync(path.join(outputDir, 'chain_down_2.wav'), soundDown2);

// Variation 3: Lighter tension link chink (scrolling up)
const soundUp1 = generateChainRattle({
  durationSec: 0.22,
  linkStrikes: [
    { delay: 0.0, baseFreq: 1580, weight: 0.95, decay: 0.12 },
    { delay: 0.025, baseFreq: 1820, weight: 0.75, decay: 0.1 },
  ],
});
fs.writeFileSync(path.join(outputDir, 'chain_up_1.wav'), soundUp1);

// Variation 4: Multiple rapid links chinking (scrolling up)
const soundUp2 = generateChainRattle({
  durationSec: 0.24,
  linkStrikes: [
    { delay: 0.0, baseFreq: 1640, weight: 1.0, decay: 0.11 },
    { delay: 0.022, baseFreq: 1420, weight: 0.7, decay: 0.09 },
    { delay: 0.052, baseFreq: 1780, weight: 0.5, decay: 0.08 },
  ],
});
fs.writeFileSync(path.join(outputDir, 'chain_up_2.wav'), soundUp2);

console.log('Successfully generated 4 authentic chain sound WAV files in public/sounds/');
