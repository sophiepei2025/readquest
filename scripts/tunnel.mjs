import { spawn, execSync } from 'child_process';
import localtunnel from 'localtunnel';
import qrcode from 'qrcode-terminal';

const PORT = 3000;

try {
  const stdout = execSync(`lsof -ti :${PORT}`, { encoding: 'utf-8' }).trim();
  if (stdout) {
    execSync(`kill -9 ${stdout.split('\n').join(' ')}`);
  }
} catch {}

console.log('\n' + '='.repeat(58));
console.log('🚀 正在启动 ReadQuest 免防火墙穿透服务...');
console.log('='.repeat(58));

const nextProc = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', String(PORT)], {
  stdio: 'pipe',
  env: { ...process.env, PORT: String(PORT) },
});

// 延迟 2 秒建立隧道
setTimeout(async () => {
  try {
    const tunnel = await localtunnel({ port: PORT });
    console.log('\n' + '★'.repeat(58));
    console.log('🌐【全球免防火墙公网 HTTPS 链接】:');
    console.log(`👉 ${tunnel.url}`);
    console.log('★'.repeat(58));
    console.log('\n📲 iPad 直接用相机扫码（无需在同一个 WiFi，无防火墙限制）：\n');

    qrcode.generate(tunnel.url, { small: true }, (qr) => {
      console.log(qr);
      console.log('★'.repeat(58) + '\n');
    });

    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });
  } catch (err) {
    console.error('Tunnel 创建失败，使用局域网模式:', err.message);
  }
}, 2500);

nextProc.stdout.on('data', (data) => process.stdout.write(data));
nextProc.stderr.on('data', (data) => process.stderr.write(data));

process.on('SIGINT', () => {
  nextProc.kill('SIGINT');
  process.exit(0);
});
