const { pool } = require('../config/database');

const travelGuideService = {
  getAllTravelGuides: async (status = 'published') => {
    const [rows] = await pool.execute(
      'SELECT id, title, destination, cover_image, days, budget, rating, created_at FROM travel_guides WHERE status = ? ORDER BY created_at DESC',
      [status]
    );
    return rows;
  },

  getTravelGuideById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM travel_guides WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  getTravelGuidesByDestination: async (destination) => {
    const [rows] = await pool.execute(
      'SELECT * FROM travel_guides WHERE destination = ? AND status = "published" ORDER BY created_at DESC',
      [destination]
    );
    return rows;
  },

  createTravelGuide: async (data) => {
    const { title, destination, cover_image, content, days, budget, rating, status } = data;
    const [result] = await pool.execute(
      'INSERT INTO travel_guides (title, destination, cover_image, content, days, budget, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, destination, cover_image, content, days || 0, budget, rating || 0, status || 'draft']
    );
    return { id: result.insertId, ...data };
  },

  updateTravelGuide: async (id, data) => {
    const { title, destination, cover_image, content, days, budget, rating, status } = data;
    const [result] = await pool.execute(
      'UPDATE travel_guides SET title = ?, destination = ?, cover_image = ?, content = ?, days = ?, budget = ?, rating = ?, status = ? WHERE id = ?',
      [title, destination, cover_image, content, days, budget, rating, status, id]
    );
    return result.affectedRows > 0;
  },

  deleteTravelGuide: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM travel_guides WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = travelGuideService;