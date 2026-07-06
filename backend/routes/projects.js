const express = require('express');
const router = express.Router();
const projectService = require('../services/projectService');

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const projects = await projectService.getAllProjects(status);
    res.json({
      success: true,
      data: projects
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
    const project = await projectService.getProjectById(id);
    if (project) {
      res.json({
        success: true,
        data: project
      });
    } else {
      res.status(404).json({
        success: false,
        message: '项目不存在'
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
    const project = await projectService.createProject(req.body);
    res.status(201).json({
      success: true,
      data: project
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
    const success = await projectService.updateProject(id, req.body);
    if (success) {
      res.json({
        success: true,
        message: '更新成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '项目不存在'
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
    const success = await projectService.deleteProject(id);
    if (success) {
      res.json({
        success: true,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '项目不存在'
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