import { Router, Request, Response } from "express";
import { pipeline } from "node:stream/promises";
import Debug from 'debug';

const debug = Debug('app:routes');

/**
 * @Services
 */
import {
  ReadableStreamFileMusic,
  TransformStreamFileMusic,
} from "../../../services/Listen";
import { downloadYTMusic } from "../../../services/Download";
import { Database } from "../../../infra/database/database";

const routes = Router();

routes.get("/", (request, response) => {
  return response.json({ message: "Hello World" });
});

routes.get("/musics", async (request: Request, response: Response) => {
  const musics = await Database.getMusics();

  return response.json(musics);
});

routes.get("/musics/:id", async (request: Request, response: Response) => {
  const music = await Database.getMusicById(request.params.id);

  return response.json(music);
});

routes.get("/playlists", async (request: Request, response: Response) => {
  const playlists = await Database.getPlaylists();

  return response.json(playlists);
});

routes.get("/playlists/:id", async (request: Request, response: Response) => {
  const playlist = await Database.getPlaylistById(request.params.id);

  return response.json(playlist);
});

routes.get("/listen", (request: Request, response: Response) => {
  try {
    if (request?.query?.music && typeof request.query.music === "string") {
      pipeline(
        ReadableStreamFileMusic(request.query.music),
        TransformStreamFileMusic,
        response
      );
    } else {
      response.status(400).json({
        message: "No music found",
      });
    }
  } catch (error) {
    debug(error);
    response.status(500).json({
      message: "Internal server error",
    });
  }
});

routes.post("/download", (request: Request, response: Response) => {
  const musicLink = request?.body?.link;
  if (musicLink && typeof musicLink === "string") {
    downloadYTMusic(musicLink);

    response.status(200).json({
      message: "Download started",
    });
  } else {
    response.status(400).json({
      message: "No link found",
    });
  }
});

export default routes;
