import { type StateCreator } from 'zustand'

export type UserInfo = {
    name: string
    email: string
}

export type AuthSlice = {
    userInfo: UserInfo | null
    setUserInfo: (userInfo: UserInfo) => void
    clearUserInfo: () => void
}

// Add the generic args for when you're combining multiple slices
export const createAuthSlice: StateCreator<
    AuthSlice,
    [],
    [],
    AuthSlice
> = (set) => ({
    userInfo: null,
    setUserInfo: (userInfo) => set({ userInfo }),
    clearUserInfo: () => set({ userInfo: null }),
})
