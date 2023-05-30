export default class Listener {
  static staticEvents = [
    'connect',
    'error',
    'disconnect',
    'reconnect',
    'reconnect_attempt',
    'reconnecting',
    'reconnect_error',
    'reconnect_failed',
    'connect_error',
    'connect_timeout',
    'connecting',
    'ping',
    'pong',
  ];

  constructor(io, emitter) {
    this.io = io;
    this.emitter = emitter;

    this.register();
  }

  register() {
    this.io.onAny((event, ...args) => {
      this.onEvent(event, ...args);
    });

    Listener.staticEvents.forEach((event) => {
      this.io.on(event, (...args) => {
        this.onEvent(event, ...args);
      });
    });
  }

  onEvent(event, ...args) {
    this.emitter.emit(event, this.io, ...args);
  }
}
