import type { Request, Response } from 'express'
import { dbDelete, dbGet, dbPatch, dbPost, dbPut } from './json'

const getCadsFileName = (req: Request) => {
  const fileNames = <{ [key: string]: string }>{
    us: 'src/server/data/database.json',
    gg: 'src/server/data/gg.json'
  }
  const userCode = req.user.code
  const fileName = fileNames[userCode]
  return fileName
}

export function GET(req: Request, res: Response) {
  console.log(`Handling    GET request for ${req.user.code} @ ${new Date().toLocaleTimeString()}`)
  if (req.params.resource === 'cads') {
    return res.json(dbGet(getCadsFileName(req), 'tasks'))
  }
  return res.json({ data: ['-empty-'], echo: true, method: 'GET' })
}

export function PATCH(req: Request, res: Response) {
  console.log(`Handling  PATCH request for ${req.user.code} @ ${new Date().toLocaleTimeString()}`)
  if (req.body.meta?.resource === 'cads') {
    return res.json(dbPatch(getCadsFileName(req), 'tasks', req.body.meta.id, req.body))
  }
  return res.json({ data: [req.body], echo: true, method: 'PATCH' })
}

export function POST(req: Request, res: Response) {
  console.log(`Handling   POST request for ${req.user.code} @ ${new Date().toLocaleTimeString()}`)
  if (req.body.meta?.resource === 'cads') {
    return res.json(dbPost(getCadsFileName(req), 'tasks', req.body))
  }
  return res.json({ data: [req.body], echo: true, method: 'POST' })
}

export function PUT(req: Request, res: Response) {
  console.log(`Handling    PUT request for ${req.user.code} @ ${new Date().toLocaleTimeString()}`)
  if (req.body.meta?.resource === 'cads') {
    const id = req.body.meta.id || req.body.id
    return res.json(dbPut(getCadsFileName(req), 'tasks', id, req.body))
  }
  return res.json({ data: [req.body], echo: true, method: 'PUT' })
}

export function DELETE(req: Request, res: Response) {
  console.log(`Handling DELETE request for ${req.user.code} @ ${new Date().toLocaleTimeString()}`)
  if (req.body.meta?.resource === 'cads') {
    const id = req.body.meta.id || req.body.id
    return res.json(dbDelete(getCadsFileName(req), 'tasks', id))
  }
  return res.json({ data: [], echo: true, method: 'DELETE' })
}
