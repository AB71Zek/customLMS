# Custom LMS - Escape Room Application

A full-stack escape room application built with Next.js, Express, Prisma, and PostgreSQL.

## Features

- **Escape Room Editor**: Create interactive escape rooms with drag-and-drop icons
- **Question System**: Add questions and answers to interactive elements
- **Treasure Chest Logic**: Dynamic lock system requiring multiple key codes
- **Shareable Links**: Generate unique room codes for students to play
- **Real-time Gameplay**: Interactive HTML image mapping for exploration

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Bootstrap
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Containerization**: Docker & Docker Compose

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd customLMS
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## API Endpoints

### Room Management
- `POST /api/rooms` - Create new escape room
- `GET /api/rooms/:roomId` - Get room for editing
- `PUT /api/rooms/:roomId` - Update room
- `GET /api/play/:roomId` - Get room for gameplay (public)

### User Management
- `GET /users` - List all users
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## How It Works

1. **Teacher creates room**: Uses drag-and-drop editor to place icons and add questions
2. **Room gets saved**: Backend generates unique 8-character room code
3. **Share with students**: Teacher shares the room code/link
4. **Students play**: Enter room code to start the escape room game
5. **Solve puzzles**: Click on interactive areas to answer questions and unlock chest

## Development

### Backend Development
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm start
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Management
```bash
# Run migrations
docker exec backend npx prisma migrate dev --name migration_name

# Reset database
docker exec backend npx prisma migrate reset

# View database
docker exec -it db psql -U customlms -d customlms
```

## Project Structure

```
customLMS/
├── frontend/                 # Next.js frontend application
│   ├── app/
│   │   ├── escape-room/     # Main escape room pages
│   │   └── Components/      # Reusable components
│   └── public/              # Static assets
├── backend/                 # Express.js backend API
│   ├── prisma/              # Database schema and migrations
│   └── index.js             # Main server file
└── docker-compose.yml       # Container orchestration
```

## Testing

Test the API endpoints:

```bash
# Create a room
curl -X POST http://localhost:4000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"userName":"Teacher","iconLayout":[{"id":"item1","type":"torch","x":20,"y":30}],"questions":[{"itemId":"item1","question":"What burns?","expectedAnswers":["fire"]}]}'

# Get room for playing
curl http://localhost:4000/api/play/ROOMCODE123
```

## Contributing

This is a university project. For questions or issues, please contact me on linkedin - https://www.linkedin.com/in/arun-babra/.
