'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/email/booking-confirmation',
      handler: 'email.sendBookingConfirmation',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/email/admin-notification',
      handler: 'email.sendAdminNotification',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};