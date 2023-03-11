'use strict';
module.exports = {
  async discover({ homey, body}) {
    return await homey.app.discover();
  },
  
  async authenticate({ homey, body}) {
    return await homey.app.authenticate(body.name, body.secret);
  },
  async connect({ homey, body}) {
    return await homey.app.connect();
  }
};
