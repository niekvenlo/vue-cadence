import JSONdb from 'simple-json-db'

// TODO: withMeta should be removed

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
  | { code: 400 | 404; error: string; context?: any }

const accessDatabase = (fileName: string) => {
  if (!databases.has(fileName)) {
    databases.set(fileName, new JSONdb(fileName, { asyncWrite: true }))
  }
  return databases.get(fileName)!
}

function hasDataIds(data: any[]) {
  const hasData = data.length
  const hasId = data[0].id !== undefined || !data[0].meta?.id !== undefined
  return hasData && hasId
}

// Delete an existing entry.
export function dbDelete(fileName: string, key: string, id: string) {
  const originalData = accessDatabase(fileName).get(key) as DbEntry[]
  if (!hasDataIds(originalData)) {
    return {
      code: 400,
      error: 'source data cannot be deleted because the data set does not have ids',
      context: { originalData }
    }
  }
  const newData = originalData.filter((element) => element.id !== id)
  if (newData.length === originalData.length) {
    return {
      code: 404,
      error: 'not found',
      context: {
        actualIds: originalData.map((element) => element.id),
        id
      }
    }
  }
  accessDatabase(fileName).set(key, newData)
  const withMeta = newData.map((f) => ({ ...f, meta: { resource: 'cads', id: f.id } }))
  return { data: withMeta, count: newData.length, lastModified: Date.now(), verb: 'DELETE' }
}

// No-op. Get all entries.
export function dbGet(fileName: string, key: string): StdResponse {
  const originalData = accessDatabase(fileName).get(key) as DbEntry[]
  const withMeta = originalData.map((f) => ({
    ...f,
    meta: { resource: 'cads', id: f.id }
  }))
  withMeta.forEach((d) => delete d.daysFromNow)
  return { data: withMeta, lastModified: null }
}

// Update an existing entry.
export function dbPatch(fileName: string, key: string, id: string, obj: any): StdResponse {
  const originalData = accessDatabase(fileName).get(key) as DbEntry[]
  if (!hasDataIds(originalData)) {
    return {
      code: 400,
      error: 'source data cannot be patched because the data set does not have ids',
      context: { originalData }
    }
  }
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
  const withMeta = newData.map((f) => ({
    ...f,
    meta: { resource: 'cads', id: f.id }
  }))
  return { data: withMeta, lastModified: Date.now() }
}

// Create a new entry
export function dbPost(fileName: string, key: string, obj: any) {
  const originalData = accessDatabase(fileName).get(key) as DbEntry[]
  const id = crypto.randomUUID()
  const newEntry = { ...obj, id, meta: { resource: 'cads', id } }
  const newData = [...originalData, newEntry]
    .sort((a, b) => (a.id > b.id ? -1 : 1))
    .sort((a, b) => (a.meta?.id > b.meta?.id ? -1 : 1))
  accessDatabase(fileName).set(key, newData)
  const withMeta = newData.map((f) => ({ ...f, meta: { resource: 'cads', id: f.id } }))
  return { data: withMeta, lastUpdated: Date.now() }
}

// Replace an existing entry.
export function dbPut(fileName: string, key: string, id: string, obj: any) {
  const originalData = accessDatabase(fileName).get(key) as DbEntry[]
  if (!hasDataIds(originalData)) {
    return {
      code: 400,
      error: 'source data cannot be replaced because the data set does not have ids',
      context: { originalData }
    }
  }
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
  const withMeta = newData.map((f) => ({ ...f, meta: { resource: 'cads', id: f.id } }))
  return { data: withMeta, lastModified: Date.now() }
}
