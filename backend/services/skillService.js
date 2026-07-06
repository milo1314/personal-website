const { pool } = require('../config/database');

const skillService = {
  getAllSkills: async () => {
    const [rows] = await pool.execute(
      'SELECT * FROM skills ORDER BY sort_order ASC, category ASC'
    );
    return rows;
  },

  getSkillsByCategory: async (category) => {
    const [rows] = await pool.execute(
      'SELECT * FROM skills WHERE category = ? ORDER BY sort_order ASC',
      [category]
    );
    return rows;
  },

  createSkill: async (data) => {
    const { name, icon, category, level, sort_order } = data;
    const [result] = await pool.execute(
      'INSERT INTO skills (name, icon, category, level, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, icon, category, level || 0, sort_order || 0]
    );
    return { id: result.insertId, ...data };
  },

  updateSkill: async (id, data) => {
    const { name, icon, category, level, sort_order } = data;
    const [result] = await pool.execute(
      'UPDATE skills SET name = ?, icon = ?, category = ?, level = ?, sort_order = ? WHERE id = ?',
      [name, icon, category, level, sort_order, id]
    );
    return result.affectedRows > 0;
  },

  deleteSkill: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM skills WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = skillService;