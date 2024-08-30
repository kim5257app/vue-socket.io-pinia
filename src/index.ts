import { type App, getCurrentInstance, inject, ref } from 'vue';
import SocketIO, { Socket } from 'socket.io-client';
import type { SocketOptions } from 'socket.io-client';
import Emitter from './emitter';
import type { EmitterOptions } from './emitter';
import { onUnmounted } from 'vue';
import Listener from './listener';

declare module 'vue' {
  interface ComponentCustomProperties {
    $socket: Socket;
    $vueSocket: VueSocket;
  }
}

interface VueSocketOptions extends EmitterOptions{
  connection: Socket | string;
  socketOptions: SocketOptions;
  debug: boolean;
}

class VueSocket {
  private static connect(connection: Socket | string, socketOptions: SocketOptions) {
    let conn;

    if (connection instanceof Socket) {
      conn = connection;
    } else {
      conn = SocketIO(connection, socketOptions);
    }

    return conn;
  }

  public readonly io: Socket;
  public readonly emitter: Emitter;
  private readonly listener: Listener;

  constructor({
    connection,
    actionPrefix,
    store,
    socketOptions,
    debug,
  }: VueSocketOptions) {
    this.io = VueSocket.connect(connection, socketOptions);
    this.emitter = new Emitter({
      actionPrefix,
      store,
    });
    this.listener = new Listener(this.io, this.emitter);
  }

  install(app: App) {
    app.config.globalProperties.$socket = this.io;
    app.config.globalProperties.$vueSocket = this;

    app.provide('$socket', this.io);
    app.provide('$vueSocket', this);
  }
}

function useSocketListener() {

  const componentInstance = getCurrentInstance()!;

  const vueSocket = inject('$vueSocket') as VueSocket;
  const subscription = ref(new Set<string>());

  function subscribe(event: string, cb: (socket: Socket, ...args: any[]) => void) {
    // 이미 등록된 이벤트가 있으면 제거
    if (subscription.value.has(event)) {
      unsubscribe(event);
    }

    vueSocket.emitter.addListener(event, cb, componentInstance);
    subscription.value.add(event);
  }

  function unsubscribe(event: string) {
    vueSocket.emitter.removeListener(event, componentInstance);
    subscription.value.delete(event);
  }

  onUnmounted(() => {
    // 이미 등록된 이벤트가 있을 경우 제거
    subscription.value.forEach((event) => {
      unsubscribe(event);
    });
  });

  return {
    subscribe,
    unsubscribe,
  }
}

export {
  useSocketListener,
};

export default {
  install(app: App, options: VueSocketOptions) {
    const vueSocket = new VueSocket(options);
    vueSocket.install(app);
  }
}
