import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import {
  checkConnectionsCache,
  getGetConnectionsSaveData,
  getTasks,
  setTasks,
  updateGetConnectionsSaveData
} from './db-access'
import { getLaolun, setLaolun, uploadSingleRecording } from './file.-access'
import { getNYConn } from './external-api-access'
import { getCurrentEpochDay } from '../utils'
import type { DbTask } from './db-access'
import { DELETE, GET, PATCH, POST, PUT } from './verbs'
import { getUserByPw, getUserByUuid } from './user'

// Adding a field to the EXPRESS REQUEST object
declare global {
  namespace Express {
    interface Request {
      user: User
    }
  }
}

type User = {
  code: string
}

const port = process.env.PORT || 3333

const app = express()
app.use(cookieparser())
app.use(cors({ origin: [/^http:\/\/(localhost|62.131.229.29)/], credentials: true }))
app.use(express.json())

// Auth middleware
app.use((req, res, next) => {
  const DAY = 24 * 60 * 60 * 1000
  const uuid = (req.cookies.peanut || '') as string
  const userByUuid = getUserByUuid(uuid)
  if (userByUuid) {
    req.user = userByUuid
    next()
    return
  }
  const userByPw = getUserByPw(req.query.pw?.toString())
  if (userByPw) {
    res.cookie('peanut', userByPw.uuid, { maxAge: 90 * DAY })
    res.json({ message: 'SID: Authorised' })
    return
  }
  res.json({ error: 'Not recognised' })
  return
})

{
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
    tasks.forEach((t: DbTask) => delete t.daysFromNow)
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
    res.json(tasks)
    tasks.forEach((t: DbTask) => (t.nextEpochDay = getCurrentEpochDay() + t.daysFromNow!))
    tasks.forEach((t: DbTask) => delete t.daysFromNow)
    setTasks(tasks)
  })

  app.get('/api/v1/getNYConn', async ({ query }, res) => {
    const year = query.year?.toString()
    const month = query.month?.toString()
    const date = query.date?.toString()
    // const entry = await getNYConn({ year, month, date })
    const entry = await checkConnectionsCache(`${year}-${month}-${date}`, () =>
      getNYConn({ year, month, date })
    )
    res.json(entry)
  })

  app.get('/api/v1/getNYConnSave', async (_req, res) => {
    res.json(await getGetConnectionsSaveData())
  })

  app.get('/api/v1/updateNYConnSave', async (req, res) => {
    res.json(await updateGetConnectionsSaveData(req.query))
  })

  app.get('/api/v1/getLaolun', async (_req, res) => {
    res.json(await getLaolun())
  })

  app.post('/api/v1/setLaolun', async ({ body }, res) => {
    const { pinyin, phrases } = body
    await setLaolun({ pinyin, phrases })
    res.json(await getLaolun())
  })

  app.post('/api/v1/uploadLaolunRecording', uploadSingleRecording, async ({ file }, res) => {
    res.json({ message: 'File uploaded successfully', filename: file?.filename })
  })
}

//////////////////////// V2

app.get('/api/v2/freeform/:resource', GET)
app.post('/api/v2/freeform', POST)
app.patch('/api/v2/freeform', PATCH)
app.put('/api/v2/freeform', PUT)
app.delete('/api/v2/freeform', DELETE)

app.get('/api/v2/tokens', (req, res) => {
  // NO-OP: Cookie middleware can handle all responses.
  res.json({ justInCase: '444' })
})

////////////////////////
app.listen(port, () => {
  console.log('Server listening on port', port)
})
