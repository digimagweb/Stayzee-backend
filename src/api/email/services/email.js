"use strict";

module.exports = {
  // In your src/api/email/services/email.js - add detailed logging
  async sendBookingConfirmation(bookingData) {
    try {
      console.log("📧 Starting booking confirmation email...");

      if (!bookingData.customer_email) {
        throw new Error("Customer email is required");
      }

      const emailService = strapi.plugin("email").service("email");
      if (!emailService) {
        throw new Error("Email service not available");
      }

      const emailTemplate = this.generateBookingEmailTemplate(bookingData);
      const textVersion = this.generateTextVersion(bookingData);

      console.log("📧 Email Details:", {
        to: bookingData.customer_email,
        from: strapi.config.get("plugin.email.settings.defaultFrom"),
        subject: `Booking Confirmation - ${bookingData.booking_reference}`,
        smtpHost: strapi.config.get("plugin.email.config.providerOptions.host"),
        smtpPort: strapi.config.get("plugin.email.config.providerOptions.port"),
      });

      const emailOptions = {
        to: bookingData.customer_email,
        from: strapi.config.get("plugin.email.settings.defaultFrom"),
        replyTo: strapi.config.get("plugin.email.settings.defaultReplyTo"),
        subject: `Booking Confirmation - ${bookingData.booking_reference}`,
        html: emailTemplate,
        text: textVersion,
      };

      console.log(
        "📧 Final email options:",
        JSON.stringify(emailOptions, null, 2)
      );

      // Send the email
      const result = await emailService.send(emailOptions);

      console.log("✅ Email send result:", result);
      console.log("✅ Email marked as sent to:", bookingData.customer_email);

      return {
        success: true,
        message: "Booking confirmation email sent successfully",
      };
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      return {
        success: false,
        error: error.message,
        details: "Check SMTP configuration and credentials",
      };
    }
  },

  async sendAdminNotification(bookingData) {
    try {
      const adminEmail =
        strapi.config.get("plugin.email.settings.adminEmail") ||
        "admin@stayzee.com";

      console.log("📧 Generating admin notification email template");
      const adminTemplate = this.generateAdminEmailTemplate(bookingData);

      await strapi
        .plugin("email")
        .service("email")
        .send({
          to: adminEmail,
          from: strapi.config.get(
            "plugin.email.settings.defaultFrom",
            "noreply@stayzee.com"
          ),
          subject: `🚨 New Booking - ${bookingData.booking_reference}`,
          html: adminTemplate,
          text: this.generateAdminTextVersion(bookingData),
        });

      strapi.log.info(
        `✅ Admin notification sent for booking ${bookingData.booking_reference}`
      );
      return { success: true };
    } catch (error) {
      strapi.log.error("❌ Failed to send admin notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Add text version for email clients that don't support HTML
  generateTextVersion(bookingData) {
    return `
Booking Confirmation - ${bookingData.booking_reference}

Dear ${bookingData.customer_name},

Thank you for choosing Stayzee! Your booking has been confirmed.

BOOKING DETAILS:
- Reference: ${bookingData.booking_reference}
- Property: ${bookingData.property_name}
- Check-in: ${bookingData.check_in}
- Check-out: ${bookingData.check_out}
- Guests: ${bookingData.guests}
- Total Nights: ${bookingData.total_nights}
- Total Amount: ₹${bookingData.total_amount}

Property Information:
- Type: ${bookingData.property_type}
- Location: ${bookingData.location}

${
  bookingData.special_requests && bookingData.special_requests !== "None"
    ? `Special Requests: ${bookingData.special_requests}`
    : ""
}

We look forward to hosting you!

Best regards,
The Stayzee Team
Booking Date: ${bookingData.booking_date}
    `;
  },

  generateAdminTextVersion(bookingData) {
    return `New Booking - ${bookingData.booking_reference}

Customer: ${bookingData.customer_name} (${bookingData.customer_email})
Property: ${bookingData.property_name}
Dates: ${bookingData.check_in} to ${bookingData.check_out}
Amount: ₹${bookingData.total_amount}
    `;
  },

  generateBookingEmailTemplate(bookingData) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f6f9fc; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #4a90e2, #357abd); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .header p { font-size: 16px; opacity: 0.9; margin: 0; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; color: #2c3e50; }
        .paragraph { font-size: 16px; margin-bottom: 25px; color: #555; }
        .card { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 25px; }
        .card h2 { font-size: 20px; font-weight: bold; color: #2c3e50; margin-bottom: 20px; border-bottom: 2px solid #4a90e2; padding-bottom: 10px; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .detail-item { margin-bottom: 12px; }
        .detail-label { font-size: 14px; color: #6c757d; margin-bottom: 4px; }
        .detail-value { font-size: 16px; font-weight: 600; color: #2c3e50; }
        .divider { border: none; border-top: 2px solid #4a90e2; margin: 20px 0; }
        .total-section { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
        .total-label { font-size: 18px; font-weight: bold; color: #2c3e50; }
        .total-amount { font-size: 24px; font-weight: bold; color: #4a90e2; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px; }
        @media (max-width: 600px) {
            .detail-grid { grid-template-columns: 1fr; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .header h1 { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your stay at ${bookingData.property_name} is confirmed</p>
        </div>
        <div class="content">
            <p class="greeting">Dear ${bookingData.customer_name},</p>
            <p class="paragraph">Thank you for choosing Stayzee! Your booking has been confirmed and we're excited to host you.</p>
            <div class="card">
                <h2>Booking Details</h2>
                <div class="detail-grid">
                    <div class="detail-item"><div class="detail-label">Booking Reference</div><div class="detail-value">${bookingData.booking_reference}</div></div>
                    <div class="detail-item"><div class="detail-label">Property</div><div class="detail-value">${bookingData.property_name}</div></div>
                    <div class="detail-item"><div class="detail-label">Check-in</div><div class="detail-value">${bookingData.check_in}</div></div>
                    <div class="detail-item"><div class="detail-label">Check-out</div><div class="detail-value">${bookingData.check_out}</div></div>
                    <div class="detail-item"><div class="detail-label">Guests</div><div class="detail-value">${bookingData.guests}</div></div>
                    <div class="detail-item"><div class="detail-label">Total Nights</div><div class="detail-value">${bookingData.total_nights}</div></div>
                </div>
                <hr class="divider">
                <div class="total-section">
                    <div class="total-label">Total Amount</div>
                    <div class="total-amount">₹${bookingData.total_amount}</div>
                </div>
            </div>
            <div class="card">
                <h2>Property Information</h2>
                <div class="detail-grid">
                    <div class="detail-item"><div class="detail-label">Property Type</div><div class="detail-value">${bookingData.property_type}</div></div>
                    <div class="detail-item"><div class="detail-label">Location</div><div class="detail-value">${bookingData.location}</div></div>
                    <div class="detail-item"><div class="detail-label">Your Phone</div><div class="detail-value">${bookingData.customer_phone}</div></div>
                </div>
            </div>
            ${
              bookingData.special_requests &&
              bookingData.special_requests !== "None"
                ? `
            <div class="card">
                <h2>Special Requests</h2>
                <p class="paragraph">${bookingData.special_requests}</p>
            </div>
            `
                : ""
            }
            <p class="paragraph">We look forward to hosting you! If you have any questions, please don't hesitate to contact us.</p>
            <div class="footer">
                <p>Best regards,<br><strong>The Stayzee Team</strong></p>
                <p style="margin-top: 10px;">Booking Date: ${bookingData.booking_date}</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
  },

  generateAdminEmailTemplate(bookingData) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f6f9fc; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
        .header { background: #ff6b6b; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .card { background: #f8f9fa; border-radius: 6px; padding: 20px; margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { color: #6c757d; }
        .value { font-weight: bold; color: #2c3e50; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 New Booking Received</h1>
            <p>Booking Reference: ${bookingData.booking_reference}</p>
        </div>
        <div class="content">
            <div class="card">
                <h3>Customer Information</h3>
                <div class="detail-row"><span class="label">Name:</span><span class="value">${bookingData.customer_name}</span></div>
                <div class="detail-row"><span class="label">Email:</span><span class="value">${bookingData.customer_email}</span></div>
                <div class="detail-row"><span class="label">Phone:</span><span class="value">${bookingData.customer_phone}</span></div>
            </div>
            <div class="card">
                <h3>Booking Details</h3>
                <div class="detail-row"><span class="label">Property:</span><span class="value">${bookingData.property_name}</span></div>
                <div class="detail-row"><span class="label">Check-in:</span><span class="value">${bookingData.check_in}</span></div>
                <div class="detail-row"><span class="label">Check-out:</span><span class="value">${bookingData.check_out}</span></div>
                <div class="detail-row"><span class="label">Guests:</span><span class="value">${bookingData.guests}</span></div>
                <div class="detail-row"><span class="label">Total Amount:</span><span class="value">₹${bookingData.total_amount}</span></div>
            </div>
            ${
              bookingData.special_requests &&
              bookingData.special_requests !== "None"
                ? `
            <div class="card">
                <h3>Special Requests</h3>
                <p>${bookingData.special_requests}</p>
            </div>
            `
                : ""
            }
            <p><strong>Booking Date:</strong> ${bookingData.booking_date}</p>
        </div>
    </div>
</body>
</html>
    `;
  },
};
