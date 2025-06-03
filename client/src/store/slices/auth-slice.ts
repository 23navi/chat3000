import { type StateCreator } from 'zustand'

export type UserInfo = {
    id: string
    name: string
    email: string
    profileSetup: boolean
}

export type AuthSlice = {
    userInfo: UserInfo | null
    setUserInfo: (userInfo: UserInfo | undefined) => void
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
