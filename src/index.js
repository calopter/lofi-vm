let memory = new WebAssembly.Memory({initial: 1, maximum: 1});
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

let audioCtx = new window.AudioContext();

let buff = audioCtx.createBuffer(1, mem.length, audioCtx.sampleRate);
buff.copyToChannel(mem, 0);

let source = audioCtx.createBufferSource();
source.buffer = buff;
source.loop = true;
source.connect(audioCtx.destination);
source.start();
