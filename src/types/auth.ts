export interface LoginForm {
  username: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user?: {
    id: number
    username: string
    name: string
    phone: string
    avatar: string | null
    role: number
    id_card: string
    skill_tags: string
  }
}

export interface UserInfo {
  id: number
  username: string
  name: string
  phone: string
  avatar: string | null
  role: number
  id_card: string
  skill_tags: string
}

export interface RegisterForm extends LoginForm {
  name: string
  phone: string
  id_card: string
  role: number
} 