'use strict';

const emailService = require('../services/email');

module.exports = {
  async sendBookingConfirmation(ctx) {
    try {
      console.log('📧 Received booking confirmation request');
      const { bookingData } = ctx.request.body;
      
      // Add validation
      if (!bookingData || !bookingData.customer_email) {
        return ctx.badRequest('Missing booking data or customer email');
      }
      
      console.log('Sending email to:', bookingData.customer_email);
      const result = await emailService.sendBookingConfirmation(bookingData);
      
      ctx.send({ 
        success: result.success,
        message: result.success 
          ? 'Booking confirmation email sent successfully' 
          : result.error
      });
    } catch (error) {
      console.error('Email controller error:', error);
      ctx.throw(500, 'Failed to send booking confirmation');
    }
  },

  async sendAdminNotification(ctx) {
    try {
      console.log('📧 Received admin notification request');
      const { bookingData } = ctx.request.body;
      
      if (!bookingData || !bookingData.booking_reference) {
        return ctx.badRequest('Missing booking data');
      }
      
      console.log('Sending admin notification for booking:', bookingData.booking_reference);
      const result = await emailService.sendAdminNotification(bookingData);
      
      ctx.send({ 
        success: result.success,
        message: result.success 
          ? 'Admin notification sent successfully' 
          : result.error
      });
    } catch (error) {
      console.error('Admin notification error:', error);
      ctx.throw(500, 'Failed to send admin notification');
    }
  },
};