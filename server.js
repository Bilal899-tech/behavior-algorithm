import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static('.'));

const PORT = 3007;
app.listen(PORT, () => {
  console.log(`\n[behavior-algorithm] http://localhost:${PORT}`);
  console.log(`nexagaze project — built by Founder Bilal`);
  console.log(`Contact: ai@nexagaze.com | WhatsApp: 03103860653\n`);
});
