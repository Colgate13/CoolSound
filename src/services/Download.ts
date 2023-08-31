import fs from "node:fs";
import path from "node:path";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import { uid } from "../shared/Utils/uid";
import { Database } from "../infra/database/database";
import { IPlaylist } from "../shared/Playlist";
import { IAuthor } from "../shared/Author";
import Debug from 'debug';

const debug = Debug('app:services:download');
const musicPath = path.resolve(__dirname, "..", "..", "database", "musics");

debug("Music path: ", musicPath);

export async function downloadYTMusic(link: string) {
  const playlistChecker = await ytpl(link).catch(() => null);

  const playlistInfoOrVideoInfo = await ytdl.getInfo(link);

  if (playlistChecker && playlistChecker.items.length > 1) {

    const playlist = await Database.createPlaylist(uid(), playlistInfoOrVideoInfo.videoDetails.title, []);
    for (const item of playlistChecker.items) {
      const musicId = uid();
      const audioTitle = `${musicId}.mp3`;
      const output = path.resolve(musicPath, audioTitle);
      const audioInfo = await ytdl.getInfo(item.shortUrl);

      const author = await Database.createAuthor(
        audioInfo.videoDetails.author.name,
        audioInfo.videoDetails.author.id
      );
      await downloadYT(item.shortUrl, output, musicId, audioInfo, author, playlist);
    }
  } else {
    const tryGetMusic = await Database.getMusicByYtVideoId(
      playlistInfoOrVideoInfo.videoDetails.videoId
    );

    if (!tryGetMusic) {
      const musicId = uid();
      const audioTitle = `${musicId}.mp3`;
      const output = path.resolve(musicPath, audioTitle);

      const author = await Database.createAuthor(
        playlistInfoOrVideoInfo.videoDetails.author.name,
        playlistInfoOrVideoInfo.videoDetails.author.id
      );

      await downloadYT(link, output, musicId, playlistInfoOrVideoInfo, author);
    }
  }
}

async function downloadYT(
  link: string,
  output: string,
  musicId: string,
  audioInfo: any,
  author: IAuthor,
  playlist?: IPlaylist
) {
  const music = await Database.getMusicByYtVideoId(audioInfo.videoDetails.videoId);

  if (!music) { 

  console.time("download");
  ytdl(link, { quality: "highestaudio" })
    .pipe(fs.createWriteStream(output))
    .on("finish", async () => {
      await Database.createMusic(
        musicId,
        audioInfo.videoDetails.videoId,
        audioInfo.videoDetails.title,
        author.id
      );

      const music = await Database.getMusicByYtVideoId(audioInfo.videoDetails.videoId);

      if (!music) { 
        debug(`Music not found: ${audioInfo.videoDetails.title}`);
      }

      if (playlist && music) {
        await Database.addMusicToPlaylist(playlist.id, music.id);
      }

      debug(`Audio downloaded successfully!: ${audioInfo.videoDetails.title}`);
    })
    .on("error", (err) => {
      debug("Error downloading audio:", err);
    });
    console.timeEnd("download");
  } else {
    if (playlist && music) { 
      debug(`Music already exists: ${audioInfo.videoDetails.title}`);
      await Database.addMusicToPlaylist(playlist.id, music.id);
    }
  }

}
