# Cloudflare部署 - VLESS和Wireguard真实代理

本指南将帮助您在Cloudflare Workers上部署真实可用的VLESS和Wireguard代理节点。

## 目录
1. [前置要求](#前置要求)
2. [快速部署](#快速部署)
3. [VLESS代理配置](#vless代理配置)
4. [Wireguard代理配置](#wireguard代理配置)
5. [测试代理](#测试代理)
6. [故障排除](#故障排除)

## 前置要求

### 必需工具
- Node.js 16+
- npm或yarn
- Cloudflare账户（免费或付费）
- Wrangler CLI

### 安装Wrangler

```bash
npm install -g wrangler
wrangler login
```

### Cloudflare配置

1. **创建KV命名空间**
   ```bash
   wrangler kv:namespace create "antarctic-fox"
   wrangler kv:namespace create "antarctic-fox" --preview
   ```

2. **记录命名空间ID**
   - 在Cloudflare Dashboard中找到KV命名空间ID
   - 复制ID并保存

## 快速部署

### 步骤1: 准备代码

```bash
cd Antarctic-Fox/cloudflare
npm install
```

### 步骤2: 配置wrangler.toml

编辑 `wrangler.toml`，填入你的信息：

```toml
name = "Antarctic-Fox"
main = "workers/index.js"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "KV"
id = "your-actual-kv-namespace-id"

[[routes]]
pattern = "proxy.yourdomain.com/*"
zone_name = "yourdomain.com"
```

### 步骤3: 部署

```bash
wrangler deploy
```

## VLESS代理配置

### VLESS链接格式

```
vless://[UUID]@[域名]:443?encryption=none&security=tls&sni=[域名]&type=ws&host=[域名]&path=/vless
```

### 配置示例

**假设：**
- 域名: `proxy.example.com`
- UUID: `550e8400-e29b-41d4-a716-446655440000`

**生成的VLESS链接：**
```
vless://550e8400-e29b-41d4-a716-446655440000@proxy.example.com:443?encryption=none&security=tls&sni=proxy.example.com&type=ws&host=proxy.example.com&path=/vless
```

### 在客户端中使用

**Clash配置：**
```yaml
proxies:
  - name: Antarctic-Fox-VLESS
    type: vless
    server: proxy.example.com
    port: 443
    uuid: 550e8400-e29b-41d4-a716-446655440000
    tls: true
    network: ws
    ws-opts:
      path: /vless
      headers:
        Host: proxy.example.com
    skip-cert-verify: false
```

## Wireguard代理配置

### 获取Wireguard配置

```bash
# 通过API获取
curl "https://proxy.example.com/wg?config=default&client=client1"
```

### Wireguard配置文件示例

```ini
[Interface]
Address = 10.0.0.2/24
PrivateKey = YF4+DwpmanSgCvFV9fWO5tXc4K2eFJxDGrKGF7F2V1M=
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = K2pJ8D1R3Q7M+9G2L5Y8O6P3W1T4V7Z5B3C6F9X2K=
AllowedIPs = 0.0.0.0/0
Endpoint = proxy.example.com:51820
PersistentKeepalive = 25
```

## 测试代理

### 健康检查

```bash
curl https://proxy.example.com/health
```

### 查看日志

```bash
wrangler tail
```

## 故障排除

### 部署失败

检查：
- Wrangler是否正确安装
- 是否已登录Cloudflare账户
- KV命名空间ID是否正确

### VLESS连接失败

检查：
- UUID是否正确
- 域名DNS是否解析
- TLS证书是否有效

### 性能问题

解决方案：
- 使用Wireguard而不是VLESS
- 检查Cloudflare的费用限制
- 优化路由规则

---

**最后更新**: 2024年
