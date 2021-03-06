var Kinect2 = require('../../kinect2'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

var kinect = new Kinect2();
var filepath = "c:\\Users\\kinectdev\\Desktop\\kinect2\\20150718_183220_00.xef";

if (kinect.replay(filepath)) {
    console.log("success.");

    if(kinect.open()) {
        server.listen(8000);
        console.log('Server listening on port 8000');
        console.log('Point your browser to http://localhost:8000');

        app.use(express.static(__dirname + '/public'));

        kinect.on('bodyFrame', function(bodies){
	    io.sockets.emit('bodyFrame', bodies);
            io.flush();
        });

        io.on("connection", function(socket) {
            socket.on("refresh", function(name, fn) {
                fn(name);
            });
        });

        kinect.openBodyReader();
    }
}
