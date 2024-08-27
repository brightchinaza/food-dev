import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http'; // To create the HTTP server
import 'dotenv/config';

// app config
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: '*', // Adjust this to allow specific domains if needed
        methods: ['GET', 'POST', 'PUT'],
    }
});

// WebSocket logic
io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);

    // Handle custom events
    socket.on('message', (data) => {
        console.log( data);
        io.emit('message', data); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
    });
});

// Start the server with WebSocket support
server.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});