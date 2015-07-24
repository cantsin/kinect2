var Kinect2 = require('../../kinect2'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    zlib = require('zlib');

var kinect = new Kinect2();

if(kinect.open()) {
    server.listen(8000);
    console.log('Server listening on port 8000');
    console.log('Point your browser to http://localhost:8000');

    app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
    });

    app.use(express.static(__dirname + '/public'));

    var colorCompressing = false;
    kinect.on('colorFrame', function(data) {
	//compress the depth data using zlib
	if(!colorCompressing) {
	    colorCompressing = true;

	    zlib.deflate(data, function(err, result){
		if(!err) {
		    io.sockets.emit('colorFrame', result.toString('base64'));
		}
		colorCompressing = false;
	    });
	}
    });

    var depthCompressing = false;
    kinect.on('depthFrame', function(data) {
        //compress the depth data using zlib
        if(!depthCompressing) {
            depthCompressing = true;
            zlib.deflate(data, function(err, result){
        	if(!err) {
        	    io.sockets.emit('depthFrame', result.toString('base64'));
        	}
        	depthCompressing = false;
            });
        }
    });

    kinect.openColorReader();
    kinect.openDepthReader();
}
