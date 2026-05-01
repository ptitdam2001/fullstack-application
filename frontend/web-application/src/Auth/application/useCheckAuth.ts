import { readAuthStorage } from '../infrastructure/authStorage'

export const useCheckAuth = () => readAuthStorage()
