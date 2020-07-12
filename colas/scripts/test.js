process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";
process.env.PUBLIC_URL = "";
require("./inject");
require("react-scripts/scripts/test");
