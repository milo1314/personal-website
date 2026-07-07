/**
 * 主脚本文件
 * 功能：页面导航切换、主题切换、通用工具函数
 * 使用方法：点击导航链接切换对应模块，点击主题按钮切换明暗主题
 */

/**
 * 当前激活的导航链接ID
 */
let currentSection = 'home';

/**
 * 当前风格 (style1: 默认风格, style2: 新风格)
 */
let currentStyle = 'style1';

/**
 * 显示指定模块
 * @param {string} sectionId - 模块ID（home/projects/blog/toolbox/contact/snippets/resources）
 */
function showSection(sectionId) {
  // 更新当前模块状态
  currentSection = sectionId;
  
  if (sectionId === 'home') {
    // 回到首页时，从localStorage恢复之前选择的风格
    const savedStyle = localStorage.getItem('style');
    const styleToggle = document.getElementById('styleToggle');
    if (savedStyle === 'style2') {
      currentStyle = 'style2';
      document.documentElement.setAttribute('data-style', 'style2');
      if (styleToggle) {
        styleToggle.innerHTML = '<i class="fas fa-home"></i>';
      }
    } else {
      currentStyle = 'style1';
      document.documentElement.removeAttribute('data-style');
      if (styleToggle) {
        styleToggle.innerHTML = '<i class="fas fa-palette"></i>';
      }
    }
    updateHomeLayout();
  }
  
  // 隐藏所有模块
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });
  
  // 显示指定模块
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = 'block';
  }
  
  // 更新导航链接状态
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.classList.remove('active');
  });
  
  // 找到对应的导航链接并激活
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link && link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionId)) {
      link.classList.add('active');
    }
  });
  
  // 如果是工具箱模块，默认显示第一个工具
  if (sectionId === 'toolbox') {
    selectTool('json2yaml');
  }
  
  // 如果是语录模块，初始化数据
  if (sectionId === 'quotes') {
    initQuotes();
  }
  
  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 选择工具箱中的工具
 * @param {string} toolId - 工具ID（json2yaml/base64/token/hash/uuid/time）
 */
function selectTool(toolId) {
  // 隐藏所有工具内容
  document.querySelectorAll('.tool-panel').forEach(content => {
    content.style.display = 'none';
  });
  
  // 显示指定工具
  const targetTool = document.getElementById('tool-' + toolId);
  if (targetTool) {
    targetTool.style.display = 'block';
  }
  
  // 更新工具导航按钮状态
  document.querySelectorAll('.tool-nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 找到对应的导航按钮并激活
  const toolBtns = document.querySelectorAll('.tool-nav-btn');
  toolBtns.forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(toolId)) {
      btn.classList.add('active');
    }
  });
  
  // 移动端：选择工具后关闭工具菜单
  const toolSidebar = document.getElementById('toolSidebar');
  if (toolSidebar) {
    toolSidebar.classList.remove('active');
  }
}

/**
 * 切换移动端工具菜单显示/隐藏
 */
function toggleMobileToolMenu() {
  const toolSidebar = document.getElementById('toolSidebar');
  if (toolSidebar) {
    toolSidebar.classList.toggle('active');
  }
}

/**
 * 复制文本到剪贴板
 * @param {string} elementId - 要复制的元素ID
 */
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }
  
  const text = element.value;
  if (!text.trim()) {
    showToast('没有可复制的内容', 'warning');
    return;
  }
  
  // 使用Clipboard API复制文本
  navigator.clipboard.writeText(text).then(() => {
    showToast('✓ 已复制到剪贴板', 'success');
  }).catch(err => {
    console.error('复制失败:', err);
    // 降级方案：使用textarea选择复制
    element.select();
    document.execCommand('copy');
    showToast('✓ 已复制到剪贴板', 'success');
  });
}

/**
 * 显示Toast提示
 * @param {string} message - 提示消息
 * @param {string} type - 提示类型（success/error/warning/info）
 */
function showToast(message, type = 'info') {
  // 移除已存在的toast
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  // 创建提示元素
  const toast = document.createElement('div');
  toast.className = 'toast-notification toast-' + type;
  toast.textContent = message;
  
  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .toast-notification {
      position: fixed;
      top: 100px;
      right: 24px;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      animation: toastSlideIn 0.3s ease-out;
      box-shadow: var(--shadow-lg);
    }
    
    .toast-success {
      background: var(--accent-green);
      color: white;
    }
    
    .toast-error {
      background: var(--accent-red);
      color: white;
    }
    
    .toast-warning {
      background: var(--accent-orange);
      color: white;
    }
    
    .toast-info {
      background: var(--accent-primary);
      color: white;
    }
    
    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(toast);
  
  // 3秒后移除提示
  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 300);
  }, 3000);
}

/**
 * 切换主题（浅色/暗色）
 */
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const themeToggle = document.getElementById('themeToggle');
  
  if (currentTheme === 'dark') {
    // 切换到浅色主题
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    showToast('已切换到浅色主题', 'info');
  } else {
    // 切换到暗色主题
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    showToast('已切换到暗色主题', 'info');
  }
}

/**
 * 切换风格
 */
function toggleStyle() {
  const html = document.documentElement;
  const styleToggle = document.getElementById('styleToggle');
  const mainContent = document.querySelector('.main-content');
  
  if (!styleToggle || !mainContent) return;
  
  styleToggle.disabled = true;
  
  const overlay = document.createElement('div');
  overlay.className = 'style-transition-overlay';
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.classList.add('active');
    mainContent.classList.add('style-transition-fade');
  }, 50);
  
  setTimeout(() => {
    if (currentStyle === 'style1') {
      currentStyle = 'style2';
      html.setAttribute('data-style', 'style2');
      localStorage.setItem('style', 'style2');
      styleToggle.innerHTML = '<i class="fas fa-home"></i>';
      showToast('已切换到苹果风格', 'info');
    } else {
      currentStyle = 'style1';
      html.removeAttribute('data-style');
      localStorage.setItem('style', 'style1');
      styleToggle.innerHTML = '<i class="fas fa-palette"></i>';
      showToast('已切换到默认风格', 'info');
    }
    
    updateHomeLayout();
    
    setTimeout(() => {
      mainContent.classList.remove('style-transition-fade');
      overlay.classList.add('fade-out');
      
      setTimeout(() => {
        document.body.removeChild(overlay);
        styleToggle.disabled = false;
      }, 400);
    }, 100);
  }, 400);
}

/**
 * 更新首页布局显示
 */
function updateHomeLayout() {
  const style2Home = document.querySelector('.style2-home');
  const heroCard = document.querySelector('.hero-card');
  const techStack = document.querySelector('.tech-stack-container');
  const bentoGrid = document.querySelector('.bento-grid');
  const sectionTitles = document.querySelectorAll('.section-title');
  
  if (currentStyle === 'style2') {
    if (style2Home) style2Home.style.display = 'block';
    if (heroCard) heroCard.style.display = 'none';
    if (techStack) techStack.style.display = 'none';
    if (bentoGrid) bentoGrid.style.display = 'none';
    sectionTitles.forEach(title => title.style.display = 'none');
  } else {
    if (style2Home) style2Home.style.display = 'none';
    if (heroCard) heroCard.style.display = '';
    if (techStack) techStack.style.display = '';
    if (bentoGrid) bentoGrid.style.display = '';
    sectionTitles.forEach(title => title.style.display = '');
  }
}

/**
 * 初始化风格
 */
function initStyle() {
  const html = document.documentElement;
  const savedStyle = localStorage.getItem('style');
  const styleToggle = document.getElementById('styleToggle');
  
  if (savedStyle === 'style2') {
    currentStyle = 'style2';
    html.setAttribute('data-style', 'style2');
    styleToggle.innerHTML = '<i class="fas fa-home"></i>';
  } else {
    currentStyle = 'style1';
    html.removeAttribute('data-style');
    styleToggle.innerHTML = '<i class="fas fa-palette"></i>';
  }
  
  updateHomeLayout();
}

/**
 * 初始化主题
 */
function initTheme() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  const themeToggle = document.getElementById('themeToggle');
  
  if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    html.removeAttribute('data-theme');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

/**
 * 初始化版权年份
 */
function initCopyrightYear() {
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = currentYear;
  }
}

/**
 * 清空工具输入输出
 * @param {string} toolId - 工具ID
 */
function clearTool(toolId) {
  const input = document.getElementById(toolId + '-input');
  const output = document.getElementById(toolId + '-output');
  
  if (input) input.value = '';
  if (output) output.value = '';
  
  // 特殊处理：时间工具
  if (toolId === 'time') {
    const datetimeInput = document.getElementById('datetime-input');
    if (datetimeInput) datetimeInput.value = '';
  }
}

/**
 * 处理联系表单提交
 * @param {Event} event - 表单提交事件
 */
function handleContactSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  console.log('表单数据:', data);
  
  form.reset();
  showToast('消息已记录！（演示模式）', 'success');
}

/**
 * 页面加载完成后的初始化操作
 */
document.addEventListener('DOMContentLoaded', () => {
  // 初始化主题
  initTheme();
  
  // 初始化风格
  initStyle();
  
  // 初始化版权年份
  initCopyrightYear();
  
  // 默认显示首页
  showSection('home');
  
  // 初始化技能标签样式
  initSkillTags();
  
  // 初始化项目卡片
  initProjectCards();
  
  // 初始化博客卡片
  initBlogCards();
  
  // 初始化文案笔记
  initNotes();
  
  // 初始化好物推荐
  initRecommendations();
  
  // 绑定主题切换按钮
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // 绑定风格切换按钮
  const styleToggle = document.getElementById('styleToggle');
  if (styleToggle) {
    styleToggle.addEventListener('click', toggleStyle);
  }
  
  // 初始化后端API测试
  initApiTest();
});

/**
 * 初始化后端API测试（演示调用后端接口）
 */
async function initApiTest() {
  console.log('=== 后端API测试 ===');
  
  try {
    const healthResult = await api.health();
    console.log('API健康检查:', healthResult);
    
    if (healthResult.success) {
      showToast('后端API连接成功！', 'success');
      
      await loadProjectsFromApi();
      await loadBlogsFromApi();
      await loadQuotesFromApi();
      await loadSkillsFromApi();
    } else {
      showToast('后端API未启动，使用本地数据', 'info');
    }
  } catch (error) {
    console.log('后端API未启动，使用本地数据');
    showToast('后端API未启动，使用本地数据', 'info');
  }
}

