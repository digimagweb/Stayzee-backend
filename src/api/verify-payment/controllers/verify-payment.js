// src/api/verify-payment/controllers/verify-payment.js
'use strict';

const crypto = require('crypto');

module.exports = {
  async verify(ctx) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = ctx.request.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return ctx.badRequest('Missing payment verification data');
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isValid = expectedSignature === razorpay_signature;

      ctx.send({ valid: isValid });
    } catch (error) {
      console.error('Payment verification error:', error);
      ctx.throw(500, 'Payment verification failed');
    }
  },
};