/**
 * Hash工具模块
 * 功能：对文本进行MD5、SHA-1、SHA-256、SHA-512哈希计算
 * 使用方法：输入文本自动计算，点击算法按钮切换算法
 */

// 当前选中的哈希算法
let currentHashAlgo = 'md5';

/**
 * 选择哈希算法
 * @param {string} algo - 算法名称（md5/sha1/sha256/sha512）
 */
function selectHashAlgo(algo) {
  currentHashAlgo = algo;
  
  // 更新按钮样式
  document.querySelectorAll('.hash-algo-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 找到对应的按钮并激活
  const buttons = document.querySelectorAll('.hash-algo-btn');
  buttons.forEach(btn => {
    if (btn.textContent.toLowerCase().includes(algo.toLowerCase())) {
      btn.classList.add('active');
    }
  });
  
  // 重新计算哈希
  computeHash();
}

/**
 * 计算文本哈希
 * @param {string} text - 输入文本
 * @param {string} algo - 哈希算法
 * @returns {Promise<string>} 哈希结果
 */
async function computeHash() {
  const input = document.getElementById('hash-input').value;
  const output = document.getElementById('hash-output');
  
  if (!input.trim()) {
    output.value = '';
    return;
  }
  
  try {
    // 将文本转换为UTF-8字节
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    // 根据选择的算法计算哈希
    let hash;
    switch (currentHashAlgo.toLowerCase()) {
      case 'md5':
        hash = await crypto.subtle.digest('MD5', data);
        break;
      case 'sha1':
        hash = await crypto.subtle.digest('SHA-1', data);
        break;
      case 'sha256':
        hash = await crypto.subtle.digest('SHA-256', data);
        break;
      case 'sha512':
        hash = await crypto.subtle.digest('SHA-512', data);
        break;
      default:
        hash = await crypto.subtle.digest('SHA-256', data);
    }
    
    // 将哈希结果转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    output.value = hashHex;
    output.style.borderColor = '';
  } catch (error) {
    output.value = '❌ 哈希计算错误: ' + error.message;
    output.style.borderColor = 'var(--accent-red)';
  }
}

/**
 * 计算MD5哈希
 * @param {string} text - 输入文本
 * @returns {Promise<string>} MD5哈希结果
 */
async function computeMD5(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 计算SHA-256哈希
 * @param {string} text - 输入文本
 * @returns {Promise<string>} SHA-256哈希结果
 */
async function computeSHA256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}