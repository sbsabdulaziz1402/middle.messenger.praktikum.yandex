type EventHandler<T extends unknown[] = unknown[]> = (...args: T) => void;

export default class EventBus<Events extends Record<string, unknown[]>> {
  private listeners: {
    [K in keyof Events]?: EventHandler<Events[K]>[];
  } = {};


  public on<K extends keyof Events>(event: K, callback: EventHandler<Events[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }


  public off<K extends keyof Events>(event: K, callback: EventHandler<Events[K]>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter((listener) => listener !== callback);
  }

  public emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
    if (!this.listeners[event]) return;
    this.listeners[event]!.forEach((listener) => listener(...args));
  }
}
