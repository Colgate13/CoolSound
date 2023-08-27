function formatTemp(timeToFormat) {
  const minutes = Math.floor(timeToFormat / 60);
  const seconds = Math.floor(timeToFormat % 60);

  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return formattedTime;
}

export { formatTemp };