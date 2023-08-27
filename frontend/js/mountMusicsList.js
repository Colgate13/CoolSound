import { getAllMusics, getMusic } from "./api/musics.js";
import { truncateString } from "./utils/truncateString.js";

const audioPlayer = document.getElementById("audioPlayer");

const mountMusicsList = async () => {
  const musics = await getAllMusics();
  musics.forEach((music) => {
    const button = document.createElement("li");
    button.setAttribute("id", music.id);
    button.innerText = truncateString(music.title, 20);

    button.addEventListener("click", async () => {
      const listenMusic = await getMusic(music.id);
      audioPlayer.src = `http://localhost:7778/listen?music=${listenMusic.id}`;
      audioPlayer.play();
    });

    document.getElementById("musics").appendChild(button);
  });
};

const clearMusicsList = () => {
  const musics = document.getElementById("musics");
  while (musics.firstChild) {
    musics.removeChild(musics.firstChild);
  }
};

export { mountMusicsList, clearMusicsList };
