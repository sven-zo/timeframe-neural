const synaptic = window.synaptic;

const network = new synaptic.Architect.Perceptron(5, 3, 1);

const trainer = new synaptic.Trainer(network);

// Training
const importData = new Promise(async (resolve, reject) => {
  console.log('Importing data...');
  try {
    const request = await fetch('mock-data/MOCK_DATA.json');
    const data = await request.json();
    resolve(data);
  } catch (err) {
    reject(err);
  }
});

const formatData = new Promise(async (resolve, reject) => {
  const data = await importData;
  console.log('Formatting data...');

  const mappedData = data.deliveries[0].packages.map(package => {
    const fragile = package.fragile ? 1 : 0;
    return {
      input: [
        // Weight
        package.weight / 68,
        // Width
        package.dimensions.width / 274,
        // Height
        package.dimensions.height / 274,
        // Depth
        package.dimensions.depth / 274,
        // Fragile
        fragile,
      ],
      output: [package.delivery_delay / 3600]
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
    log: 100,
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
  const widthSlider = document.getElementById('width')
  const widthValue = document.getElementById('width_value');
  const heightSlider = document.getElementById('height');
  const heightValue = document.getElementById('height_value');
  const depthSlider = document.getElementById('depth');
  const depthValue = document.getElementById('depth_value');
  const fragile = document.getElementById('fragile');
  const score = document.getElementById('score');
  const scoreMinutes = document.getElementById('score-minutes');
  const scoreHour = document.getElementById('score-hour');
  const image = document.querySelector('.output img');

  const fragileValue = fragile.checked ? 1 : 0;

  weightValue.innerText = `${weightSlider.value} kg`;
  widthValue.innerText = `${widthSlider.value} cm`;
  heightValue.innerText = `${heightSlider.value} cm`;
depthValue.innerText = `${depthSlider.value} cm`;

  image.style.transform = `scale(${weightSlider.value / 68 * 6})`;

  const output = network.activate([weightSlider.value / 68, widthSlider.value / 274, heightSlider.value / 274, depthSlider.value / 274, fragileValue]);
  score.innerText = `${output * 3600} seconds`;
  scoreMinutes.innerText = `${output * 60} minutes`;
  scoreHour.innerText = `${output} hours`;

  requestAnimationFrame(loop);
}

window.addEventListener('load', () => {
  console.log('Page is loaded!');
  loop();
})
