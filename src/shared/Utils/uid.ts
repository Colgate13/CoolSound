import { randomUUID } from 'node:crypto'

export const uid = (): string => randomUUID()
