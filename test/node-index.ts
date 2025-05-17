const nodeStorage = require('../src/index.ts')

nodeStorage.setItem('username', 'hopebearer')

console.log(nodeStorage.getItem('username'))
