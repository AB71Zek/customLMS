# Development Commands

## Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild backend after code changes
docker-compose build --no-cache backend

# View logs
docker logs backend
docker logs db
```

## Database Commands
```bash
# Run migrations
docker exec -e DATABASE_URL="postgresql://customlms:customlms@db:5432/customlms?schema=public" backend npx prisma migrate dev --name migration_name

# Reset database
docker exec -e DATABASE_URL="postgresql://customlms:customlms@db:5432/customlms?schema=public" backend npx prisma migrate reset

# Generate Prisma client
docker exec backend npx prisma generate

# Access database
docker exec -it db psql -U customlms -d customlms
```

## Testing Commands
```bash
# Test room creation
curl -X POST http://localhost:4000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"userName":"Teacher","iconLayout":[{"id":"item1","type":"torch","x":20,"y":30}],"questions":[{"itemId":"item1","question":"What burns?","expectedAnswers":["fire"]}]}'

# Test room play (replace ROOMCODE with actual code)
curl http://localhost:4000/api/play/ROOMCODE

# Test users endpoint
curl http://localhost:4000/users
```
