import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { validateEnv } from './backend/src/config/env.js';
import app from './backend/src/app.js';
import { connectDB } from './backend/src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';
const distPath = path.resolve(__dirname, 'frontend/dist');

async function start() {
    validateEnv();
    await connectDB();

    if (isProduction && fs.existsSync(distPath)) {
        console.log(`[RestoReserve] Serving static production build from ${distPath}`);
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    } else {
        console.log('[RestoReserve] Mounting Vite middleware for development');
        const { createServer } = await import('vite');
        const vite = await createServer({
            configFile: path.resolve(__dirname, 'frontend/vite.config.js'),
            server: {
                middlewareMode: true,
                hmr: false,
            },
            appType: 'spa',
            root: path.resolve(__dirname, 'frontend'),
        });
        app.use(vite.middlewares);
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[RestoReserve] Server running on http://0.0.0.0:${PORT} (mode: ${process.env.NODE_ENV || 'development'})`);
    });
}

start().catch((err) => {
    console.error('[RestoReserve] Server startup failed:', err);
    process.exit(1);
});
