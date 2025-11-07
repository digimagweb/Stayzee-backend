// src/api/create-razorpay-order/routes/create-razorpay-order.js
'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/create-razorpay-order',
      handler: 'create-razorpay-order.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};