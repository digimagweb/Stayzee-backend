// src/api/verify-payment/routes/verify-payment.js
'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/verify-payment',
      handler: 'verify-payment.verify',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};