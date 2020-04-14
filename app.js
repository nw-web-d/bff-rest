const express = require('express');
const app = express();

var PROTO_PATH = __dirname + '/protos/helloworld.proto';
var CAT_PROTO_PATH = __dirname + '/protos/cat.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

var packageDefinition = protoLoader.loadSync(
  CAT_PROTO_PATH,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
var cat_proto = grpc.loadPackageDefinition(packageDefinition);

app.get('/', function(req, res) {
    greeting();
    res.json({
        message:"Hello,world"
    });
});

function greeting() {
    var client = new hello_proto.Greeter('localhost:50051',
                                         grpc.credentials.createInsecure());
    var user;
    if (process.argv.length >= 3) {
      user = process.argv[2];
    } else {
      user = 'world';
    }
    client.sayHello({name: user}, function(err, response) {
      console.log('Greeting:', response.message);
    });
    client.sayHelloAgain({name: 'you'}, function(err, response) {
      console.log('Greeting:', response.message);
    });

    var catClient = new cat_proto.Cat('localhost:19003',
                                         grpc.credentials.createInsecure());
    catClient.getMyCat({target_cat: 'tama'}, function(err, response) {
      console.log('cat:', response);
    });
  }

app.listen(3000, () => console.log('Started.'));

