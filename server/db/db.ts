import { and, eq, or, asc, exists, lt, sql, gt, gte, lte, ne } from 'drizzle-orm'
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1'
import type { H3Event } from "h3"
import { deps, tasks, boards } from './schema'

export class db {
  private _db: DrizzleD1Database
  constructor(e: H3Event) {
    this._db = drizzle(e.context.cloudflare.env.CF_DB)
  }

  public isBoardExists = async (boardId: string) => {
    const dbData = await this._db.select({ boardId: boards.boardId })
    .from(boards)
    .where(eq(boards.boardId, boardId))

    return dbData.length > 0
  }

  public getBoard = async (boardId: string) => {
    return (await this._db.select()
    .from(boards)
    .where(eq(boards.boardId, boardId)))
  }

  public addBoard = async (
    boardId: string, 
    ownerId: string, 
    title: string, 
    publicPerms: number
  ) => {
    await this._db.insert(boards).values({
      boardId,
      ownerId,
      title,
      publicPerms
    })
  }

  public editBoard = async (
    boardId: string, 
    ownerId: string,
    title: string,
    publicPerms: number
  ) => {
    await this._db.update(boards).set({
      title,
      publicPerms
    })
    .where(and(
      eq(boards.boardId, boardId),
      eq(boards.ownerId, ownerId)
    ))
  }

  public deleteBoard = async (boardId: string, ownerId: string) => {
    await this._db.delete(boards)
    .where(and(
      eq(boards.boardId, boardId),
      eq(boards.ownerId, ownerId)
    ))
  }
  
  public isTaskExists = async (boardId: string, taskId: string) => {
    const dbData = await this._db.select({ taskId: tasks.taskId })
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

    if (isComplete) {
      await this._db.update(tasks)
      .set({numDeps: 0})
      .where(and(
        ne(tasks.taskId, taskId),
        lte(tasks.numDeps, 1),
        exists(
          this._db.select()
          .from(deps)
          .where(and(
            eq(deps.source, tasks.taskId),
            eq(deps.dest, taskId)
          ))
        )
      ))
      await this._db.update(tasks)
      .set({numDeps: sql`${tasks.numDeps} - 1`})
      .where(and(
        ne(tasks.taskId, taskId),
        gt(tasks.numDeps, 1),
        exists(
          this._db.select()
          .from(deps)
          .where(and(
            eq(deps.source, tasks.taskId),
            eq(deps.dest, taskId)
          ))
        )
      ))
    } else {
      await this._db.update(tasks)
      .set({numDeps: sql`${tasks.numDeps} + 1`})
      .where(and(
        ne(tasks.taskId, taskId),
        gte(tasks.numDeps, 1),
        exists(
          this._db.select()
          .from(deps)
          .where(and(
            eq(deps.source, tasks.taskId),
            eq(deps.dest, taskId)
          ))
        )
      ))
      await this._db.update(tasks)
      .set({numDeps: 1})
      .where(and(
        ne(tasks.taskId, taskId),
        lt(tasks.numDeps, 1),
        exists(
          this._db.select()
          .from(deps)
          .where(and(
            eq(deps.source, tasks.taskId),
            eq(deps.dest, taskId)
          ))
        )
      ))
    }
  }
  
  public setTaskNumDeps = async (taskId: string, value: number) => {
    await this._db.update(tasks)
    .set({ numDeps: value })
    .where(eq(tasks.taskId, taskId))
  }

  public deleteTask = async (taskId: string) => {
    await this._db.update(tasks)
      .set({numDeps: 0})
      .where(and(
        ne(tasks.taskId, taskId),
        lte(tasks.numDeps, 1),
        exists(
          this._db.select()
          .from(deps)
          .where(and(
            eq(deps.source, tasks.taskId),
            eq(deps.dest, taskId)
          ))
        )
      ))
      await this._db.update(tasks)
      .set({numDeps: sql`${tasks.numDeps} - 1`})
      .where(and(
        ne(tasks.taskId, taskId),
        gt(tasks.numDeps, 1),
        exists(
          this._db.select()
          .from(deps)
          .where(and(
            eq(deps.source, tasks.taskId),
            eq(deps.dest, taskId)
          ))
        )
      ))
    
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
    await this._db.insert(deps)
    .values({ source, dest })

    await this._db.update(tasks)
    .set({ numDeps: newDepsNum })
    .where(eq(tasks.taskId, source))
  }

  public removeDeps = async (source: string, dest: string, newDepsNum: number) => {
    await this._db.delete(deps)
    .where(and(
      eq(deps.source, source),
      eq(deps.dest, dest)
    ))

    await this._db.update(tasks)
    .set({ numDeps: newDepsNum })
    .where(eq(tasks.taskId, source))
  }
}

let dbInstance: db | undefined = undefined

export const useDB = (e: H3Event) => {
  if (!dbInstance) {
    dbInstance = new db(e)
  }
  return dbInstance
}

