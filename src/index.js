let importObject = {
  imports: { imported_func: arg => console.log(arg) }
};

fetch('add.wasm').then(response =>
  response.arrayBuffer()
).then(bytes =>
  WebAssembly.instantiate(bytes, importObject)
).then(result =>
  console.log(result.instance.exports.add(2,1))
);

let memory = new WebAssembly.Memory({initial: 10, maximum: 100});
let mem = new Uint32Array(memory.buffer);

mem.forEach((_, i, mem) => mem[i] = Math.floor(Math.random() * 1000));

let audioCtx = new window.AudioContext();

let buff = audioCtx.createBuffer(1, mem.length, audioCtx.sampleRate);
let fmem = Float32Array.from(mem); //scale
buff.copyToChannel(fmem, 0);

let source = audioCtx.createBufferSource();
source.buffer = buff;
source.loop = true;
source.connect(audioCtx.destination);
source.start();
