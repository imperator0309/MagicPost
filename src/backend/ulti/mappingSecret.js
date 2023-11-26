const secret = {}

module.exports = {
    addSecret: function(id, secret) {
        secret[id] = secret
    },
    
    removeSecret: function(id) {
        delete secret[id]
    },
    
    getSecret: function(id) {
        return secret[id]
    }
}