import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import consultationReducer from './slices/consultationSlice'
import heroReducer from './slices/heroSlice'
import profileReducer from './slices/profileSlice'
import projectReducer from './slices/projectSlice'
import serviceReducer from './slices/serviceSlice'
import userManagementReducer from './slices/userManagementSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    consultations: consultationReducer,
    hero: heroReducer,
    profile: profileReducer,
    ownerProjects: projectReducer,
    services: serviceReducer,
    userManagement: userManagementReducer,
  },
})

export default store
