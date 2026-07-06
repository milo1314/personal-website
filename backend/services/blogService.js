const { pool } = require('../config/database');

const blogService = {
  getAllBlogs: async (status = 'published') => {
    const [rows] = await pool.execute(
      'SELECT id, title, slug, excerpt, cover_image, category, tags, views, likes, created_at FROM blogs WHERE status = ? ORDER BY created_at DESC',
      [status]
    );
    return rows;
  },

  getBlogById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM blogs WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  getBlogBySlug: async (slug) => {
    const [rows] = await pool.execute(
      'SELECT * FROM blogs WHERE slug = ?',
      [slug]
    );
    return rows[0] || null;
  },

  createBlog: async (data) => {
    const { title, slug, content, excerpt, cover_image, category, tags, status } = data;
    const [result] = await pool.execute(
      'INSERT INTO blogs (title, slug, content, excerpt, cover_image, category, tags, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, content, excerpt, cover_image, category, tags, status || 'draft']
    );
    return { id: result.insertId, ...data };
  },

  updateBlog: async (id, data) => {
    const { title, slug, content, excerpt, cover_image, category, tags, status } = data;
    const [result] = await pool.execute(
      'UPDATE blogs SET title = ?, slug = ?, content = ?, excerpt = ?, cover_image = ?, category = ?, tags = ?, status = ? WHERE id = ?',
      [title, slug, content, excerpt, cover_image, category, tags, status, id]
    );
    return result.affectedRows > 0;
  },

  incrementViews: async (id) => {
    await pool.execute(
      'UPDATE blogs SET views = views + 1 WHERE id = ?',
      [id]
    );
  },

  incrementLikes: async (id) => {
    await pool.execute(
      'UPDATE blogs SET likes = likes + 1 WHERE id = ?',
      [id]
    );
  },

  deleteBlog: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM blogs WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = blogService;