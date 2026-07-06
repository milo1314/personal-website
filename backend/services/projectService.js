const { pool } = require('../config/database');

const projectService = {
  getAllProjects: async (status = 'active') => {
    const [rows] = await pool.execute(
      'SELECT * FROM projects WHERE status = ? ORDER BY sort_order ASC, created_at DESC',
      [status]
    );
    return rows;
  },

  getProjectById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  createProject: async (data) => {
    const { title, description, cover_image, tags, github_url, demo_url, status, sort_order } = data;
    const [result] = await pool.execute(
      'INSERT INTO projects (title, description, cover_image, tags, github_url, demo_url, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, cover_image, tags, github_url, demo_url, status || 'active', sort_order || 0]
    );
    return { id: result.insertId, ...data };
  },

  updateProject: async (id, data) => {
    const { title, description, cover_image, tags, github_url, demo_url, status, sort_order } = data;
    const [result] = await pool.execute(
      'UPDATE projects SET title = ?, description = ?, cover_image = ?, tags = ?, github_url = ?, demo_url = ?, status = ?, sort_order = ? WHERE id = ?',
      [title, description, cover_image, tags, github_url, demo_url, status, sort_order, id]
    );
    return result.affectedRows > 0;
  },

  deleteProject: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM projects WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = projectService;