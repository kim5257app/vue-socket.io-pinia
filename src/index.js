import SocketIO from 'socket.io-client';
import debugModule from 'debug';

import Mixin from './mixin';
import Emitter from './emitter';
import Listener from './listener';

const logger = debugModule('vue-socket.io:VueSocketIO');

export default class VueSocketIO {
  constructor({
    connection,
    pinia,
    options,
    debug,
  }) {
    if (debug) {
      debugModule.enable('vue-socket.io:*');
    } else {
      debugModule.disable('vue-socket.io:*');
    }

    this.options = options;
    this.io = this.connect(connection);
    this.emitter = new Emitter(pinia);
    this.listener = new Listener(this.io, this.emitter);
  }

  install(app) {
    app.config.globalProperties.$socket = this.io;
    app.config.globalProperties.$vueSocketIo = this;

    app.mixin(Mixin);
  }

  connect(connection) {
    let conn;

    switch (typeof connection) {
      case 'object': {
        logger('Received socket.io-client instance');
        conn = connection;
        break;
      }
      case 'string': {
        logger('Received connection string');
        conn = SocketIO(connection, this.options);
        break;
      }
      default:
        throw new Error('Unsupported connection type');
    }

    return conn;
  }
}
