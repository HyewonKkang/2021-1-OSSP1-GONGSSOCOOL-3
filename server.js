const express = require("express");
const app = express();
const connect = require('./js/schema');
const http = require('http');
const url = require('url');
const fs = require('fs');
const { response } = require("express");
http.createServer(function(request,response){
    var url = requset.url;
    if(request.url == '/'){
        url = '/index.html';
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname+url));
});

connect();

app.listen(3000, () => { //3000번 포트
    console.log("the server is running")
});