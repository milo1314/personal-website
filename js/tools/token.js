/**
 * Token生成器工具模块
 * 功能：生成指定长度的随机Token
 * 使用方法：拖动滑块调整长度，点击生成按钮生成Token
 */

/**
 * 生成随机Token
 * @param {number} length - Token长度（默认32）
 * @returns {string} 生成的Token
 */
function generateToken(length = 32) {
  // 定义可用字符集
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  // 使用Crypto API生成随机数，更安全
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    token += chars[array[i] % chars.length];
  }
  
  document.getElementById('token-output').value = token;
  return token;
}

/**
 * 生成带分隔符的Token（UUID格式）
 * @returns {string} 带分隔符的Token
 */
function generateFormattedToken() {
  const token = generateToken(36);
  return token.substr(0, 8) + '-' +
         token.substr(8, 4) + '-' +
         token.substr(12, 4) + '-' +
         token.substr(16, 4) + '-' +
         token.substr(20);
}