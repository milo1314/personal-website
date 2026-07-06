const express = require('express');
const router = express.Router();
const blogService = require('../services/blogService');

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const blogs = await blogService.getAllBlogs(status);
    res.json({
      success: true,
      data: blogs
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
    const blog = await blogService.getBlogById(id);
    if (blog) {
      await blogService.incrementViews(id);
      res.json({
        success: true,
        data: blog
      });
    } else {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await blogService.getBlogBySlug(slug);
    if (blog) {
      await blogService.incrementViews(blog.id);
      res.json({
        success: true,
        data: blog
      });
    } else {
      res.status(404).json({
        success: false,
        message: '文章不存在'
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
    const blog = await blogService.createBlog(req.body);
    res.status(201).json({
      success: true,
      data: blog
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
    const success = await blogService.updateBlog(id, req.body);
    if (success) {
      res.json({
        success: true,
        message: '更新成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogService.getBlogById(id);
    if (blog) {
      await blogService.incrementLikes(id);
      res.json({
        success: true,
        message: '点赞成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '文章不存在'
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
    const success = await blogService.deleteBlog(id);
    if (success) {
      res.json({
        success: true,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '文章不存在'
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