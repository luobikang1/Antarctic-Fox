import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// 导入路由
import authRoutes from './routes/auth.js';
import panelRoutes from './routes/panel.js';
import nodeRoutes from './routes/nodes.js';
import testRoutes from './routes/test.js';

// 使用路由
app.use('/api/auth', authRoutes);
app.use('/api/panel', panelRoutes);
app.use('/api/nodes', nodeRoutes);
app.use('/api/test', testRoutes);

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🦊 南极狐服务已启动在端口 ${PORT}`);
  console.log(`📍 访问地址: http://localhost:${PORT}`);
});

export default app;