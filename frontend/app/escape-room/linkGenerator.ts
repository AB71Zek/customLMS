export function generatePlayLink(roomId: string): string {
  return `http://localhost:3000/escape-room?room=${roomId}`;
}

export function generateEmbedLink(roomId: string): string {
  return `http://localhost:3000/escape-room/embed?room=${roomId}`;
}

export function generateEmbedCode(roomId: string): string {
  const embedLink = generateEmbedLink(roomId);
  return `<iframe src="${embedLink}" width="800" height="600" frameborder="0"></iframe>`;
}

export function generateShareText(roomId: string): string {
  const playLink = generatePlayLink(roomId);
  return `🏰 Escape Room Challenge!\n\nRoom Code: ${roomId}\nPlay Link: ${playLink}\n\nCan you solve all the puzzles and escape? Good luck! 🧩`;
}
