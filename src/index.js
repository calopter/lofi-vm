let memory = new WebAssembly.Memory({initial: 4, maximum: 4});
let mem = new Float32Array(memory.buffer);

//mem.forEach((_, i, mem) => mem[i] = Math.random());

mem[0]=40;
mem[1]=2;

let importObject = { 
  console: { log: console.log }, env: { buffer: memory }
};

fetch('add.wasm').then(response =>
  response.arrayBuffer()
).then(bytes =>
  WebAssembly.instantiate(bytes, importObject)
).then(result =>
  result.instance.exports.log_add()
);

console.log(mem);


let ctx = new window.AudioContext();

let sample = ctx.createBufferSource();

fetch('resources/spinning-coin.wav').then(response =>
  response.arrayBuffer()
).then(bytes =>
  ctx.decodeAudioData(bytes)
).then(data =>
  sample.buffer = data
);

let scrip = ctx.createScriptProcessor(256, 1, 1);
scrip.onaudioprocess = function ({inputBuffer, outputBuffer}) {
  let inputData = inputBuffer.getChannelData(0);
  let outputData = outputBuffer.getChannelData(0);

  for (var sample = 0; sample < inputBuffer.length; sample+=16) {
    outputData[sample] = inputData[sample];
  }
};

sample.connect(scrip);
sample.start();
scrip.connect(ctx.destination);

let buff = ctx.createBuffer(1, mem.length, ctx.sampleRate);
buff.copyToChannel(mem, 0);

let source = ctx.createBufferSource();
source.buffer = buff;
source.loop = true;
source.connect(ctx.destination);
//source.start();
