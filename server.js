const express = require("express");
const app = express();
const connect = require('./src/js/schema');
const http = require('http');
const url = require('url');
const fs = require('fs');
const { response } = require("express");


var server = http.createServer(function(request,response){
    var url = request.url;
    if(request.url == '/'){
        url = '/index.html';
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname+url));
});

connect();

server.listen(3000, () => { //3000번 포트
    console.log("the server is running")
});