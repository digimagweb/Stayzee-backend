// src/api/create-razorpay-order/controllers/create-razorpay-order.js
'use strict';

module.exports = {
  async create(ctx) {
    try {
      console.log('🚀 Starting Razorpay order creation...');
      
      const { amount, currency = 'INR' } = ctx.request.body;
      console.log('📥 Received request:', { amount, currency });

      // Validate required fields
      if (!amount) {
        console.log('❌ Amount is missing');
        return ctx.badRequest('Amount is required');
      }

      if (amount <= 0) {
        console.log('❌ Invalid amount:', amount);
        return ctx.badRequest('Amount must be greater than 0');
      }

      // Check if amount is at least 100 paise (₹1)
      if (amount < 100) {
        console.log('❌ Amount too small:', amount);
        return ctx.badRequest('Amount must be at least ₹1');
      }

      // Check environment variables
      console.log('🔑 Checking Razorpay credentials...');
      console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
      console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');

      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.log('❌ Razorpay credentials missing in environment variables');
        return ctx.throw(500, 'Razorpay configuration is missing. Please check server environment variables.');
      }

      // Try to load Razorpay
      let Razorpay;
      try {
        Razorpay = require('razorpay');
        console.log('✅ Razorpay package loaded successfully');
      } catch (requireError) {
        console.log('❌ Razorpay package not found:', requireError.message);
        return ctx.throw(500, 'Razorpay package not installed. Run: npm install razorpay');
      }

      // Initialize Razorpay with validation
      try {
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Test credentials by making a simple API call
        console.log('🔐 Testing Razorpay credentials...');
        await razorpay.payments.all({ count: 1 });
        console.log('✅ Razorpay credentials are valid');

      } catch (authError) {
        console.error('❌ Razorpay authentication failed:', authError);
        return ctx.throw(401, 'Invalid Razorpay API credentials. Please check KEY_ID and KEY_SECRET.');
      }

      // Re-initialize for order creation
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const orderOptions = {
        amount: parseInt(amount), // Must be integer in paise
        currency: currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1, // Auto capture payment
      };

      console.log('📦 Creating Razorpay order with:', orderOptions);

      // Create the real order
      const order = await razorpay.orders.create(orderOptions);
      
      console.log('✅ Razorpay order created successfully:', {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status
      });
      
      // Return the order data in the expected format
      ctx.send({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        receipt: order.receipt
      });

    } catch (error) {
      console.error('💥 ERROR in create-razorpay-order:', error);
      
      // Provide detailed error information
      console.log('🔍 Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error
      });

      // Handle specific Razorpay errors
      if (error.statusCode === 401) {
        return ctx.throw(401, 'Invalid Razorpay API credentials. Please check your key_id and key_secret.');
      }
      
      if (error.statusCode === 400) {
        const errorMsg = error.error?.description || error.message;
        return ctx.throw(400, `Razorpay error: ${errorMsg}`);
      }

      // Generic error
      ctx.throw(500, `Failed to create payment order: ${error.message}`);
    }
  },
};