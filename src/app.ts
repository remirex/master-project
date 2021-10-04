import express from 'express';

import config from './config';

const app = express();

/**
 * A little hack here
 * Import/Export can only be used in 'top-level code'
 * Well, at least in node 10 without babel and at the time of writing
 * So we are using good old require.
 **/
require('./loaders').default({ expressApp: app });

const server = app
  .listen(config.port, function () {
  console.log(`Server listening on port: ${config.port}`);})
  .on('error', err => {
  console.log(err);
  process.exit(1);
});

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint() {
  console.log('');
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
  console.log();
  shutdown();
});

// shut down server
function shutdown() {
  server.close(function onServerClosed(err: any) {
    if (err) {
      console.log(err);
      process.exitCode = 1;
    }
    process.exit();
  });
}
