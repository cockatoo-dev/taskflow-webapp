import { and, eq, or, asc, exists, lt, sql, gt } from 'drizzle-orm'
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1'
import type { H3Event } from "h3"
import { deps, tasks } from './schema'

export class db {
  private _db: DrizzleD1Database
  constructor(e: H3Event) {
    this._db = drizzle(e.context.cloudflare.env.CF_DB)
  }

  public isTaskExists = async (boardId: string, taskId: string) => {
    const dbData = await this._db.select({ tasks: tasks.taskId })
    .from(tasks)
    .where(and(
      eq(tasks.boardId, boardId),
      eq(tasks.taskId, taskId)
    ))

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
  
  public getTask = async (boardId: string, taskId: string) => {
    return (await this._db.select()
    .from(tasks)
    .where(and(
      eq(tasks.boardId, boardId),
      eq(tasks.taskId, taskId)
    )))
  }

  public getTaskPair = async (boardId: string, first: string, second: string) => {
    const dbData = await this._db.select()
    .from(tasks)
    .where(and(
      eq(tasks.boardId, boardId),
      or(
        eq(tasks.taskId, first),
        eq(tasks.taskId, second)
      )
    ))
    if (dbData.length < 2) {
      return []
    } else if (dbData[0].taskId === first) {
      return [dbData[0], dbData[1]]
    } else {
      return [dbData[1], dbData[0]]
    }
  }

  public getBoardTasks = async (boardId: string) => {
    return await this._db.select()
    .from(tasks)
    .where(eq(tasks.boardId, boardId))
    .orderBy(asc(tasks.title))
  }

  public getBoardTasksInfo = async (boardId: string) => {
    return await this._db.select({
      id: tasks.taskId,
      title: tasks.title,
      isComplete: tasks.isComplete,
      numDeps: tasks.numDeps
    })
    .from(tasks)
    .where(eq(tasks.boardId, boardId))
    .orderBy(asc(tasks.title))
  }

  public addTask = async (boardId: string, taskId: string, title: string, description: string) => {
    await this._db.insert(tasks)
    .values({ 
      boardId,
      taskId,
      title,
      description,
      numDeps: 0,
      isComplete: false
    })
  }

  public editTask = async (taskId: string, title: string, description: string) => {
    await this._db.update(tasks)
    .set({ title, description })
    .where(eq(tasks.taskId, taskId))
  }

  public setTaskComplete = async (taskId: string, isComplete: boolean) => {
    await this._db.update(tasks)
    .set({ isComplete: isComplete })
    .where(eq(tasks.taskId, taskId))

    
    // const depsInfoOld = await this._db.select({
    //   id: tasks.taskId,
    //   numDeps: tasks.numDeps
    // })
    // .from(deps)
    // .where(eq(deps.dest, taskId))
    // .innerJoin(tasks, eq(deps.source, tasks.taskId))

    const depsInfo = this._db.$with('completeDepsInfo').as(
      this._db.select({
        taskId: tasks.taskId,
        numDeps: tasks.numDeps
      })
      .from(deps)
      .where(eq(deps.dest, taskId))
      .innerJoin(tasks, eq(deps.source, tasks.taskId))
    )

    if (isComplete) {
      await this._db.update(tasks)
      .set({numDeps: 0})
      .where(and(
        exists(depsInfo),
        lt(tasks.numDeps, 1)
      ))
      await this._db.update(tasks)
      .set({numDeps: sql`${tasks.numDeps} - 1`})
      .where(and(
        exists(depsInfo),
        gt(tasks.numDeps, 0)
      ))
    } else {
      await this._db.update(tasks)
      .set({numDeps: 1})
      .where(and(
        exists(depsInfo),
        lt(tasks.numDeps, 1)
      ))
      await this._db.update(tasks)
      .set({numDeps: sql`${tasks.numDeps} + 1`})
      .where(and(
        exists(depsInfo),
        gt(tasks.numDeps, 0)
      ))
    }
  }

  public setTaskNumDeps = async (taskId: string, value: number) => {
    await this._db.update(tasks)
    .set({ numDeps: value })
    .where(eq(tasks.taskId, taskId))
  }

  public deleteTask = async (taskId: string) => {
    // const depsInfoOld = await this._db.select({
    //   id: tasks.taskId,
    //   num: tasks.numDeps
    // })
    // .from(deps)
    // .where(eq(deps.dest, taskId))
    // .innerJoin(tasks, eq(deps.source, tasks.taskId))

    const depsInfo = this._db.$with('deleteDepsInfo').as(
      this._db.select({
        id: tasks.taskId,
        num: tasks.numDeps
      })
      .from(deps)
      .where(eq(deps.dest, taskId))
      .innerJoin(tasks, eq(deps.source, tasks.taskId))
    )

    await this._db.update(tasks)
    .set({numDeps: 0})
    .where(and(
      exists(depsInfo),
      lt(tasks.numDeps, 1)
    ))
    await this._db.update(tasks)
    .set({numDeps: sql`${tasks.numDeps} - 1`})
    .where(and(
      exists(depsInfo),
      gt(tasks.numDeps, 0)
    ))

    // for (const i of depsInfoOld) {
    //   let newNum: number
    //   if (i.num < 1) {
    //     newNum = 0
    //   } else {
    //     newNum = i.num - 1
    //   }

    //   await this._db.update(tasks)
    //   .set({ numDeps: newNum })
    //   .where(eq(tasks.taskId, i.id))
    // }
    
    await this._db.delete(deps)
    .where(or(
      eq(deps.source, taskId),
      eq(deps.dest, taskId)
    ))

    await this._db.delete(tasks)
    .where(eq(tasks.taskId, taskId))
  }

  public getDeps = async () => {
    return await this._db.select()
    .from(deps)
  }

  public getDestDepsInfo = async (dest: string) => {
    return await this._db.select({
      taskId: tasks.taskId,
      title: tasks.title,
      numDeps: tasks.numDeps,
      isComplete: tasks.isComplete,
    })
    .from(deps)
    .orderBy(asc(tasks.title))
    .where(eq(deps.dest, dest))
    .innerJoin(tasks, eq(deps.source, tasks.taskId))
  }

  public getSourceDepsInfo = async (source: string) => {
    return await this._db.select({
      taskId: tasks.taskId,
      title: tasks.title,
      numDeps: tasks.numDeps,
      isComplete: tasks.isComplete,
    })
    .from(deps)
    .orderBy(asc(tasks.title))
    .where(eq(deps.source, source))
    .innerJoin(tasks, eq(deps.dest, tasks.taskId))
  }

  public addDeps = async (source: string, dest: string, newDepsNum: number) => {
    await this._db.transaction(async (t) => {
      await t.insert(deps)
      .values({ source, dest })

      await t.update(tasks)
      .set({ numDeps: newDepsNum })
      .where(eq(tasks.taskId, source))
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
      .where(eq(tasks.taskId, source))
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

// export const dbErrorHandler = (err: any) => {
//   if (err instanceof H3Error) {
//     throw err
//   }
  
//   if (err instanceof Error) {
//     console.log(err)
//     throw createError({
//       statusCode: 500,
//       statusMessage: `Database error:\n${err.message}`
//     })
//   } else {
//     throw createError({
//       statusCode: 500,
//       statusMessage: "Database error"
//     })
//   }
// }
