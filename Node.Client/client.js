'use strict';

const fs = require('fs');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader')

const PORT = 9000;

/** CERTIFICADO */
const cacert = fs.readFileSync('../certs/ca.crt');
const cert = fs.readFileSync('../certs/client.crt');
const key = fs.readFileSync('../certs/client.key');
const credentials = grpc.credentials.createSsl(cacert, key, cert);

/** LOAD PROTO E IMPLEMENTAÇÃO */
const PROTO_PATH = '../pb/messages.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const notesProto = grpc.loadPackageDefinition(packageDefinition);
const client = new notesProto.UserService(`localhost:${PORT}`, credentials);

/** CHAMADA */
const implementation = require('./clientImplementation');
setInterval(() => {
    implementation.getByUserId(client);
}, 1)