import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import chatRoute from './routes/chat.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/chat', chatRoute);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
