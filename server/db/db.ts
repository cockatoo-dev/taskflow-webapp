import { and, eq, or, asc } from 'drizzle-orm'
import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1'
import { H3Error, type EventHandlerRequest, type H3Event } from "h3"
import { deps, tasks } from './schema'

export class db {
  private _db: DrizzleD1Database
  constructor(e: H3Event) {
    this._db = drizzle(e.context.cloudflare.env.CF_DB)
  }

  public isTaskExists = async (id: string) => {
    const dbData = await this._db.select({ tasks: tasks.id })
    .from(tasks)
    .where(eq(tasks.id, id))

    return dbData.length > 0
  }

  public isDepsExist = async (source: string, dest: string) => {
    const dbData = await this._db.select({ id: deps.source })
    .from(deps)
    .where(and(
      eq(deps.source, source),
      eq(deps.dest, dest)
    ))

    return dbData.length > 0
  }
  
  public getTask = async (id: string) => {
    return (await this._db.select()
    .from(tasks)
    .where(eq(tasks.id, id)))
  }

  public getTaskPair = async (first: string, second: string) => {
    return (await this._db.select()
    .from(tasks)
    .where(or(
      eq(tasks.id, first),
      eq(tasks.id, second)
    )))
  }

  public getTasks = async () => {
    return await this._db.select()
    .from(tasks)
    .orderBy(asc(tasks.title))
  }

  public getTasksInfo = async () => {
    return await this._db.select({
      id: tasks.id,
      title: tasks.title,
      isComplete: tasks.isComplete,
      numDeps: tasks.numDeps
    })
    .from(tasks)
    .orderBy(asc(tasks.title))
  }

  public addTask = async (id: string, title: string, description: string) => {
    await this._db.insert(tasks)
    .values({ 
      id,
      title,
      description,
      numDeps: 0,
      isComplete: false
    })
  }

  public editTask = async (id: string, title: string, description: string) => {
    await this._db.update(tasks)
    .set({ title, description })
    .where(eq(tasks.id, id))
  }

  public setTaskComplete = async (id: string, value: boolean) => {
    await this._db.transaction(async (t) => {
      await t.update(tasks)
      .set({ isComplete: value })
      .where(eq(tasks.id, id))

      const depsInfo = await t.select({
        id: tasks.id,
        title: tasks.title,
        numDeps: tasks.numDeps,
        isComplete: tasks.isComplete,
      })
      .from(deps)
      .where(eq(deps.dest, id))
      .innerJoin(tasks, eq(deps.source, tasks.id))

      for (const i of depsInfo) {
        if (value) {
          if (i.numDeps < 1) {
            await t.update(tasks)
            .set({ numDeps: 0 })
            .where(eq(tasks.id, i.id))
          } else {
            await t.update(tasks)
            .set({ numDeps: i.numDeps - 1 })
            .where(eq(tasks.id, i.id))
          }
        } else {
          if (i.numDeps < 1) {
            await t.update(tasks)
            .set({ numDeps: 1 })
            .where(eq(tasks.id, i.id))
          } else {
            await t.update(tasks)
            .set({ numDeps: i.numDeps + 1 })
            .where(eq(tasks.id, i.id))
          }
        }
      }
    })
    
  }

  public setTaskNumDeps = async (id: string, value: number) => {
    await this._db.update(tasks)
    .set({ numDeps: value })
    .where(eq(tasks.id, id))
  }

  public deleteTask = async (id: string) => {
    await this._db.transaction(async (t) => {
      const depsInfo = await t.select({
        id: tasks.id,
        num: tasks.numDeps
      })
      .from(deps)
      .where(eq(deps.dest, id))
      .innerJoin(tasks, eq(deps.source, tasks.id))

      for (const i of depsInfo) {
        let newNum: number
        if (i.num < 1) {
          newNum = 0
        } else {
          newNum = i.num - 1
        }

        await t.update(tasks)
        .set({ numDeps: newNum })
        .where(eq(tasks.id, i.id))
      }
      
      await t.delete(deps)
      .where(or(
        eq(deps.source, id),
        eq(deps.dest, id)
      ))

      await t.delete(tasks)
      .where(eq(tasks.id, id))
    })
  }

  public getDeps = async () => {
    return await this._db.select()
    .from(deps)
  }

  public getDestDepsInfo = async (dest: string) => {
    return await this._db.select({
      id: tasks.id,
      title: tasks.title,
      numDeps: tasks.numDeps,
      isComplete: tasks.isComplete,
    })
    .from(deps)
    .orderBy(asc(tasks.title))
    .where(eq(deps.dest, dest))
    .innerJoin(tasks, eq(deps.source, tasks.id))
  }

  public getSourceDepsInfo = async (source: string) => {
    return await this._db.select({
      id: tasks.id,
      title: tasks.title,
      numDeps: tasks.numDeps,
      isComplete: tasks.isComplete,
    })
    .from(deps)
    .orderBy(asc(tasks.title))
    .where(eq(deps.source, source))
    .innerJoin(tasks, eq(deps.dest, tasks.id))
  }

  public addDeps = async (source: string, dest: string, newDepsNum: number) => {
    await this._db.transaction(async (t) => {
      await t.insert(deps)
      .values({ source, dest })

      await t.update(tasks)
      .set({ numDeps: newDepsNum })
      .where(eq(tasks.id, source))
    })
    
  }

  public removeDeps = async (source: string, dest: string, newDepsNum: number) => {
    await this._db.transaction(async (t) => {
      await t.delete(deps)
      .where(and(
        eq(deps.source, source),
        eq(deps.dest, dest)
      ))

      await t.update(tasks)
      .set({ numDeps: newDepsNum })
      .where(eq(tasks.id, source))
    })
  }
}

let dbInstance: db | undefined = undefined

export const useDB = (e: H3Event) => {
  if (!dbInstance) {
    dbInstance = new db(e)
  }
  return dbInstance
}

export const dbErrorHandler = (err: any) => {
  if (err instanceof H3Error) {
    throw err
  }
  
  if (err instanceof Error) {
    console.log(err)
    throw createError({
      statusCode: 500,
      statusMessage: `Database error:\n${err.message}`
    })
  } else {
    throw createError({
      statusCode: 500,
      statusMessage: "Database error"
    })
  }
}
