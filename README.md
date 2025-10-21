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
- ☁️ **AWS Lambda**: Room validation and listing functions
- 🧪 **Testing**: Playwright end-to-end tests

## Technology Stack

- **Frontend**: Next.js 13+ (App Router), React, Bootstrap
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Monitoring**: OpenTelemetry instrumentation (Jaeger, Zipkin, Prometheus)
- **Containerization**: Docker & Docker Compose
- **Cloud**: AWS Lambda, API Gateway
- **Testing**: Playwright

## Project Structure

```
customLMS/
├── frontend/               # Next.js frontend application
│   ├── app/
│   │   ├── escape-room/   # Main escape room application
│   │   ├── Components/    # Reusable components
│   │   └── public/        # Static assets
│   ├── tests/             # Playwright tests
│   └── package.json
├── backend/               # Next.js backend API
│   ├── app/
│   │   ├── api/           # API routes
│   │   └── page.tsx       # Backend dashboard
│   ├── prisma/            # Database schema
│   ├── lib/               # Prisma client
│   └── package.json
├── lambda/                # AWS Lambda functions
│   └── room-validator/    # Room validation Lambda
├── docker-compose.yml     # Multi-container setup
├── otel-collector-config.yaml # OpenTelemetry configuration
└── prometheus.yaml        # Prometheus monitoring config
```

## API Endpoints

### Backend API (EC2)
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user
- `GET /api/rooms` - Fetch all rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/[roomId]` - Fetch specific room
- `PUT /api/rooms/[roomId]` - Update room
- `GET /api/play/[roomId]` - Public room data for playing

### AWS Lambda API
- `GET /room-list` - List all rooms (Lambda function)
- `GET /room-list?limit=5` - Limited results
- `GET /room-list?createdBy=John` - Filter by creator

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- AWS Account (for Lambda functions)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/AB71Zek/customLMS.git
   cd customLMS
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:80
   - Backend: http://localhost:4080
   - Prometheus: http://localhost:9090
   - Jaeger: http://localhost:16686

### EC2 Deployment

1. **Launch EC2 instance** (Amazon Linux 2)
2. **Install Docker**
   ```bash
   sudo yum update -y
   sudo yum install -y docker
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user
   ```

3. **Install Docker Compose**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Deploy application**
   ```bash
   git clone https://github.com/AB71Zek/customLMS.git
   cd customLMS
   sudo docker-compose up -d
   ```

5. **Update URLs** (see URL Configuration section below)

## URL Configuration

When deploying to a new EC2 instance, update these URLs in the following files:

### Files to Update:

1. **`docker-compose.yml`**
   ```yaml
   environment:
     - NEXT_PUBLIC_BACKEND_URL=http://YOUR-NEW-EC2-DNS:4080
     - NEXT_PUBLIC_GAME_SERVER_URL=http://YOUR-NEW-EC2-DNS
   ```

2. **`frontend/playwright.config.ts`**
   ```typescript
   baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://YOUR-NEW-EC2-DNS',
   url: 'http://YOUR-NEW-EC2-DNS',
   ```

3. **`frontend/app/escape-room/linkGenerator.ts`**
   ```typescript
   const baseUrl = process.env.NEXT_PUBLIC_GAME_SERVER_URL || 'http://YOUR-NEW-EC2-DNS';
   ```

4. **`frontend/app/escape-room/editor/CombinedEditor.tsx`**
   ```typescript
   const baseUrl = process.env.NEXT_PUBLIC_GAME_SERVER_URL || 'http://YOUR-NEW-EC2-DNS';
   ```

5. **`prometheus.yaml`**
   ```yaml
   - targets: ['YOUR-NEW-EC2-DNS:9090']
   ```

### Dynamic URLs (No Changes Needed):
- `window.location.hostname` - Automatically uses new DNS
- Environment variables - Will use new values from docker-compose.yml

### Lambda Function URLs:
- Update Lambda environment variables if connecting to database
- Update API Gateway endpoints if needed

## Monitoring & Observability

### OpenTelemetry Stack
- **Jaeger**: http://YOUR-EC2-DNS:16686 (Distributed tracing)
- **Zipkin**: http://YOUR-EC2-DNS:9411 (Alternative tracing)
- **Prometheus**: http://YOUR-EC2-DNS:9090 (Metrics)
- **OpenTelemetry Collector**: Port 8888 (Data processing)

### Security Groups Required:
```
Port 22 (SSH) - Your IP
Port 80 (Frontend) - 0.0.0.0/0
Port 4080 (Backend) - 0.0.0.0/0
Port 5432 (PostgreSQL) - 0.0.0.0/0 (for Lambda)
Port 8888 (OTEL Collector) - 0.0.0.0/0
Port 9090 (Prometheus) - 0.0.0.0/0
Port 16686 (Jaeger) - 0.0.0.0/0
Port 9411 (Zipkin) - 0.0.0.0/0
```

## Testing

### Playwright Tests
```bash
cd frontend
npx playwright test
```

### Lambda Testing
- Use AWS Console test events
- Test API Gateway endpoints
- Verify database connectivity

## Features Checklist

- ✅ **Game Features**: Interactive escape rooms, timer system, puzzle system
- ✅ **Dockerization**: Multi-container setup with Docker Compose
- ✅ **APIs/Database**: RESTful APIs with PostgreSQL database
- ✅ **Instrumentation**: OpenTelemetry with Jaeger, Zipkin, Prometheus
- ✅ **Playwright Tests**: End-to-end testing framework
- ✅ **Lighthouse Report**: Performance and accessibility testing
- ✅ **Cloud Deployment**: EC2 deployment with monitoring
- ✅ **Lambda Function**: AWS Lambda for room validation and listing

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
