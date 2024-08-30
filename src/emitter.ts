import type { Store } from 'pinia';
import type { ComponentInternalInstance } from 'vue';

export interface EmitterOptions {
  store: Store;
  actionPrefix: string;
}

type EventCallback = (...args: any[]) => void;

export interface ListenerItem {
  cb: EventCallback;
  componentInstance: ComponentInternalInstance;
}

class Emitter {
  private readonly actionPrefix: string;
  private readonly store: Store;
  private listenerList = new Map<string, ListenerItem[]>();

  constructor(options: EmitterOptions) {
    this.actionPrefix = options.actionPrefix;
    this.store = options.store;
  }

  addListener(event: string, cb: EventCallback, componentInstance: ComponentInternalInstance) {
    if (!this.listenerList.has(event)) {
      this.listenerList.set(event, []);
    }

    console.log('addListener:', event);
    this.listenerList.get(event)!.push({ cb, componentInstance });
  }

  removeListener(event: string, componentInstance: ComponentInternalInstance) {
    if (this.listenerList.has(event)) {
      const listenerList = this.listenerList.get(event)!
        .filter((listener) => (listener.componentInstance !== componentInstance))

      if (listenerList.length > 0) {
        this.listenerList.set(event, listenerList);
      } else {
        this.listenerList.delete(event);
      }
    }
  }

  emit(event: string, ...args: any[]) {
    this.listenerList.get(event)?.forEach((listener) => {
      listener.cb.call(listener.componentInstance.proxy, ...args);
    });

    if (event !== 'ping' && event !== 'pong') {
      this.dispatchStore(event, ...args);
    }
  }

  dispatchStore(event: string, ...args: any[]) {
    const prefixedEvent = `${this.actionPrefix}${event}`;
    const storeActions = this.store as unknown as { [key: string]: EventCallback }

    const storeAction = storeActions[prefixedEvent];
    if (storeAction != null) {
      storeAction(...args);
    }
  }
}

export default Emitter;
