import { config } from 'dotenv';
config();

interface ICONFIG {
  node_env: string;
  port: number;
  ip: string;
  jwt_secret: string;
  jwt_secret_admin: string;
  jwt_refresh_admin: string;
  jwt_refresh_secret: string;
  jwt_token_expires: string;
  jwt_refresh_expires: string;
  db_name: string;
  db_username: string;
  db_port: number;
  db_host: string;
  db_password: string;
  server_url: string;
  swagger_url: string;
  jwt_token_expires_in_min: number;
  db_certificate: string;
  rabbitmq_url: string;
}

let _config: ICONFIG;

const configuration = () => {
  if (!_config) {
    _config = {
      node_env: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT) || 3000,
      ip: process.env.IP || '127.0.0.1',
      jwt_secret: process.env.JWT_SECRET,
      jwt_secret_admin: process.env.JWT_SECRET_ADMIN,
      jwt_refresh_admin: process.env.JWT_REFRESH_ADMIN,
      jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
      jwt_token_expires: process.env.JWT_TOKEN_EXPIRES,
      jwt_refresh_expires: process.env.JWT_REFRESH_EXPIRES,
      jwt_token_expires_in_min: parseInt(
        process.env.JWT_REFRESH_EXPIRES_TIME_IN_MIN,
      ),
      db_name: process.env.DB_NAME,
      db_username: process.env.DB_USERNAME,
      db_password: process.env.DB_PASSWORD,
      db_host: process.env.DB_HOST,
      db_port: parseInt(process.env.DB_PORT),
      db_certificate: process.env.DB_CERTIFICATE || '',
      server_url: process.env.SERVER_URL || 'http://localhost:3000',
      swagger_url: process.env.SWAGGER_URL || '',
      rabbitmq_url: process.env.RABBITMQ_URL,
    };

    let toExit = false;
    for (const key in _config) {
      if (_config.hasOwnProperty(key) && typeof _config[key] === 'undefined') {
        console.error('not defined \t-\t' + key);
        toExit = true;
      }
    }

    if (toExit) {
      console.error('process exiting');
      process.exit(-1);
    }
  }

  return _config;
};

export const env = configuration();
