
export default class WorkerManager {
  private worker: Worker;
  private listeners: Set<(event: MessageEvent) => void>;
  private listener_names: string[];

  constructor(path: string) {
    this.worker = new Worker(path, {type: "module"});
    this.listeners = new Set();
    this.listener_names = []

    this.worker.onmessage = (event: MessageEvent) => {
      this.listeners.forEach((listener) => listener(event));
    };
  }

  postMessage(message: any): void {
    this.worker.postMessage(message);
  }

  addListener(listener: (event: MessageEvent) => void, name?: string): void {
    this.listeners.add(listener);
    if (name) this.listener_names.push(name)
  }

  removeListener(listener: (event: MessageEvent) => void): void {
    this.listeners.delete(listener);
  }

  terminate(): void {
    this.worker.terminate()
  }

  numListeners() {
    return this.listeners.size
  }

  listenerExists(name: string) {
    return this.listener_names.includes(name)
  }
}