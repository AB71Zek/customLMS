# Custom LMS Escape Room

An interactive escape room learning management system built with Next.js, React, Bootstrap, Prisma, PostgreSQL, and OpenTelemetry instrumentation.

## Features

- 🏰 **Interactive Escape Rooms**: Create and play educational escape room experiences
- ⏰ **Timer System**: Configurable game timers (5, 10, 15 minutes + custom)
- 🧩 **Puzzle System**: Interactive Q&A with key code generation
- 🏆 **Treasure Chest**: Multi-lock treasure chest puzzle
- 📊 **Real-time Analytics**: OpenTelemetry instrumentation for monitoring
- 🎨 **Modern UI**: Bootstrap-based responsive design
- 🌙 **Theme Support**: Light/dark mode toggle

## Technology Stack

- **Frontend**: Next.js 13+ (App Router), React, Bootstrap
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Monitoring**: OpenTelemetry instrumentation
- **Containerization**: Docker & Docker Compose

## Project Structure

```
customLMS/
├── frontend/               # Next.js frontend application
│   ├── app/
│   │   ├── escape-room/   # Main escape room application
│   │   ├── Components/    # Reusable components
│   │   └── public/        # Static assets
│   ├── instrumentation.ts # OpenTelemetry setup
│   └── package.json
├── backend/               # Next.js backend API
│   ├── app/
│   │   ├── api/           # API routes
│   │   └── page.tsx       # Backend dashboard
│   ├── prisma/            # Database schema
│   ├── lib/               # Prisma client
│   ├── instrumentation.ts # OpenTelemetry setup
│   └── package.json
└── docker-compose.yml     # Multi-container setup
```

## API Endpoints

### Users
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user

### Rooms
- `GET /api/rooms` - Fetch all rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/[roomId]` - Fetch specific room
- `PUT /api/rooms/[roomId]` - Update room

### Play
- `GET /api/play/[roomId]` - Public room data for playing

## Development

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd customLMS
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Or run individually**
   ```bash
   # Backend
   cd backend
   npm install
   npm run db:generate
   npm run db:migrate
   npm run dev

   # Frontend (in another terminal)
   cd frontend
   npm install
   npm run dev
   ```

### Environment Variables

Create `.env` files in both frontend and backend directories:

```env
# Backend .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/customlms"
NEXTAUTH_SECRET="your-secret-key"
NODE_ENV="development"
```

## OpenTelemetry Instrumentation

The application includes comprehensive OpenTelemetry instrumentation:

- **Frontend**: User interactions, API calls, timer operations
- **Backend**: Database operations, API request/response cycles
- **Performance**: Response times, error tracking
- **Custom Metrics**: Room creation, user engagement

## Deployment

### Docker Deployment
```bash
docker-compose up --build -d
```

### Manual Deployment
1. Build both applications
2. Set up PostgreSQL database
3. Run Prisma migrations
4. Deploy frontend and backend separately

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
