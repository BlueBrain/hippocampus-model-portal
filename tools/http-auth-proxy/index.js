const httpProxy = require('http-proxy');

const target = process.env.TARGET;
const authToken = process.env.AUTH_TOKEN;
const port = process.env.PORT || 8000;

if (!target) {
  console.error('Env var TARGET not set. Exiting');
  process.exit(1);
}

if (!authToken) {
  console.error('Env var AUTH_TOKEN not set. Exiting');
  process.exit(1);
}

console.log(`Proxy target: ${target}`);

const proxyServer = httpProxy.createProxyServer({
  target,
  changeOrigin: true,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

proxyServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

proxyServer.on('error', (err, req, res) => {
  console.error(err);
});
