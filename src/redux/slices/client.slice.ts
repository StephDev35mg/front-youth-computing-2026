import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UserData } from '#/interface/user.interface'

interface AuthTokens {
  access: string
  // refresh token NON stocké en Redux (généralement via HttpOnly cookie)
}

type ClientState = {
  user: UserData | null
  token: AuthTokens | null
}

const initialState: ClientState = {
  user: null,
  token: null,
}

interface AuthPayload {
  user: UserData
  access: string
}

interface PendingIdentityPayload {
  email: string
  username?: string
}

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    // Sign-in step 1 (avant OTP): on garde l'identité pour /confirmSignIn
    setPendingIdentity(state, action: PayloadAction<PendingIdentityPayload>) {
      state.user = {
        id: 0,
        email: action.payload.email,
        username: action.payload.username,
      }
      state.token = null
    },

    // Login final (après OTP): set access token + user
    setAuth(state, action: PayloadAction<AuthPayload>) {
      state.user = action.payload.user
      state.token = { access: action.payload.access }
    },

    // Mise à jour partielle du profil
    updateUser(state, action: PayloadAction<Partial<UserData>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },

    // Logout
    logout(state) {
      state.user = null
      state.token = null
    },
  },
})

export const { setPendingIdentity, setAuth, updateUser, logout } =
  clientSlice.actions
export default clientSlice.reducer
