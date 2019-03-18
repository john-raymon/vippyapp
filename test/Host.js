var assert = require('assert')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/vippy_test');

mongoose.connection
    .once('open', () => console.log('Connected!'))
    .on('error', (error) => {
        console.warn('Error : ',error);
    });

//Called hooks which runs before something.
beforeEach((done) => {
    mongoose.connection.collections.host.drop(() => {
         //this function runs after the drop is completed
        done(); //go ahead everything is done now.
    });
});
