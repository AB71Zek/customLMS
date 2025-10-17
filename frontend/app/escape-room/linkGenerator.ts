// Link generator for escape room sharing
// Generates shareable links and embed codes for external websites

// Generate direct play link for students
export const generatePlayLink = (roomId: string): string => {
  // For development, use localhost. In production, this would be your EC2 server URL
  const baseUrl = process.env.NEXT_PUBLIC_GAME_SERVER_URL || 'http://localhost:80';
  return `${baseUrl}/escape-room?room=${roomId}`;
};

// Generate embeddable link for external websites
export const generateEmbedLink = (roomId: string): string => {
  // This will be the URL where the game runs on your EC2 server
  const baseUrl = process.env.NEXT_PUBLIC_GAME_SERVER_URL || 'https://your-ec2-server.com';
  return `${baseUrl}/play/${roomId}`;
};

// Generate iframe embed code for websites
export const generateEmbedCode = (roomId: string): string => {
  const embedUrl = generateEmbedLink(roomId);
  return `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
};

// Generate shareable text for teachers
export const generateShareText = (roomId: string): string => {
  const playLink = generatePlayLink(roomId);
  return `🎮 Escape Room Ready!\n\nRoom Code: ${roomId}\nPlay Link: ${playLink}\n\nShare this with your students to start the game!`;
};