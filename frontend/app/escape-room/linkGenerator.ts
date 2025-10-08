// Link generator for escape room sharing
// This will generate embeddable links for external websites

export interface PlacedItem {
  id: string;
  type: 'barrel' | 'chest' | 'key' | 'torch' | 'treasure';
  x: number;
  y: number;
}

export interface Question {
  id: string;
  iconType: PlacedItem['type'];
  question: string;
  expectedAnswers: string[];
}

export interface RoomData {
  roomId: string;
  iconLayout: PlacedItem[];
  questions: Question[];
  createdAt: string;
  createdBy: string;
}

// Generate unique room ID (8 characters for better uniqueness)
export const generateRoomId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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

// Save room data to backend (framework for future implementation)
export const saveRoomToBackend = async (roomData: RoomData): Promise<{ success: boolean; roomId?: string; error?: string }> => {
  try {
    // TODO: Replace with actual backend API call
    // const response = await fetch('/api/rooms', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(roomData)
    // });
    // return await response.json();
    
    // For now, simulate success
    console.log('Saving room to backend:', roomData);
    return { success: true, roomId: roomData.roomId };
  } catch (error) {
    return { success: false, error: 'Failed to save room' };
  }
};

// Load room data from backend (framework for future implementation)
export const loadRoomFromBackend = async (roomId: string): Promise<RoomData | null> => {
  try {
    // TODO: Replace with actual backend API call
    // const response = await fetch(`/api/rooms/${roomId}`);
    // if (response.ok) {
    //   return await response.json();
    // }
    
    // For now, return null
    console.log('Loading room from backend:', roomId);
    return null;
  } catch (error) {
    console.error('Error loading room:', error);
    return null;
  }
};
