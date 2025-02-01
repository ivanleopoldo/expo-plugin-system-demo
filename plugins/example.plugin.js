const toast = require('react-native-toast-message');
module.exports = function run(name) {
  toast.show({ type: 'success', text1: 'hello from ' + name });
};
