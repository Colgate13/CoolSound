import fs, { existsSync } from 'node:fs';
import path from "path";

export async function mountDatabase() {
  const database = path.resolve(__dirname, '..', '..', '..', 'database')
  const authorFile = path.resolve(__dirname, '..', '..', '..', 'database', 'authors.json');
  const musicsFile = path.resolve(__dirname, '..', '..', '..', 'database', 'musics.json');
  const playlistFile = path.resolve(__dirname, '..', '..', '..', 'database', 'playlists.json');
  const musicFolder = path.resolve(__dirname, '..', '..', '..', 'database', 'musics');

  if (existsSync(database) === false) {
    await fs.promises.mkdir(database)
  }

  if (existsSync(musicFolder) === false) {
    await fs.promises.mkdir(musicFolder)
  }

  if (existsSync(authorFile) === false) { 
    await fs.promises.writeFile(authorFile, '[]', 'utf-8')
  }

  if (existsSync(musicsFile) === false) { 
    await fs.promises.writeFile(musicsFile, '[]', 'utf-8')
  }

  if (existsSync(playlistFile) === false) { 
    await fs.promises.writeFile(playlistFile, '[]', 'utf-8')
  }
}