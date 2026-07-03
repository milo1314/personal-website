/**
 * JSON转YAML工具模块
 * 功能：将JSON格式数据转换为YAML格式
 * 使用方法：输入JSON数据，自动实时转换为YAML
 */

/**
 * 转换JSON到YAML
 * @param {string} jsonStr - JSON字符串
 * @returns {string} YAML字符串
 */
function convertJson2Yaml() {
  const input = document.getElementById('json-input').value;
  const output = document.getElementById('yaml-output');
  
  if (!input.trim()) {
    output.value = '';
    return;
  }
  
  try {
    // 解析JSON
    const json = JSON.parse(input);
    // 转换为YAML
    const yaml = jsonToYaml(json);
    output.value = yaml;
    output.style.borderColor = '';
  } catch (error) {
    output.value = '❌ JSON格式错误: ' + error.message;
    output.style.borderColor = 'var(--accent-red)';
  }
}

/**
 * JSON对象转YAML字符串（递归）
 * @param {any} obj - JSON对象
 * @param {number} indent - 当前缩进级别
 * @returns {string} YAML字符串
 */
function jsonToYaml(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let yaml = '';
  
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        yaml += spaces + '- ' + jsonToYamlValue(item, indent + 1);
      }
    } else {
      for (const [key, value] of Object.entries(obj)) {
        yaml += spaces + key + ': ' + jsonToYamlValue(value, indent + 1);
      }
    }
  } else {
    yaml += jsonToYamlValue(obj, indent);
  }
  
  return yaml;
}

/**
 * 转换单个值为YAML格式
 * @param {any} value - 值
 * @param {number} indent - 缩进级别
 * @returns {string} YAML格式的值
 */
function jsonToYamlValue(value, indent) {
  if (typeof value === 'string') {
    // 如果字符串包含特殊字符，使用引号
    if (value.includes(':') || value.includes('\n') || value.includes(' ')) {
      return `"${value}"\n`;
    }
    return value + '\n';
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    return value + '\n';
  } else if (value === null) {
    return 'null\n';
  } else if (typeof value === 'object') {
    return '\n' + jsonToYaml(value, indent);
  }
  return String(value) + '\n';
}

/**
 * 清空输入和输出
 */
function clearJson2Yaml() {
  document.getElementById('json-input').value = '';
  document.getElementById('yaml-output').value = '';
  document.getElementById('yaml-output').style.borderColor = '';
}