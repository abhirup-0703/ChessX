import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import chatRoutes from './modules/chat/chat.routes';
import teamRoutes from './modules/teams/team.routes';
import forumRoutes from './modules/forums/forum.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Mounting the routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/forums', forumRoutes);

export default app;