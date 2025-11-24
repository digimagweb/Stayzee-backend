// config/middlewares.js
module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // Remove this: enabled: true,
      headers: '*',
      origin: [
        'http://localhost:3000',
        'http://localhost:1337', 
        'http://localhost:5173',
        'https://metamag.co.in',
        'https://www.metamag.co.in',
        'https://admin.metamag.co.in',
        'https://appetizing-reward-d32d5c8f0f.strapiapp.com'
      ]
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];