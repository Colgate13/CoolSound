import fs from "node:fs";
import path from "node:path";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import { uid } from "../Utils/uid";
import { Database } from "../database";
import { IPlaylist } from "../shared/Playlist";
import { IAuthor } from "../shared/Author";

const musicPath = path.resolve(__dirname, "..", "..", "database", "musics");

export async function downloadYTMusic(link: string) {
  const playlistChecker = await ytpl(link).catch(() => null);
  const playlistInfoOrVideoInfo = await ytdl.getInfo(link);

  if (playlistChecker && playlistChecker.items.length > 1) {

    const playlist = await Database.createPlaylist(uid(), playlistInfoOrVideoInfo.videoDetails.title, []);

    let count = 0;
    for (const item of playlistChecker.items) {
      if (count > 1) { 
        break;
      }
      const musicId = uid();
      const audioTitle = `${musicId}.mp3`;
      const output = path.resolve(musicPath, audioTitle);
      const audioInfo = await ytdl.getInfo(item.shortUrl);

      const author = await Database.createAuthor(
        audioInfo.videoDetails.author.name,
        audioInfo.videoDetails.author.id
      );
      await downloadYT(item.shortUrl, output, musicId, audioInfo, author, playlist);
      count++;
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
        console.log("Music not found");
      }

      if (playlist && music) {
        await Database.addMusicToPlaylist(playlist.id, music.id);
      }

      console.log("Audio downloaded successfully!");
    })
    .on("error", (err) => {
      console.error("Error downloading audio:", err);
    });
    console.timeEnd("download");
  } else {
    console.log(music)
    console.log(playlist)
    if (playlist && music) { 
      console.log("Music already exists");
      await Database.addMusicToPlaylist(playlist.id, music.id);
    }
  }

}
