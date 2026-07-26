// ============================================================
// dataGenerator.ts
// Pure logic — no React, no DOM. Generates a synthetic dataset
// of fake "subjects" with 4 cognitive variables each, belonging
// to one of 3 simulated cognitive profiles.
// ============================================================

// A single subject: 4 feature values + which profile it belongs to.
export type Subject = {
  features: [number, number, number, number]; // [speed, memory, inhibition, flexibility]
  label: number; // index into PROFILES
};

// The 3 profiles we're simulating. Each has a "mean vector":
// the typical (average) value for each variable, on a z-score-like
// scale where 0 = population average, negative = below, positive = above.
// These means are PURELY ILLUSTRATIVE — chosen to make the profiles
// visually/statistically distinguishable, not based on real clinical data.
export const PROFILES = [
  {
    name: 'Balanced',
    means: [0, 0, 0, 0] as [number, number, number, number],
  },
  {
    name: 'Strong attention / limited working memory',
    means: [0.8, -1.2, 1.0, 0.2] as [number, number, number, number],
  },
  {
    name: 'Global slowing',
    means: [-1.5, -0.8, -0.6, -1.0] as [number, number, number, number],
  },
];

// ------------------------------------------------------------
// Box-Muller transform: converts two uniform random numbers
// (what Math.random() gives us) into one normally-distributed
// ("bell curve") random number. This is the standard trick since
// JS has no built-in gaussian random function.
// ------------------------------------------------------------
function gaussianRandom(mean = 0, stdDev = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

// ------------------------------------------------------------
// Generates `nPerClass` synthetic subjects for EACH profile,
// then shuffles them together. This is what will train the
// logistic regression model in the next step.
// ------------------------------------------------------------
export function generateDataset(nPerClass = 80, noiseStdDev = 0.9): Subject[] {
  const subjects: Subject[] = [];

  PROFILES.forEach((profile, labelIndex) => {
    for (let i = 0; i < nPerClass; i++) {
      const features = profile.means.map((mean) =>
        gaussianRandom(mean, noiseStdDev)
      ) as [number, number, number, number];

      subjects.push({ features, label: labelIndex });
    }
  });

  // Shuffle so the training data isn't ordered by class
  // (important later: gradient descent trains better on shuffled data).
  for (let i = subjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [subjects[i], subjects[j]] = [subjects[j], subjects[i]];
  }

  return subjects;
}
