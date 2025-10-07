// Utility functions for key code generation during gameplay

export interface GameplayState {
  collectedKeyCodes: string[];
  chestAnswer: string;
}

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
  roomCode: string;
  iconLayout: PlacedItem[];
  questions: Question[];
  createdAt: string;
  createdBy: string;
}

// Generate unique room code (6 characters)
export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate random key code part (3-5 characters)
export const generateKeyCodePart = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = Math.floor(Math.random() * 3) + 3; // 3-5 characters
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate chest answer from collected key codes
export const generateChestAnswer = (collectedKeyCodes: string[]): string => {
  return collectedKeyCodes.join('-');
};

// Check if answer matches any expected answer (case-insensitive)
export const isAnswerCorrect = (userAnswer: string, expectedAnswers: string[]): boolean => {
  const normalizedUserAnswer = userAnswer.toLowerCase().trim();
  return expectedAnswers.some(expected => 
    expected.toLowerCase().trim() === normalizedUserAnswer
  );
};

// Storage keys for room and gameplay data
export const ROOMS_STORAGE_KEY = 'escape-room:rooms';
export const GAMEPLAY_STORAGE_KEY = 'escape-room:gameplay:state';
export const QUESTIONS_STORAGE_KEY = 'escape-room:editor:questions';
export const CURRENT_ROOM_KEY = 'escape-room:current:room';

// Load gameplay state from localStorage
export const loadGameplayState = (): GameplayState => {
  try {
    const saved = localStorage.getItem(GAMEPLAY_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return { collectedKeyCodes: [], chestAnswer: '' };
};

// Save gameplay state to localStorage
export const saveGameplayState = (state: GameplayState): void => {
  try {
    localStorage.setItem(GAMEPLAY_STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

// Load questions from editor
export const loadQuestions = () => {
  try {
    const saved = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return [];
};

// Room management functions
export const saveRoom = (roomData: RoomData): void => {
  try {
    const existingRooms = loadAllRooms();
    const updatedRooms = [...existingRooms, roomData];
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(updatedRooms));
    localStorage.setItem(CURRENT_ROOM_KEY, roomData.roomCode);
  } catch {}
};

export const loadAllRooms = (): RoomData[] => {
  try {
    const saved = localStorage.getItem(ROOMS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return [];
};

export const loadRoomByCode = (roomCode: string): RoomData | null => {
  try {
    const rooms = loadAllRooms();
    return rooms.find(room => room.roomCode === roomCode) || null;
  } catch {}
  return null;
};

export const getCurrentRoom = (): RoomData | null => {
  try {
    const roomCode = localStorage.getItem(CURRENT_ROOM_KEY);
    if (roomCode) {
      return loadRoomByCode(roomCode);
    }
  } catch {}
  return null;
};

// Reset gameplay state
export const resetGameplayState = (): void => {
  try {
    localStorage.removeItem(GAMEPLAY_STORAGE_KEY);
  } catch {}
};

// Reset all room data
export const resetAllRooms = (): void => {
  try {
    localStorage.removeItem(ROOMS_STORAGE_KEY);
    localStorage.removeItem(CURRENT_ROOM_KEY);
    localStorage.removeItem(QUESTIONS_STORAGE_KEY);
    localStorage.removeItem('escape-room:editor:layout');
    localStorage.removeItem('escape-room:questions:complete');
    localStorage.removeItem('escape-room:room:saved');
  } catch {}
};
