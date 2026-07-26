import React, { useState, useEffect } from 'react';
import { colors, fonts } from './theme';
import { DisclaimerBanner } from './DisclaimerBanner';
import { Section } from './Section';
import { SubjectPanel } from './SubjectPanel';
import { ResultCard } from './ResultCard';
import { ContributionChart } from './ContributionChart';
import { ComparisonRadar } from './ComparisonRadar';
import { generateDataset, PROFILES } from './dataGenerator';
import { trainModel, predict, explainPrediction } from './logisticRegression';
import type { Model } from './logisticRegression';

const fontImport = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=VT323&family=Space+Mono:wght@400;700&display=swap');
  `}</style>
);

const PROFILE_NAMES = PROFILES.map((p) => p.name);

export default function App() {
  // The 4 cognitive variables, on a -3..3 scale (0 = average).
  const [values, setValues] = useState({
    speed: 0,
    memory: 0,
    inhibition: 0,
    flexibility: 0,
  });

  // The trained model — null until training finishes.
  const [model, setModel] = useState<Model | null>(null);

  // Results of the last "Analyze" click — null until then.
  const [probabilities, setProbabilities] = useState<number[] | null>(null);
  const [contributions, setContributions] = useState<
    { featureIndex: number; contribution: number }[] | null
  >(null);
  const [analyzedFeatures, setAnalyzedFeatures] = useState<number[] | null>(null);

  // useEffect with an empty dependency array ([]) runs its code
  // exactly once, right after the component first renders. This
  // is the right place to generate the dataset and train the
  // model — we don't want to retrain on every re-render.
  useEffect(() => {
    const dataset = generateDataset(80);
    const trained = trainModel(dataset);
    setModel(trained);
  }, []);

  function handleChange(key: string, newVal: number) {
    setValues((prev) => ({ ...prev, [key]: newVal }));
  }

  function handleRandomize() {
    setValues({
      speed: Math.random() * 6 - 3,
      memory: Math.random() * 6 - 3,
      inhibition: Math.random() * 6 - 3,
      flexibility: Math.random() * 6 - 3,
    });
  }

  function handleAnalyze() {
    if (!model) return; // model still training — button shouldn't be usable yet anyway

    const features = [values.speed, values.memory, values.inhibition, values.flexibility];
    const probs = predict(model, features);
    const topClass = probs.indexOf(Math.max(...probs));
    const explanation = explainPrediction(model, features, topClass);

    setProbabilities(probs);
    setContributions(explanation);
    setAnalyzedFeatures(features);
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      {fontImport}
      <DisclaimerBanner />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{
          fontFamily: fonts.display,
          color: colors.text,
          fontSize: '40px',
          fontWeight: 400,
          marginBottom: '0px',
          letterSpacing: '0.03em',
          textShadow: `0 0 8px ${colors.pink}`,
        }}>
          Neuropredict
        </h1>
        <p style={{
          fontFamily: fonts.mono,
          color: colors.textDim,
          fontSize: '13px',
          marginBottom: '28px',
        }}>
          Explainable AI — simulated cognitive profiles
          {!model && ' — training model...'}
        </p>

        <Section step="01" title="Generate a subject">
          <SubjectPanel
            values={values}
            onChange={handleChange}
            onRandomize={handleRandomize}
            onAnalyze={handleAnalyze}
          />
        </Section>

        <Section step="02" title="Estimated profile">
          <ResultCard profileNames={PROFILE_NAMES} probabilities={probabilities} />
        </Section>

        <Section step="03" title="Why this prediction?">
          <ContributionChart contributions={contributions} />
        </Section>

        <Section step="04" title="Comparison to reference group">
          <ComparisonRadar subjectFeatures={analyzedFeatures} />
        </Section>
      </div>
    </div>
  );
}
