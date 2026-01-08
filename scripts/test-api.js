#!/usr/bin/env node

/**
 * API 连接测试脚本
 * 用于检查 OpenRouter API 和 Gemini 模型是否正常工作
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const TEST_URL = `http://localhost:${PORT}/api/test`;

console.log('🔍 开始测试 API 连接...\n');
console.log(`📍 测试地址: ${TEST_URL}\n`);

const request = http.get(TEST_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      console.log('📊 响应状态:', res.statusCode);
      console.log('📦 响应数据:');
      console.log(JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('\n✅ API 连接正常！');
        console.log(`📝 模型: ${result.model || 'N/A'}`);
        if (result.usage) {
          console.log(`💰 Token 使用: ${JSON.stringify(result.usage)}`);
        }
        process.exit(0);
      } else {
        console.log('\n❌ API 连接失败');
        console.log(`错误: ${result.error || '未知错误'}`);
        process.exit(1);
      }
    } catch (error) {
      console.error('\n❌ 解析响应失败:', error.message);
      console.log('原始响应:', data);
      process.exit(1);
    }
  });
});

request.on('error', (error) => {
  console.error('\n❌ 请求失败:', error.message);
  console.log('\n💡 提示:');
  console.log('   1. 请确保开发服务器正在运行 (npm run dev)');
  console.log(`   2. 请确保服务器运行在端口 ${PORT}`);
  console.log('   3. 请检查 .env.local 文件中的 OPENROUTER_API_KEY 是否配置');
  process.exit(1);
});

request.setTimeout(10000, () => {
  console.error('\n❌ 请求超时 (10秒)');
  console.log('💡 请检查服务器是否正常运行');
  request.destroy();
  process.exit(1);
});











