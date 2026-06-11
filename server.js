const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Servir arquivos estáticos do frontend (nossa interface)
app.use(express.static(path.join(__dirname, 'public')));

// Rota de proxy
app.use('/proxy', createProxyMiddleware({
    target: 'http://127.0.0.1', // fallback, será sobrescrito pelo router
    changeOrigin: true,
    ws: true, // suporte a websockets
    router: (req) => {
        let targetUrl = req.query.url;
        if (!targetUrl) return 'http://127.0.0.1';
        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }
        try {
            return new URL(targetUrl).origin;
        } catch (e) {
            return 'http://127.0.0.1';
        }
    },
    pathRewrite: (pathStr, req) => {
        let targetUrl = req.query.url;
        if (!targetUrl) return '';
        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }
        try {
            const parsed = new URL(targetUrl);
            return parsed.pathname + parsed.search;
        } catch (e) {
            return '';
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        // Remove cabeçalhos que impedem o site de abrir em iframes
        delete proxyRes.headers['x-frame-options'];
        delete proxyRes.headers['content-security-policy'];
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse http://localhost:${PORT}`);
});
