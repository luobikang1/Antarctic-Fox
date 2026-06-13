#南极狐(南极狐)
由于技术原因，目前仅支持节点模板生成

一个基于Cloudflare的真实可用的代理VPN系统，支持多种节点部署和管理。

## 项目概述

南极狐是一个完整的VPN代理解决方案，主要部署在Cloudflare平台上，实现真实可用的节点代理功能。该项目不仅仅是节点模型展示，而是一个完全可用的VPN系统，支持中国大陆用户访问Google等外部网络。

##核心功能

###1. 用户认证系统
-登录界面标题：**南极狐**
- 欢迎语：**欢迎来到南方**
- 支持UUID生成和密码设置
-支持D1数据库和KV存储配置

### 2. 节点管理
- **vless节点**（主要支持）
- **TUIC节点**（补充支持）
- **wireguard节点**（新增）
- 节点自动生成和QR码
-订阅链接支持（每个链接可生成10个节点）

### 3. 部署方式
-CloudFlare页面部署
-Cloudflare Workers部署
-Docker本地部署
- 文件上传部署
- 拉取部署

###4. 管理界面功能
- 操作面板支持本地图片替换
- 主题色切换
- 多语言支持（中文、韩文、波斯文、英文）
- UUID和绑定域名变量管理
- 节点模板定制生成

### 5. 测试与诊断
- 连通性测试
- 延迟测试
- 节点配置验证

### 6. 安全特性
- 有效防止部署和使用过程中被检测
- 反封锁能力优化
- 密码平滑登录保障

## 项目结构

```
Antarctic-Fox/
├── docs/                      # 文档目录
│   ├── README_CN.md          # 中文说明
│   ├── README_EN.md          # 英文说明
│   ├── 配置指南.md            # 配置指南
│   └── 节点说明.md            # 节点配置说明
├── src/                       # 源代码目录
│   ├── auth/                 # 认证模块
│   ├── panel/                # 管理面板
│   ├── nodes/                # 节点模块
│   ├── deploy/               # 部署模块
│   └── utils/                # 工具函数
├── docker/                    # Docker配置
├── cloudflare/               # Cloudflare配置
│   ├── workers/              # Workers脚本
│   └── pages/                # Pages配置
├── config/                    # 配置文件
└── package.json             # 项目配置
```

## 快速开始

### 前置要求
- Node.js 16+
- Docker (可选)
- Cloudflare账户

### 安装

```bash
git clone https://github.com/luobikang2/Antarctic-Fox.git
cd Antarctic-Fox
npm install
```

### 本地运行

```bash
npm run dev
```

### Docker部署

```bash
docker build -t antarctic-fox .
docker run -p 3000:3000 antarctic-fox
```

### Cloudflare部署

详见 `docs/Cloudflare部署指南.md`

## 使用说明

1. **登录系统**：使用设置的密码登录操作面板
2. **生成UUID**：在面板中生成或导入UUID
3. **创建节点**：选择节点类型（VLESS/TUIC/Wireguard）自动生成
4. **获取订阅**：复制订阅链接或扫描二维码
5. **测试连接**：使用内置工具测试节点连通性和延迟

## 节点类型说明

### VLESS节点（主要）
- 主要支持类型
- 支持各类设备
- 配置灵活

### TUIC节点（补充）
- 增强型QUIC协议
- 更好的性能
- 备选方案

### Wireguard节点（新增）
- 直接调用CF的UDP功能
- 高效可靠
- 现代化协议

## 语言支持

- 🇨🇳 简体中文
- 🇬🇧 English
- 🇰🇷 한국어
- 🇮🇷 فارسی

## 反封锁能力

- 自动识别和规避常见检测方法
- 流量混淆
- 域名轮换
- IP池管理

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request

## 支持

如有问题，请提交Issue或联系项目维护者

---

**注意**：该项目仅用于学习和研究目的，用户需遵守当地法律法规。
