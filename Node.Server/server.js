'use strict';

const fs = require('fs');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader')

const PORT = 9000;

/** CERTIFICADO */
const cacert = fs.readFileSync('../certs/ca.crt');
const cert = fs.readFileSync('../certs/server.crt');
const key = fs.readFileSync('../certs/server.key');
const kvpair = { 'private_key': key, 'cert_chain': cert };
const credentials = grpc.ServerCredentials.createSsl(cacert, [kvpair]);

/** LOAD PROTO E IMPLEMENTAÇÃO */
const server = new grpc.Server();
const PROTO_PATH = '../pb/messages.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const notesProto = grpc.loadPackageDefinition(packageDefinition);
server.addService(notesProto.UserService.service, require('./serverImplementation'));
server.bind(`0.0.0.0:${PORT}`, credentials);
console.log(`Starting server on port ${PORT}`);
server.start();
