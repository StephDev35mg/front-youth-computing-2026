export interface UserData {
  id: number
  email: string
  username?: string
  photo?: File
  role?: 'Admin' | 'User'
}
