import { createContextWithWrite } from '@Common/Context/createContextWithWrite'

export const OpenProvider = createContextWithWrite<boolean, boolean>('Open')
