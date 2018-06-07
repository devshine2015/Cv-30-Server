'use strict';

module.exports = function(io) {
    io.on('connection', function(socket){
        console.log("connected");
        // socket.on("update", function(data){
        //     io.emit('newCard', {text:'A new card'});
        // });
    });
};
