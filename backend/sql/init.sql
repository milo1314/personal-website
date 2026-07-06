CREATE DATABASE IF NOT EXISTS personal_website DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE personal_website;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image VARCHAR(255),
  tags VARCHAR(255),
  github_url VARCHAR(255),
  demo_url VARCHAR(255),
  status ENUM('active', 'completed', 'draft') DEFAULT 'active',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS blogs;
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  content LONGTEXT,
  excerpt TEXT,
  cover_image VARCHAR(255),
  category VARCHAR(100),
  tags VARCHAR(255),
  status ENUM('published', 'draft') DEFAULT 'draft',
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS skills;
CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(50),
  level INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS quotes;
CREATE TABLE quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  author VARCHAR(100),
  source VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS tools;
CREATE TABLE tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  description TEXT,
  category VARCHAR(50),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS travel_guides;
CREATE TABLE travel_guides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  destination VARCHAR(100),
  cover_image VARCHAR(255),
  content TEXT,
  days INT DEFAULT 0,
  budget VARCHAR(100),
  rating INT DEFAULT 0,
  status ENUM('published', 'draft') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_destination (destination),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS notes;
CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  category VARCHAR(50),
  tags VARCHAR(255),
  status ENUM('active', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (username, email, password, bio) VALUES
('milo', 'milo@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '全栈开发者，热爱技术，专注于构建高质量的Web应用。');

INSERT INTO projects (title, description, cover_image, tags, github_url, demo_url, status, sort_order) VALUES
('个人博客系统', '基于Node.js和Express开发的个人博客系统，支持Markdown编辑、评论功能等。', 'https://example.com/project1.jpg', 'Node.js, Express, MongoDB', 'https://github.com/milo/blog', 'https://demo.example.com/blog', 'completed', 1),
('在线工具箱', '提供JSON格式化、Base64编码解码、UUID生成等常用工具。', 'https://example.com/project2.jpg', 'React, TypeScript, Tailwind', 'https://github.com/milo/tools', 'https://demo.example.com/tools', 'active', 2),
('任务管理App', '移动端任务管理应用，支持日历视图、提醒功能、数据同步。', 'https://example.com/project3.jpg', 'React Native, Firebase', 'https://github.com/milo/todo', 'https://demo.example.com/todo', 'active', 3);

INSERT INTO blogs (title, slug, content, excerpt, cover_image, category, tags, status, views, likes) VALUES
('JavaScript异步编程入门', 'javascript-async-guide', '<h2>什么是异步编程？</h2><p>异步编程是JavaScript中非常重要的概念...</p>', '本文介绍JavaScript异步编程的基本概念，包括Promise、async/await等。', 'https://example.com/blog1.jpg', '技术', 'JavaScript, Async, Promise', 'published', 1200, 56),
('React Hooks最佳实践', 'react-hooks-best-practices', '<h2>useState的使用技巧</h2><p>在使用useState时...</p>', '分享React Hooks的使用经验和最佳实践。', 'https://example.com/blog2.jpg', '技术', 'React, Hooks', 'published', 850, 42),
('CSS Grid布局完全指南', 'css-grid-complete-guide', '<h2>Grid布局基础</h2><p>CSS Grid是一个强大的布局系统...</p>', '从零开始学习CSS Grid布局。', 'https://example.com/blog3.jpg', '技术', 'CSS, Grid, Layout', 'draft', 0, 0);

INSERT INTO skills (name, icon, category, level, sort_order) VALUES
('JavaScript', 'js', 'Frontend', 95, 1),
('TypeScript', 'ts', 'Frontend', 85, 2),
('React', 'react', 'Frontend', 90, 3),
('Vue', 'vue', 'Frontend', 80, 4),
('Node.js', 'node', 'Backend', 88, 5),
('Python', 'python', 'Backend', 75, 6),
('MySQL', 'mysql', 'Database', 85, 7),
('MongoDB', 'mongo', 'Database', 70, 8),
('Docker', 'docker', 'DevOps', 75, 9),
('Git', 'git', 'Tools', 90, 10);

INSERT INTO quotes (content, author, source) VALUES
('代码是写给人看的，只是顺便让机器执行。', 'Robert C. Martin', '《代码整洁之道》'),
('Talk is cheap. Show me the code.', 'Linus Torvalds', 'Linux内核开发'),
('优秀的程序员是那种过单行线都要往两边看的人。', 'Doug Linder', '编程名言'),
('程序必须为阅读它的人而编写，只是顺便为执行它的机器而编写。', 'Harold Abelson', 'SICP');

INSERT INTO tools (name, icon, description, category, sort_order) VALUES
('JSON格式化', 'json', '在线JSON格式化和校验工具', '格式化工具', 1),
('Base64编解码', 'code', '字符串和文件的Base64编码解码', '编码工具', 2),
('UUID生成', 'hash', '生成各种格式的UUID', '生成工具', 3),
('时间戳转换', 'clock', 'Unix时间戳和日期的相互转换', '时间工具', 4),
('Hash计算', 'hash', '计算文件或字符串的MD5/SHA值', '安全工具', 5),
('Token生成', 'key', '生成随机Token和密码', '安全工具', 6);

INSERT INTO travel_guides (title, destination, cover_image, content, days, budget, rating, status) VALUES
('东京五日自由行攻略', '东京', 'https://example.com/tokyo.jpg', '<h2>行程安排</h2><p>第一天：浅草寺、晴空塔...</p>', 5, '8000元', 4, 'published'),
('巴厘岛度假指南', '巴厘岛', 'https://example.com/bali.jpg', '<h2>最佳旅游时间</h2><p>4月至10月是巴厘岛的旱季...</p>', 7, '12000元', 5, 'published'),
('云南大理七日游', '大理', 'https://example.com/dali.jpg', '<h2>必去景点</h2><p>洱海、古城、苍山...</p>', 7, '5000元', 4, 'draft');

INSERT INTO notes (title, content, category, tags, status) VALUES
('面试准备清单', '- 算法题复习\n- 项目经验梳理\n- 常见问题准备', '工作', '面试, 准备', 'active'),
('学习计划', '1. 每周学习一个新技能\n2. 每月阅读一本技术书\n3. 每季度做一个小项目', '学习', '计划', 'active'),
('会议记录', '讨论了新项目的技术选型，最终决定使用React + Node.js', '工作', '会议', 'archived');