import { configureStore } from '@reduxjs/toolkit'
import analyticsReducer from './slices/analyticsSlice'
import authReducer from './slices/authSlice'
import consultationReducer from './slices/consultationSlice'
import heroReducer from './slices/heroSlice'
import passwordReducer from './slices/passwordSlice'
import profileReducer from './slices/profileSlice'
import projectReducer from './slices/projectSlice'
import serviceReducer from './slices/serviceSlice'
import userManagementReducer from './slices/userManagementSlice'

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    auth: authReducer,
    consultations: consultationReducer,
    hero: heroReducer,
    password: passwordReducer,
    profile: profileReducer,
    ownerProjects: projectReducer,
    services: serviceReducer,
    userManagement: userManagementReducer,
  },
})

export default store
