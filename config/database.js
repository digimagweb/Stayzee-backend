const fs = require('fs');

module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'aws-1-ap-south-1.pooler.supabase.com'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'postgres'),
      user: env('DATABASE_USERNAME', 'postgres.agftlnfysiogvhwhymmt'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', true)
        ? {
            ca: env('DATABASE_SSL_CA')
              ? env('DATABASE_SSL_CA').replace(/\\n/g, '\n')
              : fs.readFileSync('/app/supabase-ca.pem').toString(),
            rejectUnauthorized: true,
          }
        : false,
    },
  },
});
