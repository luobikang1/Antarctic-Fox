import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 面板配置数据
const panelConfigs = new Map();

/**
 * 生成UUID
 * POST /api/panel/generate-uuid
 */
router.post('/generate-uuid', (req, res) => {
  try {
    const uuid = uuidv4();
    res.json({
      message: 'UUID生成成功',
      uuid,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 保存面板配置
 * POST /api/panel/config
 */
router.post('/config', (req, res) => {
  try {
    const { 
      uuid, 
      domain, 
      password, 
      kvConfig, 
      d1Config,
      language = 'zh',
      theme = 'default',
      backgroundImage = null
    } = req.body;

    if (!uuid || !domain) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const configId = uuidv4();
    const config = {
      id: configId,
      uuid,
      domain,
      password,
      kvConfig,
      d1Config,
      language,
      theme,
      backgroundImage,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    panelConfigs.set(configId, config);

    res.json({
      message: '配置保存成功',
      configId,
      config
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 获取面板配置
 * GET /api/panel/config/:configId
 */
router.get('/config/:configId', (req, res) => {
  try {
    const { configId } = req.params;
    const config = panelConfigs.get(configId);

    if (!config) {
      return res.status(404).json({ error: '配置不存在' });
    }

    res.json({
      message: '获取成功',
      config
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 更新主题
 * POST /api/panel/theme
 */
router.post('/theme', (req, res) => {
  try {
    const { configId, theme, backgroundImage } = req.body;

    if (!configId) {
      return res.status(400).json({ error: '缺少配置ID' });
    }

    const config = panelConfigs.get(configId);
    if (!config) {
      return res.status(404).json({ error: '配置不存在' });
    }

    config.theme = theme || config.theme;
    config.backgroundImage = backgroundImage || config.backgroundImage;
    config.updatedAt = new Date();

    res.json({
      message: '主题更新成功',
      config
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 设置语言
 * POST /api/panel/language
 */
router.post('/language', (req, res) => {
  try {
    const { configId, language } = req.body;

    if (!configId || !language) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const config = panelConfigs.get(configId);
    if (!config) {
      return res.status(404).json({ error: '配置不存在' });
    }

    config.language = language;
    config.updatedAt = new Date();

    res.json({
      message: '语言设置成功',
      config
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 获取面板状态
 * GET /api/panel/status
 */
router.get('/status', (req, res) => {
  try {
    res.json({
      status: 'active',
      title: '南极狐',
      welcome: '欢迎来到南方',
      version: '1.0.0',
      timestamp: new Date(),
      supportedLanguages: ['zh', 'en', 'ko', 'fa'],
      supportedThemes: ['default', 'dark', 'light'],
      features: {
        vlessNodes: true,
        tuicNodes: true,
        wireguardNodes: true,
        subscriptionLinks: true,
        qrCode: true,
        testing: true
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;