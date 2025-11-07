'use strict';

module.exports = {
  async check(ctx) {
    try {
      const { propertyId, checkIn, checkOut } = ctx.request.body;

      if (!propertyId || !checkIn || !checkOut) {
        return ctx.badRequest('Missing required fields: propertyId, checkIn, checkOut');
      }

      // Convert string dates to Date objects
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Find overlapping bookings
      const overlappingBookings = await strapi.entityService.findMany('api::booking.booking', {
        filters: {
          property: propertyId,
          booking_status: { $in: ['confirmed', 'pending'] },
          $or: [
            // Case 1: Existing booking starts before and ends after check-in
            {
              check_in: { $lte: checkInDate },
              check_out: { $gte: checkInDate }
            },
            // Case 2: Existing booking starts before check-out and ends after
            {
              check_in: { $lte: checkOutDate },
              check_out: { $gte: checkOutDate }
            },
            // Case 3: Existing booking is within the new booking dates
            {
              check_in: { $gte: checkInDate },
              check_out: { $lte: checkOutDate }
            },
            // Case 4: New booking is within existing booking dates
            {
              check_in: { $lte: checkInDate },
              check_out: { $gte: checkOutDate }
            }
          ]
        }
      });

      const isAvailable = overlappingBookings.length === 0;

      console.log('🔍 Availability check result:', {
        propertyId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        overlappingBookings: overlappingBookings.length,
        isAvailable
      });

      ctx.send({
        available: isAvailable,
        overlappingBookings: overlappingBookings.length,
        message: isAvailable ? 'Property is available' : 'Property is not available for selected dates'
      });

    } catch (error) {
      console.error('💥 Availability check error:', error);
      ctx.throw(500, 'Failed to check availability');
    }
  },
};