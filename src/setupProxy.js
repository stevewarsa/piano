const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/piano-app', {
            target: 'http://127.0.0.1:8080',
            changeOrigin: true,
            logLevel: "debug",
            headers: {
                Connection: "keep-alive"
            }
        })
    );
}