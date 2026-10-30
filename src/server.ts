import 'dotenv/config';
import { createApp } from './app.js';

const app = createApp();
const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});