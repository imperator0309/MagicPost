const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/express_learning', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect Successfully!');
    } catch (error) {
        console.log('Connect failed! ',error);
    }
}

module.exports = {connect};