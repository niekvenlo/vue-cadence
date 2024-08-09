import express from 'express'
import cors from 'cors'
import { getTasks, setTasks } from './db-access'
import { getCurrentEpochDay } from '../utils'

const port = process.env.PORT || 3333

const app = express()
app.use(cors())

app.get('/api/v1/getTasks', (_req, res) => {
  res.json(getTasks())
})

app.post('/api/v1/setTasks', ({ params }: { params: { tasks: string } }, res) => {
  const tasks = JSON.parse(params.tasks) as ReturnType<typeof getTasks>
  console.log(tasks)
  setTasks(tasks)
  res.json(tasks) // TODO: Remove
})

app.get('/api/v1/completeTask', ({ query }, res) => {
  const taskId = query.taskId
  const tasks = getTasks()
  const idx = tasks.findIndex((task) => task.id === taskId)
  if (!taskId || idx < 0) {
    res.status(404).json([{ error: 'not found' }])
    return
  }
  const task = tasks[idx]
  if (task.type == 'NUDGE') {
    // remove
    tasks.splice(idx, 1)
  } else {
    // reschedule
    tasks[idx] = {
      ...task,
      nextEpochDay: getCurrentEpochDay() + task?.cadenceInDays
    }
  }
  setTasks(tasks)
  res.json(getTasks())
})

app.get('/api/v1/updateTask', ({ query }, res) => {
  const taskToUpdate = JSON.parse(`${query.taskJson}`)
  const tasks = getTasks()
  const idx = tasks.findIndex((task) => task.id === taskToUpdate.id)
  if (idx < 0) {
    // If the task is new, we add it:
    tasks.push({
      ...taskToUpdate,
      id: crypto.randomUUID(),
      nextEpochDay: getCurrentEpochDay() + taskToUpdate.daysFromNow
    })
  } else {
    // Otherwise we update the existing task
    const task = tasks[idx]
    tasks[idx] = {
      ...task,
      ...taskToUpdate
    }
  }
  setTasks(tasks)
  res.json(tasks)
})

app.listen(port, () => {
  console.log('Server listening on port', port)
})

// app.get('/api/v1/setTask', ({params, query}, res) => {});
