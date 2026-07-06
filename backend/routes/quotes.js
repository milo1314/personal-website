const express = require('express');
const router = express.Router();
const quoteService = require('../services/quoteService');

router.get('/', async (req, res) => {
  try {
    const quotes = await quoteService.getAllQuotes();
    res.json({
      success: true,
      data: quotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/random', async (req, res) => {
  try {
    const quote = await quoteService.getRandomQuote();
    if (quote) {
      res.json({
        success: true,
        data: quote
      });
    } else {
      res.status(404).json({
        success: false,
        message: '暂无语录'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await quoteService.getQuoteById(id);
    if (quote) {
      res.json({
        success: true,
        data: quote
      });
    } else {
      res.status(404).json({
        success: false,
        message: '语录不存在'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const quote = await quoteService.createQuote(req.body);
    res.status(201).json({
      success: true,
      data: quote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await quoteService.updateQuote(id, req.body);
    if (success) {
      res.json({
        success: true,
        message: '更新成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '语录不存在'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await quoteService.deleteQuote(id);
    if (success) {
      res.json({
        success: true,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '语录不存在'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;