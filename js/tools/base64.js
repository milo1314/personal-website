/**
 * Base64编解码工具模块
 * 功能：对文本进行Base64编码和解码
 * 使用方法：输入文本自动编码，点击解码按钮进行解码
 */

/**
 * Base64编码
 * @param {string} text - 原始文本
 * @returns {string} Base64编码结果
 */
function encodeBase64() {
  const input = document.getElementById('base64-input').value;
  const output = document.getElementById('base64-output');
  
  if (!input.trim()) {
    output.value = '';
    return;
  }
  
  try {
    // UTF-8编码后再进行Base64编码
    const utf8Bytes = new TextEncoder().encode(input);
    const base64 = btoa(String.fromCharCode(...utf8Bytes));
    output.value = base64;
    output.style.borderColor = '';
  } catch (error) {
    output.value = '❌ 编码错误: ' + error.message;
    output.style.borderColor = 'var(--accent-red)';
  }
}

/**
 * Base64解码
 * 将输出框中的Base64字符串解码后放入输入框
 */
function decodeBase64() {
  const input = document.getElementById('base64-input');
  const output = document.getElementById('base64-output');
  
  const base64Str = output.value || input.value;
  
  if (!base64Str.trim()) {
    alert('请输入要解码的Base64字符串');
    return;
  }
  
  try {
    // Base64解码后再进行UTF-8解码
    const decodedBytes = atob(base64Str);
    const utf8Bytes = new Uint8Array(decodedBytes.length);
    for (let i = 0; i < decodedBytes.length; i++) {
      utf8Bytes[i] = decodedBytes.charCodeAt(i);
    }
    const text = new TextDecoder().decode(utf8Bytes);
    input.value = text;
    output.value = base64Str;
    output.style.borderColor = '';
  } catch (error) {
    output.value = '❌ 解码错误: ' + error.message;
    output.style.borderColor = 'var(--accent-red)';
  }
}

/**
 * 清空输入和输出
 */
function clearBase64() {
  document.getElementById('base64-input').value = '';
  document.getElementById('base64-output').value = '';
  document.getElementById('base64-output').style.borderColor = '';
}