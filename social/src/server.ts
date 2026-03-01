import 'dotenv/config'; 
import { createServer } from 'http'; 
import app from './app';
import { connectMongo } from './config/mongo';
import { verifyCloudinary } from './config/cloudinary'; // <-- Import the new function
import { initSocket } from './config/socket';
import { handleChatEvents } from './modules/chat/chat.events';

const PORT = process.env.PORT || 4000;

const httpServer = createServer(app);
const io = initSocket(httpServer);

io.on('connection', (socket) => {
  console.log(`🟢 New client connected: ${socket.id} (User: ${socket.data.userId})`);
  handleChatEvents(io, socket);
  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

// Start the server only after verifying both Mongo AND Cloudinary
Promise.all([
  connectMongo(),
  verifyCloudinary() // <-- Add the verification step here
]).then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Social Engine running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server due to initialization errors:", error);
});