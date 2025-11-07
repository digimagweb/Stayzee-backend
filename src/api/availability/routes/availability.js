'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/check-availability',
      handler: 'availability.check',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};