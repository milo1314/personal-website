const express = require('express');
const router = express.Router();
const travelGuideService = require('../services/travelGuideService');

router.get('/', async (req, res) => {
  try {
    const { status, destination } = req.query;
    let guides;
    if (destination) {
      guides = await travelGuideService.getTravelGuidesByDestination(destination);
    } else {
      guides = await travelGuideService.getAllTravelGuides(status);
    }
    res.json({
      success: true,
      data: guides
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
    const guide = await travelGuideService.getTravelGuideById(id);
    if (guide) {
      res.json({
        success: true,
        data: guide
      });
    } else {
      res.status(404).json({
        success: false,
        message: '攻略不存在'
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
    const guide = await travelGuideService.createTravelGuide(req.body);
    res.status(201).json({
      success: true,
      data: guide
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
    const success = await travelGuideService.updateTravelGuide(id, req.body);
    if (success) {
      res.json({
        success: true,
        message: '更新成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '攻略不存在'
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
    const success = await travelGuideService.deleteTravelGuide(id);
    if (success) {
      res.json({
        success: true,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '攻略不存在'
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