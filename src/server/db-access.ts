import { getCurrentEpochDay } from '../utils'
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

export const getTasks = () => {
  const tasks = db.get('tasks')
  return tasks.sort(sortByNextDayAndCadence).map(addUtilityFields) as Task[]

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
export const setTasks = (tasks: Task[]) => db.set('tasks', tasks)
