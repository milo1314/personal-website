const { pool } = require('../config/database');

const quoteService = {
  getAllQuotes: async () => {
    const [rows] = await pool.execute(
      'SELECT * FROM quotes ORDER BY created_at DESC'
    );
    return rows;
  },

  getRandomQuote: async () => {
    const [rows] = await pool.execute(
      'SELECT * FROM quotes ORDER BY RAND() LIMIT 1'
    );
    return rows[0] || null;
  },

  getQuoteById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM quotes WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  createQuote: async (data) => {
    const { content, author, source } = data;
    const [result] = await pool.execute(
      'INSERT INTO quotes (content, author, source) VALUES (?, ?, ?)',
      [content, author, source]
    );
    return { id: result.insertId, ...data };
  },

  updateQuote: async (id, data) => {
    const { content, author, source } = data;
    const [result] = await pool.execute(
      'UPDATE quotes SET content = ?, author = ?, source = ? WHERE id = ?',
      [content, author, source, id]
    );
    return result.affectedRows > 0;
  },

  deleteQuote: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM quotes WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = quoteService;