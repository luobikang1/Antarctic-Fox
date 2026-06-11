import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'south-pole-secret-key-2024';

// 用户数据存储（实际应使用数据库或D1/KV）
const users = new Map();

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    if (users.has(username)) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    users.set(username, {
      username,
      password: hashedPassword,
      createdAt: new Date(),
      uuid: null,
      kvConfig: null
    });

    res.json({ 
      message: '注册成功',
      username 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const user = users.get(username);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { username, userId: Date.now() },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.json({
      message: '登录成功',
      token,
      username,
      title: '南极狐',
      welcome: '欢迎来到南方'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 验证令牌
 * GET /api/auth/verify
 */
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: '未提供令牌' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ 
      valid: true,
      user: decoded 
    });
  } catch (error) {
    res.status(401).json({ 
      valid: false, 
      error: '令牌无效' 
    });
  }
});

export default router;