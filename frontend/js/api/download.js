async function download(link) {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: `{"link":"${link}"}`
  };
  
  const response = await fetch('http://localhost:7778/download', options)

  return response.json();
}

export { download };