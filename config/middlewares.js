// config/middlewares.js
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',
        'http://localhost:1337',
        'http://localhost:5173',
        'http://admin.metamag.co.in',
        'https://admin.metamag.co.in',
        'https://metamag.co.in',
        'https://www.metamag.co.in',
        'https://appetizing-reward-d32d5c8f0f.strapiapp.com'
      ],
      headers: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
      credentials: true
    }
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
