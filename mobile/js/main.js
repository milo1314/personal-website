let currentSection = 'home';

function showSection(sectionId) {
  currentSection = sectionId;
  
  document.querySelectorAll('.mobile-section').forEach(section => {
    section.classList.remove('active');
  });
  
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  toggleFabMenu();
  
  if (sectionId === 'toolbox') {
    selectTool('json2yaml');
  }
  
  if (sectionId === 'quotes') {
    initQuotes();
  }
  
  if (sectionId === 'notes') {
    renderNotes();
  }
  
  if (sectionId === 'recommendations') {
    renderRecommendations();
  }
  
  if (sectionId === 'travel') {
    renderTravel();
  }
  
  if (sectionId === 'projects') {
    renderProjects();
  }
  
  if (sectionId === 'blog') {
    renderBlog();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleFabMenu() {
  const fabToggle = document.getElementById('mobileMenuToggle');
  const fabItems = document.getElementById('mobileFabItems');
  
  fabToggle.classList.toggle('active');
  fabItems.classList.toggle('active');
}

function selectTool(toolId) {
  document.querySelectorAll('.mobile-tool-panel').forEach(panel => {
    panel.style.display = 'none';
  });
  
  document.querySelectorAll('.mobile-tool-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  const targetPanel = document.getElementById('tool-' + toolId);
  if (targetPanel) {
    targetPanel.style.display = 'block';
  }
  
  document.querySelectorAll('.mobile-tool-tab').forEach(tab => {
    if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(toolId)) {
      tab.classList.add('active');
    }
  });
}

function toggleFabMenu() {
  const fabToggle = document.getElementById('mobileFabToggle');
  const fabItems = document.getElementById('mobileFabItems');
  
  fabToggle.classList.toggle('active');
  fabItems.classList.toggle('active');
}

function toggleTheme() {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const text = element.value;
  if (!text.trim()) {
    showToast('没有可复制的内容', 'warning');
    return;
  }
  
  navigator.clipboard.writeText(text).then(() => {
    showToast('✓ 已复制到剪贴板', 'success');
  }).catch(() => {
    element.select();
    document.execCommand('copy');
    showToast('✓ 已复制到剪贴板', 'success');
  });
}

function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.mobile-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'mobile-toast mobile-toast-' + type;
  toast.textContent = message;
  
  const style = document.createElement('style');
  style.textContent = `
    .mobile-toast {
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      animation: toastSlideIn 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .mobile-toast-success { background: #10b981; color: white; }
    .mobile-toast-error { background: #ef4444; color: white; }
    .mobile-toast-warning { background: #f59e0b; color: white; }
    .mobile-toast-info { background: #4f46e5; color: white; }
    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function clearTool(toolId) {
  const toolPanel = document.getElementById('tool-' + toolId);
  if (!toolPanel) return;
  
  const inputs = toolPanel.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.value = '';
  });
  
  const selects = toolPanel.querySelectorAll('select');
  selects.forEach(select => {
    select.selectedIndex = 0;
  });
}

function convertJson2Yaml() {
  const input = document.getElementById('json-input');
  const output = document.getElementById('yaml-output');
  
  try {
    const json = JSON.parse(input.value);
    output.value = jsonToYaml(json);
  } catch (e) {
    showToast('JSON格式错误', 'error');
  }
}

function convertYaml2Json() {
  const input = document.getElementById('yaml-output');
  const output = document.getElementById('json-input');
  
  try {
    const json = yamlToJson(input.value);
    output.value = JSON.stringify(json, null, 2);
  } catch (e) {
    showToast('YAML格式错误', 'error');
  }
}

function jsonToYaml(obj, prefix = '') {
  let yaml = '';
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      yaml += prefix + key + ':\n';
      yaml += jsonToYaml(obj[key], prefix + '  ');
    } else if (Array.isArray(obj[key])) {
      yaml += prefix + key + ':\n';
      obj[key].forEach(item => {
        yaml += prefix + '  - ' + (typeof item === 'object' ? JSON.stringify(item) : item) + '\n';
      });
    } else {
      yaml += prefix + key + ': ' + obj[key] + '\n';
    }
  }
  return yaml;
}

function yamlToJson(yaml) {
  const lines = yaml.split('\n');
  const result = {};
  let current = result;
  const stack = [];
  
  lines.forEach(line => {
    const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
    if (match) {
      const depth = match[1].length / 2;
      const key = match[2].trim();
      const value = match[3].trim();
      
      while (stack.length > depth) {
        current = stack.pop();
      }
      
      let parsedValue = value;
      if (value === 'true') parsedValue = true;
      else if (value === 'false') parsedValue = false;
      else if (!isNaN(value)) parsedValue = Number(value);
      else if (value === '') parsedValue = {};
      
      current[key] = parsedValue;
      
      if (parsedValue === {}) {
        stack.push(current);
        current = current[key];
      }
    }
  });
  
  return result;
}

function encodeBase64() {
  const input = document.getElementById('base64-input');
  const output = document.getElementById('base64-output');
  
  try {
    output.value = btoa(unescape(encodeURIComponent(input.value)));
  } catch (e) {
    showToast('编码失败', 'error');
  }
}

function decodeBase64() {
  const input = document.getElementById('base64-output');
  const output = document.getElementById('base64-input');
  
  try {
    output.value = decodeURIComponent(escape(atob(input.value)));
  } catch (e) {
    showToast('解码失败', 'error');
  }
}

function generateToken() {
  const length = parseInt(document.getElementById('token-length').value) || 32;
  const type = document.getElementById('token-type').value;
  
  let chars = '';
  if (type.includes('alpha')) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if (type.includes('numeric')) chars += '0123456789';
  if (type === 'hex') chars = '0123456789abcdef';
  if (type === 'base64') chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  document.getElementById('token-output').value = token;
}

let currentHashAlgo = 'md5';

function selectHashAlgo(algo) {
  currentHashAlgo = algo;
  
  document.querySelectorAll('.mobile-hash-algo').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.querySelectorAll('.mobile-hash-algo').forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(algo)) {
      btn.classList.add('active');
    }
  });
}

function calculateHash() {
  const input = document.getElementById('hash-input').value;
  const output = document.getElementById('hash-output');
  
  if (!input) {
    showToast('请输入字符串', 'warning');
    return;
  }
  
  output.value = computeHash(input, currentHashAlgo);
}

function computeHash(str, algo) {
  const chars = '0123456789abcdef';
  
  function md5(str) {
    function rotateLeft(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function addUnsigned(lX, lY) {
      const lX4 = (lX & 0xFFFF0000);
      const lX3 = (lX & 0x0000FFFF);
      const lY4 = (lY & 0xFFFF0000);
      const lY3 = (lY & 0x0000FFFF);
      let lX8 = ((lX3 + lY3) & 0x0000FFFF);
      let lY8 = (lX4 + lY4);
      return (lY8 >>> 16) + lX8 + (lY8 << 16);
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return x ^ y ^ z; }
    function I(x, y, z) { return y ^ (x | (~z)); }
    function FF(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function convertToWordArray(str) {
      const lWordCount = ((str.length + 8) >> 6) + 1;
      const lWordArray = new Array(lWordCount << 2);
      let lBytePosition = 0;
      let lByteCount = 0;
      while (lByteCount < str.length) {
        lWordArray[lBytePosition >> 2] |= (str.charCodeAt(lByteCount) & 0xFF) << ((lBytePosition & 3) << 3);
        lBytePosition++;
        lByteCount++;
      }
      lWordArray[lBytePosition >> 2] |= 0x80 << ((lBytePosition & 3) << 3);
      lWordArray[lWordCount] = str.length << 3;
      return lWordArray;
    }
    function wordToHex(lValue) {
      let wordHex = '';
      for (let i = 0; i <= 3; i++) {
        wordHex += chars.charAt((lValue >> (i * 8 + 4)) & 0x0F) + chars.charAt((lValue >> (i * 8)) & 0x0F);
      }
      return wordHex;
    }
    
    const x = convertToWordArray(str);
    let a = 0x67452301;
    let b = 0xEFCDAB89;
    let c = 0x98BADCFE;
    let d = 0x10325476;
    
    for (let i = 0; i < x.length; i += 16) {
      const AA = a, BB = b, CC = c, DD = d;
      a = FF(a, b, c, d, x[i + 0], 7, 0xD76AA478);
      d = FF(d, a, b, c, x[i + 1], 12, 0xE8C7B756);
      c = FF(c, d, a, b, x[i + 2], 17, 0x242070DB);
      b = FF(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[i + 4], 7, 0xF57C0FAF);
      d = FF(d, a, b, c, x[i + 5], 12, 0x4787C62A);
      c = FF(c, d, a, b, x[i + 6], 17, 0xA8304613);
      b = FF(b, c, d, a, x[i + 7], 22, 0xFD469501);
      a = FF(a, b, c, d, x[i + 8], 7, 0x698098D8);
      d = FF(d, a, b, c, x[i + 9], 12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[i + 11], 22, 0x895CD7BE);
      a = FF(a, b, c, d, x[i + 12], 7, 0x6B901122);
      d = FF(d, a, b, c, x[i + 13], 12, 0xFD987193);
      c = FF(c, d, a, b, x[i + 14], 17, 0xA679438E);
      b = FF(b, c, d, a, x[i + 15], 22, 0x49B40821);
      
      a = GG(a, b, c, d, x[i + 1], 5, 0xF61E2562);
      d = GG(d, a, b, c, x[i + 6], 9, 0xC040B340);
      c = GG(c, d, a, b, x[i + 11], 14, 0x265E5A51);
      b = GG(b, c, d, a, x[i + 0], 20, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[i + 5], 5, 0xD62F105D);
      d = GG(d, a, b, c, x[i + 10], 9, 0x02441453);
      c = GG(c, d, a, b, x[i + 15], 14, 0xD8A1E681);
      b = GG(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[i + 9], 5, 0x21E1CDE6);
      d = GG(d, a, b, c, x[i + 14], 9, 0xC33707D6);
      c = GG(c, d, a, b, x[i + 3], 14, 0xF4D50D87);
      b = GG(b, c, d, a, x[i + 8], 20, 0x455A14ED);
      a = GG(a, b, c, d, x[i + 13], 5, 0xA9E3E905);
      d = GG(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[i + 7], 14, 0x676F02D9);
      b = GG(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A);
      
      a = HH(a, b, c, d, x[i + 5], 4, 0xFFFA3942);
      d = HH(d, a, b, c, x[i + 8], 11, 0x8771F681);
      c = HH(c, d, a, b, x[i + 11], 16, 0x6D9D6122);
      b = HH(b, c, d, a, x[i + 14], 23, 0xFDE5380C);
      a = HH(a, b, c, d, x[i + 1], 4, 0xA4BEEA44);
      d = HH(d, a, b, c, x[i + 4], 11, 0x4BDECFA9);
      c = HH(c, d, a, b, x[i + 7], 16, 0xF6BB4B60);
      b = HH(b, c, d, a, x[i + 10], 23, 0xBEBFBC70);
      a = HH(a, b, c, d, x[i + 13], 4, 0x289B7EC6);
      d = HH(d, a, b, c, x[i + 0], 11, 0xEAA127FA);
      c = HH(c, d, a, b, x[i + 3], 16, 0xD4EF3085);
      b = HH(b, c, d, a, x[i + 6], 23, 0x04881D05);
      a = HH(a, b, c, d, x[i + 9], 4, 0xD9D4D039);
      d = HH(d, a, b, c, x[i + 12], 11, 0xE6DB99E5);
      c = HH(c, d, a, b, x[i + 15], 16, 0x1FA27CF8);
      b = HH(b, c, d, a, x[i + 2], 23, 0xC4AC5665);
      
      a = II(a, b, c, d, x[i + 0], 6, 0xF4292244);
      d = II(d, a, b, c, x[i + 7], 10, 0x432AFF97);
      c = II(c, d, a, b, x[i + 14], 15, 0xAB9423A7);
      b = II(b, c, d, a, x[i + 5], 21, 0xFC93A039);
      a = II(a, b, c, d, x[i + 12], 6, 0x655B59C3);
      d = II(d, a, b, c, x[i + 3], 10, 0x8F0CCC92);
      c = II(c, d, a, b, x[i + 10], 15, 0xFFEFF47D);
      b = II(b, c, d, a, x[i + 1], 21, 0x85845DD1);
      a = II(a, b, c, d, x[i + 8], 6, 0x6FA87E4F);
      d = II(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0);
      c = II(c, d, a, b, x[i + 6], 15, 0xA3014314);
      b = II(b, c, d, a, x[i + 13], 21, 0x4E0811A1);
      a = II(a, b, c, d, x[i + 4], 6, 0xF7537E82);
      d = II(d, a, b, c, x[i + 11], 10, 0xBD3AF235);
      c = II(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB);
      b = II(b, c, d, a, x[i + 9], 21, 0xEB86D391);
      
      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }
    
    return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
  }
  
  function sha1(str) {
    function rotateLeft(n, s) {
      return (n << s) | (n >>> (32 - s));
    }
    function lsbHex(val) {
      let str = '';
      for (let i = 7; i >= 0; i--) {
        str += chars.charAt((val >>> (i * 4)) & 0xF);
      }
      return str;
    }
    
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
    
    bytes.push(0x80);
    
    while ((bytes.length % 64) !== 56) {
      bytes.push(0x00);
    }
    
    const length = str.length * 8;
    bytes.push((length >>> 24) & 0xFF);
    bytes.push((length >>> 16) & 0xFF);
    bytes.push((length >>> 8) & 0xFF);
    bytes.push(length & 0xFF);
    
    let h0 = 0x67452301;
    let h1 = 0xEFCDAB89;
    let h2 = 0x98BADCFE;
    let h3 = 0x10325476;
    let h4 = 0xC3D2E1F0;
    
    for (let i = 0; i < bytes.length; i += 64) {
      const w = [];
      for (let j = 0; j < 16; j++) {
        w[j] = bytes[i + j * 4] << 24 | bytes[i + j * 4 + 1] << 16 | bytes[i + j * 4 + 2] << 8 | bytes[i + j * 4 + 3];
      }
      
      for (let j = 16; j < 80; j++) {
        w[j] = rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      }
      
      let a = h0, b = h1, c = h2, d = h3, e = h4;
      
      for (let j = 0; j < 80; j++) {
        let f, k;
        if (j < 20) {
          f = (b & c) | ((~b) & d);
          k = 0x5A827999;
        } else if (j < 40) {
          f = b ^ c ^ d;
          k = 0x6ED9EBA1;
        } else if (j < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = 0x8F1BBCDC;
        } else {
          f = b ^ c ^ d;
          k = 0xCA62C1D6;
        }
        
        const temp = rotateLeft(a, 5) + f + e + k + w[j];
        e = d;
        d = c;
        c = rotateLeft(b, 30);
        b = a;
        a = temp;
      }
      
      h0 = (h0 + a) >>> 0;
      h1 = (h1 + b) >>> 0;
      h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0;
    }
    
    return lsbHex(h0) + lsbHex(h1) + lsbHex(h2) + lsbHex(h3) + lsbHex(h4);
  }
  
  function sha256(str) {
    const K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
               0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
               0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
               0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
               0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
               0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
               0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
               0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];
    
    function rightRotate(n, s) {
      return (n >>> s) | (n << (32 - s));
    }
    
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
    
    bytes.push(0x80);
    
    while ((bytes.length % 64) !== 56) {
      bytes.push(0);
    }
    
    const length = str.length * 8;
    bytes.push((length >>> 24) & 0xFF);
    bytes.push((length >>> 16) & 0xFF);
    bytes.push((length >>> 8) & 0xFF);
    bytes.push(length & 0xFF);
    
    let h0 = 0x6A09E667, h1 = 0xBB67AE85, h2 = 0x3C6EF372, h3 = 0xA54FF53A;
    let h4 = 0x510E527F, h5 = 0x9B05688C, h6 = 0x1F83D9AB, h7 = 0x5BE0CD19;
    
    for (let i = 0; i < bytes.length; i += 64) {
      const w = [];
      for (let j = 0; j < 16; j++) {
        w[j] = bytes[i + j * 4] << 24 | bytes[i + j * 4 + 1] << 16 | bytes[i + j * 4 + 2] << 8 | bytes[i + j * 4 + 3];
      }
      
      for (let j = 16; j < 64; j++) {
        const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
      }
      
      let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
      
      for (let j = 0; j < 64; j++) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) >>> 0;
        
        h = g; g = f; f = e; e = (d + temp1) >>> 0;
        d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
      }
      
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
    }
    
    function toHex(n) {
      let s = '';
      for (let i = 7; i >= 0; i--) {
        s += chars.charAt((n >>> (i * 4)) & 0xF);
      }
      return s;
    }
    
    return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7);
  }
  
  function sha512(str) {
    const K = [0x428A2F98D728AE22, 0x7137449123EF65CD, 0xB5C0FBCFEC4D3B2F, 0xE9B5DBA58189DBBC,
               0x3956C25BF348B538, 0x59F111F1B605D019, 0x923F82A4AF194F9B, 0xAB1C5ED5DA6D8118,
               0xD807AA98A3030242, 0x12835B0145706FBE, 0x243185BE4EE4B28C, 0x550C7DC3D5FFB4E2,
               0x72BE5D74F27B896F, 0x80DEB1FE3B1696B1, 0x9BDC06A725C71235, 0xC19BF174CF692694,
               0xE49B69C19EF14AD2, 0xEFBE4786384F25E3, 0x0FC19DC68B8CD5B5, 0x240CA1CC77AC9C65,
               0x2DE92C6F592B0275, 0x4A7484AA6EA6E483, 0x5CB0A9DCBD41FBD4, 0x76F988DA831153B5,
               0x983E5152EE66DFAB, 0xA831C66D2DB43210, 0xB00327C898FB213F, 0xBF597FC7BEEF0EE4,
               0xC6E00BF33DA88FC2, 0xD5A79147930AA725, 0x06CA6351E003826F, 0x142929670A0E6E70,
               0x27B70A8546D22FFC, 0x2E1B21385C26C926, 0x4D2C6DFC5AC42AED, 0x53380D139D95B3DF,
               0x650A73548BAF63DE, 0x766A0ABB3C77B2A8, 0x81C2C92E47EDAEE6, 0x92722C851482353B,
               0xA2BFE8A14CF10364, 0xA81A664BBC423001, 0xC24B8B70D0F89791, 0xC76C51A30654BE30,
               0xD192E819D6EF5218, 0xD69906245565A910, 0xF40E35855771202A, 0x106AA07032BBD1B8,
               0x19A4C116B8D2D0C8, 0x1E376C085141AB53, 0x2748774CDF8EEB99, 0x34B0BCB5E19B48A8,
               0x391C0CB3C5C95A63, 0x4ED8AA4AE3418ACB, 0x5B9CCA4F7763E373, 0x682E6FF3D6B2B8A3,
               0x748F82EE5DEFB2FC, 0x78A5636F43172F60, 0x84C87814A1F0AB72, 0x8CC702081A6439EC,
               0x90BEFFFA23631E28, 0xA4506CEBDE82BDE9, 0xBEF9A3F7B2C67915, 0xC67178F2E372532B,
               0xCA273ECEEA26619C, 0xD186B8C721C0C207, 0xEADA7DD6CDE0EB1E, 0xF57D4F7FEE6ED178,
               0x06F067AA72176FBA, 0x0A637DC5A2C898A6, 0x113F9804BEF90DAE, 0x1B710B35131C471B,
               0x28DB77F523047D84, 0x32CAAB7B40C72493, 0x3C9EBE0A15C9BEBC, 0x431D67C49C100D4C,
               0x4CC5D4BECB3E42B6, 0x597F299CFC657E2A, 0x5FCB6FAB3AD6FAEC, 0x6C44198C4A475817];
    
    function rightRotate(n, s) {
      return (n >>> s) | (n << (64 - s));
    }
    
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
    
    bytes.push(0x80);
    
    while ((bytes.length % 128) !== 112) {
      bytes.push(0);
    }
    
    const length = str.length * 8;
    for (let i = 7; i >= 0; i--) {
      bytes.push((length >>> (i * 8)) & 0xFF);
    }
    
    let h0 = 0x6A09E667F3BCC908, h1 = 0xBB67AE8584CAA73B, h2 = 0x3C6EF372FE94F82B, h3 = 0xA54FF53A5F1D36F1;
    let h4 = 0x510E527FADE682D1, h5 = 0x9B05688C2B3E6C1F, h6 = 0x1F83D9ABFB41BD6B, h7 = 0x5BE0CD19137E2179;
    
    for (let i = 0; i < bytes.length; i += 128) {
      const w = [];
      for (let j = 0; j < 16; j++) {
        w[j] = 0;
        for (let k = 0; k < 8; k++) {
          w[j] |= bytes[i + j * 8 + k] << ((7 - k) * 8);
        }
      }
      
      for (let j = 16; j < 80; j++) {
        const s0 = rightRotate(w[j - 15], 1) ^ rightRotate(w[j - 15], 8) ^ (w[j - 15] >>> 7);
        const s1 = rightRotate(w[j - 2], 19) ^ rightRotate(w[j - 2], 61) ^ (w[j - 2] >>> 6);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
      }
      
      let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
      
      for (let j = 0; j < 80; j++) {
        const S1 = rightRotate(e, 14) ^ rightRotate(e, 18) ^ rightRotate(e, 41);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
        const S0 = rightRotate(a, 28) ^ rightRotate(a, 34) ^ rightRotate(a, 39);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) >>> 0;
        
        h = g; g = f; f = e; e = (d + temp1) >>> 0;
        d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
      }
      
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
    }
    
    function toHex(n) {
      let s = '';
      for (let i = 15; i >= 0; i--) {
        s += chars.charAt((n >>> (i * 4)) & 0xF);
      }
      return s;
    }
    
    return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7);
  }
  
  switch (algo) {
    case 'md5': return md5(str);
    case 'sha1': return sha1(str);
    case 'sha256': return sha256(str);
    case 'sha512': return sha512(str);
    default: return md5(str);
  }
}

function generateUUID() {
  const count = parseInt(document.getElementById('uuid-count').value) || 1;
  const format = document.getElementById('uuid-format').value;
  
  let result = '';
  for (let i = 0; i < count; i++) {
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    if (format === 'no-hyphen') uuid = uuid.replace(/-/g, '');
    if (format === 'uppercase') uuid = uuid.toUpperCase();
    
    result += uuid + '\n';
  }
  
  document.getElementById('uuid-output').value = result.trim();
}

function convertTimestamp() {
  const timestamp = document.getElementById('timestamp-input').value;
  const output = document.getElementById('time-output');
  
  if (!timestamp) {
    showToast('请输入时间戳', 'warning');
    return;
  }
  
  const date = new Date(timestamp * 1000);
  output.value = date.toLocaleString('zh-CN');
}

function convertDatetime() {
  const datetime = document.getElementById('datetime-input').value;
  const output = document.getElementById('time-output');
  
  if (!datetime) {
    showToast('请选择日期时间', 'warning');
    return;
  }
  
  const timestamp = Math.floor(new Date(datetime).getTime() / 1000);
  output.value = timestamp;
}

function getCurrentTime() {
  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);
  
  document.getElementById('timestamp-input').value = timestamp;
  document.getElementById('time-output').value = now.toLocaleString('zh-CN');
}

function renderProjects() {
  const list = document.getElementById('project-list');
  if (!list) return;
  
  const projects = [
    { title: 'MiloLab', description: '个人作品集网站，展示技术栈、项目和博客。', tags: ['Vue', 'React', 'Node.js'] },
    { title: 'TaskManager', description: '任务管理系统，支持任务创建、编辑和状态追踪。', tags: ['Vue', 'Express', 'MongoDB'] },
    { title: 'BlogAPI', description: '博客后台API服务，支持文章管理和评论系统。', tags: ['Node.js', 'PostgreSQL', 'Redis'] },
    { title: 'ChatApp', description: '实时聊天应用，支持WebSocket通信。', tags: ['React', 'Node.js', 'Socket.io'] }
  ];
  
  list.innerHTML = projects.map(p => `
    <div class="mobile-project-card">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div style="display: flex; gap: 6px; margin-top: 8px;">
        ${p.tags.map(t => `<span style="background: rgba(79,70,229,0.1); color: #4f46e5; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderBlog() {
  const list = document.getElementById('blog-list');
  if (!list) return;
  
  const articles = [
    { title: '全栈开发入门指南', description: '从零开始学习全栈开发，涵盖前端和后端技术栈。', date: '2024-01-15' },
    { title: 'Vue3 Composition API 详解', description: '深入理解Vue3的组合式API，提升代码组织能力。', date: '2024-01-10' },
    { title: 'Docker容器化部署实践', description: '使用Docker部署Web应用，实现环境一致性。', date: '2024-01-05' },
    { title: 'React性能优化技巧', description: '掌握React性能优化的核心方法，提升应用响应速度。', date: '2023-12-28' }
  ];
  
  list.innerHTML = articles.map(a => `
    <div class="mobile-blog-card">
      <h3>${a.title}</h3>
      <p>${a.description}</p>
      <div style="color: #94a3b8; font-size: 12px; margin-top: 4px;">${a.date}</div>
    </div>
  `).join('');
}

const quotesData = {
  liuzhenyun: {
    name: '刘震云',
    books: {
      yiju: {
        name: '一句顶一万句',
        icon: 'fas fa-book-open',
        quotes: [
          {"num": 1, "text": "世上的人遍地都是，说得着的人千里难寻。", "theme": "孤独与寻找"},
          {"num": 2, "text": "日子是过以后，不是过从前。", "theme": "时间与人生"},
          {"num": 3, "text": "世上的事情，原来件件藏着委屈。", "theme": "世事与人情"},
          {"num": 4, "text": "人要一赌上气，就忘记了事情的初衷；只想能气着别人，忘记也耽误了自己。", "theme": "情绪与理智"},
          {"num": 5, "text": "遇到小事，可以指望别人；遇到大事，千万不能把自个儿的命运，拴到别人身上。", "theme": "独立与依靠"}
        ]
      },
      xian: {
        name: '咸的玩笑',
        icon: 'fas fa-smile',
        quotes: [
          {"num": 1, "text": "世上有许多玩笑，注定要流着泪开完。", "theme": "核心隐喻"},
          {"num": 2, "text": "一时解决不了的矛盾，可以等待，可以交给时间，给时间一点时间。", "theme": "时间与人生"},
          {"num": 3, "text": "沉默是最响亮的回答，尤其是对不该问的问题。", "theme": "言语与沉默"}
        ]
      }
    }
  },
  yuvalnoahharari: {
    name: '尤瓦尔·赫拉利',
    books: {
      shengtai: {
        name: '人类简史',
        icon: 'fas fa-history',
        quotes: [
          {"num": 1, "text": "人类历史上最大的骗局是农业革命。", "theme": "历史反思"},
          {"num": 2, "text": "虚构故事是人类文明的基石。", "theme": "文明本质"},
          {"num": 3, "text": "快乐来自于主观的期望，而非客观的条件。", "theme": "幸福哲学"}
        ]
      },
      wangluo: {
        name: '未来简史',
        icon: 'fas fa-robot',
        quotes: [
          {"num": 1, "text": "未来，数据将比权力和资本更重要。", "theme": "未来趋势"},
          {"num": 2, "text": "算法可能比你更了解你自己。", "theme": "科技伦理"},
          {"num": 3, "text": "人类正面临着从智人到神人的转变。", "theme": "人类进化"}
        ]
      }
    }
  },
  fangfang: {
    name: '方方',
    books: {
      wuhan: {
        name: '武汉日记',
        icon: 'fas fa-book',
        quotes: [
          {"num": 1, "text": "时代的一粒灰，落在个人头上，就是一座山。", "theme": "时代与个人"},
          {"num": 2, "text": "真实是最强大的力量。", "theme": "写作信念"},
          {"num": 3, "text": "善良比金子更珍贵。", "theme": "人性光辉"}
        ]
      }
    }
  },
  wangxiaobo: {
    name: '王小波',
    books: {
      jinse: {
        name: '黄金时代',
        icon: 'fas fa-sun',
        quotes: [
          {"num": 1, "text": "生活就是个缓慢受锤的过程。", "theme": "生活感悟"},
          {"num": 2, "text": "一个人只拥有此生此世是不够的，他还应该拥有诗意的世界。", "theme": "精神追求"},
          {"num": 3, "text": "人的一切痛苦，本质上都是对自己无能的愤怒。", "theme": "自我认知"}
        ]
      },
      qingjing: {
        name: '青铜时代',
        icon: 'fas fa-crown',
        quotes: [
          {"num": 1, "text": "智慧本身就是好的。", "theme": "智慧价值"},
          {"num": 2, "text": "我活在世上，无非想要明白些道理，遇见些有趣的事。", "theme": "人生追求"}
        ]
      }
    }
  },
  luohengfu: {
    name: '罗振宇',
    books: {
      yuansu: {
        name: '罗辑思维',
        icon: 'fas fa-lightbulb',
        quotes: [
          {"num": 1, "text": "时间是唯一的战场。", "theme": "时间管理"},
          {"num": 2, "text": "认知升级是唯一的护城河。", "theme": "认知提升"},
          {"num": 3, "text": "做时间的朋友。", "theme": "长期主义"}
        ]
      },
      zhengming: {
        name: '跃迁',
        icon: 'fas fa-rocket',
        quotes: [
          {"num": 1, "text": "利用规律，放大努力。", "theme": "效率思维"},
          {"num": 2, "text": "高手都在利用时代的杠杆。", "theme": "趋势把握"}
        ]
      }
    }
  }
};

let currentQuoteAuthor = 'liuzhenyun';
let currentQuoteBook = 'yiju';

function initQuotes() {
  renderQuoteAuthorTabs();
  renderQuoteBookTabs();
  renderQuotes();
}

function renderQuoteAuthorTabs() {
  const container = document.getElementById('quotes-author-tabs');
  if (!container) return;
  
  container.innerHTML = Object.keys(quotesData).map(key => {
    const author = quotesData[key];
    const isActive = key === currentQuoteAuthor;
    return `
      <button class="mobile-quotes-author-tab ${isActive ? 'active' : ''}" 
              onclick="switchQuoteAuthor('${key}')">
        ${author.name}
      </button>
    `;
  }).join('');
}

function renderQuoteBookTabs() {
  const container = document.getElementById('quotes-book-tabs');
  if (!container) return;
  
  const author = quotesData[currentQuoteAuthor];
  if (!author) return;
  
  container.innerHTML = Object.keys(author.books).map(key => {
    const book = author.books[key];
    const isActive = key === currentQuoteBook;
    return `
      <button class="mobile-quotes-book-tab ${isActive ? 'active' : ''}" 
              onclick="switchQuoteBook('${key}')">
        ${book.name}
      </button>
    `;
  }).join('');
}

function switchQuoteAuthor(authorKey) {
  currentQuoteAuthor = authorKey;
  const author = quotesData[authorKey];
  if (author) {
    currentQuoteBook = Object.keys(author.books)[0];
  }
  renderQuoteAuthorTabs();
  renderQuoteBookTabs();
  renderQuotes();
}

function switchQuoteBook(bookKey) {
  currentQuoteBook = bookKey;
  renderQuoteBookTabs();
  renderQuotes();
}

function renderQuotes() {
  const container = document.getElementById('quotes-list');
  const countEl = document.getElementById('quotes-count');
  if (!container) return;
  
  const author = quotesData[currentQuoteAuthor];
  if (!author) {
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">暂无数据</div>';
    if (countEl) countEl.textContent = '0';
    return;
  }
  
  const book = author.books[currentQuoteBook];
  if (!book) {
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">暂无数据</div>';
    if (countEl) countEl.textContent = '0';
    return;
  }
  
  const quotes = book.quotes;
  
  if (countEl) {
    let totalCount = 0;
    Object.values(quotesData).forEach(a => {
      Object.values(a.books).forEach(b => {
        totalCount += b.quotes.length;
      });
    });
    countEl.textContent = totalCount;
  }
  
  container.innerHTML = quotes.map(q => `
    <div class="mobile-quote-card">
      <div class="mobile-quote-text">"${q.text}"</div>
      <div class="mobile-quote-meta">
        <span class="mobile-quote-author">${author.name}</span>
        <span class="mobile-quote-theme">${q.theme}</span>
      </div>
    </div>
  `).join('');
}

function openAddQuoteModal() {
  const modal = document.getElementById('add-quote-modal');
  const authorSelect = document.getElementById('add-quote-author');
  
  authorSelect.innerHTML = Object.keys(quotesData).map(key => {
    return `<option value="${key}">${quotesData[key].name}</option>`;
  }).join('');
  
  updateQuoteBooks();
  modal.classList.add('active');
}

function closeAddQuoteModal() {
  const modal = document.getElementById('add-quote-modal');
  modal.classList.remove('active');
  
  document.getElementById('add-quote-text').value = '';
  document.getElementById('add-quote-theme').value = '';
}

function updateQuoteBooks() {
  const authorKey = document.getElementById('add-quote-author').value;
  const bookSelect = document.getElementById('add-quote-book');
  
  const author = quotesData[authorKey];
  if (!author) {
    bookSelect.innerHTML = '';
    return;
  }
  
  bookSelect.innerHTML = Object.keys(author.books).map(key => {
    return `<option value="${key}">${author.books[key].name}</option>`;
  }).join('');
}

function addQuote() {
  const authorKey = document.getElementById('add-quote-author').value;
  const bookKey = document.getElementById('add-quote-book').value;
  const text = document.getElementById('add-quote-text').value.trim();
  const theme = document.getElementById('add-quote-theme').value.trim() || '人生哲理';
  
  if (!text) {
    showToast('请输入语录内容', 'warning');
    return;
  }
  
  const author = quotesData[authorKey];
  if (!author || !author.books[bookKey]) {
    showToast('选择的作者或书籍不存在', 'error');
    return;
  }
  
  const book = author.books[bookKey];
  const newNum = book.quotes.length + 1;
  
  book.quotes.push({
    num: newNum,
    text: text,
    theme: theme
  });
  
  showToast('语录添加成功', 'success');
  closeAddQuoteModal();
  renderQuotes();
}

function copyAllQuotes() {
  const author = quotesData[currentQuoteAuthor];
  if (!author) return;
  
  const book = author.books[currentQuoteBook];
  if (!book) return;
  
  const text = book.quotes.map(q => `"${q.text}" —— ${author.name}《${book.name}`).join('\n\n');
  
  navigator.clipboard.writeText(text).then(() => {
    showToast('已复制全部语录', 'success');
  }).catch(() => {
    showToast('复制失败', 'error');
  });
}

let notesSortDesc = true;

function getNotes() {
  const saved = localStorage.getItem('notes');
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function addNote() {
  const input = document.getElementById('note-input');
  const content = input.value.trim();
  
  if (!content) {
    showToast('请输入文案内容', 'warning');
    return;
  }
  
  const notes = getNotes();
  const newNote = {
    id: Date.now(),
    content: content,
    createdAt: Date.now()
  };
  
  notes.unshift(newNote);
  saveNotes(notes);
  input.value = '';
  renderNotes();
  showToast('文案已添加', 'success');
}

function deleteNote(noteId) {
  const notes = getNotes();
  const updatedNotes = notes.filter(note => note.id !== noteId);
  saveNotes(updatedNotes);
  renderNotes();
  showToast('已删除', 'success');
}

function copyNote(content) {
  navigator.clipboard.writeText(content).then(() => {
    showToast('已复制到剪贴板', 'success');
  }).catch(() => {
    showToast('复制失败', 'error');
  });
}

function toggleSortNotes() {
  notesSortDesc = !notesSortDesc;
  
  const sortIcon = document.getElementById('notes-sort-icon');
  if (sortIcon) {
    sortIcon.className = `fas ${notesSortDesc ? 'fa-arrow-down' : 'fa-arrow-up'}`;
  }
  
  renderNotes();
}

function renderNotes() {
  const notes = getNotes();
  const notesList = document.getElementById('notes-list');
  const notesEmpty = document.getElementById('notes-empty');
  const notesCount = document.getElementById('notes-count');
  
  if (notesCount) {
    notesCount.textContent = notes.length;
  }
  
  const sortedNotes = [...notes].sort((a, b) => {
    return notesSortDesc ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
  });
  
  if (notes.length === 0) {
    notesList.innerHTML = '';
    if (notesEmpty) notesEmpty.style.display = 'block';
    return;
  }
  
  if (notesEmpty) notesEmpty.style.display = 'none';
  
  notesList.innerHTML = sortedNotes.map(note => {
    const date = new Date(note.createdAt);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return `
      <div class="mobile-note-card">
        <p>${note.content}</p>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">${dateStr}</div>
        <div class="mobile-note-card-actions">
          <button onclick="copyNote('${note.content.replace(/'/g, "\\'")}')">
            <i class="fas fa-copy"></i> 复制
          </button>
          <button onclick="deleteNote(${note.id})">
            <i class="fas fa-trash"></i> 删除
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderRecommendations() {
  const list = document.getElementById('recommendations-list');
  if (!list) return;
  
  const recommendations = [
    { title: 'VS Code', category: '效率工具', desc: '强大的代码编辑器，插件生态丰富。' },
    { title: 'Notion', category: '效率工具', desc: '一站式知识管理和协作平台。' },
    { title: '《代码整洁之道》', category: '书籍阅读', desc: '编程经典书籍，提升代码质量。' },
    { title: 'AirPods Pro', category: '数码科技', desc: '优秀的降噪体验，音质出色。' }
  ];
  
  list.innerHTML = recommendations.map(r => `
    <div class="mobile-recommendation-card">
      <h3>${r.title}</h3>
      <div style="display: flex; justify-content: space-between; margin-top: 4px;">
        <span style="background: rgba(245,158,11,0.1); color: #f59e0b; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${r.category}</span>
      </div>
      <p style="margin-top: 8px;">${r.desc}</p>
    </div>
  `).join('');
}

function handleRecommendationSubmit(e) {
  e.preventDefault();
  showToast('推荐添加成功', 'success');
  e.target.reset();
  renderRecommendations();
}

let travelData = [];
let currentTravelCity = 'all';
const travelCityNames = {
  beijing: '北京',
  shanghai: '上海',
  chengdu: '成都',
  hangzhou: '杭州',
  other: '其他'
};

function getTravelGuides() {
  const saved = localStorage.getItem('travelData');
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    {
      id: 1,
      title: '北京三日游详细攻略',
      city: 'beijing',
      image: '',
      days: 3,
      route: 'Day1: 天安门 → 故宫 → 景山公园\nDay2: 颐和园 → 圆明园 → 清华北大\nDay3: 八达岭长城 → 鸟巢水立方夜景',
      desc: '北京是中国的首都，拥有丰富的历史文化遗产和现代化景观。建议游玩3-5天，重点游览故宫、长城、颐和园等著名景点。',
      tips: '1. 故宫需要提前预约门票\n2. 长城建议选择八达岭或慕田峪\n3. 夏季注意防暑，冬季注意保暖',
      createdAt: Date.now()
    },
    {
      id: 2,
      title: '上海两日游精华路线',
      city: 'shanghai',
      image: '',
      days: 2,
      route: 'Day1: 外滩 → 豫园 → 南京路步行街\nDay2: 陆家嘴 → 东方明珠 → 田子坊',
      desc: '上海是国际化大都市，既有现代化的摩天大楼，也有充满历史韵味的老城区。外滩夜景是必看的景点。',
      tips: '1. 外滩夜景最佳观赏时间是19:00-21:00\n2. 豫园周边小吃很多，可以尝试',
      createdAt: Date.now()
    },
    {
      id: 3,
      title: '成都美食休闲之旅',
      city: 'chengdu',
      image: '',
      days: 4,
      route: 'Day1: 宽窄巷子 → 锦里 → 武侯祠\nDay2: 大熊猫基地 → 春熙路\nDay3: 都江堰 → 青城山\nDay4: 杜甫草堂 → 青羊宫',
      desc: '成都是一座来了就不想走的城市，美食和悠闲的生活节奏是这里的特色。火锅、串串香、大熊猫是必体验的。',
      tips: '1. 吃火锅建议微辣或中辣\n2. 大熊猫基地建议早上去，熊猫比较活跃',
      createdAt: Date.now()
    },
    {
      id: 4,
      title: '杭州西湖深度游',
      city: 'hangzhou',
      image: '',
      days: 3,
      route: 'Day1: 西湖十景 → 断桥残雪 → 苏堤春晓\nDay2: 灵隐寺 → 飞来峰 → 龙井茶园\nDay3: 千岛湖一日游',
      desc: '杭州以西湖闻名天下，风景秀丽，人文荟萃。西湖十景各有特色，值得慢慢品味。',
      tips: '1. 西湖周边景点较多，可以租自行车游览\n2. 灵隐寺香火旺盛，建议早去',
      createdAt: Date.now()
    }
  ];
}

function renderTravel() {
  const container = document.getElementById('travel-list');
  const guides = getTravelGuides();
  
  const filtered = currentTravelCity === 'all' 
    ? guides 
    : guides.filter(g => g.city === currentTravelCity);
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fas fa-map-marked-alt" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
        <p>暂无该城市的攻略</p>
        <p style="font-size: 14px;">快来添加第一条攻略吧！</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map(guide => `
    <div class="mobile-travel-card">
      ${guide.image ? `<div class="mobile-travel-card-image"><img src="${guide.image}" alt="${guide.title}"></div>` : ''}
      <div class="mobile-travel-card-content">
        <div class="mobile-travel-card-header">
          <div class="mobile-travel-card-title">${guide.title}</div>
          <div class="mobile-travel-card-meta">
            <span><i class="fas fa-map-marker-alt"></i> ${travelCityNames[guide.city]}</span>
            ${guide.days ? `<span><i class="fas fa-calendar"></i> ${guide.days}天</span>` : ''}
          </div>
        </div>
        <div class="mobile-travel-route">
          <div class="mobile-travel-route-title"><i class="fas fa-route"></i> 导航路线</div>
          <div class="mobile-travel-route-content">${guide.route}</div>
        </div>
        ${guide.desc ? `<div class="mobile-travel-desc">${guide.desc}</div>` : ''}
        ${guide.tips ? `
          <div class="mobile-travel-tips">
            <div class="mobile-travel-tips-title"><i class="fas fa-lightbulb"></i> 注意事项</div>
            <div class="mobile-travel-tips-content">${guide.tips}</div>
          </div>
        ` : ''}
        <div class="mobile-travel-card-actions">
          <button onclick="editTravelGuide(${guide.id})">
            <i class="fas fa-edit"></i> 修改
          </button>
          <button onclick="deleteTravelGuide(${guide.id})">
            <i class="fas fa-trash"></i> 删除
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function switchTravelCity(city) {
  currentTravelCity = city;
  
  document.querySelectorAll('.mobile-travel-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.mobile-travel-tab').forEach(tab => {
    if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(city)) {
      tab.classList.add('active');
    }
  });
  
  renderTravel();
}

function toggleTravelAddForm() {
  const form = document.getElementById('travel-add-form');
  const icon = document.getElementById('travel-add-toggle-icon');
  const submitBtn = document.getElementById('travel-submit');
  
  if (form && icon) {
    const isExpanded = form.classList.contains('expanded');
    
    if (isExpanded) {
      form.classList.remove('expanded');
      icon.classList.remove('expanded');
      
      document.getElementById('travel-title').value = '';
      document.getElementById('travel-city').value = 'beijing';
      document.getElementById('travel-image-url').value = '';
      document.getElementById('travel-days').value = '';
      document.getElementById('travel-route').value = '';
      document.getElementById('travel-desc').value = '';
      document.getElementById('travel-tips').value = '';
      
      submitBtn.innerHTML = '<i class="fas fa-plus"></i> 添加攻略';
      delete submitBtn.dataset.editId;
    } else {
      form.classList.add('expanded');
      icon.classList.add('expanded');
    }
  }
}

function editTravelGuide(id) {
  const guides = getTravelGuides();
  const guide = guides.find(g => g.id === id);
  if (!guide) return;
  
  const form = document.getElementById('travel-add-form');
  const icon = document.getElementById('travel-add-toggle-icon');
  if (form && icon) {
    form.classList.add('expanded');
    icon.classList.add('expanded');
  }
  
  document.getElementById('travel-title').value = guide.title;
  document.getElementById('travel-city').value = guide.city;
  document.getElementById('travel-image-url').value = guide.image || '';
  document.getElementById('travel-days').value = guide.days || '';
  document.getElementById('travel-route').value = guide.route;
  document.getElementById('travel-desc').value = guide.desc || '';
  document.getElementById('travel-tips').value = guide.tips || '';
  
  const submitBtn = document.getElementById('travel-submit');
  submitBtn.innerHTML = '<i class="fas fa-save"></i> 保存修改';
  submitBtn.dataset.editId = id;
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteTravelGuide(id) {
  if (!confirm('确定要删除这条攻略吗？')) return;
  
  const guides = getTravelGuides();
  const updated = guides.filter(g => g.id !== id);
  localStorage.setItem('travelData', JSON.stringify(updated));
  
  showToast('攻略删除成功', 'success');
  renderTravel();
}

function handleTravelSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('travel-title').value.trim();
  const city = document.getElementById('travel-city').value;
  const image = document.getElementById('travel-image-url').value.trim();
  const days = parseInt(document.getElementById('travel-days').value) || 0;
  const route = document.getElementById('travel-route').value.trim();
  const desc = document.getElementById('travel-desc').value.trim();
  const tips = document.getElementById('travel-tips').value.trim();
  
  const submitBtn = document.getElementById('travel-submit');
  const editId = submitBtn.dataset.editId;
  
  const guides = getTravelGuides();
  
  if (editId) {
    const index = guides.findIndex(g => g.id === parseInt(editId));
    if (index !== -1) {
      guides[index] = {
        ...guides[index],
        title,
        city,
        image,
        days,
        route,
        desc,
        tips
      };
      showToast('攻略修改成功', 'success');
    }
  } else {
    const newGuide = {
      id: Date.now(),
      title,
      city,
      image,
      days,
      route,
      desc,
      tips,
      createdAt: Date.now()
    };
    guides.push(newGuide);
    showToast('攻略添加成功', 'success');
  }
  
  localStorage.setItem('travelData', JSON.stringify(guides));
  toggleTravelAddForm();
  renderTravel();
}

function handleContactSubmit(e) {
  e.preventDefault();
  showToast('留言发送成功', 'success');
  e.target.reset();
}

window.addEventListener('DOMContentLoaded', () => {
  initTheme();
});