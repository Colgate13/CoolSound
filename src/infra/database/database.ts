import fs from 'node:fs';
import path from 'node:path';
import { uid } from '../../shared/Utils/uid'
import { IPlaylist } from 'shared/Playlist';

const authorFile = path.resolve(__dirname, '..', '..', '..', 'database', 'authors.json');
const musicsFile = path.resolve(__dirname, '..', '..', '..','database', 'musics.json');
const playlistFile = path.resolve(__dirname, '..', '..', '..','database', 'playlists.json');

export class Database {

  static async getAuthors() {

    if (fs.existsSync(authorFile) === false) { 
      await fs.promises.writeFile(authorFile, '[]', 'utf-8')

      return []
    }

    const authors = await fs.readFileSync(authorFile, 'utf-8')

    return JSON.parse(authors)
  }

  static async getMusics() { 
    if (fs.existsSync(musicsFile) === false) { 
      await fs.promises.writeFile(musicsFile, '[]', 'utf-8')

      return []
    }

    const musics = await fs.readFileSync(musicsFile, 'utf-8')

    return JSON.parse(musics)
  }

  static async getAuthorByYtId(ytId: string) { 
    const authors = await this.getAuthors()

    for (const author of authors) {
      if (author.ytId === ytId) {
        return author
      }
    }
  }

  static async getMusicByYtVideoId(ytVideoId: string) {
    const musics = await this.getMusics()

    for (const music of musics) {
      if (music.ytVideoId === ytVideoId) {
        return music
      }
    }

    return null
  }

  static async getMusicById(musicId: string) { 
    const musics = await this.getMusics()

    for (const music of musics) {
      if (music.id === musicId) {
        return music
      }
    }
  }

  static async createAuthor(name: string, ytId: string) {
    const author = {
      id: uid(),
      name,
      ytId,
    }
    const authors = await this.getAuthors()

    let authorExists = false
    for (const author of authors) {
      if (author.ytId === ytId) {
        return author
      }
    }

    if (!authorExists) {
      authors.push(author)

      const authorsString = JSON.stringify(authors, null, 2)
      await fs.promises.writeFile(authorFile, authorsString, 'utf-8')
    }

    return author
  }

  static async createMusic(musicId: string, ytVideoId: string, title: string, authorId: string) { 
    const music = {
      id: musicId,
      title,
      ytVideoId,
      authorId,
    }

    const musics = await this.getMusics()

    let musicExists = false;
    for (const musicSearch of musics) {
      if (musicSearch.ytVideoId === ytVideoId) {
        musicExists = true;
        break;
      }
    }

    if (!musicExists) {
      musics.push(music)

      const musicsString = JSON.stringify(musics, null, 2)
      await fs.promises.writeFile(musicsFile, musicsString, 'utf-8')
  
      return music
    }
  }

  static async getPlaylists() { 
    if (fs.existsSync(playlistFile) === false) { 
      await fs.promises.writeFile(playlistFile, '[]', 'utf-8')

      return []
    }

    const playlists = await fs.readFileSync(playlistFile, 'utf-8')

    return playlists ? JSON.parse(playlists) : []
  }

  static async getPlaylistById(playlistId: string) { 
    const playlists = await this.getPlaylists()

    for (const playlist of playlists) {
      if (playlist.id === playlistId) {
        return playlist
      }
    }
  }

  static async createPlaylist(playlistId: string, name: string, musics: string[]): Promise<IPlaylist> { 
    const playlist: IPlaylist = {
      id: playlistId,
      name,
      musics 
    }

    const playlists: IPlaylist[] = await this.getPlaylists();

    let playlistExists = false;
    for (const playlistSearch of playlists) {
      if (playlistSearch.id === playlistId || playlistSearch.name === name) {
        playlistExists = true;
        return playlistSearch
      }
    }

    if (!playlistExists) { 
      playlists.push(playlist)

      const playlistsString = JSON.stringify(playlists, null, 2)
      await fs.promises.writeFile(playlistFile, playlistsString, 'utf-8')

      return playlist
    }

    return playlist
  }

  static async addMusicToPlaylist(playlistId: string, musicId: string) { 
    const playlists = await this.getPlaylists()
    for (const playlist of playlists) {
      if (playlist.id === playlistId) { 
        let musicExists = false;
        for (const musicSearch of playlist.musicsIds || []) {
          if (musicSearch === musicId) {
            musicExists = true;
            break;
          }
        }

        if (!musicExists) {

          if (!playlist.musicsIds) { 
            playlist.musicsIds = []
          }

          playlist.musicsIds.push(musicId)
          
          const playlistsString = JSON.stringify(playlists, null, 2)
          await fs.promises.writeFile(playlistFile, playlistsString, 'utf-8')
          
          return playlist
        }
      }
    }
  }
}