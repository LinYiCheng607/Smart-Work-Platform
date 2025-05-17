export interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
}

export interface Post {
  id: number;
  author: string;
  avatar: string;
  type: '兼职日记' | '经验分享';
  time: string;
  title?: string;
  content: string;
  images: string[];
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  showComments: boolean;
  tags: string[];
}

export interface PostCreateData {
  type: '兼职日记' | '经验分享';
  title?: string;
  content: string;
  images: string[];
  tags: string[];
  author: string;
  avatar: string;
  time: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

export interface Job {
  id: number;
  title: string;
  salary: string;
  location: string;
}

export interface Company {
  id: number;
  name: string;
  logo: string;
  description: string;
  industry: string;
  isVerified: boolean;
  isFollowed: boolean;
  jobs: Job[];
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  image: string;
  status: '进行中' | '已结束' | '即将开始';
  time: string;
  participants: number;
}

export interface PostForm {
  category: '' | 'diary' | 'experience';
  title: string;
  content: string;
  images: string[];
  tags: string[];
}

export interface UploadFile {
  url: string;
  [key: string]: any;
} 