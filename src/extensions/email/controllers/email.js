'use strict';

module.exports = {
  async sendBookingConfirmation(ctx) {
    try {
      const { bookingData } = ctx.request.body;
      
      // Add validation
      if (!bookingData || !bookingData.customer_email) {
        return ctx.badRequest('Missing booking data or customer email');
      }
      
      const result = await strapi
        .plugin('email')
        .service('email')
        .sendBookingConfirmation(bookingData);
      
      ctx.send({ 
        success: result.success,
        message: result.success 
          ? 'Booking confirmation email sent successfully' 
          : result.error
      });
    } catch (error) {
      strapi.log.error('Email controller error:', error);
      ctx.throw(500, 'Failed to send booking confirmation');
    }
  },

  async sendAdminNotification(ctx) {
    try {
      const { bookingData } = ctx.request.body;
      
      if (!bookingData || !bookingData.booking_reference) {
        return ctx.badRequest('Missing booking data');
      }
      
      const result = await strapi
        .plugin('email')
        .service('email')
        .sendAdminNotification(bookingData);
      
      ctx.send({ 
        success: result.success,
        message: result.success 
          ? 'Admin notification sent successfully' 
          : result.error
      });
    } catch (error) {
      strapi.log.error('Admin notification error:', error);
      ctx.throw(500, 'Failed to send admin notification');
    }
  },
};