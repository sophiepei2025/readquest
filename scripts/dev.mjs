import { spawn, execSync } from 'child_process';
import os from 'os';
import qrcode from 'qrcode-terminal';

const PORT = process.env.PORT || 3000;

// 1. 获取局域网真实 IPv4 地址
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// 2. 检查并清理端口占用
function clearPort(port) {
  try {
    const stdout = execSync(`lsof -ti :${port}`, { encoding: 'utf-8' }).trim();
    if (stdout) {
      console.log(`🧹 清理端口 ${port} 上的旧进程 (PID: ${stdout.split('\n').join(', ')})...`);
      execSync(`kill -9 ${stdout.split('\n').join(' ')}`);
    }
  } catch {
    // 端口未被占用
  }
}

clearPort(PORT);

const ip = getLocalIp();
const localUrl = `http://localhost:${PORT}`;
const localIpUrl = `http://127.0.0.1:${PORT}`;
const networkUrl = `http://${ip}:${PORT}`;

console.log('\n' + '='.repeat(54));
console.log('🚀 ReadQuest 服务启动中...');
console.log('='.repeat(54));
console.log(`💻 电脑本机访问:   ${localUrl}`);
console.log(`💻 备用本机链接:   ${localIpUrl}`);
console.log(`📱 Pad / 手机访问: ${networkUrl}`);
console.log('='.repeat(54));
console.log('\n📲 iPad 可以直接用【相机】扫描下方二维码打开答题：\n');

qrcode.generate(networkUrl, { small: true }, (qr) => {
  console.log(qr);
  console.log('='.repeat(54) + '\n');
});

// 3. 显式绑定 0.0.0.0 确保局域网所有设备均可接入
const nextProc = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', String(PORT)], {
  stdio: 'inherit',
  env: { ...process.env, PORT: String(PORT) },
});

nextProc.on('exit', (code) => {
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  nextProc.kill('SIGINT');
  process.exit(0);
});
