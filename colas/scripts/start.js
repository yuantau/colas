
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.PUBLIC_URL = './';
require('./inject');
require('react-scripts/scripts/start');
