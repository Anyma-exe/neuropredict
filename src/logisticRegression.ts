import type { Subject } from './dataGenerator';

// ============================================================
// logisticRegression.ts
// Pure logic — a small multinomial logistic regression trained
// by gradient descent, from scratch (no ML library). This is
// what makes the model genuinely "explainable": we hold every
// weight ourselves, so we can show exactly how each variable
// pushed the prediction one way or another.
// ============================================================

export type Model = {
  // weights[classIndex][featureIndex] — one row of weights per profile
  weights: number[][];
  bias: number[];
};

const NUM_FEATURES = 4;
const NUM_CLASSES = 3;

// ------------------------------------------------------------
// Softmax: turns raw per-class scores into probabilities that
// sum to 1. Subtracting the max score first is a standard trick
// to avoid huge numbers blowing up (numerical stability).
// ------------------------------------------------------------
function softmax(scores: number[]): number[] {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

// ------------------------------------------------------------
// Computes raw scores for each class, then applies softmax.
// This is the "forward pass" — given a model and a subject's
// 4 features, what does the model currently predict?
// ------------------------------------------------------------
export function predict(model: Model, features: number[]): number[] {
  const scores = model.weights.map(
    (classWeights, c) =>
      classWeights.reduce((sum, w, i) => sum + w * features[i], 0) +
      model.bias[c]
  );
  return softmax(scores);
}

// ------------------------------------------------------------
// Trains the model on a dataset via gradient descent.
// Each epoch: for every subject, compare the model's prediction
// to the true label, then nudge every weight slightly in the
// direction that would have reduced that error.
// ------------------------------------------------------------
export function trainModel(
  dataset: Subject[],
  epochs = 300,
  learningRate = 0.05
): Model {
  // Start with all weights at 0 — the model knows nothing yet.
  let weights: number[][] = Array.from({ length: NUM_CLASSES }, () =>
    Array(NUM_FEATURES).fill(0)
  );
  let bias: number[] = Array(NUM_CLASSES).fill(0);

  for (let epoch = 0; epoch < epochs; epoch++) {
    for (const subject of dataset) {
      const probs = predict({ weights, bias }, subject.features);

      // "one-hot" target: 1 for the true class, 0 for the others.
      const target = Array(NUM_CLASSES).fill(0);
      target[subject.label] = 1;

      // Gradient descent update: the error (probs - target) tells us
      // how wrong each class's probability was. We shift each weight
      // by a small step (learningRate) in the direction that reduces
      // that error, scaled by how strongly that feature was involved.
      for (let c = 0; c < NUM_CLASSES; c++) {
        const error = probs[c] - target[c];
        for (let i = 0; i < NUM_FEATURES; i++) {
          weights[c][i] -= learningRate * error * subject.features[i];
        }
        bias[c] -= learningRate * error;
      }
    }
  }

  return { weights, bias };
}

// ------------------------------------------------------------
// Explainability: for a given subject and the predicted class,
// how much did each variable contribute to that class's score?
// We take weight × feature value per variable, then express each
// as a percentage of the total (absolute) contribution — this is
// what ContributionChart will display as bars.
// ------------------------------------------------------------
export function explainPrediction(
  model: Model,
  features: number[],
  predictedClass: number
): { featureIndex: number; contribution: number }[] {
  const classWeights = model.weights[predictedClass];
  const raw = classWeights.map((w, i) => w * features[i]);
  const totalAbs = raw.reduce((sum, v) => sum + Math.abs(v), 0) || 1;

  return raw.map((value, featureIndex) => ({
    featureIndex,
    contribution: (value / totalAbs) * 100, // as a percentage, signed
  }));
}
