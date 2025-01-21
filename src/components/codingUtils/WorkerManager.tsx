
export default class WorkerManager {
  private worker: Worker;
  private listeners: Set<(event: MessageEvent) => void>;

  constructor(path: string) {
    this.worker = new Worker(path, {type: "module"});
    this.listeners = new Set();

    this.worker.onmessage = (event: MessageEvent) => {
      this.listeners.forEach((listener) => listener(event));
    };
  }

  postMessage(message: any): void {
    this.worker.postMessage(message);
  }

  addListener(listener: (event: MessageEvent) => void): void {
    this.listeners.add(listener);
  }

  removeListener(listener: (event: MessageEvent) => void): void {
    this.listeners.delete(listener);
  }

  numListeners() {
    return this.listeners.size
  }
}