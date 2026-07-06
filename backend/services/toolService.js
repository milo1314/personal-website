const { pool } = require('../config/database');

const toolService = {
  getAllTools: async () => {
    const [rows] = await pool.execute(
      'SELECT * FROM tools ORDER BY sort_order ASC'
    );
    return rows;
  },

  getToolsByCategory: async (category) => {
    const [rows] = await pool.execute(
      'SELECT * FROM tools WHERE category = ? ORDER BY sort_order ASC',
      [category]
    );
    return rows;
  },

  getToolById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM tools WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  createTool: async (data) => {
    const { name, icon, description, category, sort_order } = data;
    const [result] = await pool.execute(
      'INSERT INTO tools (name, icon, description, category, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, icon, description, category, sort_order || 0]
    );
    return { id: result.insertId, ...data };
  },

  updateTool: async (id, data) => {
    const { name, icon, description, category, sort_order } = data;
    const [result] = await pool.execute(
      'UPDATE tools SET name = ?, icon = ?, description = ?, category = ?, sort_order = ? WHERE id = ?',
      [name, icon, description, category, sort_order, id]
    );
    return result.affectedRows > 0;
  },

  deleteTool: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM tools WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = toolService;