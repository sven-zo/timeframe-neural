
const synaptic = window.synaptic;

const network = new synaptic.Architect.Perceptron(2, 5, 1);

const trainer = new synaptic.Trainer(network);

// Training
const importData = new Promise(async (resolve, reject) => {
  console.log('Importing data...');
  try {
    const request = await fetch('mock-data/mock-1.json');
    const data = await request.json();
    resolve(data);
  } catch (err) {
    reject(err);
  }
});

const formatData = new Promise(async (resolve, reject) => {
  const data = await importData;
  console.log('Formatting data...');

  const mappedData = data.packages.map(package => {
    const fragile = package.fragile ? 1 : 0;
    return {
      input: [
        // Gewicht
        package.weight / 100,
        // Fragile
        fragile, 
      ],
      output: [package.time_since_last_package / 3600]
    }
  });

  resolve(mappedData);
});

const train = async (trainer) => {
  const settings = {
    rate: 0.3,
    iterations: 1000,
    error: 0.005,
    shuffle: true,
    log: 1000,
    cost: synaptic.Trainer.cost.CROSS_ENTROPY,
  }
  const data = await formatData;
  console.log('Training using ', data);
  trainer.train(data, settings);
}

train(trainer);

// Render loop
const loop = () => {

  const weightSlider = document.getElementById('weight');
  const weightValue = document.getElementById('weight_value');
  const fragile = document.getElementById('fragile');
  const score = document.getElementById('score');
  const scoreMinutes = document.getElementById('score-minutes');
  const scoreHour = document.getElementById('score-hour');

  const fragileValue = fragile.checked ? 1 : 0;

  weightValue.innerHTML = weightSlider.value;
  const output = network.activate([weightSlider.value, fragileValue]);
  score.innerHTML = `${output * 3600} seconds`;
  scoreMinutes.innerHTML = `${output * 60} minutes`;
  scoreHour.innerHTML = `${output} hours`;

  requestAnimationFrame(loop);
}

window.addEventListener('load', () => {
  console.log('Page is loaded!');
  loop();
})
