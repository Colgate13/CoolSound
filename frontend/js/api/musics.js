const getAllMusics = async () => { 
  const response = await fetch('http://localhost:7778/musics');
  const data = await response.json();
  return data;
}

const getMusic = async (id) => { 
  const response = await fetch(`http://localhost:7778/musics/${id}`);
  const data = await response.json();
  return data;
}

export {
  getAllMusics,
  getMusic
}