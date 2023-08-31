import { mountDatabase } from './infra/database/mountDatabase';
import Server from './infra/http/server';
import dotenv from 'dotenv';
import Debug from 'debug';

const debug = Debug('app:server');

dotenv.config();

async function init() {
  await mountDatabase();
}

init();
const server = new Server(process.env.PORT || 7778, false);

server.init();

process.on('SIGTERM', () => {
  debug(
    '> Server ending after close all connections - ',
    new Date().toISOString(),
  );
  server.close(() => process.exit());
});

process.on('SIGINT', () => {
  debug('> Server ending now! - ', new Date().toISOString());
  server.close(() => process.exit());
  process.exit();
});