/**
 * 苹果风格主脚本文件
 * 功能：页面导航切换、主题切换、通用工具函数
 */

let currentSection = 'home';

function showSection(sectionId) {
  currentSection = sectionId;
  
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });
  
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = 'block';
  }
  
  document.querySelectorAll('.nav-item a').forEach(link => {
    link.classList.remove('active');
  });
  
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link && (link.getAttribute('href') === `style2.html#${sectionId}` || link.getAttribute('onclick')?.includes(sectionId))) {
      link.classList.add('active');
    }
  });
  
  if (sectionId === 'toolbox') {
    selectTool('json2yaml');
  }
  
  if (sectionId === 'quotes') {
    initQuotes();
  }
  
  if (sectionId === 'notes') {
    initNotes();
  }
  
  if (sectionId === 'recommendations') {
    initRecommendations();
  }
  
  if (sectionId === 'travel') {
    initTravel();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectTool(toolId) {
  document.querySelectorAll('.tool-panel').forEach(content => {
    content.style.display = 'none';
  });
  
  const targetTool = document.getElementById(`tool-${toolId}`);
  if (targetTool) {
    targetTool.style.display = 'block';
  }
  
  document.querySelectorAll('.tool-nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const navBtn = document.querySelector(`.tool-nav-btn[onclick="selectTool('${toolId}')"]`);
  if (navBtn) {
    navBtn.classList.add('active');
  }
  
  const sidebar = document.getElementById('toolSidebar');
  if (sidebar && window.innerWidth <= 768) {
    sidebar.classList.remove('active');
  }
}

function toggleMobileToolMenu() {
  const sidebar = document.getElementById('toolSidebar');
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.select();
  element.setSelectionRange(0, 99999);
  
  navigator.clipboard.writeText(element.value).then(() => {
    showToast('已复制到剪贴板');
  }).catch(err => {
    showToast('复制失败，请手动复制');
  });
}

function clearTool(toolId) {
  const inputs = document.querySelectorAll(`#tool-${toolId} input, #tool-${toolId} textarea`);
  inputs.forEach(input => {
    input.value = '';
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  initQuotes();
  initNotes();
  initRecommendations();
  initTravel();
  initProjects();
  initBlog();
  
  const currentYear = document.getElementById('currentYear');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
  
  const hash = window.location.hash.substring(1);
  if (hash && document.getElementById(hash)) {
    showSection(hash);
  }
});

function toggleTheme() {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  
  if (html.getAttribute('data-theme') === 'dark') {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }
}

let quotesData = [];
let currentAuthorFilter = 'all';
let currentBookFilter = 'all';
let currentThemeFilter = 'all';

function initQuotes() {
  const saved = localStorage.getItem('quotesData');
  if (saved) {
    quotesData = JSON.parse(saved);
  } else {
    quotesData = [
      { id: 1, author: '刘震云', book: '一句顶一万句', content: '过日子是过以后，不是过以前', theme: '人生' },
      { id: 2, author: '刘震云', book: '一句顶一万句', content: '世界上最可怕的事，是你不知道自己想要什么', theme: '人生' },
      { id: 3, author: '余华', book: '活着', content: '人是为活着本身而活着，而不是为活着之外的任何事物所活着', theme: '生命' },
      { id: 4, author: '余华', book: '活着', content: '少年去游荡，中年想掘藏，老年做和尚', theme: '人生' },
      { id: 5, author: '余华', book: '许三观卖血记', content: '事情都是被逼出来的，人只有被逼到绝路上，才会有办法', theme: '生存' }
    ];
    localStorage.setItem('quotesData', JSON.stringify(quotesData));
  }
  renderQuotes();
  renderAuthorTabs();
  renderBookTabs();
  renderThemeFilter();
}

function renderQuotes() {
  const list = document.getElementById('quotes-list');
  const count = document.getElementById('quotes-count');
  
  let filtered = quotesData;
  
  if (currentAuthorFilter !== 'all') {
    filtered = filtered.filter(q => q.author === currentAuthorFilter);
  }
  if (currentBookFilter !== 'all') {
    filtered = filtered.filter(q => q.book === currentBookFilter);
  }
  if (currentThemeFilter !== 'all') {
    filtered = filtered.filter(q => q.theme === currentThemeFilter);
  }
  
  count.textContent = filtered.length;
  
  const colors = ['purple', 'orange', 'cyan', 'pink', 'green'];
  
  list.innerHTML = filtered.map((quote, index) => {
    const color = colors[index % colors.length];
    return `
      <div class="quotes-card ${color}">
        <div class="quotes-content">"${quote.content}"</div>
        <div class="quotes-author-name">${quote.author}</div>
        <div class="quotes-book-name">《${quote.book}》</div>
        <div class="quotes-theme-tags">
          <span class="quotes-theme-tag">${quote.theme}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderAuthorTabs() {
  const authors = [...new Set(quotesData.map(q => q.author))];
  const container = document.getElementById('quotes-author-tabs');
  
  container.innerHTML = `
    <button class="quotes-author-tab ${currentAuthorFilter === 'all' ? 'active' : ''}" onclick="filterQuotesByAuthor('all')">全部</button>
    ${authors.map(author => `
      <button class="quotes-author-tab ${currentAuthorFilter === author ? 'active' : ''}" onclick="filterQuotesByAuthor('${author}')">
        ${author}
      </button>
    `).join('')}
  `;
}

function filterQuotesByAuthor(author) {
  currentAuthorFilter = author;
  renderQuotes();
  renderAuthorTabs();
}

function renderBookTabs() {
  const books = [...new Set(quotesData.map(q => q.book))];
  const container = document.getElementById('quotes-book-tabs');
  
  container.innerHTML = `
    <button class="quotes-book-tab ${currentBookFilter === 'all' ? 'active' : ''}" onclick="filterQuotesByBook('all')">全部书籍</button>
    ${books.map(book => `
      <button class="quotes-book-tab ${currentBookFilter === book ? 'active' : ''}" onclick="filterQuotesByBook('${book}')">${book}</button>
    `).join('')}
  `;
}

function filterQuotesByBook(book) {
  currentBookFilter = book;
  renderQuotes();
  renderBookTabs();
}

function renderThemeFilter() {
  const themes = [...new Set(quotesData.map(q => q.theme))];
  const container = document.getElementById('quotes-theme-filter');
  
  container.innerHTML = `
    <button class="quotes-theme-tag-item ${currentThemeFilter === 'all' ? 'active' : ''}" onclick="filterQuotesByTheme('all')">全部主题</button>
    ${themes.map(theme => `
      <button class="quotes-theme-tag-item ${currentThemeFilter === theme ? 'active' : ''}" onclick="filterQuotesByTheme('${theme}')">${theme}</button>
    `).join('')}
  `;
}

function filterQuotesByTheme(theme) {
  currentThemeFilter = theme;
  renderQuotes();
  renderThemeFilter();
}

function openAddAuthorModal() {
  document.getElementById('add-author-modal').style.display = 'flex';
}

function closeAddAuthorModal() {
  document.getElementById('add-author-modal').style.display = 'none';
}

function addAuthor() {
  const name = document.getElementById('author-name').value.trim();
  if (!name) return;
  
  closeAddAuthorModal();
  showToast('名人添加成功');
}

function openAddQuoteModal() {
  document.getElementById('add-quote-modal').style.display = 'flex';
  const authorSelect = document.getElementById('quote-author');
  const authors = [...new Set(quotesData.map(q => q.author))];
  authorSelect.innerHTML = authors.map(a => `<option value="${a}">${a}</option>`).join('');
}

function closeAddQuoteModal() {
  document.getElementById('add-quote-modal').style.display = 'none';
}

function addQuote() {
  const author = document.getElementById('quote-author').value;
  const content = document.getElementById('quote-content').value.trim();
  const book = document.getElementById('quote-book').value.trim() || '未知';
  const theme = document.getElementById('quote-theme').value.trim() || '人生';
  
  if (!content) return;
  
  quotesData.push({
    id: Date.now(),
    author,
    content,
    book,
    theme
  });
  
  localStorage.setItem('quotesData', JSON.stringify(quotesData));
  closeAddQuoteModal();
  renderQuotes();
  renderAuthorTabs();
  renderBookTabs();
  renderThemeFilter();
  showToast('语录添加成功');
}

function copyAllQuotes() {
  let filtered = quotesData;
  if (currentAuthorFilter !== 'all') filtered = filtered.filter(q => q.author === currentAuthorFilter);
  if (currentBookFilter !== 'all') filtered = filtered.filter(q => q.book === currentBookFilter);
  if (currentThemeFilter !== 'all') filtered = filtered.filter(q => q.theme === currentThemeFilter);
  
  const text = filtered.map(q => `【${q.author} - 《${q.book}》】${q.content}`).join('\n\n');
  navigator.clipboard.writeText(text).then(() => {
    showToast('已复制全部语录');
  });
}

function exportQuotes() {
  let filtered = quotesData;
  if (currentAuthorFilter !== 'all') filtered = filtered.filter(q => q.author === currentAuthorFilter);
  if (currentBookFilter !== 'all') filtered = filtered.filter(q => q.book === currentBookFilter);
  if (currentThemeFilter !== 'all') filtered = filtered.filter(q => q.theme === currentThemeFilter);
  
  const text = filtered.map(q => `【${q.author} - 《${q.book}》】${q.content}`).join('\n\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.txt';
  a.click();
  URL.revokeObjectURL(url);
}

let notesData = [];
let notesSortByTime = true;

function initNotes() {
  const saved = localStorage.getItem('notesData');
  if (saved) {
    notesData = JSON.parse(saved);
  }
  renderNotes();
}

function renderNotes() {
  const list = document.getElementById('notes-list');
  const count = document.getElementById('notes-count');
  const empty = document.getElementById('notes-empty');
  
  if (!notesSortByTime) {
    notesData.sort((a, b) => b.timestamp - a.timestamp);
  }
  
  count.textContent = notesData.length;
  
  if (notesData.length === 0) {
    list.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  
  list.style.display = 'grid';
  empty.style.display = 'none';
  
  list.innerHTML = notesData.map(note => `
    <div class="notes-card">
      <div class="notes-content">${note.content}</div>
      <div class="notes-time">${new Date(note.timestamp).toLocaleString('zh-CN')}</div>
      <div class="notes-actions">
        <button class="notes-delete-btn" onclick="deleteNote(${note.id})">删除</button>
      </div>
    </div>
  `).join('');
}

function addNote() {
  const input = document.getElementById('note-input');
  const content = input.value.trim();
  
  if (!content) return;
  
  notesData.unshift({
    id: Date.now(),
    content,
    timestamp: Date.now()
  });
  
  localStorage.setItem('notesData', JSON.stringify(notesData));
  input.value = '';
  renderNotes();
  showToast('添加成功');
}

function deleteNote(id) {
  notesData = notesData.filter(n => n.id !== id);
  localStorage.setItem('notesData', JSON.stringify(notesData));
  renderNotes();
}

function toggleSortNotes() {
  notesSortByTime = !notesSortByTime;
  const label = document.getElementById('sort-label');
  label.textContent = notesSortByTime ? '按时间排序' : '按内容排序';
  renderNotes();
}

let recommendationsData = [];

function initRecommendations() {
  const saved = localStorage.getItem('recommendationsData');
  if (saved) {
    recommendationsData = JSON.parse(saved);
  } else {
    recommendationsData = [
      { id: 1, title: 'VS Code', category: 'tool', desc: '强大的代码编辑器，丰富的插件生态', url: 'https://code.visualstudio.com' },
      { id: 2, title: 'Notion', category: 'tool', desc: '全能笔记和协作工具', url: 'https://notion.so' },
      { id: 3, title: '《代码整洁之道》', category: 'book', desc: '编程经典，教你写出干净优雅的代码', url: '' },
      { id: 4, title: 'Alfred', category: 'tool', desc: 'Mac效率神器，快速启动和搜索', url: 'https://alfredapp.com' }
    ];
    localStorage.setItem('recommendationsData', JSON.stringify(recommendationsData));
  }
  renderRecommendations();
}

function renderRecommendations() {
  const list = document.getElementById('recommendations-list');
  
  list.innerHTML = recommendationsData.map(item => {
    const categoryNames = { tech: '数码科技', book: '书籍阅读', life: '生活家居', tool: '效率工具', other: '其他' };
    return `
      <div class="recommendation-card">
        ${item.image ? `<img src="${item.image}" class="recommendation-image">` : ''}
        <div class="recommendation-content">
          <div class="recommendation-title">${item.title}</div>
          <div class="recommendation-category">${categoryNames[item.category] || '其他'}</div>
          <div class="recommendation-desc">${item.desc}</div>
          ${item.url ? `<a href="${item.url}" target="_blank" class="recommendation-link">了解更多 <i class="fas fa-external-link-alt"></i></a>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function handleRecommendationSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('rec-title').value.trim();
  const category = document.getElementById('rec-category').value;
  const desc = document.getElementById('rec-desc').value.trim();
  const url = document.getElementById('rec-url').value.trim();
  const imageUrl = document.getElementById('rec-image-url').value.trim();
  
  if (!title || !desc) return;
  
  recommendationsData.push({
    id: Date.now(),
    title,
    category,
    desc,
    url,
    image: imageUrl
  });
  
  localStorage.setItem('recommendationsData', JSON.stringify(recommendationsData));
  renderRecommendations();
  e.target.reset();
  document.getElementById('rec-image-preview').style.display = 'none';
  showToast('推荐添加成功');
}

function handleImageUpload(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('rec-image-preview');
      preview.innerHTML = `<img src="${e.target.result}" style="width: 100%;">`;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

let travelData = [];
let currentTravelCity = 'all';

function initTravel() {
  const saved = localStorage.getItem('travelData');
  if (saved) {
    travelData = JSON.parse(saved);
  } else {
    travelData = [
      {
        id: 1,
        title: '北京三日游详细攻略',
        city: 'beijing',
        days: 3,
        route: 'Day1: 天安门 → 故宫 → 景山公园\nDay2: 颐和园 → 圆明园\nDay3: 八达岭长城',
        desc: '北京是中国的首都，拥有丰富的历史文化遗产和现代化建筑。',
        tips: '建议提前预约故宫门票，长城可以选择慕田峪长城人较少。'
      },
      {
        id: 2,
        title: '上海都市风情游',
        city: 'shanghai',
        days: 2,
        route: 'Day1: 外滩 → 南京路 → 豫园\nDay2: 东方明珠 → 陆家嘴 → 世纪公园',
        desc: '上海是国际化大都市，既有外滩的历史韵味，也有陆家嘴的现代繁华。',
        tips: '外滩夜景非常美丽，建议晚上前往。'
      }
    ];
    localStorage.setItem('travelData', JSON.stringify(travelData));
  }
  renderTravel();
}

function renderTravel() {
  const list = document.getElementById('travel-list');
  
  let filtered = travelData;
  if (currentTravelCity !== 'all') {
    filtered = filtered.filter(t => t.city === currentTravelCity);
  }
  
  const cityNames = { beijing: '北京', shanghai: '上海', chengdu: '成都', hangzhou: '杭州', other: '其他' };
  
  list.innerHTML = filtered.map(item => `
    <div class="travel-card">
      <div class="travel-card-header">
        <h3>${item.title}</h3>
        <span class="travel-card-city"><i class="fas fa-map-marker-alt"></i> ${cityNames[item.city]}</span>
      </div>
      ${item.image ? `<img src="${item.image}" class="travel-card-image">` : ''}
      <div class="travel-card-details">
        ${item.days ? `<span class="travel-card-days"><i class="fas fa-calendar"></i> ${item.days}天</span>` : ''}
        <div class="travel-card-route">
          <div class="travel-card-route-title"><i class="fas fa-route"></i> 导航路线</div>
          <div class="travel-card-route-content">${item.route.replace(/\n/g, '<br>')}</div>
        </div>
        ${item.desc ? `<div class="travel-card-desc"><i class="fas fa-info-circle"></i> ${item.desc}</div>` : ''}
        ${item.tips ? `<div class="travel-card-tips"><i class="fas fa-lightbulb"></i> ${item.tips}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function switchTravelCity(city) {
  currentTravelCity = city;
  
  document.querySelectorAll('.travel-city-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = document.querySelector(`.travel-city-tab[onclick="switchTravelCity('${city}')"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  renderTravel();
}

function toggleTravelAddForm() {
  const form = document.getElementById('travel-add-form');
  const icon = document.getElementById('travel-add-toggle-icon');
  
  if (form.style.display === 'none' || form.style.display === '') {
    form.style.display = 'block';
    if (icon) icon.classList.add('rotated');
  } else {
    form.style.display = 'none';
    if (icon) icon.classList.remove('rotated');
  }
}

function handleTravelSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('travel-title').value.trim();
  const city = document.getElementById('travel-city').value;
  const days = document.getElementById('travel-days').value;
  const route = document.getElementById('travel-route').value.trim();
  const desc = document.getElementById('travel-desc').value.trim();
  const tips = document.getElementById('travel-tips').value.trim();
  const imageUrl = document.getElementById('travel-image-url').value.trim();
  
  if (!title || !route) return;
  
  travelData.push({
    id: Date.now(),
    title,
    city,
    days: days ? parseInt(days) : null,
    route,
    desc,
    tips,
    image: imageUrl
  });
  
  localStorage.setItem('travelData', JSON.stringify(travelData));
  renderTravel();
  e.target.reset();
  document.getElementById('travel-image-preview').style.display = 'none';
  document.getElementById('travel-add-form').style.display = 'none';
  document.getElementById('travel-add-toggle-icon').classList.remove('rotated');
  showToast('攻略添加成功');
}

function handleTravelImageUpload(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('travel-image-preview');
      preview.innerHTML = `<img src="${e.target.result}" style="width: 100%;">`;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

let projectsData = [];

function initProjects() {
  const saved = localStorage.getItem('projectsData');
  if (saved) {
    projectsData = JSON.parse(saved);
  } else {
    projectsData = [
      { id: 1, name: 'MiloLab', desc: '开发者个人网站模板，包含工具箱、项目展示、博客等模块', tags: ['Vue.js', 'TypeScript', 'Tailwind CSS'], stars: 128 },
      { id: 2, name: 'API Gateway', desc: '轻量级API网关服务，支持路由转发、限流、认证等功能', tags: ['Go', 'gRPC', 'Docker'], stars: 86 },
      { id: 3, name: 'Data Pipeline', desc: '基于Kafka的数据处理管道，支持实时数据清洗和转换', tags: ['Python', 'Kafka', 'Spark'], stars: 54 }
    ];
    localStorage.setItem('projectsData', JSON.stringify(projectsData));
  }
  renderProjects();
}

function renderProjects() {
  const list = document.getElementById('project-list');
  
  list.innerHTML = projectsData.map(project => `
    <div class="project-card">
      <div class="project-icon"><i class="fas fa-project-diagram"></i></div>
      <div class="project-info">
        <div class="project-title">${project.name}</div>
        <div class="project-desc">${project.desc}</div>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="project-stars"><i class="fas fa-star"></i> ${project.stars}</div>
    </div>
  `).join('');
}

let blogData = [];

function initBlog() {
  const saved = localStorage.getItem('blogData');
  if (saved) {
    blogData = JSON.parse(saved);
  } else {
    blogData = [
      { id: 1, title: '深入理解JavaScript闭包', date: '2024-01-15', author: 'Milo', excerpt: '闭包是JavaScript中最重要的概念之一，本文深入讲解闭包的原理和应用场景...' },
      { id: 2, title: 'Vue3组合式API实战指南', date: '2024-01-10', author: 'Milo', excerpt: 'Vue3引入了组合式API，让代码组织更加灵活。本文通过实战案例讲解如何使用...' },
      { id: 3, title: 'Docker容器化部署最佳实践', date: '2024-01-05', author: 'Milo', excerpt: '容器化已经成为现代应用部署的标准方式。本文总结了Docker部署的最佳实践...' }
    ];
    localStorage.setItem('blogData', JSON.stringify(blogData));
  }
  renderBlog();
}

function renderBlog() {
  const list = document.getElementById('blog-list');
  
  list.innerHTML = blogData.map(article => `
    <div class="blog-card">
      <div class="blog-title">${article.title}</div>
      <div class="blog-meta">
        <span><i class="fas fa-calendar"></i> ${article.date}</span>
        <span><i class="fas fa-user"></i> ${article.author}</span>
      </div>
      <div class="blog-excerpt">${article.excerpt}</div>
    </div>
  `).join('');
}

function handleContactSubmit(e) {
  e.preventDefault();
  showToast('留言已发送，感谢您的反馈！');
  e.target.reset();
}