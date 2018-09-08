var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

http.createServer(function (req, res) {

    var pathname = url.parse(req.url).pathname;
    var dataToSend = "";
    console.log("Request Coming Through......", pathname);

    if (pathname == "/") {
        pathname = "/home.html";
        console.log("Home Page: ", pathname)
    }

    if (pathname == "/save") {

        if (req.method == 'POST') {
            var body = '';
            req.on('data', function (data) {
                body += data;
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6) {
                    // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                    req.connection.destroy();
                }
            });
            req.on('end', function () {

                var POST = qs.parse(body);
                var temp = JSON.parse(body);
                console.log("Save: ", temp.purchase);

                fs.writeFile('JSON/' + temp.purchase.purchaseBillNumber + '.json', body, function (err) {
                    if (err) {
                        return console.error(err);
                    }

                    console.log("Data written successfully!");

                });

                res.write(body);
                res.end();
                // use POST
            });
        }


    }

    if (pathname == "/get") {

        if (req.method == 'POST') {
            var body = '';
            req.on('data', function (data) {
                body += data;
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6) {
                    // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                    req.connection.destroy();
                }
            });
            req.on('end', function () {

                var POST = qs.parse(body);
                var temp = JSON.parse(body);
                console.log("get: ", temp.purchaseBillNumber);

                fs.open('JSON/' + temp.purchaseBillNumber + '.json', 'r+', function (err, fd) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        fs.readFile(fd, function (err, data) {
                            //console.log("Fetch File: ")
                            dataToSend = data.toString();
                            res.write(dataToSend);
                            res.end();
                        })
                    }

                });
            });
        }


    }

    else {
        fs.open(pathname.substr(1), 'r+', function (err, fd) {
            if (err) {
                console.log(err);
            }
            else {
                fs.readFile(fd, function (err, data) {
                    console.log("Fetch File: ", pathname.substr(1))
                    dataToSend = data.toString();
                    if (pathname.toString().indexOf("css") >= 0) {
                        res.writeHead(200, { 'Content-Type': 'text/css' });
                    }
                    res.write(dataToSend);
                    res.end();
                })
            }

        });
    }


}).listen(8080);