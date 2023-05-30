import debugModule from 'debug';

const logger = debugModule('vue-socket.io:emitter');

export default class Emitter {
  constructor(pinia = {}) {
    logger(pinia ? 'Pinia adapter enabled' : 'Pinia adapter disabled');

    this.store = pinia.store;
    this.actionPrefix = pinia.actionPrefix ? pinia.actionPrefix : 'socket.';
    this.listenerList = new Map();
  }

  addListener(event, cb, component) {
    if (typeof cb === 'function') {
      if (!this.listenerList.has(event)) {
        this.listenerList.set(event, []);
      }

      this.listenerList.get(event).push({ cb, component });

      logger(`#${event} subscribe, component: ${component.$options.name}`);
    } else {
      throw new Error('callback must be a function');
    }
  }

  removeListener(event, component) {
    if (this.listenerList.has(event)) {
      const listenerList = this.listenerList.get(event)
        .filter((listener) => (listener.component !== component));

      if (listenerList.length > 0) {
        this.listenerList.set(event, listenerList);
      } else {
        this.listenerList.delete(event);
      }

      logger(`#${event} unsubscribe, component: ${component.$options.name}`);
    }
  }

  emit(event, ...args) {
    if (this.listenerList.has(event)) {
      logger(`Broadcasting: #${event}, Data:`, ...args);

      this.listenerList.get(event).forEach((listener) => {
        listener.cb.call(listener.component, ...args);
      });
    }

    if (event !== 'ping' && event !== 'pong') {
      this.dispatchStore(event, ...args);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  dispatchStore(event, ...args) {
    logger(`Dispatching Action: ${event}, Data:`, args);

    const prefixedEvent = `${this.actionPrefix}${event}`;

    if (this.store[prefixedEvent] != null) {
      this.store[prefixedEvent](...args);
    }
  }
}
