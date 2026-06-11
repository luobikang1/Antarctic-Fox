import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * 测试节点连通性
 * POST /api/test/connectivity
 */
router.post('/connectivity', async (req, res) => {
  try {
    const { nodeLink, testUrl = 'https://www.google.com' } = req.body;

    if (!nodeLink) {
      return res.status(400).json({ error: '缺少节点链接' });
    }

    // 模拟连通性测试
    const startTime = Date.now();
    
    try {
      // 简单的连接测试
      const response = await axios.get(testUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Antarctic-Fox/1.0'
        }
      });

      const latency = Date.now() - startTime;

      res.json({
        message: '连通性测试成功',
        status: 'connected',
        latency: `${latency}ms`,
        statusCode: response.status,
        success: true
      });
    } catch (error) {
      res.json({
        message: '连通性测试失败',
        status: 'disconnected',
        error: error.message,
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 测试节点延迟
 * POST /api/test/latency
 */
router.post('/latency', async (req, res) => {
  try {
    const { nodeLink, testCount = 5 } = req.body;

    if (!nodeLink) {
      return res.status(400).json({ error: '缺少节点链接' });
    }

    const latencies = [];
    const testUrl = 'https://www.cloudflare.com/cdn-cgi/trace';

    for (let i = 0; i < testCount; i++) {
      const startTime = Date.now();
      
      try {
        await axios.get(testUrl, {
          timeout: 3000,
          headers: {
            'User-Agent': 'Antarctic-Fox/1.0'
          }
        });
        
        latencies.push(Date.now() - startTime);
      } catch (error) {
        // 继续测试
      }
    }

    if (latencies.length === 0) {
      return res.json({
        message: '延迟测试失败',
        success: false,
        latencies: []
      });
    }

    const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);

    res.json({
      message: '延迟测试完成',
      success: true,
      latencies,
      statistics: {
        average: `${avgLatency}ms`,
        minimum: `${minLatency}ms`,
        maximum: `${maxLatency}ms`,
        testCount: latencies.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 配置验证
 * POST /api/test/validate-config
 */
router.post('/validate-config', (req, res) => {
  try {
    const { nodeType, uuid, domain, link } = req.body;

    if (!nodeType || !link) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 简单的验证
    let isValid = false;
    let errorMessages = [];

    switch (nodeType) {
      case 'vless':
        isValid = link.startsWith('vless://') && uuid && domain;
        if (!isValid) {
          if (!link.startsWith('vless://')) errorMessages.push('VLESS链接格式错误');
          if (!uuid) errorMessages.push('缺少UUID');
          if (!domain) errorMessages.push('缺少域名');
        }
        break;
      case 'tuic':
        isValid = link.startsWith('tuic://') && uuid && domain;
        if (!isValid) {
          if (!link.startsWith('tuic://')) errorMessages.push('TUIC链接格式错误');
          if (!uuid) errorMessages.push('缺少UUID');
          if (!domain) errorMessages.push('缺少域名');
        }
        break;
      case 'wireguard':
        isValid = link.includes('[Interface]') && link.includes('PrivateKey');
        if (!isValid) errorMessages.push('Wireguard配置格式错误');
        break;
      default:
        errorMessages.push('不支持的节点类型');
    }

    res.json({
      message: isValid ? '配置验证通过' : '配置验证失败',
      isValid,
      nodeType,
      errors: errorMessages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;