import { getCurrentEpochDay } from '../utils'
import JSONdb from 'simple-json-db'

const db = new JSONdb('src/server/data/database.json', { asyncWrite: true })

export type DbTask = {
  cadenceInDays: number
  daysFromNow?: number
  id: string
  nextEpochDay: number
  title: string
  type?: 'NUDGE' | 'STANDARD'
}

export type Task = DbTask & {
  daysFromNow: number
}

export type ConnectionsEntry = {
  id: string
  name: string
  createdAt: string
  board: { [key: string]: { level: number; members: string[] } }
  startingBoard: string[][]
  lastUpdated: string
  error: string // bull
}

export type ConnectionsCache = { [key: string]: {} }

export const getTasks = () => {
  const tasks = db.get('tasks').sort(sortByNextDayAndCadence).map(addUtilityFields) as Task[]
  return tasks

  function sortByNextDayAndCadence(a: Task, b: Task) {
    if (a.nextEpochDay === b.nextEpochDay) {
      return a.cadenceInDays > b.cadenceInDays ? -1 : 1
    }
    return a.nextEpochDay < b.nextEpochDay ? -1 : 1
  }
  function addUtilityFields(task: Task) {
    return { ...task, daysFromNow: task.nextEpochDay - getCurrentEpochDay() }
  }
}
export const setTasks = (tasks: Task[]) =>
  db.set(
    'tasks',
    tasks.sort((a, b) => (a.id > b.id ? -1 : 1))
  )

export const getConnectionsCache = (): ConnectionsCache => {
  return db.get('connections-cache')
}
export const checkConnectionsCache = async (
  key: string,
  adder: () => Promise<ConnectionsEntry | { error: string }>
): Promise<ConnectionsEntry | { error: string }> => {
  const cache = db.get('connections-cache')
  if (cache[key]) {
    return cache[key]
  } else {
    const entry = await adder()
    if (entry.error === undefined) {
      cache[key] = entry
      db.set('connections-cache', { ...cache })
    }
    return entry
  }
}

export const getGetConnectionsSaveData = () => {
  return db.get('connections-save-data')
}

export const updateGetConnectionsSaveData = (data: any) => {
  const original = getGetConnectionsSaveData()
  const patch = { ...original, ...data }
  db.set('connections-save-data', patch)
  return patch
}
