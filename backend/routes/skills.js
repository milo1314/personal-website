const express = require('express');
const router = express.Router();
const skillService = require('../services/skillService');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let skills;
    if (category) {
      skills = await skillService.getSkillsByCategory(category);
    } else {
      skills = await skillService.getAllSkills();
    }
    res.json({
      success: true,
      data: skills
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
    const skill = await skillService.getSkillsByCategory(id);
    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const skill = await skillService.createSkill(req.body);
    res.status(201).json({
      success: true,
      data: skill
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
    const success = await skillService.updateSkill(id, req.body);
    if (success) {
      res.json({
        success: true,
        message: '更新成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '技能不存在'
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
    const success = await skillService.deleteSkill(id);
    if (success) {
      res.json({
        success: true,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '技能不存在'
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