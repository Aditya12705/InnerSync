import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

// Proxy middleware must be mounted BEFORE any body-parsers
app.use('/api', createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
        // Log the proxy request to help debug
        console.log(`[Proxy] ${req.method} ${req.originalUrl} -> ${BACKEND_URL}${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Keep CORS headers from backend if any, otherwise proxy handles it
    },
    onError: (err, req, res) => {
        console.error('[Proxy Error]:', err);
        res.status(502).send('Bad Gateway error connecting to Backend.');
    }
}));

// Serve static files AFTER the API proxy
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend server is running on port ${PORT}`);
    console.log(`Proxying /api requests to ${BACKEND_URL}`);
});
