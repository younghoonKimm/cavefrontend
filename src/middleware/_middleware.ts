import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = createProxyMiddleware({
  target: 'http:localhost:3000/api',
  pathRewrite: { '^/api': '/api' },
  ws: true,
  //the data server
  changeOrigin: true,
});

export default proxy;
