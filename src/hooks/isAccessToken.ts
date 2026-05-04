import {jwtDecode} from 'jwt-decode'

 const isAcessToken = (token: string | undefined): boolean => {
  if (!token) return false
  try {
    const decoded: { exp: number } = jwtDecode(token)
    const now = Date.now() / 1000
    return decoded.exp > now
  } catch {
    return false
  }
}


export default isAcessToken