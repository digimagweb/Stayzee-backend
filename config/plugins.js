module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('EMAIL_SMTP_HOST', 'mail.digimag.co.in'),
        port: env.int('EMAIL_SMTP_PORT', 465),
        auth: {
          user: env('EMAIL_SMTP_USERNAME', 'viraj@digimag.co.in'),
          pass: env('EMAIL_SMTP_PASSWORD', 'viraj@123'),
        },
        secure: true, // Port 465 requires secure: true
        requireTLS: false, // Disable TLS for SSL
        // Increase timeouts
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
        // Additional options for better reliability
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'noreply@stayzee.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'noreply@stayzee.com'),
        adminEmail: env('ADMIN_EMAIL', 'admin@stayzee.com'),
      },
    },
  },
});