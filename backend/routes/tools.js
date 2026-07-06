const express = require('express');
const router = express.Router();
const toolService = require('../services/toolService');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let tools;
    if (category) {
      tools = await toolService.getToolsByCategory(category);
    } else {
      tools = await toolService.getAllTools();
    }
    res.json({
      success: true,
      data: tools
    });
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
    const tool = await toolService.getToolById(id);
    if (tool) {
      res.json({
        success: true,
        data: tool
      });
    } else {
      res.status(404).json({
        success: false,
        message: '工具不存在'
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
    const tool = await toolService.createTool(req.body);
    res.status(201).json({
      success: true,
      data: tool
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
    const success = await toolService.updateTool(id, req.body);
    if (success) {
      res.json({
        success: true,
        message: '更新成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '工具不存在'
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
    const success = await toolService.deleteTool(id);
    if (success) {
      res.json({
        success: true,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '工具不存在'
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