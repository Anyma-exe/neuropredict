# Neuropredict

### Explainable AI for Simulated Cognitive Profiles

> An interactive React/TypeScript tool demonstrating a fully interpretable machine learning pipeline — from synthetic data generation to prediction and explanation — applied to simulated cognitive profiles.

`React` `TypeScript` `MIT License` `Field: Neuroscience / Explainable AI`

---

> ⚠️ **Educational project only.** All data is synthetically generated. Neuropredict has no diagnostic value and is not intended for clinical or medical use of any kind.

---

## Research Context

Machine learning models used to interpret neuropsychological or cognitive data are often "black boxes" — accurate, but unable to explain *why* a given prediction was made. In applied cognitive science, this opacity is a real limitation: understanding which variables drove a decision often matters as much as the decision itself.

**Research question:** *Can a fully transparent, from-scratch model — trained entirely in the browser — produce cognitive profile predictions that are both understandable and traceable to their inputs?*

Neuropredict explores this with a deliberately simple, self-implemented multinomial logistic regression rather than a black-box classifier or a post-hoc explainability layer (e.g. SHAP). Every prediction is explained using the model's own learned weights — the explanation *is* the mechanism, not an approximation of it.

## What It Does

| Step | Description |
|---|---|
| Synthetic subject generation | Simulates subjects across 3 cognitive profiles using Gaussian-distributed scores on 4 variables |
| Model training | Trains a multinomial logistic regression via gradient descent, live in the browser |
| Prediction | Estimates the most likely cognitive profile for a given subject, with per-class confidence |
| Explanation | Decomposes the prediction into each variable's signed contribution, derived directly from the model's weights |
| Comparison | Visualizes the subject against a reference ("healthy average") profile on a radar chart |

## Cognitive Variables

- **Processing speed**
- **Working memory**
- **Inhibition**
- **Cognitive flexibility**

Each simulated profile (e.g. *Balanced*, *Strong attention / limited working memory*, *Global slowing*) is defined by a distinct mean across these 4 variables, with added Gaussian noise to simulate realistic individual variation.

## Project Structure & Logic

The project is organized into modular components, separating data generation, model logic, and visualization.

**Core methodology:** everything — dataset generation, training, and inference — runs client-side, with no external ML library. This keeps the entire pipeline auditable in the source code.

```
src/
├── dataGenerator.ts        # synthetic subject generation (Gaussian noise per profile)
├── logisticRegression.ts   # from-scratch multinomial logistic regression + explanation logic
├── theme.ts                # shared design tokens
├── App.tsx                 # orchestrates state, training, and prediction
├── SubjectPanel.tsx         # input sliders for the 4 cognitive variables
├── ResultCard.tsx           # estimated profile + per-class confidence
├── ContributionChart.tsx    # per-variable contribution breakdown
├── ComparisonRadar.tsx      # subject vs. reference group radar chart
├── Section.tsx              # shared section/card wrapper
└── DisclaimerBanner.tsx      # persistent educational-use disclaimer
```

**Analytical goal:** demonstrate that interpretability doesn't require sacrificing a real, working model — a transparent logistic regression, trained and explained end-to-end, can be both scientifically legible and genuinely predictive on its own simulated data.

## Tech Stack

React · TypeScript · Vite — no ML libraries; the model is implemented from scratch.
