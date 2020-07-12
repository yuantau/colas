
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.PUBLIC_URL = './';
require('./inject');
require('react-scripts/scripts/build');