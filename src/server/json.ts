import JSONdb from 'simple-json-db'

const databases = new Map<string, JSONdb<any>>()

type DbEntry = any & {
  id?: string
  meta?: {
    id: string
  }
}

type StdResponse =
  | {
      data: any[]
      lastModified: number | null
    }
  | { code: 404; error: string; context?: any }

const accessDatabase = (fileName: string) => {
  if (!databases.has(fileName)) {
    databases.set(fileName, new JSONdb(fileName, { asyncWrite: true }))
  }
  return databases.get(fileName)!
}

// Delete an existing entry.
export function dbDelete(fileName: string, key: string, id: string) {
  const originalData = accessDatabase(fileName).get(key) as DbEntry[]
  const newData = originalData.filter((element) => element.id === id)
  accessDatabase(fileName).set(key, newData)
  return { data: newData, lastModified: Date.now() }
}

// No-op. Get all entries.
export function dbGet(fileName: string, key: string): StdResponse {
  const originalData = accessDatabase(fileName).get(key) as DbEntry[]
  return { data: originalData, lastModified: null }
}

// Update an existing entry.
export function dbPatch(fileName: string, key: string, id: string, obj: any): StdResponse {
  const originalData = accessDatabase(fileName).get(key) as DbEntry[]
  const idx = originalData.findIndex((element: DbEntry) => element.id === id)
  if (idx < 0) {
    return {
      code: 404,
      error: 'not found',
      context: { verb: 'PATCH', fileName, key, obj, idx, originalData }
    }
  }
  const newData = [...originalData]
  newData[idx] = { ...newData[idx], ...obj }
  accessDatabase(fileName).set(key, newData)
  return { data: newData, lastModified: Date.now() }
}

// Create a new entry
export function dbPost(fileName: string, key: string, obj: any) {
  const originalData = accessDatabase(fileName).get(key) as DbEntry[]
  const id = crypto.randomUUID()
  const newEntry = { ...obj, id, meta: { resource: 'cads', id } }
  const newData = [...originalData, newEntry].sort((a, b) => (a.meta.id > b.meta.id ? -1 : 1))
  accessDatabase(fileName).set(key, newData)
  return { data: newData, lastUpdated: Date.now() }
}

// Replace an existing entry.
export function dbPut(fileName: string, key: string, id: string, obj: any) {
  const originalData = accessDatabase(fileName).get(key) as DbEntry[]
  const idx = originalData.findIndex((element: DbEntry) => element.id === id)
  if (idx < 0) {
    return {
      code: 404,
      error: 'not found',
      context: { verb: 'PUT', fileName, key, obj, idx, originalData }
    }
  }
  const newData = [...originalData]
  newData[idx] = obj
  accessDatabase(fileName).set(key, newData)
  return { data: newData, lastModified: Date.now() }
}
