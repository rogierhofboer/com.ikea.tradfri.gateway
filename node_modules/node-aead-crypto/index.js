var binary = require('node-pre-gyp');
var path = require('path');
var binding_path = binary.find(path.resolve(path.join(__dirname,'./package.json')));
var binding = require(binding_path);

module.exports = {
    ccm: {
        encrypt: binding.CcmEncrypt,
        decrypt: binding.CcmDecrypt,
    },
    gcm: {
        encrypt: binding.GcmEncrypt,
        decrypt: binding.GcmDecrypt,
    }
}