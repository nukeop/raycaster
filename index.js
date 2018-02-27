const express = require('express');

var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/game'));

http.listen(process.env.PORT, () => {
    console.log('listening on *:' + process.env.PORT);
});
