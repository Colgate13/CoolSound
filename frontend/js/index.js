import { download } from "./api/download.js";
import { mountMusicsList, clearMusicsList } from './mountMusicsList.js'

const addMusicsBtn = document.getElementById("addMusics");
const linkDownloadBtn = document.getElementById("linkDownload");
const resultDownload = document.getElementById("resultDownload");
const searchInput = document.getElementById("searchMusic");

let inDownload = false;

/**
 ** @EventListeners {Player}
 */
addMusicsBtn.addEventListener("click", async () => {
  if (linkDownloadBtn.value && !inDownload) { 
    inDownload = true;
    const response = await download(linkDownloadBtn.value)
    inDownload = response ? false : false;

    if (response && response.message) { 
      resultDownload.innerText = response.message
      
      clearMusicsList();
      mountMusicsList();
    }
  }
});

searchInput.addEventListener("input", function () {
  filterMusicList(this.value);
});

function filterMusicList(searchText) {
  const musicItems = document.querySelectorAll("#musics li");

  musicItems.forEach((item) => {
    const musicName = item.textContent.toLowerCase();
    if (musicName.includes(searchText.toLowerCase())) {
      item.style.display = "block"; // Mostra o item correspondente
    } else {
      item.style.display = "none"; // Oculta o item não correspondente
    }
  });
}