/**
 * 从后端加载项目数据
 */
async function loadProjectsFromApi() {
  try {
    const result = await api.projects.getAll();
    if (result.success && result.data && result.data.length > 0) {
      console.log('从后端加载项目:', result.data.length, '个');
      renderProjectsFromApi(result.data);
    }
  } catch (error) {
    console.error('加载项目失败:', error);
  }
}

/**
 * 从后端加载博客数据
 */
async function loadBlogsFromApi() {
  try {
    const result = await api.blogs.getAll();
    if (result.success && result.data && result.data.length > 0) {
      console.log('从后端加载博客:', result.data.length, '篇');
      renderBlogsFromApi(result.data);
    }
  } catch (error) {
    console.error('加载博客失败:', error);
  }
}

/**
 * 从后端加载语录数据
 */
async function loadQuotesFromApi() {
  try {
    const result = await api.quotes.getAll();
    if (result.success && result.data && result.data.length > 0) {
      console.log('从后端加载语录:', result.data.length, '条');
      renderQuotesFromApi(result.data);
    }
  } catch (error) {
    console.error('加载语录失败:', error);
  }
}

/**
 * 从后端加载技能数据
 */
async function loadSkillsFromApi() {
  try {
    const result = await api.skills.getAll();
    if (result.success && result.data && result.data.length > 0) {
      console.log('从后端加载技能:', result.data.length, '个');
      renderSkillsFromApi(result.data);
    }
  } catch (error) {
    console.error('加载技能失败:', error);
  }
}

/**
 * 渲染后端项目数据（示例）
 */
function renderProjectsFromApi(projects) {
  const projectSection = document.getElementById('projects');
  if (!projectSection) return;
  
  const projectGrid = projectSection.querySelector('.project-grid');
  if (!projectGrid) return;
  
  console.log('项目数据示例:', projects[0]);
}

/**
 * 渲染后端博客数据（示例）
 */
function renderBlogsFromApi(blogs) {
  const blogSection = document.getElementById('blog');
  if (!blogSection) return;
  
  console.log('博客数据示例:', blogs[0]);
}

/**
 * 渲染后端语录数据（示例）
 */
function renderQuotesFromApi(quotes) {
  const quoteSection = document.getElementById('quotes');
  if (!quoteSection) return;
  
  console.log('语录数据示例:', quotes[0]);
}

/**
 * 渲染后端技能数据（示例）
 */
function renderSkillsFromApi(skills) {
  const skillContainer = document.querySelector('.tech-stack-container');
  if (!skillContainer) return;
  
  console.log('技能数据示例:', skills[0]);
}

/**
 * 初始化技能标签样式（浅色/暗色主题适配）
 */
function initSkillTags() {
  const style = document.createElement('style');
  style.textContent = `
    .skill-tag {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }
    
    .skill-tag:hover {
      background: rgba(79, 70, 229, 0.08);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      box-shadow: 0 2px 4px rgba(79, 70, 229, 0.1);
    }
    
    .tool-nav-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 12px;
      background: transparent;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }
    
    .tool-nav-btn:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }
    
    .tool-nav-btn.active {
      background: rgba(79, 70, 229, 0.08);
      color: var(--accent-primary);
      font-weight: 500;
    }
    
    .tool-textarea {
      width: 100%;
      min-height: 200px;
      padding: 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-primary);
      resize: vertical;
      transition: all 0.2s ease;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    .tool-textarea:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
    
    .tool-textarea::placeholder {
      color: var(--text-muted);
    }
    
    .tool-input {
      width: 100%;
      padding: 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--text-primary);
      transition: all 0.2s ease;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    .tool-input:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
    
    .tool-input::placeholder {
      color: var(--text-muted);
    }
    
    .hash-algo-btn {
      padding: 8px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 13px;
      font-family: var(--font-mono);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .hash-algo-btn:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      background: rgba(79, 70, 229, 0.05);
    }
    
    .hash-algo-btn.active {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
      box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
    }
    
    #project-list, #blog-list {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .project-card {
      padding: 20px;
      background: var(--bg-card);
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid var(--border-color);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }
    
    .project-card:hover {
      border-color: var(--accent-primary);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .blog-card {
      padding: 16px;
      background: var(--bg-card);
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid var(--border-color);
      transition: all 0.2s ease;
    }
    
    .blog-card:hover {
      border-color: var(--accent-primary);
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * 初始化项目卡片样式
 */
function initProjectCards() {
  const projects = [
    {
      id: 1,
      title: 'MiloLab',
      description: '开发者个人网站模板，包含工具箱、项目展示、博客等模块。',
      tags: ['Vue.js', 'TypeScript', 'Tailwind CSS'],
      url: 'https://github.com',
      stars: 128
    },
    {
      id: 2,
      title: 'API Gateway',
      description: '轻量级API网关服务，支持路由转发、限流、认证等功能。',
      tags: ['Go', 'gRPC', 'Docker'],
      url: 'https://github.com',
      stars: 86
    },
    {
      id: 3,
      title: 'Data Pipeline',
      description: '基于Kafka的数据处理管道，支持实时数据清洗和转换。',
      tags: ['Python', 'Kafka', 'Spark'],
      url: 'https://github.com',
      stars: 54
    }
  ];
  
  const projectList = document.getElementById('project-list');
  if (projectList) {
    projectList.innerHTML = projects.map(project => `
      <div class="project-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h3 style="font-size: 16px; font-weight: 600; color: var(--text-primary);">
            <a href="${project.url}" target="_blank" style="color: var(--accent-primary); text-decoration: none;">${project.title}</a>
          </h3>
          <span style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-muted);">
            <i class="fas fa-star"></i> ${project.stars}
          </span>
        </div>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">${project.description}</p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${project.tags.map(tag => `
            <span style="padding: 4px 10px; background: var(--bg-tertiary); border-radius: 4px; font-size: 12px; font-family: var(--font-mono); color: var(--text-secondary);">${tag}</span>
          `).join('')}
        </div>
      </div>
    `).join('');
  }
}

/**
 * 初始化博客卡片样式
 */
function initBlogCards() {
  const blogs = [
    {
      id: 1,
      title: '深入理解 JavaScript 闭包',
      excerpt: '闭包是 JavaScript 中最重要的概念之一，本文深入探讨闭包的原理和应用场景...',
      date: '2024-01-15',
      tags: ['JavaScript', '基础']
    },
    {
      id: 2,
      title: 'Vue 3 Composition API 实战指南',
      excerpt: '从 Options API 迁移到 Composition API，学习如何更好地组织和复用代码...',
      date: '2024-01-10',
      tags: ['Vue.js', '前端']
    },
    {
      id: 3,
      title: 'Docker 容器化部署最佳实践',
      excerpt: '掌握 Docker 容器化部署的核心技巧，包括镜像优化、网络配置和安全加固...',
      date: '2024-01-05',
      tags: ['Docker', 'DevOps']
    }
  ];
  
  const blogList = document.getElementById('blog-list');
  if (blogList) {
    blogList.innerHTML = blogs.map(blog => `
      <div class="blog-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h3 style="font-size: 16px; font-weight: 600; color: var(--text-primary);">${blog.title}</h3>
          <span style="font-size: 12px; color: var(--text-muted);">${blog.date}</span>
        </div>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">${blog.excerpt}</p>
        <div style="display: flex; gap: 8px;">
          ${blog.tags.map(tag => `
            <span style="padding: 4px 10px; background: var(--accent-primary-light); border-radius: 4px; font-size: 12px; color: var(--accent-primary);">${tag}</span>
          `).join('')}
        </div>
      </div>
    `).join('');
  }
}

/**
 * 文案记事本相关功能
 */

/** 笔记数据存储键 */
const NOTES_STORAGE_KEY = 'devhub_notes';

/** 是否按时间倒序排序 */
let notesSortDesc = true;

/**
 * 获取笔记数据
 * @returns {Array} 笔记数组
 */
