const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const initialPosts = require('../data/posts')

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/community'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('只能上传图片文件！'))
    }
    cb(null, true)
  }
})

// 初始化帖子数据
let posts = [...initialPosts]
let postId = Math.max(...posts.map(p => p.id)) + 1

// 获取帖子列表
router.get('/posts', (req, res) => {
  const { type, page = 1, pageSize = 10 } = req.query
  let filteredPosts = posts

  if (type) {
    filteredPosts = posts.filter(post => post.type === type)
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + parseInt(pageSize)
  const paginatedPosts = filteredPosts.slice(start, end)

  res.json({
    data: paginatedPosts,
    total: filteredPosts.length,
    page: parseInt(page),
    pageSize: parseInt(pageSize)
  })
})

// 获取单个帖子
router.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id))
  if (post) {
    res.json(post)
  } else {
    res.status(404).json({ message: '帖子不存在' })
  }
})

// 创建帖子
router.post('/posts', (req, res) => {
  const post = {
    id: postId++,
    ...req.body,
    comments: [],
    showComments: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  posts.unshift(post)
  res.status(201).json(post)
})

// 更新帖子
router.put('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = posts.findIndex(p => p.id === id)
  
  if (index > -1) {
    posts[index] = {
      ...posts[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    }
    res.json(posts[index])
  } else {
    res.status(404).json({ message: '帖子不存在' })
  }
})

// 删除帖子
router.delete('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = posts.findIndex(p => p.id === id)
  
  if (index > -1) {
    posts.splice(index, 1)
    res.status(204).end()
  } else {
    res.status(404).json({ message: '帖子不存在' })
  }
})

// 图片上传
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '没有上传文件' })
  }
  const url = `/uploads/community/${req.file.filename}`
  res.json({ url })
})

// 添加评论
router.post('/posts/:id/comments', (req, res) => {
  const id = parseInt(req.params.id)
  const post = posts.find(p => p.id === id)
  
  if (post) {
    const comment = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    }
    post.comments.unshift(comment)
    res.status(201).json(comment)
  } else {
    res.status(404).json({ message: '帖子不存在' })
  }
})

// 删除评论
router.delete('/posts/:postId/comments/:commentId', (req, res) => {
  const postId = parseInt(req.params.postId)
  const commentId = parseInt(req.params.commentId)
  const post = posts.find(p => p.id === postId)
  
  if (post) {
    const index = post.comments.findIndex(c => c.id === commentId)
    if (index > -1) {
      post.comments.splice(index, 1)
      res.status(204).end()
    } else {
      res.status(404).json({ message: '评论不存在' })
    }
  } else {
    res.status(404).json({ message: '帖子不存在' })
  }
})

// 点赞/取消点赞
router.post('/posts/:id/like', (req, res) => {
  const id = parseInt(req.params.id)
  const post = posts.find(p => p.id === id)
  
  if (post) {
    post.isLiked = !post.isLiked
    post.likes += post.isLiked ? 1 : -1
    res.json({ isLiked: post.isLiked, likes: post.likes })
  } else {
    res.status(404).json({ message: '帖子不存在' })
  }
})

// 获取热门标签
router.get('/tags', (req, res) => {
  const tags = new Set()
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag))
  })
  res.json(Array.from(tags))
})

module.exports = router 