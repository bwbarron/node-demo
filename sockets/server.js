var net = require("net");
var server = net.createServer();
var clients = [];

server.on("connection", function (socket) {
    var name;

    function broadcast(name, message) {
        clients.forEach(function (client) {
            if (client !== socket) {
                client.write("[" + name + "] " + message);
            }
        });
    }

    clients.push(socket);
    socket.write("Hello!\n");
    socket.on("data", function (data) {
        if (!name) {
            name = data.toString().trim();
            socket.write("Hello " + name + "!\n");
        } else {
            var message = data.toString();
            if (message.trim() == "exit") {
                socket.end();
            } else {
                broadcast(name, message);
            }
        }
    });
});

server.on("listening", function () {
    console.log("server listening on port 3000");
});

server.listen(3000);