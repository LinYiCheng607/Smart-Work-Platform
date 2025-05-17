const posts = [
  {
    id: 1,
    author: '张三',
    avatar: '/avatars/user1.jpg',
    type: '兼职日记',
    title: '',
    content: '今天在便利店兼职，遇到很多有趣的顾客，收获满满！',
    images: ['/uploads/community/post1.jpg'],
    likes: 45,
    isLiked: false,
    comments: [
      {
        id: 1,
        author: '李四',
        avatar: '/avatars/user2.jpg',
        content: '分享得很详细，感谢！',
        createdAt: '2024-01-15T08:30:00.000Z'
      }
    ],
    tags: ['便利店', '兼职经验'],
    showComments: false,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: 2,
    author: '李四',
    avatar: '/avatars/user2.jpg',
    type: '经验分享',
    title: '如何高效找到合适的兼职',
    content: '分享一下我找兼职的心得体会...',
    images: [],
    likes: 32,
    isLiked: false,
    comments: [],
    tags: ['求职技巧', '经验分享'],
    showComments: false,
    createdAt: '2024-01-14T10:00:00.000Z',
    updatedAt: '2024-01-14T10:00:00.000Z'
  }
]

module.exports = posts 