import express from 'express'
import cors from 'cors'
import { getTasks, setTasks } from './db-access'
import { getLaolun, setLaolun, uploadSingleRecording } from './file.-access'
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

app.get('/api/v1/getNYConn', async (_req, res) => {
  fetch('https://connectionsgame.org/get/getdaily.php?game=25-05-2025', {
    credentials: 'include',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0',
      Accept: '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Alt-Used': 'connectionsgame.org',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin'
    },
    referrer: 'https://connectionsgame.org/?game=25-05-2025',
    method: 'GET',
    mode: 'cors'
  })
    .then((response) => response.json())
    .then((json) => res.json(json))
    .catch((err) => console.log(err))
})

app.post('/api/v1/setLaolun', async ({ body }, res) => {
  const { pinyin, phrases } = body
  await setLaolun({ pinyin, phrases })
  res.json(await getLaolun())
})

app.post('/api/v1/uploadLaolunRecording', uploadSingleRecording, async ({ file }, res) => {
  res.json({ message: 'File uploaded successfully', filename: file?.filename })
})

app.listen(port, () => {
  console.log('Server listening on port', port)
})

// app.get('/api/v1/setTask', ({params, query}, res) => {});
