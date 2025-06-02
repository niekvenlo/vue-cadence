import type { Request, Response } from 'express'
import { dbDelete, dbGet, dbPatch, dbPost, dbPut } from './json'

export function GET(req: Request, res: Response) {
  if (req.params.resource === 'cads') {
    return res.json(dbGet('src/server/data/database.json', 'tasks'))
  }
  return res.json({ data: ['-empty-'], echo: true, method: 'GET' })
}

export function PATCH(req: Request, res: Response) {
  if (req.body.meta?.resource === 'cads') {
    return res.json(dbPatch('src/server/data/database.json', 'tasks', req.body.meta.id, req.body))
  }
  return res.json({ data: [req.body], echo: true, method: 'PATCH' })
}

export function POST(req: Request, res: Response) {
  if (req.body.meta?.resource === 'cads') {
    return res.json(dbPost('', '', req.body))
  }
  return res.json({ data: [req.body], echo: true, method: 'POST' })
}

export function PUT(req: Request, res: Response) {
  if (req.body.meta?.resource === 'cads') {
    const id = req.body.meta.id || req.body.id
    return res.json(dbPut('src/server/data/database.json', 'tasks', id, req.body))
  }
  return res.json({ data: [req.body], echo: true, method: 'PUT' })
}

export function DELETE(req: Request, res: Response) {
  if (req.body.meta?.resource === 'cads') {
    return res.json(dbDelete('src/server/data/database.json', 'tasks', req.body))
  }
  return res.json({ data: [], echo: true, method: 'DELETE' })
}
