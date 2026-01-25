class StreamWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.chunkSize = 0;
    this.buffer = [];
    this.port.onmessage = (event) => {
      if (event.data && event.data.chunkSize) {
        this.chunkSize = event.data.chunkSize;
      }
      if (event.data && event.data.flush) {
        this.flush();
      }
    };
  }

  flush() {
    if (!this.buffer.length) {
      return;
    }
    const out = new Float32Array(this.buffer);
    this.buffer = [];
    this.port.postMessage(out, [out.buffer]);
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) {
      return true;
    }
    const channelData = input[0];
    for (let i = 0; i < channelData.length; i += 1) {
      this.buffer.push(channelData[i]);
    }
    if (this.chunkSize && this.buffer.length >= this.chunkSize) {
      const out = new Float32Array(this.buffer.slice(0, this.chunkSize));
      this.buffer = this.buffer.slice(this.chunkSize);
      this.port.postMessage(out, [out.buffer]);
    }
    return true;
  }
}

registerProcessor('stream-worklet', StreamWorkletProcessor);
