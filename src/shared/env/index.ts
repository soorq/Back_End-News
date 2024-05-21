const RATE_LIMIT_MAX: number = +process.env['RATE_LIMIT_MAX'] || 10000;
const NODE_ENV: string = process.env['NODE_ENV'] || 'development';
const DOMAIN: string = process.env['DOMAIN'] || 'localhost';
const PORT: number = +process.env['PORT'] || 1010;

// DataSource

const DHOST = process.env['DB_HOST'];
const DNAME = process.env['DB_NAME'];
const DUSER = process.env['DB_USER'];
const DPASS = process.env['DB_PASS'];

export { RATE_LIMIT_MAX, NODE_ENV, DOMAIN, DHOST, DNAME, DPASS, DUSER, PORT };
