const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://customlms:customlms@db:5432/customlms?schema=public"
    }
  }
});
const app = express();

//json
app.use(express.json());

//cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//get all users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//get user by id
app.get('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        });
        res.status(202).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//create user
app.post('/users', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: { name: req.body.name },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//update user
app.put('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: { name: req.body.name },
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//delete user
app.delete('/users/:id', async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ===== ROOM ROUTES =====

// Create a new room
app.post('/api/rooms', async (req, res) => {
    try {
        const { iconLayout, questions, userName } = req.body;
        
        // Validate required fields
        if (!iconLayout || !questions || !userName) {
            return res.status(400).json({ message: 'Missing required fields: iconLayout, questions, userName' });
        }
        
        // Find or create user
        let user = await prisma.user.findFirst({
            where: { name: userName }
        });
        
        if (!user) {
            user = await prisma.user.create({
                data: { name: userName }
            });
        }
        
        // Generate unique roomId
        const generateRoomId = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        
        let roomId;
        let isUnique = false;
        while (!isUnique) {
            roomId = generateRoomId();
            const existing = await prisma.room.findUnique({
                where: { roomId }
            });
            if (!existing) isUnique = true;
        }
        
        // Create room
        const room = await prisma.room.create({
            data: {
                roomId,
                userId: user.id,
                iconLayout,
                questions
            }
        });
        
        res.status(201).json({ 
            roomId: room.roomId,
            message: 'Room created successfully' 
        });
        
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get room by roomId (for editing)
app.get('/api/rooms/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        
        const room = await prisma.room.findUnique({
            where: { roomId },
            include: { user: true }
        });
        
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        res.status(200).json({
            roomId: room.roomId,
            iconLayout: room.iconLayout,
            questions: room.questions,
            createdAt: room.createdAt,
            userName: room.user.name
        });
        
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update room
app.put('/api/rooms/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const { iconLayout, questions } = req.body;
        
        if (!iconLayout || !questions) {
            return res.status(400).json({ message: 'Missing required fields: iconLayout, questions' });
        }
        
        const room = await prisma.room.update({
            where: { roomId },
            data: { iconLayout, questions }
        });
        
        res.status(200).json({ 
            roomId: room.roomId,
            message: 'Room updated successfully' 
        });
        
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ===== PLAY ROUTES =====

// Get room data for playing (public access)
app.get('/api/play/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        
        const room = await prisma.room.findUnique({
            where: { roomId },
            include: { user: true }
        });
        
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        // Return only the data needed for gameplay
        res.status(200).json({
            roomId: room.roomId,
            iconLayout: room.iconLayout,
            questions: room.questions,
            createdAt: room.createdAt
        });
        
    } catch (error) {
        console.error('Error fetching room for play:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
