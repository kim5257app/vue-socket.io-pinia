import type { Socket } from 'socket.io-client';
import type Emitter from './emitter';

class Listener {
  private static readonly staticEvents: string[] = [
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

  private readonly io: Socket;
  private readonly emitter: Emitter;

  constructor(io: Socket, emitter: Emitter) {
    this.io = io;
    this.emitter = emitter;

    this.register();
  }

  private register() {
    this.io.onAny((event: string, ...args: any[]) => {
      this.onEvent(event, ...args);
    });

    Listener.staticEvents.forEach((event) => {
      this.io.on(event, (...args: any[]) => {
        this.onEvent(event, ...args);
      });
    });
  }

  private onEvent(event: string, ...args: any) {
    console.log('onEvent:', event);
    this.emitter.emit(event, this.io, ...args);
  }
}

export {
  Listener
};

export default Listener;
