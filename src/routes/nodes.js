import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

const router = express.Router();

// 节点数据存储
const nodes = new Map();

/**
 * 生成VLESS节点
 * POST /api/nodes/generate-vless
 */
router.post('/generate-vless', async (req, res) => {
  try {
    const { uuid, domain, count = 1 } = req.body;

    if (!uuid || !domain) {
      return res.status(400).json({ error: '缺少必要参数：uuid 和 domain' });
    }

    const vlessNodes = [];
    const nodeIds = [];

    for (let i = 0; i < Math.min(count, 10); i++) {
      const nodeId = uuidv4();
      const vlessLink = `vless://${uuid}@${domain}:443?encryption=none&security=tls&sni=${domain}&type=ws&host=${domain}&path=/vless`;
      
      const nodeData = {
        id: nodeId,
        type: 'vless',
        uuid,
        domain,
        link: vlessLink,
        createdAt: new Date()
      };

      nodes.set(nodeId, nodeData);
      vlessNodes.push(nodeData);
      nodeIds.push(nodeId);
    }

    // 生成订阅链接
    const subscriptionLink = Buffer.from(
      vlessNodes.map(n => n.link).join('\n')
    ).toString('base64');

    // 生成二维码
    const qrCode = await QRCode.toDataURL(subscriptionLink);

    res.json({
      message: '生成成功',
      type: 'vless',
      nodes: vlessNodes,
      subscriptionLink,
      qrCode,
      nodeCount: vlessNodes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 生成TUIC节点
 * POST /api/nodes/generate-tuic
 */
router.post('/generate-tuic', async (req, res) => {
  try {
    const { uuid, domain, count = 1 } = req.body;

    if (!uuid || !domain) {
      return res.status(400).json({ error: '缺少必要参数：uuid 和 domain' });
    }

    const tuicNodes = [];

    for (let i = 0; i < Math.min(count, 10); i++) {
      const nodeId = uuidv4();
      const tuicLink = `tuic://${uuid}@${domain}:443?congestion_control=cubic&udp_relay_mode=native`;
      
      const nodeData = {
        id: nodeId,
        type: 'tuic',
        uuid,
        domain,
        link: tuicLink,
        createdAt: new Date()
      };

      nodes.set(nodeId, nodeData);
      tuicNodes.push(nodeData);
    }

    // 生成订阅链接
    const subscriptionLink = Buffer.from(
      tuicNodes.map(n => n.link).join('\n')
    ).toString('base64');

    // 生成二维码
    const qrCode = await QRCode.toDataURL(subscriptionLink);

    res.json({
      message: '生成成功',
      type: 'tuic',
      nodes: tuicNodes,
      subscriptionLink,
      qrCode,
      nodeCount: tuicNodes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 生成Wireguard节点
 * POST /api/nodes/generate-wireguard
 */
router.post('/generate-wireguard', async (req, res) => {
  try {
    const { domain, count = 1 } = req.body;

    if (!domain) {
      return res.status(400).json({ error: '缺少必要参数：domain' });
    }

    const wgNodes = [];

    for (let i = 0; i < Math.min(count, 10); i++) {
      const nodeId = uuidv4();
      const privateKey = Buffer.from(uuidv4()).toString('base64').substring(0, 32);
      const publicKey = Buffer.from(uuidv4()).toString('base64').substring(0, 32);

      const wgConfig = `[Interface]
Address = 10.0.0.${2 + i}/24
PrivateKey = ${privateKey}
DNS = 1.1.1.1

[Peer]
PublicKey = ${publicKey}
AllowedIPs = 0.0.0.0/0
Endpoint = ${domain}:51820`;

      const nodeData = {
        id: nodeId,
        type: 'wireguard',
        domain,
        config: wgConfig,
        privateKey,
        publicKey,
        createdAt: new Date()
      };

      nodes.set(nodeId, nodeData);
      wgNodes.push(nodeData);
    }

    // 生成二维码
    const qrCode = await QRCode.toDataURL(wgNodes[0].config);

    res.json({
      message: '生成成功',
      type: 'wireguard',
      nodes: wgNodes,
      qrCode,
      nodeCount: wgNodes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 获取所有节点
 * GET /api/nodes/list
 */
router.get('/list', (req, res) => {
  try {
    const allNodes = Array.from(nodes.values());
    res.json({
      message: '获取成功',
      nodes: allNodes,
      count: allNodes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 删除节点
 * DELETE /api/nodes/:id
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (nodes.has(id)) {
      nodes.delete(id);
      res.json({ message: '节点已删除' });
    } else {
      res.status(404).json({ error: '节点不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;