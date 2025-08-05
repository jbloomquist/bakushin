const { useState } = React;

function TrainingChartFiller() {
  const [inputs, setInputs] = useState(Array(17).fill(""));
  const [weights, setWeights] = useState(Array(5).fill(false));
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    speed: '',
    stamina: '',
    power: '',
    guts: '',
    wit: ''
  });

  const handleChange = (index, value) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
  };

  const handleStatChange = (key, value) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

  const handleWeightToggle = (index) => {
    const updated = [...weights];
    updated[index] = !updated[index];
    setWeights(updated);
  };

  const generateOutput = () => {
    const [s1, s2, s3, st1, st2, st3, p1, p2, p3, g1, g2, g3, g4, w1, w2, w3] = inputs;
    const tag = (index) => weights[index] ? ' 🔥' : '';
    const statLine = `${stats.speed} Speed, ${stats.stamina} Stamina, ${stats.power} Power, ${stats.guts} Guts, ${stats.wit} Wit`;
    const result = `${statLine}

Speed: +${s1} Speed, +${s2} Power, Support: ${s3 || "None"}${tag(0)}
Stamina: +${st1} Stamina, +${st2} Guts, Support: ${st3 || "None"}${tag(1)}
Power: +${p1} Power, +${p2}, Support: ${p3 || "None"}${tag(2)}
Guts: +${g1} Guts, +${g2} Power, +${g3} Speed, Support: ${g4 || "None"}${tag(3)}
Wit: +${w1} Wit, +${w2} Speed, Support: ${w3 || "None"}${tag(4)}`;

    setOutput(result);
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const inputLayout = [
    { label: "Speed", fields: [0, 1, 2], names: ["+Speed", "+Power", "Support"] },
    { label: "Stamina", fields: [3, 4, 5], names: ["+Stamina", "+Guts", "Support"] },
    { label: "Power", fields: [6, 7, 8], names: ["+Power", "Secondary", "Support"] },
    { label: "Guts", fields: [9, 10, 11, 12], names: ["+Guts", "+Power", "+Speed", "Support"] },
    { label: "Wit", fields: [13, 14, 15], names: ["+Wit", "+Speed", "Support"] }
  ];

  return React.createElement('div', { className: 'page' }, [
    React.createElement('h2', { key: 'title' }, 'Training Chart Filler'),

    React.createElement('div', { className: 'stat-section', key: 'stats' }, [
      React.createElement('strong', null, 'Current Stats'),
      React.createElement('div', { className: 'section-grid' },
        Object.entries(stats).map(([key, value]) =>
          React.createElement('div', { key, className: 'form-column' }, [
            React.createElement('label', { className: 'form-label' }, key.charAt(0).toUpperCase() + key.slice(1)),
            React.createElement('input', {
              className: 'form-input',
              value: value,
              placeholder: '0',
              onChange: (e) => handleStatChange(key, e.target.value)
            })
          ])
        )
      )
    ]),

    React.createElement('div', { className: 'section-flex', key: 'input-sections' },
      inputLayout.map((section, rowIndex) =>
        React.createElement('div', { key: `section-${rowIndex}` }, [
          React.createElement('div', { className: 'row-label', key: `label-${rowIndex}` }, [
            React.createElement('strong', null, section.label),
            React.createElement('label', { className: 'checkbox-label' }, [
              React.createElement('input', {
                type: 'checkbox',
                checked: weights[rowIndex],
                onChange: () => handleWeightToggle(rowIndex)
              }),
              'Mark as 🔥'
            ])
          ]),
          React.createElement('div', {
            className: section.fields.length === 4 ? 'grid-4' : 'grid-3',
            key: `inputs-${rowIndex}`
          }, section.fields.map((i, idx) =>
            React.createElement('div', { key: `input-${i}`, className: 'form-column' }, [
              React.createElement('label', { className: 'form-label' }, section.names[idx]),
              React.createElement('input', {
                className: 'form-input',
                placeholder: `Value ${i + 1}`,
                value: inputs[i],
                onChange: (e) => handleChange(i, e.target.value)
              })
            ])
          ))
        ])
      )
    ),

    React.createElement('button', {
      className: 'button',
      onClick: generateOutput,
      key: 'generate'
    }, 'Generate Chart'),

    copied && React.createElement('p', { className: 'copied-msg', key: 'copied-msg' }, '📋 Copied to clipboard!'),

    output && React.createElement('pre', { className: 'output', key: 'output-block' }, output)
  ]);
}

ReactDOM.render(
  React.createElement(TrainingChartFiller),
  document.getElementById('root')
);
