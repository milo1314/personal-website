/**
 * 时间转换器工具模块
 * 功能：时间戳与日期时间的相互转换
 * 使用方法：输入时间戳自动转换，点击获取当前时间戳
 */

/**
 * 转换时间戳为日期时间
 * @param {number} timestamp - 毫秒时间戳
 * @returns {string} 格式化的日期时间字符串
 */
function convertTimestamp() {
  const input = document.getElementById('timestamp-input').value;
  const output = document.getElementById('datetime-output');
  
  if (!input.trim()) {
    output.value = '';
    return;
  }
  
  const timestamp = parseInt(input, 10);
  
  if (isNaN(timestamp)) {
    output.value = '❌ 请输入有效的时间戳';
    output.style.borderColor = 'var(--accent-red)';
    return;
  }
  
  try {
    const date = new Date(timestamp);
    
    // 检查时间戳是否有效
    if (isNaN(date.getTime())) {
      output.value = '❌ 无效的时间戳';
      output.style.borderColor = 'var(--accent-red)';
      return;
    }
    
    // 格式化日期时间
    const formatted = formatDateTime(date);
    output.value = formatted;
    output.style.borderColor = '';
  } catch (error) {
    output.value = '❌ 转换错误: ' + error.message;
    output.style.borderColor = 'var(--accent-red)';
  }
}

/**
 * 格式化日期时间
 * @param {Date} date - Date对象
 * @returns {string} 格式化的日期时间字符串
 */
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * 获取当前时间戳
 * @returns {number} 当前毫秒时间戳
 */
function getCurrentTimestamp() {
  const timestamp = Date.now();
  document.getElementById('timestamp-input').value = timestamp;
  convertTimestamp();
  return timestamp;
}

/**
 * 获取当前UTC时间戳
 * @returns {number} 当前UTC毫秒时间戳
 */
function getCurrentUtcTimestamp() {
  const now = new Date();
  return Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );
}

/**
 * 清空输入和输出
 */
function clearTime() {
  document.getElementById('timestamp-input').value = '';
  document.getElementById('datetime-output').value = '';
  document.getElementById('datetime-output').style.borderColor = '';
}