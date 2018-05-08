const synaptic = window.synaptic;

const network = new synaptic.Architect.Perceptron(2, 5, 3);

const trainer = new synaptic.Trainer(network);

const learningRate = 0.3;

// overfit: 20000 / correct: 200
for (let i = 0; i < 200; i++) {
  // 0,0 => 0
  network.activate([0, 0]);
  network.propagate(learningRate, [0, 0, 0]);
  // 0,1 => 1
  network.activate([0, 1]);
  network.propagate(learningRate, [1, 0, 0]);
  // 1,0 => 1
  network.activate([1, 0]);
  network.propagate(learningRate, [0, 1, 0]);
  // 1,1 => 0
  network.activate([1, 1]);
  network.propagate(learningRate, [0, 0, 1]);
}

const loop = () => {
  const slider1 = document.getElementById('slider1');
  const slider2 = document.getElementById('slider2');

  const value1 = slider1.value / 100;
  const value2 = slider2.value / 100;

  const display1 = document.getElementById('display1');
  const display2 = document.getElementById('display2');

  display1.value = value1;
  display2.value = value2;

  const color = network.activate([value1, value2]);
  document.body.style.backgroundColor = `rgb(${color[0] * 255}, ${color[1] *
    255}, ${color[2] * 255})`;

  requestAnimationFrame(loop);
};

window.addEventListener('load', () => {
  console.log('Page is loaded!');
  loop();
});
