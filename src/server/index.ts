import express from 'express'
import cors from 'cors'
import { getTasks, setTasks } from './db-access'
import { getLaolun, setLaolun } from './file.-access'
import { getCurrentEpochDay } from '../utils'

const port = process.env.PORT || 3333

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/v1/getTasks', (_req, res) => {
  res.json(getTasks())
})

app.post('/api/v1/setTasks', ({ body }, res) => {
  const tasks = body
  setTasks(tasks)
  res.json(tasks)
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

app.get('/api/v1/getLaolun', async (_req, res) => {
  res.json(await getLaolun())
})

app.post('/api/v1/setLaolun', async ({ body }, res) => {
  const { pinyin, phrases } = body
  await setLaolun({ pinyin, phrases })
  res.json(await getLaolun())
})

app.listen(port, () => {
  console.log('Server listening on port', port)
})

// app.get('/api/v1/setTask', ({params, query}, res) => {});
