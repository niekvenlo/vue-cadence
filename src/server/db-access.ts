import JSONdb from 'simple-json-db'

const db = new JSONdb('src/server/data/database.json')

export type Task = {
  cadenceInDays: number
  daysFromNow: number
  id: string
  nextEpochDay: number
  title: string
  type?: 'NUDGE' | 'STANDARD'
}

export const getTasks = () => db.get('tasks') as Task[]
export const setTasks = (tasks: Task[]) => db.set('tasks', tasks)
