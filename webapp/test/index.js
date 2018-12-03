// require all modules ending in "-test" from the
// current directory and all subdirectories
const testsContext = require.context('.', true, /-test$/);

testsContext.keys().forEach(testsContext);