function getNotes() {
  const stored = localStorage.getItem(NOTES_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // 返回初始示例数据
  return [
    {
      id: Date.now() - 3600000 * 24,
      content: '人生没有白走的路，每一步都算数。',
      createdAt: Date.now() - 3600000 * 24
    },
    {
      id: Date.now() - 3600000 * 12,
      content: '生活不是等待风暴过去，而是学会在雨中翩翩起舞。',
      createdAt: Date.now() - 3600000 * 12
    },
    {
      id: Date.now() - 3600000 * 6,
      content: '种一棵树最好的时间是十年前，其次是现在。',
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: Date.now() - 3600000 * 2,
      content: '不要等待机会，而要创造机会。',
      createdAt: Date.now() - 3600000 * 2
    },
    {
      id: Date.now() - 3600000,
      content: '星光不问赶路人，时光不负有心人。',
      createdAt: Date.now() - 3600000
    },
    {
      id: Date.now(),
      content: '世界上只有一种英雄主义，就是看清生活的真相之后依然热爱生活。',
      createdAt: Date.now()
    }
  ];
}

/**
 * 保存笔记数据
 * @param {Array} notes - 笔记数组
 */
function saveNotes(notes) {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

/**
 * 格式化时间戳为可读日期
 * @param {number} timestamp - 时间戳
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 初始化笔记模块
 */
function initNotes() {
  renderNotes();
}

/**
 * 添加新笔记
 */
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
  showToast('✓ 文案已添加', 'success');
}

/**
 * 删除笔记
 * @param {number} noteId - 笔记ID
 */
function deleteNote(noteId) {
  const notes = getNotes();
  const updatedNotes = notes.filter(note => note.id !== noteId);
  saveNotes(updatedNotes);
  renderNotes();
  showToast('✓ 已删除', 'success');
}

/**
 * 复制笔记内容
 * @param {string} content - 笔记内容
 */
function copyNote(content) {
  navigator.clipboard.writeText(content).then(() => {
    showToast('✓ 已复制到剪贴板', 'success');
  }).catch(() => {
    showToast('复制失败', 'error');
  });
}

/**
 * 切换排序方式
 */
function toggleSortNotes() {
  notesSortDesc = !notesSortDesc;
  const sortLabel = document.getElementById('sort-label');
  if (sortLabel) {
    sortLabel.textContent = notesSortDesc ? '按时间排序' : '按时间倒序';
  }
  renderNotes();
}

/**
 * 渲染笔记列表
 */
function renderNotes() {
  const notes = getNotes();
  const notesList = document.getElementById('notes-list');
  const notesEmpty = document.getElementById('notes-empty');
  const notesCount = document.getElementById('notes-count');
  
  // 更新计数
  if (notesCount) {
    notesCount.textContent = notes.length;
  }
  
  // 排序
  const sortedNotes = [...notes].sort((a, b) => {
    return notesSortDesc ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
  });
  
  // 渲染列表或空状态
  if (notes.length === 0) {
    if (notesList) notesList.style.display = 'none';
    if (notesEmpty) notesEmpty.style.display = 'block';
  } else {
    if (notesList) notesList.style.display = 'grid';
    if (notesEmpty) notesEmpty.style.display = 'none';
    
    if (notesList) {
      notesList.innerHTML = sortedNotes.map(note => `
        <div class="note-card">
          <div class="note-content">"${note.content}"</div>
          <div class="note-meta">
            <span class="note-date">${formatDate(note.createdAt)}</span>
            <div class="note-actions">
              <button class="note-action-btn copy" onclick="copyNote('${note.content.replace(/'/g, "\\'")}')" title="复制">
                <i class="fas fa-copy"></i>
              </button>
              <button class="note-action-btn" onclick="deleteNote(${note.id})" title="删除">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

/**
 * ==================== 好物推荐模块 ====================
 */

const RECOMMENDATIONS_STORAGE_KEY = 'devhub_recommendations';

const categoryIcons = {
  tech: 'fas fa-mobile-alt',
  book: 'fas fa-book',
  life: 'fas fa-home',
  tool: 'fas fa-wrench',
  other: 'fas fa-star'
};

const categoryNames = {
  tech: '数码科技',
  book: '书籍阅读',
  life: '生活家居',
  tool: '效率工具',
  other: '其他'
};

function getRecommendations() {
  const stored = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: Date.now() - 3600000 * 24,
      title: 'VS Code',
      category: 'tool',
      url: 'https://code.visualstudio.com',
      desc: '微软出品的强大代码编辑器，插件生态丰富，支持几乎所有编程语言。',
      createdAt: Date.now() - 3600000 * 24
    },
    {
      id: Date.now() - 3600000 * 12,
      title: 'Notion',
      category: 'tool',
      url: 'https://www.notion.so',
      desc: '一站式工作空间，集笔记、任务管理、数据库于一体，非常适合个人和团队使用。',
      createdAt: Date.now() - 3600000 * 12
    },
    {
      id: Date.now() - 3600000 * 6,
      title: '《史蒂夫·乔布斯传》',
      category: 'book',
      url: 'https://book.douban.com/subject/6566747/',
      desc: '沃尔特·艾萨克森撰写的乔布斯官方传记，深入了解苹果创始人的传奇人生。',
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: Date.now() - 3600000 * 2,
      title: 'AirPods Pro',
      category: 'tech',
      url: 'https://www.apple.com/airpods-pro/',
      desc: '苹果的旗舰降噪耳机，主动降噪效果出色，佩戴舒适，适合日常通勤。',
      createdAt: Date.now() - 3600000 * 2
    },
    {
      id: Date.now(),
      title: '小米台灯',
      category: 'life',
      url: 'https://www.mi.com/xiaomi-lamp',
      desc: '简约设计，护眼模式，亮度可调节，是工作学习的好伴侣。',
      createdAt: Date.now()
    }
  ];
}

function saveRecommendations(recommendations) {
  localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(recommendations));
}

function initRecommendations() {
  renderRecommendations();
}

function handleImageUpload(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('rec-image-preview');
    const imageUrlInput = document.getElementById('rec-image-url');
    
    imageUrlInput.value = e.target.result;
    preview.innerHTML = `
      <img src="${e.target.result}" alt="预览">
      <button class="rec-image-preview-remove" onclick="removeImagePreview()">
        <i class="fas fa-times"></i>
      </button>
    `;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function removeImagePreview() {
  const preview = document.getElementById('rec-image-preview');
  const imageUrlInput = document.getElementById('rec-image-url');
  const imageFileInput = document.getElementById('rec-image-file');
  
  preview.style.display = 'none';
  preview.innerHTML = '';
  imageUrlInput.value = '';
  imageFileInput.value = '';
}

function handleRecommendationSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('rec-title').value.trim();
  const category = document.getElementById('rec-category').value;
  const image = document.getElementById('rec-image-url').value.trim();
  const url = document.getElementById('rec-url').value.trim();
  const desc = document.getElementById('rec-desc').value.trim();
  
  if (!title || !desc) {
    showToast('请填写名称和推荐理由', 'warning');
    return;
  }
  
  const recommendations = getRecommendations();
  const newRec = {
    id: Date.now(),
    title: title,
    category: category,
    image: image,
    url: url,
    desc: desc,
    createdAt: Date.now()
  };
  
  recommendations.unshift(newRec);
  saveRecommendations(recommendations);
  
  document.getElementById('rec-title').value = '';
  document.getElementById('rec-category').value = 'tech';
  document.getElementById('rec-url').value = '';
  document.getElementById('rec-desc').value = '';
  removeImagePreview();
  
  renderRecommendations();
  showToast('✓ 好物推荐已添加', 'success');
}

function deleteRecommendation(recId) {
  const recommendations = getRecommendations();
  const updated = recommendations.filter(r => r.id !== recId);
  saveRecommendations(updated);
  renderRecommendations();
  showToast('✓ 已删除', 'success');
}

function renderRecommendations() {
  const recommendations = getRecommendations();
  const container = document.getElementById('recommendations-list');
  
  if (!container) return;
  
  if (recommendations.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px;">
        <div style="font-size: 48px; margin-bottom: 16px;">✨</div>
        <div class="card-title">还没有推荐好物</div>
        <div class="card-description">添加你觉得好用的产品或工具，分享给大家</div>
      </div>
    `;
    return;
  }
  
  const sorted = [...recommendations].sort((a, b) => b.createdAt - a.createdAt);
  
  container.innerHTML = sorted.map(rec => `
    <div class="recommendation-card">
      ${rec.image ? `<div class="recommendation-card-image"><img src="${rec.image}" alt="${rec.title}"></div>` : ''}
      <div class="recommendation-header">
        <div class="recommendation-icon ${rec.category}">
          <i class="${categoryIcons[rec.category]}"></i>
        </div>
        <div class="recommendation-title">${rec.title}</div>
        <span class="recommendation-category">${categoryNames[rec.category]}</span>
      </div>
      <div class="recommendation-desc">${rec.desc}</div>
      ${rec.url ? `<a href="${rec.url}" target="_blank" class="recommendation-url"><i class="fas fa-external-link-alt"></i> 查看详情</a>` : ''}
      <div class="recommendation-actions">
        <button class="recommendation-delete-btn" onclick="deleteRecommendation(${rec.id})">
          <i class="fas fa-trash"></i> 删除
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * ==================== 名人语录模块 ====================
 */

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
          {"num": 5, "text": "遇到小事，可以指望别人；遇到大事，千万不能把自个儿的命运，拴到别人身上。", "theme": "独立与依靠"},
          {"num": 6, "text": "一个人的孤独不是孤独，一个人找另一个人，一句话找另一句话，才是真正的孤独。", "theme": "孤独与寻找"},
          {"num": 7, "text": "人相互一有隔阂，对方便无做得对的地方；同做一件事，本来是为对方考虑，对方也把你想成了另有想法。", "theme": "误解与隔阂"},
          {"num": 8, "text": "街上的事，一件事就是一件事；家里的事，一件事扯着八件事。", "theme": "世事与人情"},
          {"num": 9, "text": "慢性子容易心细，心细的人容易记仇。", "theme": "性格与命运"},
          {"num": 10, "text": "话，一旦成了人与人唯一沟通的东西，寻找和孤独便伴随一生。", "theme": "孤独与寻找"},
          {"num": 11, "text": "爱不爱说话，原来也看跟谁在一起。", "theme": "人际关系"},
          {"num": 12, "text": "不拿你当朋友的，你赶着巴结了一辈子；拿你当朋友的，你倒不往心里去。", "theme": "人际关系"},
          {"num": 13, "text": "人一有偏向，中间自然有假。", "theme": "世事与人情"},
          {"num": 14, "text": "世上最难是厚道，一见面大家就能喝醉，证明说得着。", "theme": "人际关系"},
          {"num": 15, "text": "事情想不明白，人的忧愁还少些；事情想明白了，反倒更加忧愁了。", "theme": "世事与人情"},
          {"num": 16, "text": "世上有用的话，一天不超过十句。", "theme": "言语与沉默"},
          {"num": 17, "text": "人将心腹话说给朋友，没想到朋友一掰，这些自己说过的话，都成了刀子，反过头扎向自己。", "theme": "信任与背叛"},
          {"num": 18, "text": "干活儿再累，也比找不着活儿强。", "theme": "生存与奋斗"},
          {"num": 19, "text": "啥叫废话？就是说些已经过去的没用的事；啥叫有用的话？张罗些前面的有用的事。", "theme": "言语与沉默"},
          {"num": 20, "text": "同样一件事情，对自己有利没利他不管，看到对别人有利，他就觉得吃了亏。", "theme": "人性与欲望"},
          {"num": 21, "text": "会说话不是说他话多，嘴不停，而是说起话来，不与你抢话；有话让你先说，他再接着说。", "theme": "言语与沉默"},
          {"num": 22, "text": "世上万千的事，说起了结，还属这种了结快；别的事，一辈子也难了结。", "theme": "世事与人情"},
          {"num": 23, "text": "手闲着不会把人憋死，嘴闲着就把人憋死了。", "theme": "言语与沉默"},
          {"num": 24, "text": "做生意跟人说话，又与平日说话不同，平日说话照着自己的心思，做生意得照着别人的心思，见什么人说什么话。", "theme": "处世智慧"},
          {"num": 25, "text": "我活了七十岁，明白一个道理，世上别的东西都能挑，就是日子没法挑。", "theme": "时间与人生"},
          {"num": 26, "text": "世上最难吃的是屎，世上最难寻的是人。", "theme": "孤独与寻找"},
          {"num": 27, "text": "平时说一千句坏话无碍，关键时候说人一句坏话，就把一个人变成了另一个人。", "theme": "言语与沉默"},
          {"num": 28, "text": "两人的心离得远，对同样一句话，就有不同的理解；你认为是句好话，她听起来不一定觉得是好话。", "theme": "误解与隔阂"},
          {"num": 29, "text": "躁人之辞多，吉人之辞寡。", "theme": "言语与沉默"},
          {"num": 30, "text": "论起事来，同样一件事，我只能看一里，他能看十里，我只能看一个月，他一下能看十年。", "theme": "处世智慧"},
          {"num": 31, "text": "都说论理好，真论起理来，事情倒更难办了。", "theme": "处世智慧"},
          {"num": 32, "text": "过去一件事挺难，除非再发生一件大事，把这件事遮过去。", "theme": "世事与人情"},
          {"num": 33, "text": "啥叫常有理？就是不讲理。", "theme": "言语与沉默"},
          {"num": 34, "text": "爸妈不亲你，有不亲的好处；爸妈护着你，有护着的坏处。", "theme": "亲情与成长"},
          {"num": 35, "text": "可世上啥最毒？就是人的心。人心毒不是说它狠，是说大家遇事都不往好处想，盼着事坏。", "theme": "人性与欲望"},
          {"num": 36, "text": "如果身边有朋友，心里的话都说完了，远道来个人，不是添堵吗？", "theme": "人际关系"},
          {"num": 37, "text": "长痛不如短痛。有短处在人手里，一辈子别想翻身。", "theme": "处世智慧"},
          {"num": 38, "text": "真是知人知面不知心。因为一只布袋，我丢了一个朋友，得到一个朋友。", "theme": "信任与背叛"},
          {"num": 39, "text": "不瘫时常说假话，瘫了之后句句都掏心窝子。", "theme": "人性与欲望"},
          {"num": 40, "text": "人一自主，心里又松快许多。", "theme": "独立与依靠"},
          {"num": 41, "text": "一个人总顺着别人的心思来，自己心里就有些别扭；但一个人自己别扭，也比再让别人别扭自己强。", "theme": "独立与依靠"},
          {"num": 42, "text": "原来一件事，中间拐着好几道弯儿呢。", "theme": "世事与人情"},
          {"num": 43, "text": "街上怎么说，那是街上的事；自己怎么做，才是自己的事。", "theme": "独立与依靠"},
          {"num": 44, "text": "上学是得脑子好使，但要说值得着，还得那个脑子笨的。人就像鸟一样，脑子好使，翅膀一硬就飞了；脑子笨，撒出去才能飞回来。", "theme": "亲情与成长"},
          {"num": 45, "text": "顺着你说的人，心里就是憋着坏。", "theme": "信任与背叛"},
          {"num": 46, "text": "一开始觉得没有话说是两人不爱说话，后来发现不爱说话和没话说是两回事。不爱说话是心里还有话，没话说是干脆什么都没有了。", "theme": "孤独与寻找"},
          {"num": 47, "text": "人来世上一趟，免生闲气罢了。", "theme": "时间与人生"},
          {"num": 48, "text": "不求人办事是熟人，一求人办事人就生了。", "theme": "人际关系"},
          {"num": 49, "text": "好把的是病，猜不透的是人心。", "theme": "人性与欲望"},
          {"num": 50, "text": "世上的人遍地都是，说得着的人千里难寻。", "theme": "孤独与寻找"}
        ]
      },
      xian: {
        name: '咸的玩笑',
        icon: 'fas fa-smile',
        quotes: [
          {"num": 1, "text": "世上有许多玩笑，注定要流着泪开完。", "theme": "核心隐喻"},
          {"num": 2, "text": "世界各地，不同的街道上，街上走着的每个人，内心都有伤痕，大家都辛苦了。", "theme": "悲悯与理解"},
          {"num": 3, "text": "一时解决不了的矛盾，可以等待，可以交给时间，给时间一点时间。", "theme": "时间与人生"},
          {"num": 4, "text": "给时间一点时间。真理是个慢性子的人。", "theme": "时间与人生"},
          {"num": 5, "text": "世上的事情，是油然而生的吗？不，世上的事情是突然发生的。", "theme": "世事与人情"},
          {"num": 6, "text": "凡是把简单变成复杂的人，都居心叵测；唯一的活扣，是把复杂变回简单。", "theme": "处世智慧"},
          {"num": 7, "text": "大事讲理是为了不走错路，小事也讲理只能引来麻烦。", "theme": "处世智慧"},
          {"num": 8, "text": "遇到寒冬，就是一句话，装死。装死，就不会死了。", "theme": "生存智慧"},
          {"num": 9, "text": "有活儿干可不能叫累，没活儿干等活儿的时候，才叫累呢。", "theme": "生存智慧"},
          {"num": 10, "text": "沉默是最响亮的回答，尤其是对不该问的问题。", "theme": "言语与沉默"},
          {"num": 11, "text": "人都是以自我为中心。人在中心，听到的声音会比实际声音显得大；得到的感觉，也比实际显得大；也就是，你把世界夸大了。", "theme": "人性与欲望"},
          {"num": 12, "text": "爱讨好外人的人，不会讨好家里人；爱巴结别人的人，喜欢家里人巴结他。", "theme": "人际关系"},
          {"num": 13, "text": "过去杜太白去南街大排档吃饭，不愿与人拼桌，现在也开始与人拼桌；渐渐喜欢与人拼桌，不光为接活计，热闹；如同地下的下水道，你觉得它脏，但人人离不了。", "theme": "生活真谛"},
          {"num": 14, "text": "当现实没意思的时候，我愿意回到古书里。当然，我并不是厚古薄今，古代的生活，也和如今的现实一样，一地鸡毛，但书经过过滤和筛选，把没意思的生活过滤和筛选掉了。", "theme": "阅读与意义"},
          {"num": 15, "text": "欺负我没什么，不能欺负我的小白鼠。", "theme": "人物妙语"},
          {"num": 16, "text": "舅舅，我知道我该干啥了。我想当和尚。这么多人，都没爸妈。也不是没爸没妈，而是离开爸妈，大家都一样。", "theme": "人物妙语"},
          {"num": 17, "text": "世界上所有的狼都想装羊，而世界上所有的羊也都在装狼。", "theme": "人性与欲望"},
          {"num": 18, "text": "真正的聪明是知道自己是笨的，愚公移山才是大智慧。", "theme": "处世智慧"},
          {"num": 19, "text": "真相像远山，越走近越模糊。", "theme": "世事与人情"},
          {"num": 20, "text": "生活就是拧巴着过，笑着笑着就哭了。", "theme": "生活真谛"},
          {"num": 21, "text": "思索是穷人的快乐，富人的奢侈品。", "theme": "生活真谛"},
          {"num": 22, "text": "把复杂的事情说简单，你就是大师。", "theme": "言语与沉默"},
          {"num": 23, "text": "幽默是生活的解药，真实是幽默的配方。", "theme": "生活真谛"},
          {"num": 24, "text": "最远的人最近，最近的人最远。", "theme": "孤独与寻找"},
          {"num": 25, "text": "重复做一件事是专家，专注做重复的事是大家。", "theme": "时间与人生"},
          {"num": 26, "text": "悲剧里藏着最好的喜剧，喜剧里埋着最深的悲剧。", "theme": "生活真谛"},
          {"num": 27, "text": "幽默不是段子，是活着的态度。", "theme": "生活真谛"},
          {"num": 28, "text": "你以为的朋友，可能只是你以为。", "theme": "信任与背叛"},
          {"num": 29, "text": "文学就是那个永远等你的她。", "theme": "阅读与意义"},
          {"num": 30, "text": "真正深刻的人，说的都是家常话。", "theme": "言语与沉默"},
          {"num": 31, "text": "生活可以没有钱，但不能没有激情。", "theme": "生存与奋斗"},
          {"num": 32, "text": "人一辈子都在找，最后找到的可能是自己。", "theme": "孤独与寻找"},
          {"num": 33, "text": "伤痕是岁月的印章，盖在普通人的命运上。", "theme": "生活真谛"},
          {"num": 34, "text": "生活就像咸菜缸，越腌越有滋味。", "theme": "生活真谛"},
          {"num": 35, "text": "我们都是被生活开过玩笑的人，却还要笑着活下去。", "theme": "生活真谛"},
          {"num": 36, "text": "普通人的伟大，在于把苦日子过成了段子。", "theme": "生活真谛"},
          {"num": 37, "text": "所谓成熟，就是学会把眼泪腌成咸菜下饭。", "theme": "生活真谛"},
          {"num": 38, "text": "命运给的盐，聪明人拿来调味，愚笨的人只会喊咸。", "theme": "处世智慧"},
          {"num": 39, "text": "日子要像腌咸菜，经得起时间的压榨才能出味。", "theme": "时间与人生"},
          {"num": 40, "text": "咸的玩笑背后，是生活对我们最诚实的告白。", "theme": "核心隐喻"},
          {"num": 41, "text": "世上冲突频仍，就是边太多了。", "theme": "世事与人情"},
          {"num": 42, "text": "世上一百九十多个国家，八十多亿人；地球带着这些国家和人，以每秒六百公里的速度在宇宙狂奔，我们却毫无知觉。", "theme": "宇宙与人生"},
          {"num": 43, "text": "你划的边越多，分别心越重，对立和冲突就越多，烦恼和苦难就越没有尽头。", "theme": "世事与人情"},
          {"num": 44, "text": "真正无限的不是抽象的无边，而是那些被人为划定的边，因为它们会无限延伸出问题、冲突和复杂性。", "theme": "世事与人情"},
          {"num": 45, "text": "世界上所有的悲剧都经不起推敲，悲剧一推敲都是喜剧。", "theme": "生活真谛"},
          {"num": 46, "text": "真正的幽默不产生在喜剧，不产生在小品，真正的幽默产生在悲剧。", "theme": "生活真谛"},
          {"num": 47, "text": "一辈子只做自己喜欢做的事，并把它做好，就会取得与别人不一样的好成绩。", "theme": "时间与人生"},
          {"num": 48, "text": "这个世界什么都是假的，只有过好自己才是真的。", "theme": "独立与依靠"},
          {"num": 49, "text": "当你的善良受到委屈的时候，记得对自己说这句话：你的善良要留给那些懂得感恩的人。", "theme": "处世智慧"},
          {"num": 50, "text": "人一辈子都在寻找。你生下来要找奶，才能活下去，长大了要找爱人，找健康、找好的工作，找自己的知心朋友，最后就是找死。这其中最重要的就是，要找到一个人，和他说一句知心的话。", "theme": "孤独与寻找"}
        ]
      }
    }
  },
  yuhua: {
    name: '余华',
    books: {
      huozhe: {
        name: '活着',
        icon: 'fas fa-heart',
        quotes: [
          {"num": 1, "text": "人是为活着本身而活着，而不是为活着之外的任何事物所活着。", "theme": "生存本质"},
          {"num": 2, "text": "福贵就像田里的那头牛，只要他还活着，苦难就不会放过他。", "theme": "命运与苦难"},
          {"num": 3, "text": "没有什么比时间更具有说服力了，因为时间无需通知我们就可以改变一切。", "theme": "时间的力量"},
          {"num": 4, "text": "生活不是你活过的日子，而是你记住的日子。", "theme": "记忆与生活"},
          {"num": 5, "text": "少年去游荡，中年想掘藏，老年做和尚。", "theme": "人生阶段"},
          {"num": 6, "text": "检验一个人的标准，就是看他把时间放在了哪儿。别自欺欺人；当生命走到尽头，只有时间不会撒谎。", "theme": "时间与人生"},
          {"num": 7, "text": "人要是累得整天没力气，就不会去乱想了。", "theme": "生存与思考"},
          {"num": 8, "text": "做人不能忘记四条，话不要说错，路不要走错，门槛不要踏错，口袋不要摸错。", "theme": "处世原则"},
          {"num": 9, "text": "家珍是你的女人，不是别人的，谁也抢不走。", "theme": "爱情与坚守"},
          {"num": 10, "text": "命好不如心态好。", "theme": "心态与命运"},
          {"num": 11, "text": "以笑的方式哭，在死亡的伴随下活着。", "theme": "生存姿态"},
          {"num": 12, "text": "女人都是一个心眼，她认准的事谁也不能让她变。", "theme": "女性坚韧"},
          {"num": 13, "text": "我看着那条弯曲着通向城里的小路，听不到我儿子赤脚跑来的声音，月光照在路上，像是撒满了盐。", "theme": "悲伤与思念"},
          {"num": 14, "text": "只要一家人天天在一起，也就不在乎什么福分了。", "theme": "家庭温暖"},
          {"num": 15, "text": "日子过得又苦又累，心里反倒踏实了。", "theme": "苦中作乐"},
          {"num": 16, "text": "你千万别糊涂，死人都还想活过来，你一个大活人可不能去死。", "theme": "生命的渴望"},
          {"num": 17, "text": "人要是想死，怎么都能死。", "theme": "生死一念"},
          {"num": 18, "text": "我知道他不会和我拼命了，可他说的话就像是一把钝刀子在割我的脖子，脑袋掉不下来，倒是疼得死去活来。", "theme": "精神折磨"},
          {"num": 19, "text": "福贵的一生是一个逐渐失去的过程。", "theme": "生命体验"},
          {"num": 20, "text": "他喜欢回想过去，喜欢讲述自己，这样做的时候，他就如同站在田埂上，看着自己的过去，像看着一条河流。", "theme": "回忆与人生"}
        ]
      },
      xusanguan: {
        name: '许三观卖血记',
        icon: 'fas fa-droplet',
        quotes: [
          {"num": 1, "text": "许三观对许玉兰说：\"我卖血就是为了让你和孩子们活下去。\"", "theme": "父爱如山"},
          {"num": 2, "text": "卖血是穷人家的出路，也是穷人家的活路。", "theme": "生存手段"},
          {"num": 3, "text": "许三观卖了血，心里就踏实了，好像把什么都卖出去了，自己就轻松了。", "theme": "牺牲与救赎"},
          {"num": 4, "text": "人活一辈子，谁会没病没灾，谁没个三长两短？遇到那些倒霉的事，有准备总被没准备好。聪明人做事都给自己留一条退路。", "theme": "未雨绸缪"},
          {"num": 5, "text": "这世上只有两样东西是别人抢不走的，一是藏在心中的梦想，二是读进脑子里的书。", "theme": "精神财富"},
          {"num": 6, "text": "许三观说：\"我这个人啊，做事就喜欢做到底。\"", "theme": "执着与坚持"},
          {"num": 7, "text": "许三观在心里想：做人要有良心，我不能让别人欺负我的儿子。", "theme": "父爱的担当"},
          {"num": 8, "text": "人活在世上，有吃有穿，那是福气；没吃没穿，那是命。", "theme": "命运与知足"},
          {"num": 9, "text": "许三观卖血不是为了自己，是为了一家人。", "theme": "家庭责任"},
          {"num": 10, "text": "人要是想通了，什么事都能过去。", "theme": "心态与解脱"},
          {"num": 11, "text": "许三观坐在藤椅里，看着屋顶想：我这一辈子，就是卖血卖过来的。", "theme": "人生感慨"},
          {"num": 12, "text": "卖血是穷人最后的指望，也是穷人最后的尊严。", "theme": "生存底线"},
          {"num": 13, "text": "许三观对儿子们说：\"你们要记住，人活着，就要活得光明磊落。\"", "theme": "做人准则"},
          {"num": 14, "text": "人活着不容易，可再不容易也得活着。", "theme": "生命韧性"},
          {"num": 15, "text": "许三观卖血的时候，心里想着的不是自己，是家里人。", "theme": "无私奉献"},
          {"num": 16, "text": "做人要有骨气，不能让人看不起。", "theme": "尊严与骨气"},
          {"num": 17, "text": "许三观说：\"我卖血卖了一辈子，从来没有卖过一次冤枉血。\"", "theme": "正直为人"},
          {"num": 18, "text": "人活一辈子，总得有几个真心朋友。", "theme": "友情珍贵"},
          {"num": 19, "text": "许三观看着孩子们长大，心里想：我卖血卖得值。", "theme": "付出与收获"},
          {"num": 20, "text": "生命就像血一样，流出去了就再也回不来了。", "theme": "生命的流逝"}
        ]
      },
      xiongdi: {
        name: '兄弟',
        icon: 'fas fa-users',
        quotes: [
          {"num": 1, "text": "这是两个时代相遇以后出生的小说，前一个是文革中的故事，那是一个精神狂热、本能压抑和命运惨烈的时代，相当于欧洲的中世纪；后一个是现在的故事，那是一个伦理颠覆、浮躁纵欲和众生万象的时代，更甚于今天的欧洲。", "theme": "时代对比"},
          {"num": 2, "text": "李光头和宋钢是兄弟，也是敌人。", "theme": "兄弟情仇"},
          {"num": 3, "text": "人活着就要折腾，不折腾怎么叫活着？", "theme": "生命活力"},
          {"num": 4, "text": "宋钢说：\"兄弟之间，没有什么不能原谅的。\"", "theme": "兄弟情谊"},
          {"num": 5, "text": "李光头说：\"我活着就是为了出人头地。\"", "theme": "奋斗目标"},
          {"num": 6, "text": "人要是不要脸，天下无敌。", "theme": "厚黑之道"},
          {"num": 7, "text": "宋钢是个好人，可好人往往没有好报。", "theme": "好人命运"},
          {"num": 8, "text": "李光头说：\"我什么都没有，就是有勇气。\"", "theme": "勇气与魄力"},
          {"num": 9, "text": "这世道，好人难做，坏人当道。", "theme": "社会现实"},
          {"num": 10, "text": "宋钢对李光头说：\"你可以看不起我，但不能看不起我们的兄弟情。\"", "theme": "兄弟情深"},
          {"num": 11, "text": "人活着，总得有点追求。", "theme": "人生追求"},
          {"num": 12, "text": "李光头成功了，可他失去了最珍贵的东西。", "theme": "得与失"},
          {"num": 13, "text": "宋钢说：\"我这辈子，最骄傲的就是有你这个兄弟。\"", "theme": "兄弟之爱"},
          {"num": 14, "text": "人在江湖，身不由己。", "theme": "命运无奈"},
          {"num": 15, "text": "李光头说：\"我要让全世界都知道我是谁。\"", "theme": "自我实现"},
          {"num": 16, "text": "宋钢是个老实人，可老实人总是被欺负。", "theme": "老实人命运"},
          {"num": 17, "text": "兄弟之间，血浓于水。", "theme": "血缘亲情"},
          {"num": 18, "text": "李光头和宋钢，一个在天上，一个在地下。", "theme": "命运悬殊"},
          {"num": 19, "text": "人活着，就要活得轰轰烈烈。", "theme": "人生态度"},
          {"num": 20, "text": "宋钢死了，李光头才知道什么是真正的兄弟。", "theme": "失去才懂珍惜"}
        ]
      },
      diqitian: {
        name: '第七天',
        icon: 'fas fa-cloud',
        quotes: [
          {"num": 1, "text": "我在第七天里看到了人间的真相，也看到了人性的光辉。", "theme": "生死观"},
          {"num": 2, "text": "死亡不是终点，而是另一个开始。", "theme": "死亡哲学"},
          {"num": 3, "text": "在阴间，人人平等。", "theme": "平等理想"},
          {"num": 4, "text": "我看到了那些在人间受苦的人，在阴间终于得到了安宁。", "theme": "善恶有报"},
          {"num": 5, "text": "死亡是公平的，它对每个人都一视同仁。", "theme": "死亡平等"},
          {"num": 6, "text": "在第七天，我找到了真正的自由。", "theme": "精神自由"},
          {"num": 7, "text": "人间的苦难，在阴间都变成了故事。", "theme": "苦难叙事"},
          {"num": 8, "text": "死亡并不可怕，可怕的是活着的时候没有好好活过。", "theme": "生命意义"},
          {"num": 9, "text": "在阴间，我看到了人间看不到的真相。", "theme": "真相与谎言"},
          {"num": 10, "text": "每个人都有自己的故事，每个人的故事都是独一无二的。", "theme": "个体命运"},
          {"num": 11, "text": "死亡是一场旅行，我们都要经历。", "theme": "死亡旅程"},
          {"num": 12, "text": "在第七天，我终于明白了什么是真正的幸福。", "theme": "幸福真谛"},
          {"num": 13, "text": "人间的爱恨情仇，在阴间都变得微不足道。", "theme": "超脱生死"},
          {"num": 14, "text": "死亡是生命的一部分，我们应该坦然面对。", "theme": "生死坦然"},
          {"num": 15, "text": "在阴间，我遇到了那些我曾经失去的人。", "theme": "重逢与思念"},
          {"num": 16, "text": "每个人都有自己的归宿，不管是在人间还是在阴间。", "theme": "命运归宿"},
          {"num": 17, "text": "死亡不是结束，而是另一种开始。", "theme": "重生希望"},
          {"num": 18, "text": "在第七天，我看到了人性中最美好的一面。", "theme": "人性光辉"},
          {"num": 19, "text": "生命是短暂的，但爱却是永恒的。", "theme": "爱的永恒"},
          {"num": 20, "text": "在阴间，我终于找到了内心的平静。", "theme": "内心安宁"}
        ]
      }
    }
  }
};

const builtInAuthors = ['liuzhenyun', 'yuhua'];

function loadUserQuotes() {
  try {
    const userAuthors = localStorage.getItem('userQuoteAuthors');
    if (userAuthors) {
      const parsed = JSON.parse(userAuthors);
      Object.keys(parsed).forEach(key => {
        if (!quotesData[key]) {
          quotesData[key] = parsed[key];
        }
      });
    }
    
    const userQuotes = localStorage.getItem('userAddedQuotes');
    if (userQuotes) {
      const parsed = JSON.parse(userQuotes);
      Object.keys(parsed).forEach(authorKey => {
        if (quotesData[authorKey]) {
          Object.keys(parsed[authorKey]).forEach(bookKey => {
            if (quotesData[authorKey].books[bookKey]) {
              const existingNums = quotesData[authorKey].books[bookKey].quotes.map(q => q.num);
              const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
              
              parsed[authorKey][bookKey].forEach((quote, index) => {
                quotesData[authorKey].books[bookKey].quotes.push({
                  ...quote,
                  num: maxNum + index + 1
                });
              });
            }
          });
        }
      });
    }
  } catch (e) {
    console.error('Failed to load user quotes:', e);
  }
}

function saveUserQuotes() {
  const userAuthors = {};
  Object.keys(quotesData).forEach(key => {
    if (!builtInAuthors.includes(key)) {
      userAuthors[key] = quotesData[key];
    }
  });
  localStorage.setItem('userQuoteAuthors', JSON.stringify(userAuthors));
}

function saveUserAddedQuotes(authorKey, bookKey, quotes) {
  try {
    const userQuotes = JSON.parse(localStorage.getItem('userAddedQuotes') || '{}');
    if (!userQuotes[authorKey]) {
      userQuotes[authorKey] = {};
    }
    if (!userQuotes[authorKey][bookKey]) {
      userQuotes[authorKey][bookKey] = [];
    }
    userQuotes[authorKey][bookKey] = [...userQuotes[authorKey][bookKey], ...quotes];
    localStorage.setItem('userAddedQuotes', JSON.stringify(userQuotes));
  } catch (e) {
    console.error('Failed to save user quotes:', e);
  }
}

loadUserQuotes();

let currentQuoteAuthor = 'liuzhenyun';
let currentQuoteBook = 'yiju';
let currentQuoteTheme = 'all';
let deleteCallback = null;

function switchQuoteAuthor(author) {
  currentQuoteAuthor = author;
  currentQuoteBook = Object.keys(quotesData[author].books)[0];
  currentQuoteTheme = 'all';
  
  renderQuoteAuthorTabs();
  renderQuoteBookTabs();
  renderQuoteThemeFilter();
  renderQuotes();
}

function switchQuoteBook(book) {
  currentQuoteBook = book;
  currentQuoteTheme = 'all';
  
  document.querySelectorAll('.quotes-book-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.book === book);
  });
  
  renderQuoteThemeFilter();
  renderQuotes();
}

function filterQuoteTheme(theme) {
  currentQuoteTheme = theme;
  
  document.querySelectorAll('.quotes-theme-tag').forEach(tag => {
    tag.classList.toggle('active', tag.dataset.theme === theme);
  });
  
  renderQuotes();
}

function getCurrentQuoteData() {
  const author = quotesData[currentQuoteAuthor];
  let data = [];
  
  if (currentQuoteBook === 'all') {
    Object.keys(author.books).forEach(bookKey => {
      data = data.concat(author.books[bookKey].quotes.map((q, index) => ({
        ...q,
        bookName: author.books[bookKey].name,
        bookKey,
        quoteIndex: index
      })));
    });
  } else {
    data = author.books[currentQuoteBook].quotes.map((q, index) => ({
      ...q,
      bookName: author.books[currentQuoteBook].name,
      bookKey: currentQuoteBook,
      quoteIndex: index
    }));
  }
  
  if (currentQuoteTheme !== 'all') {
    data = data.filter(q => q.theme === currentQuoteTheme);
  }
  
  return data;
}

function getQuoteThemes() {
  const author = quotesData[currentQuoteAuthor];
  let allQuotes = [];
  
  if (currentQuoteBook === 'all') {
    Object.keys(author.books).forEach(bookKey => {
      allQuotes = allQuotes.concat(author.books[bookKey].quotes);
    });
  } else {
    allQuotes = author.books[currentQuoteBook].quotes;
  }
  
  return [...new Set(allQuotes.map(q => q.theme))];
}

function renderQuoteBookTabs() {
  const container = document.getElementById('quotes-book-tabs');
  const author = quotesData[currentQuoteAuthor];
  const books = author.books;
  
  let html = `<button class="quotes-book-tab ${currentQuoteBook === 'all' ? 'active' : ''}" data-book="all" onclick="switchQuoteBook('all')">
    <i class="fas fa-layer-group"></i> 全部书籍
  </button>`;
  
  Object.keys(books).forEach(bookKey => {
    const book = books[bookKey];
    html += `<button class="quotes-book-tab ${currentQuoteBook === bookKey ? 'active' : ''}" data-book="${bookKey}" onclick="switchQuoteBook('${bookKey}')">
      <i class="${book.icon}"></i> ${book.name}
    </button>`;
  });
  
  container.innerHTML = html;
}

function renderQuoteThemeFilter() {
  const container = document.getElementById('quotes-theme-filter');
  const themes = getQuoteThemes();
  
  let html = `<button class="quotes-theme-tag ${currentQuoteTheme === 'all' ? 'active' : ''}" data-theme="all" onclick="filterQuoteTheme('all')">全部主题</button>`;
  themes.forEach(theme => {
    html += `<button class="quotes-theme-tag ${currentQuoteTheme === theme ? 'active' : ''}" data-theme="${theme}" onclick="filterQuoteTheme('${theme}')">${theme}</button>`;
  });
  
  container.innerHTML = html;
}

function renderQuotes() {
  const data = getCurrentQuoteData();
  const container = document.getElementById('quotes-list');
  const countEl = document.getElementById('quotes-count');
  
  const cardColors = [
    'rgba(79, 70, 229, 0.06)',
    'rgba(249, 115, 22, 0.06)',
    'rgba(6, 182, 212, 0.06)',
    'rgba(236, 72, 153, 0.06)',
    'rgba(16, 185, 129, 0.06)'
  ];
  
  if (countEl) {
    countEl.textContent = data.length;
  }
  
  if (data.length === 0) {
    container.innerHTML = `
      <div class="quotes-empty">
        <i class="fas fa-search"></i>
        <div>没有找到匹配的语录</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = data.map((item, index) => {
    const bgColor = cardColors[index % cardColors.length];
    const authorName = quotesData[currentQuoteAuthor]?.name || '';
    return `
      <div class="quote-card" data-index="${index}" style="background: ${bgColor};">
        <div class="quote-header">
          <span class="quote-num">#${item.num}</span>
          <span class="quote-theme">${item.theme}</span>
        </div>
        <div class="quote-text">${item.text}</div>
        <div class="quote-footer">
          <div class="quote-author-info">
            <span class="quote-author">${authorName}</span>
            <span class="quote-book">《${item.bookName}》</span>
          </div>
          <div class="quote-actions">
            <button class="quote-btn" onclick="copyQuote(${index})">
              <i class="fas fa-copy"></i> 复制
            </button>
            <button class="quote-btn quote-delete-btn" onclick="deleteQuote('${item.bookKey}', ${item.quoteIndex})">
              <i class="fas fa-trash"></i> 删除
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function copyQuote(index) {
  const data = getCurrentQuoteData();
  const item = data[index];
  const text = `${item.text} —— ${quotesData[currentQuoteAuthor].name}《${item.bookName}》`;
  
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target.closest('.quote-btn');
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fas fa-check"></i>已复制';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '<i class="fas fa-copy"></i>复制';
    }, 1500);
  });
}

function copyAllQuotes() {
  const data = getCurrentQuoteData();
  const authorName = quotesData[currentQuoteAuthor].name;
  const text = data.map((item, i) => `${i + 1}. ${item.text} ——${authorName}《${item.bookName}》`).join('\n\n');
  
  navigator.clipboard.writeText(text).then(() => {
    showToast(`已复制 ${data.length} 条语录到剪贴板`, 'success');
  });
}

function exportQuotes() {
  const data = getCurrentQuoteData();
  const authorName = quotesData[currentQuoteAuthor].name;
  const text = data.map((item, i) => `${i + 1}. [${item.theme}] ${item.text}`).join('\n\n');
  
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${authorName}-语录.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('导出成功', 'success');
}

function renderQuoteAuthorTabs() {
  const container = document.getElementById('quotes-author-tabs');
  const colors = [
    'linear-gradient(135deg, #8B4513, #A0522D)',
    'linear-gradient(135deg, #4F46E5, #7C3AED)',
    'linear-gradient(135deg, #EF4444, #F97316)',
    'linear-gradient(135deg, #06B6D4, #10B981)',
    'linear-gradient(135deg, #8B5CF6, #EC4899)'
  ];
  
  container.innerHTML = Object.keys(quotesData).map((key, index) => {
    const author = quotesData[key];
    const isActive = key === currentQuoteAuthor;
    const color = author.color || colors[index % colors.length];
    const firstChar = author.name.charAt(0);
    const isBuiltIn = builtInAuthors.includes(key);
    
    return `
      <div class="quotes-author-tab-wrapper">
        <button class="quotes-author-tab ${isActive ? 'active' : ''}" onclick="switchQuoteAuthor('${key}')">
          <div class="quotes-author-avatar" style="background: ${color};">${firstChar}</div>
          <span>${author.name}</span>
        </button>
        ${!isBuiltIn ? `<button class="author-delete-btn" onclick="deleteAuthor('${key}')"><i class="fas fa-times"></i></button>` : ''}
      </div>
    `;
  }).join('');
}

function initQuotes() {
  renderQuoteAuthorTabs();
  renderQuoteBookTabs();
  renderQuoteThemeFilter();
  renderQuotes();
}

function openAddAuthorModal() {
  document.getElementById('add-author-modal').style.display = 'flex';
  document.getElementById('author-name').value = '';
  document.getElementById('author-book').value = '';
  document.querySelectorAll('.color-option').forEach(opt => {
    opt.classList.remove('selected');
    opt.onclick = function() {
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
    };
  });
  document.querySelector('.color-option:first-child').classList.add('selected');
}

function closeAddAuthorModal() {
  document.getElementById('add-author-modal').style.display = 'none';
}

function addAuthor() {
  const name = document.getElementById('author-name').value.trim();
  if (!name) {
    showToast('请输入名人姓名', 'error');
    return;
  }
  
  const color = document.querySelector('.color-option.selected').dataset.color;
  const bookInput = document.getElementById('author-book').value.trim();
  const books = {};
  
  if (bookInput) {
    bookInput.split(',').forEach((bookName, index) => {
      const bookKey = 'book' + (index + 1);
      books[bookKey] = {
        name: bookName.trim(),
        icon: 'fas fa-book',
        quotes: []
      };
    });
  } else {
    books['book1'] = {
      name: '作品集',
      icon: 'fas fa-book',
      quotes: []
    };
  }
  
  const authorKey = name.toLowerCase().replace(/\s+/g, '');
  
  if (quotesData[authorKey]) {
    showToast('该名人已存在', 'error');
    return;
  }
  
  quotesData[authorKey] = {
    name,
    color,
    books
  };
  
  saveUserQuotes();
  closeAddAuthorModal();
  switchQuoteAuthor(authorKey);
  showToast('名人添加成功', 'success');
}

function deleteAuthor(authorKey) {
  const authorName = quotesData[authorKey].name;
  document.getElementById('confirm-message').textContent = `确定要删除名人「${authorName}」吗？此操作不可恢复。`;
  deleteCallback = () => {
    delete quotesData[authorKey];
    saveUserQuotes();
    
    const authors = Object.keys(quotesData);
    if (authors.length === 0) {
      currentQuoteAuthor = null;
    } else if (currentQuoteAuthor === authorKey) {
      currentQuoteAuthor = authors[0];
      currentQuoteBook = Object.keys(quotesData[currentQuoteAuthor].books)[0];
    }
    
    renderQuoteAuthorTabs();
    if (currentQuoteAuthor) {
      renderQuoteBookTabs();
      renderQuoteThemeFilter();
      renderQuotes();
    }
    
    closeConfirmModal();
    showToast('名人删除成功', 'success');
  };
  document.getElementById('confirm-modal').style.display = 'flex';
}

function openAddQuoteModal() {
  const bookSelect = document.getElementById('quote-book');
  bookSelect.innerHTML = '';
  
  const books = quotesData[currentQuoteAuthor].books;
  Object.keys(books).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = books[key].name;
    bookSelect.appendChild(option);
  });
  
  document.getElementById('quote-text').value = '';
  document.getElementById('quote-theme').value = '';
  document.getElementById('add-quote-modal').style.display = 'flex';
}

function closeAddQuoteModal() {
  document.getElementById('add-quote-modal').style.display = 'none';
}

function addQuote() {
  const book = document.getElementById('quote-book').value;
  const text = document.getElementById('quote-text').value.trim();
  const theme = document.getElementById('quote-theme').value.trim() || '未分类';
  
  if (!text) {
    showToast('请输入语录内容', 'error');
    return;
  }
  
  const bookData = quotesData[currentQuoteAuthor].books[book];
  const newNum = bookData.quotes.length + 1;
  
  const newQuote = {
    num: newNum,
    text,
    theme
  };
  
  bookData.quotes.push(newQuote);
  
  if (builtInAuthors.includes(currentQuoteAuthor)) {
    saveUserAddedQuotes(currentQuoteAuthor, book, [newQuote]);
  } else {
    saveUserQuotes();
  }
  
  closeAddQuoteModal();
  renderQuotes();
  updateQuoteCount();
  showToast('语录添加成功', 'success');
}

function deleteQuote(bookKey, quoteIndex) {
  const bookData = quotesData[currentQuoteAuthor].books[bookKey];
  const quoteText = bookData.quotes[quoteIndex].text.substring(0, 30) + (bookData.quotes[quoteIndex].text.length > 30 ? '...' : '');
  
  document.getElementById('confirm-message').textContent = `确定要删除这条语录吗？\n「${quoteText}」`;
  deleteCallback = () => {
    bookData.quotes.splice(quoteIndex, 1);
    
    bookData.quotes.forEach((quote, index) => {
      quote.num = index + 1;
    });
    
    saveUserQuotes();
    renderQuotes();
    updateQuoteCount();
    closeConfirmModal();
    showToast('语录删除成功', 'success');
  };
  document.getElementById('confirm-modal').style.display = 'flex';
}

function closeConfirmModal() {
  document.getElementById('confirm-modal').style.display = 'none';
  deleteCallback = null;
}

function confirmDelete() {
  if (deleteCallback) {
    deleteCallback();
  }
}

function updateQuoteCount() {
  const countEl = document.getElementById('quotes-count');
  if (countEl) {
    countEl.textContent = getCurrentQuoteData().length;
  }
}

function handleContactSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;
  
  const subject = encodeURIComponent(`来自${name}的留言`);
  const body = encodeURIComponent(`姓名：${name}\n邮箱：${email}\n留言内容：\n${message}`);
  
  const mailtoLink = `mailto:jensonzhang@126.com?subject=${subject}&body=${body}`;
  
  window.location.href = mailtoLink;
  
  const contactData = {
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };
  
  let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  messages.push(contactData);
  localStorage.setItem('contactMessages', JSON.stringify(messages));
  
  event.target.reset();
  
  showToast('已打开邮件客户端，请发送邮件', 'success');
}

// ===== 旅游攻略模块 =====
const defaultTravelGuides = [
  {
    id: 1,
    title: '北京三日游经典路线',
    city: 'beijing',
    image: '',
    days: 3,
    route: 'Day1: 天安门广场 → 故宫博物院 → 景山公园\nDay2: 颐和园 → 圆明园 → 北京大学\nDay3: 八达岭长城 → 明十三陵',
    desc: '北京三日游经典路线，涵盖了北京最具代表性的景点。故宫是必去之地，建议提前预约门票。长城建议选择八达岭段，交通方便。',
    tips: '1. 故宫周一闭馆，注意安排时间\n2. 长城门票建议提前网上购买\n3. 北京地铁交通发达，建议办理交通卡',
    createdAt: Date.now()
  },
  {
    id: 2,
    title: '上海美食与夜景之旅',
    city: 'shanghai',
    image: '',
    days: 2,
    route: 'Day1: 南京路步行街 → 外滩 → 东方明珠塔\nDay2: 豫园 → 田子坊 → 陆家嘴',
    desc: '上海两日游，体验魔都的繁华与美食。外滩夜景是必看的，建议傍晚去，可以看到白天和夜晚两种景色。',
    tips: '1. 外滩人流量大，注意安全\n2. 豫园小吃推荐：南翔小笼包、蟹壳黄\n3. 陆家嘴三件套拍照打卡',
    createdAt: Date.now()
  },
  {
    id: 3,
    title: '成都美食休闲之旅',
    city: 'chengdu',
    image: '',
    days: 4,
    route: 'Day1: 宽窄巷子 → 锦里 → 武侯祠\nDay2: 大熊猫基地 → 春熙路 → 太古里\nDay3: 都江堰 → 青城山\nDay4: 人民公园喝茶 → 玉林路小酒馆',
    desc: '成都四日游，感受慢生活的魅力。大熊猫基地是亲子游的好地方，都江堰和青城山一日游也非常值得。',
    tips: '1. 大熊猫基地建议早上去，熊猫比较活跃\n2. 成都火锅推荐：大龙燚、小龙坎\n3. 人民公园鹤鸣茶社体验盖碗茶',
    createdAt: Date.now()
  },
  {
    id: 4,
    title: '杭州西湖深度游',
    city: 'hangzhou',
    image: '',
    days: 3,
    route: 'Day1: 西湖十景 → 雷峰塔 → 苏堤\nDay2: 灵隐寺 → 飞来峰 → 龙井村\nDay3: 西溪湿地 → 河坊街 → 南宋御街',
    desc: '杭州三日游，漫步西湖，感受江南水乡的韵味。西湖十景各有特色，建议租自行车环湖游览。',
    tips: '1. 灵隐寺香火旺盛，建议提前预约\n2. 龙井村可以品尝正宗西湖龙井\n3. 西湖音乐喷泉值得一看',
    createdAt: Date.now()
  }
];

let currentTravelCity = 'all';

const travelCityNames = {
  beijing: '北京',
  shanghai: '上海',
  chengdu: '成都',
  hangzhou: '杭州',
  other: '其他'
};

function getTravelGuides() {
  const saved = localStorage.getItem('travelGuides');
  if (saved) {
    return JSON.parse(saved);
  }
  return defaultTravelGuides;
}

function saveTravelGuides(guides) {
  localStorage.setItem('travelGuides', JSON.stringify(guides));
}

function switchTravelCity(city) {
  currentTravelCity = city;
  
  document.querySelectorAll('.travel-city-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  renderTravelGuides();
}

function renderTravelGuides() {
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
    <div class="travel-card" id="travel-card-${guide.id}">
      ${guide.image ? `<div class="travel-card-image"><img src="${guide.image}" alt="${guide.title}"></div>` : ''}
      <div class="travel-card-content">
        <div class="travel-card-header">
          <h3 class="travel-card-title">${guide.title}</h3>
          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <span class="travel-card-city"><i class="fas fa-map-marker-alt"></i> ${travelCityNames[guide.city]}</span>
            ${guide.days ? `<span class="travel-card-days"><i class="fas fa-calendar"></i> ${guide.days}天</span>` : ''}
          </div>
        </div>
        <div class="travel-card-details" id="card-details-${guide.id}">
          <div class="travel-route">
            <div class="travel-route-title"><i class="fas fa-route"></i> 导航路线</div>
            <div class="travel-route-content">${guide.route}</div>
          </div>
          ${guide.desc ? `<div class="travel-desc">${guide.desc}</div>` : ''}
          ${guide.tips ? `
            <div class="travel-tips">
              <div class="travel-tips-title"><i class="fas fa-lightbulb"></i> 注意事项</div>
              <div class="travel-tips-content">${guide.tips}</div>
            </div>
          ` : ''}
        </div>
        <div class="travel-card-actions">
          <button class="travel-save-btn" onclick="saveTravelGuideAsImage(${guide.id})">
            <i class="fas fa-download"></i> 保存图片
          </button>
          <button class="travel-edit-btn" onclick="editTravelGuide(${guide.id})">
            <i class="fas fa-edit"></i> 修改
          </button>
          <button class="travel-delete-btn" onclick="deleteTravelGuide(${guide.id})">
            <i class="fas fa-trash"></i> 删除
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleTravelCard(id) {
  const details = document.getElementById('card-details-' + id);
  const toggle = document.getElementById('toggle-' + id);
  
  if (details && toggle) {
    details.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
  }
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
      document.getElementById('travel-days').value = '';
      document.getElementById('travel-route').value = '';
      document.getElementById('travel-desc').value = '';
      document.getElementById('travel-tips').value = '';
      removeTravelImagePreview();
      
      submitBtn.textContent = '添加攻略';
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
  document.getElementById('travel-days').value = guide.days || '';
  document.getElementById('travel-route').value = guide.route;
  document.getElementById('travel-desc').value = guide.desc || '';
  document.getElementById('travel-tips').value = guide.tips || '';
  
  if (guide.image) {
    document.getElementById('travel-image-url').value = guide.image;
    const preview = document.getElementById('travel-image-preview');
    preview.innerHTML = `
      <img src="${guide.image}" alt="预览">
      <button class="travel-image-preview-remove" onclick="removeTravelImagePreview()">
        <i class="fas fa-times"></i>
      </button>
    `;
    preview.style.display = 'block';
  }
  
  const submitBtn = document.getElementById('travel-submit');
  submitBtn.textContent = '保存修改';
  submitBtn.dataset.editId = id;
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleTravelImageUpload(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('travel-image-preview');
    const imageUrlInput = document.getElementById('travel-image-url');
    
    imageUrlInput.value = e.target.result;
    preview.innerHTML = `
      <img src="${e.target.result}" alt="预览">
      <button class="travel-image-preview-remove" onclick="removeTravelImagePreview()">
        <i class="fas fa-times"></i>
      </button>
    `;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function removeTravelImagePreview() {
  const preview = document.getElementById('travel-image-preview');
  const imageUrlInput = document.getElementById('travel-image-url');
  const imageFileInput = document.getElementById('travel-image-file');
  
  preview.style.display = 'none';
  preview.innerHTML = '';
  imageUrlInput.value = '';
  imageFileInput.value = '';
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
  
  if (!title || !route) {
    showToast('请填写攻略标题和导航路线', 'warning');
    return;
  }
  
  const submitBtn = document.getElementById('travel-submit');
  const editId = submitBtn.dataset.editId;
  
  const guides = getTravelGuides();
  
  if (editId) {
    const index = guides.findIndex(g => g.id == editId);
    if (index !== -1) {
      guides[index] = {
        ...guides[index],
        title: title,
        city: city,
        image: image,
        days: days,
        route: route,
        desc: desc,
        tips: tips,
        updatedAt: Date.now()
      };
      saveTravelGuides(guides);
      showToast('✓ 攻略修改成功', 'success');
    }
    
    submitBtn.textContent = '添加攻略';
    delete submitBtn.dataset.editId;
    
    renderTravelGuides();
    
    setTimeout(() => {
      const card = document.getElementById('travel-card-' + editId);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    return;
  } else {
    const newGuide = {
      id: Date.now(),
      title: title,
      city: city,
      image: image,
      days: days,
      route: route,
      desc: desc,
      tips: tips,
      createdAt: Date.now()
    };
    
    guides.unshift(newGuide);
    saveTravelGuides(guides);
    showToast('✓ 攻略添加成功', 'success');
  }
  
  document.getElementById('travel-title').value = '';
  document.getElementById('travel-city').value = 'beijing';
  document.getElementById('travel-days').value = '';
  document.getElementById('travel-route').value = '';
  document.getElementById('travel-desc').value = '';
  document.getElementById('travel-tips').value = '';
  removeTravelImagePreview();
  
  renderTravelGuides();
}

function deleteTravelGuide(id) {
  if (!confirm('确定要删除这条攻略吗？')) {
    return;
  }
  
  const guides = getTravelGuides();
  const updated = guides.filter(g => g.id !== id);
  saveTravelGuides(updated);
  
  renderTravelGuides();
  showToast('✓ 攻略已删除', 'success');
}

function saveTravelGuideAsImage(id) {
  const guides = getTravelGuides();
  const guide = guides.find(g => g.id === id);
  if (!guide) {
    showToast('未找到攻略', 'error');
    return;
  }
  
  showToast('正在生成图片，请稍候...', 'info');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const padding = 40;
  const lineHeight = 32;
  const titleFontSize = 28;
  const subtitleFontSize = 16;
  const contentFontSize = 15;
  const routeFontSize = 14;
  const maxTextWidth = canvas.width - padding * 2;
  
  let imageHeight = 0;
  let imageLoaded = false;
  
  const loadImage = () => {
    if (!guide.image) {
      imageLoaded = true;
      generateCanvas();
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageHeight = Math.min(300, img.height * (600 / img.width));
      imageLoaded = true;
      generateCanvas();
    };
    img.onerror = () => {
      imageLoaded = true;
      generateCanvas();
    };
    img.src = guide.image;
  };
  
  const calculateLines = (text, fontSize) => {
    ctx.font = `${fontSize}px 'Microsoft YaHei', sans-serif`;
    const words = text.split('');
    let lines = 1;
    let currentLine = '';
    const maxWidth = 600;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = currentLine + words[n];
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && n > 0) {
        lines++;
        currentLine = words[n];
      } else {
        currentLine = testLine;
      }
    }
    return lines;
  };
  
  const generateCanvas = () => {
    let contentHeight = padding * 2;
    
    contentHeight += titleFontSize + 20;
    
    contentHeight += lineHeight + 10;
    
    contentHeight += lineHeight * 2 + 20;
    
    if (guide.image) {
      contentHeight += imageHeight + 20;
    }
    
    contentHeight += lineHeight + 15;
    
    const routeLines = guide.route.split('\n').length;
    contentHeight += routeLines * lineHeight + 20;
    
    if (guide.desc) {
      const descLines = calculateLines(guide.desc, contentFontSize);
      contentHeight += lineHeight + 15 + descLines * lineHeight + 20;
    }
    
    if (guide.tips) {
      contentHeight += lineHeight + 15;
      const tipsLines = guide.tips.split('\n').length;
      contentHeight += tipsLines * lineHeight + 20;
    }
    
    contentHeight += 60;
    
    canvas.width = 680;
    canvas.height = Math.max(600, contentHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#f0f4f8';
    ctx.fillRect(0, 0, canvas.width, 100);
    
    ctx.fillStyle = '#3B82F6';
    ctx.font = `bold ${titleFontSize}px 'Microsoft YaHei', sans-serif`;
    ctx.fillText(guide.title, padding, padding + titleFontSize - 18);
    
    ctx.fillStyle = '#64748b';
    ctx.font = `${subtitleFontSize}px 'Microsoft YaHei', sans-serif`;
    let tagX = padding;
    ctx.fillText(`📍 ${travelCityNames[guide.city]}`, tagX, padding + titleFontSize + 8);
    tagX += ctx.measureText(`📍 ${travelCityNames[guide.city]}`).width + 20;
    if (guide.days) {
      ctx.fillText(`📅 ${guide.days}天`, tagX, padding + titleFontSize + 8);
    }
    
    let currentY = padding + titleFontSize + lineHeight * 2 + 20;
    
    if (guide.image && imageHeight > 0) {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(padding, currentY, canvas.width - padding * 2, imageHeight);
      
      try {
        const img = new Image();
        img.src = guide.image;
        const drawImg = () => {
          const imgWidth = canvas.width - padding * 2;
          const imgHeight = imageHeight;
          ctx.drawImage(img, padding, currentY, imgWidth, imgHeight);
          currentY += imageHeight + 20;
          drawContent();
        };
        if (img.complete) {
          drawImg();
        } else {
          img.onload = drawImg;
          img.onerror = drawContent;
        }
      } catch (e) {
        currentY += imageHeight + 20;
        drawContent();
      }
      return;
    }
    
    drawContent();
    
    function drawContent() {
      ctx.fillStyle = '#3B82F6';
      ctx.font = `bold ${contentFontSize}px 'Microsoft YaHei', sans-serif`;
      ctx.fillText('🗺️ 导航路线', padding, currentY);
      currentY += lineHeight;
      
      ctx.fillStyle = '#1e293b';
      ctx.font = `${routeFontSize}px 'Microsoft YaHei', sans-serif`;
      guide.route.split('\n').forEach(line => {
        ctx.fillText(line.trim(), padding, currentY);
        currentY += lineHeight;
      });
      currentY += 10;
      
      if (guide.desc) {
        ctx.fillStyle = '#3B82F6';
        ctx.font = `bold ${contentFontSize}px 'Microsoft YaHei', sans-serif`;
        ctx.fillText('📝 详细攻略', padding, currentY);
        currentY += lineHeight;
        
        ctx.fillStyle = '#475569';
        ctx.font = `${contentFontSize}px 'Microsoft YaHei', sans-serif`;
        const descLines = wrapText(ctx, guide.desc, padding, currentY, 600, lineHeight);
        currentY += descLines * lineHeight + 20;
      }
      
      if (guide.tips) {
        ctx.fillStyle = '#FBBF24';
        ctx.font = `bold ${contentFontSize}px 'Microsoft YaHei', sans-serif`;
        ctx.fillText('💡 注意事项', padding, currentY);
        currentY += lineHeight;
        
        ctx.fillStyle = '#475569';
        ctx.font = `${contentFontSize}px 'Microsoft YaHei', sans-serif`;
        guide.tips.split('\n').forEach(line => {
          ctx.fillText(line.trim(), padding, currentY);
          currentY += lineHeight;
        });
      }
      
      ctx.fillStyle = '#1E40AF';
      ctx.font = 'bold 20px "Microsoft YaHei", sans-serif';
      ctx.shadowColor = 'rgba(30, 64, 175, 0.4)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      const watermarkText = '世界很大，你值得出去看看';
      ctx.fillText(watermarkText, canvas.width / 2 - ctx.measureText(watermarkText).width / 2, canvas.height - 35);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      const link = document.createElement('a');
      link.download = `${guide.title}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      showToast('✓ 攻略图片已保存', 'success');
    }
  };
  
  loadImage();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split('');
  let line = '';
  let lines = 1;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n];
      y += lineHeight;
      lines++;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return lines;
}

document.addEventListener('DOMContentLoaded', function() {
  renderTravelGuides();
});