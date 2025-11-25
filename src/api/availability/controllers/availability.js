"use strict";

module.exports = {
  async check(ctx) {
    try {
      const { propertyId, checkIn, checkOut } = ctx.request.body;

      if (!propertyId || !checkIn || !checkOut) {
        return ctx.badRequest(
          "Missing required fields: propertyId, checkIn, checkOut"
        );
      }

      // Convert string dates to Date objects
      const checkInDate = new Date(checkIn).toISOString();
      const checkOutDate = new Date(checkOut).toISOString();

      // Find overlapping bookings
      const overlappingBookings = await strapi.entityService.findMany(
        "api::booking.booking",
        {
          filters: {
            property: propertyId,
            booking_status: { $in: ["confirmed", "pending"] },
            $and: [
              { check_in: { $lte: checkOutDate } },
              { check_out: { $gte: checkInDate } },
            ],
          },
        }
      );

      const isAvailable = overlappingBookings.length === 0;

      console.log("🔍 Availability check result:", {
        propertyId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        overlappingBookings: overlappingBookings.length,
        isAvailable,
      });

      ctx.send({
        available: isAvailable,
        overlappingBookings: overlappingBookings.length,
        message: isAvailable
          ? "Property is available"
          : "Property is not available for selected dates",
      });
    } catch (error) {
      console.error("💥 Availability check error:", error);
      ctx.throw(500, "Failed to check availability");
    }
  },
};
