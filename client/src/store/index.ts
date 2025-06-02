import { create } from 'zustand'
import { createAuthSlice, type AuthSlice } from './slices/auth-slice'

export type AppStore = AuthSlice


// ...a represents (set,get,api) which is passed by zustand to our create and it is positional argument
export const useAppStore = create<AppStore>()((...a) => ({
    ...createAuthSlice(...a),
}))