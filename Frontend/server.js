import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || process.env.VITE_API_BASE_URL || 'http://localhost:4000';

app.use('/api', createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true
}));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend server is running on port ${PORT}`);
    console.log(`Proxying /api requests to ${BACKEND_URL}`);
});
