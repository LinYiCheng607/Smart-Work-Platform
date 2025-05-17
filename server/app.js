const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const communityRoutes = require('./routes/community')

const app = express()

// 添加 CORS 支持
app.use(cors())

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
  next()
})

app.use(express.json())

// 文件上传配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('只能上传图片文件！'))
    }
    cb(null, true)
  }
})

// 模拟数据库
let posts = []
let postId = 1

// 获取帖子列表
app.get('/api/posts', (req, res) => {
  const { type } = req.query
  let result = posts
  if (type) {
    result = posts.filter(post => post.type === type)
  }
  res.json(result)
})

// 创建帖子
app.post('/api/posts', (req, res) => {
  const post = {
    id: postId++,
    ...req.body,
    showComments: false
  }
  posts.unshift(post)
  res.json(post)
})

// 更新帖子
app.put('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = posts.findIndex(p => p.id === id)
  if (index > -1) {
    posts[index] = { ...posts[index], ...req.body }
    res.json(posts[index])
  } else {
    res.status(404).json({ message: '帖子不存在' })
  }
})

// 删除帖子
app.delete('/api/posts/:id', (req, res) => {
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
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '没有上传文件' })
  }
  const url = `/uploads/${req.file.filename}`
  res.json({ url })
})

// 点赞/取消点赞
app.post('/api/posts/:id/like', (req, res) => {
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

// 添加评论
app.post('/api/posts/:id/comments', (req, res) => {
  const id = parseInt(req.params.id)
  const post = posts.find(p => p.id === id)
  if (post) {
    const comment = {
      id: Date.now(),
      time: '刚刚',
      ...req.body
    }
    post.comments.unshift(comment)
    res.json(comment)
  } else {
    res.status(404).json({ message: '帖子不存在' })
  }
})

// 删除评论
app.delete('/api/posts/:postId/comments/:commentId', (req, res) => {
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

// 使用零工圈路由
app.use('/api/community', communityRoutes)

// 静态文件服务
app.use('/uploads', express.static('uploads'))

// 获取未读消息数
app.get('/api/messages/unread/count', (req, res) => {
  // 这里应该从数据库中获取实际的未读消息数
  // 现在先返回0，表示没有未读消息
  res.json({ count: 0 })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({
    error: true,
    message: err.message || '服务器内部错误'
  })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: '未找到请求的资源'
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 