FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

# Create .env file with DATABASE_URL
RUN echo 'DATABASE_URL="postgresql://customlms:customlms@db:5432/customlms?schema=public"' > .env

EXPOSE 4000

CMD ["node", "index.js"]