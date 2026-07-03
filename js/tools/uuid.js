/**
 * UUID生成器工具模块
 * 功能：生成UUID v1和UUID v4
 * 使用方法：点击生成按钮生成单个UUID，或点击生成多个按钮
 */

// 当前选中的UUID版本
let currentUuidVersion = 'v4';

/**
 * 选择UUID版本
 * @param {string} version - UUID版本（v1/v4）
 */
function selectUuidVersion(version) {
  currentUuidVersion = version;
  
  // 更新按钮样式
  document.querySelectorAll('.hash-algo-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 找到对应的按钮并激活
  const buttons = document.querySelectorAll('.hash-algo-btn');
  buttons.forEach(btn => {
    if (btn.textContent.toLowerCase().includes(version.toLowerCase())) {
      btn.classList.add('active');
    }
  });
}

/**
 * 生成UUID v4（随机UUID）
 * @returns {string} UUID v4字符串
 */
function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 生成UUID v1（时间戳UUID）
 * @returns {string} UUID v1字符串
 */
function generateUUIDv1() {
  const now = new Date().getTime();
  const uuid = [];
  
  // 将时间戳转换为十六进制
  const hexTime = now.toString(16);
  
  // 填充时间部分（UUID v1的前60位）
  for (let i = 0; i < 8; i++) {
    uuid[i] = hexTime[i] || '0';
  }
  uuid[8] = '-';
  for (let i = 0; i < 4; i++) {
    uuid[i + 9] = hexTime[i + 8] || '0';
  }
  uuid[13] = '-';
  uuid[14] = '1'; // UUID版本1
  for (let i = 0; i < 3; i++) {
    uuid[i + 15] = hexTime[i + 12] || '0';
  }
  uuid[18] = '-';
  
  // 随机部分
  uuid[19] = (Math.random() * 16 | 0x8).toString(16); // 设置variant
  for (let i = 0; i < 3; i++) {
    uuid[i + 20] = (Math.random() * 16 | 0).toString(16);
  }
  uuid[23] = '-';
  for (let i = 0; i < 12; i++) {
    uuid[i + 24] = (Math.random() * 16 | 0).toString(16);
  }
  
  return uuid.join('');
}

/**
 * 生成UUID
 * 根据当前选择的版本生成UUID
 */
function generateUuid() {
  let uuid;
  if (currentUuidVersion === 'v1') {
    uuid = generateUUIDv1();
  } else {
    uuid = generateUUIDv4();
  }
  document.getElementById('uuid-output').value = uuid;
}

/**
 * 生成多个UUID
 * @param {number} count - 生成数量（默认5）
 */
function generateMultipleUuid(count = 5) {
  const uuids = [];
  for (let i = 0; i < count; i++) {
    if (currentUuidVersion === 'v1') {
      uuids.push(generateUUIDv1());
    } else {
      uuids.push(generateUUIDv4());
    }
  }
  document.getElementById('uuid-output').value = uuids.join('\n');
}

/**
 * 使用Crypto API生成安全的UUID v4
 * @returns {string} 安全的UUID v4字符串
 */
function generateSecureUUID() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // 设置版本和variant
  array[6] = (array[6] & 0x0f) | 0x40; // Version 4
  array[8] = (array[8] & 0x3f) | 0x80; // Variant 10xx
  
  const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
}