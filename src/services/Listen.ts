import fs, { ReadStream } from 'node:fs';
import path from 'node:path';
import Debug from 'debug';

const debug = Debug('app:routes');

const musicCwd = (music: string) => {
  return path.resolve(__dirname, '..', '..', 'database', 'musics', `${music}.mp3`);
}

async function createFileStream(musicName: string): Promise<ReadStream> {
  if (!fs.existsSync(musicCwd(musicName))) debug(`Arquivo não existe: ${musicName}`);

  return fs.createReadStream(musicCwd(musicName));
}

async function* ReadableStreamFileMusic(musicName: string): AsyncGenerator<Buffer> { 
  const readStream = await createFileStream(musicName);

  let cout = 0;
  for await (const data of readStream) {
    cout++;
    yield data;
  }
  debug(`Quantidade de bytes lidos: ${cout} in ${musicName}`);
}

async function* TransformStreamFileMusic(stream: AsyncIterable<Buffer>): AsyncIterable<Buffer> { 
  for await (const data of stream) { 
    yield data;
  }
}

export {
  ReadableStreamFileMusic,
  TransformStreamFileMusic
}