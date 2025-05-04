import { and, eq, or, asc, exists, lt, sql, gt, gte, lte, ne } from 'drizzle-orm'
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1'
import type { H3Event } from "h3"
import { deps, tasks, boards } from './schema'

export class db {
  private _db: DrizzleD1Database
  constructor(e: H3Event) {
    this._db = drizzle(e.context.cloudflare.env.CF_DB)
  }

  /**
   * Check if a board exists.
   * @param boardId board ID
   * @returns true if the board exists, false otherwise
   */
  public isBoardExists = async (boardId: string) => {
    const dbData = await this._db.select({ boardId: boards.boardId })
    .from(boards)
    .where(eq(boards.boardId, boardId))

    return dbData.length > 0
  }

  /**
   * Get information about a board.
   * @param boardId board ID
   * @returns board name, owner ID, and public permissions
   */
  public getBoard = async (boardId: string) => {
    return (await this._db.select()
    .from(boards)
    .where(eq(boards.boardId, boardId)))
  }

  /**
   * Add a new board to the database.
   * @param boardId board ID
   * @param ownerId owner ID
   * @param title board title
   * @param publicPerms public permissions
   */
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

  /**
   * Edit an existing board.
   * @param boardId board ID
   * @param ownerId owner ID
   * @param title board title
   * @param publicPerms public permissions
   */
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

  /**
   * Delete a board.
   * @param boardId board ID
   * @param ownerId owner ID
   */
  public deleteBoard = async (boardId: string, ownerId: string) => {
    await this._db.batch([
      this._db.delete(deps)
      .where(exists(
        this._db.select().from(tasks)
        .where(and(
          eq(deps.source, tasks.taskId),
          eq(tasks.boardId, boardId)
        ))
      )),
      this._db.delete(boards)
      .where(and(
        eq(boards.boardId, boardId),
        eq(boards.ownerId, ownerId)
      ))
    ])
  }

  /**
   * Get all boards owned by a user.
   * @param userId user ID
   * @returns array of boards (board ID, title, and public permissions)
   */
  public getUserBoards = async (userId: string) => {
    return await this._db.select({
      boardId: boards.boardId,
      title: boards.title,
      publicPerms: boards.publicPerms
    })
    .from(boards)
    .where(eq(boards.ownerId, userId))
  }

  /**
   * Delete all boards owned by a user.
   * @param userId user ID
   */
  public deleteUserBaords = async (userId: string) => {
    await this._db.batch([
      this._db.delete(deps)
      .where(exists(
        this._db.select().from(tasks)
        .innerJoin(boards, eq(tasks.boardId, boards.boardId))
        .where(and(
          eq(deps.source, tasks.taskId),
          eq(boards.ownerId, userId)
        ))
      )),
      this._db.delete(boards)
      .where(eq(boards.ownerId, userId))
    ])
  }
  
  /**
   * Check if a task exists on a board.
   * @param boardId board ID
   * @param taskId task ID
   * @returns true if the task exists, false otherwise
   */
  public isTaskExists = async (boardId: string, taskId: string) => {
    const dbData = await this._db.select({ taskId: tasks.taskId })
    .from(tasks)
    .where(and(
      eq(tasks.boardId, boardId),
      eq(tasks.taskId, taskId)
    ))

    return dbData.length > 0
  }

  /**
   * Check if a dependency exists between two tasks.
   * @param source source task ID
   * @param dest dest task ID
   * @returns true if the dependency exists, false otherwise
   */
  public isDepsExist = async (source: string, dest: string) => {
    const dbData = await this._db.select({ id: deps.source })
    .from(deps)
    .where(and(
      eq(deps.source, source),
      eq(deps.dest, dest)
    ))

    return dbData.length > 0
  }
  
  /**
   * Get information about a task.
   * @param boardId board ID
   * @param taskId task ID
   * @returns task ID, title, description, number of dependencies, and completion status
   */
  public getTask = async (boardId: string, taskId: string) => {
    return (await this._db.select()
    .from(tasks)
    .where(and(
      eq(tasks.boardId, boardId),
      eq(tasks.taskId, taskId)
    )))
  }

  /**
   * Get information about two tasks. Useful when managing dependencies.
   * @param boardId board ID
   * @param first first task ID
   * @param second second task ID
   * @returns array of two tasks (task ID, title, description, number of dependencies, and completion status),
   * first task will always be in position 0 and second task in position 1.
   */
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

  /**
   * Get all tasks on a board.
   * @param boardId board ID
   * @returns array of tasks (task ID, title, description, number of dependencies, and completion status)
   */
  public getBoardTasks = async (boardId: string) => {
    return await this._db.select()
    .from(tasks)
    .where(eq(tasks.boardId, boardId))
    .orderBy(asc(tasks.title))
  }

  /**
   * Get limited information about all tasks on a board.
   * @param boardId board ID
   * @returns list of tasks (task ID, title, and completion status)
   */
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

  /**
   * Add a new task to a board.
   * @param boardId board ID
   * @param taskId task ID
   * @param title task title
   * @param description task description
   */
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

  /**
   * Edit an existing task.
   * @param taskId task ID
   * @param title task title
   * @param description task description
   */
  public editTask = async (taskId: string, title: string, description: string) => {
    await this._db.update(tasks)
    .set({ title, description })
    .where(eq(tasks.taskId, taskId))
  }

  /**
   * Set the completion status of a task, and update the number of dependencies
   * for tasks that depend on this task.
   * @param taskId task ID
   * @param isComplete completion status
   */
  public setTaskComplete = async (taskId: string, isComplete: boolean) => {
    if (isComplete) {
      await this._db.batch([
        this._db.update(tasks)
        .set({ isComplete: isComplete })
        .where(eq(tasks.taskId, taskId)),

        this._db.update(tasks)
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
        )),

        this._db.update(tasks)
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
      ])
    } else {
      await this._db.batch([
        this._db.update(tasks)
        .set({ isComplete: isComplete })
        .where(eq(tasks.taskId, taskId)),

        this._db.update(tasks)
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
        )),

        this._db.update(tasks)
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
      ])
    }
  }
  
  /**
   * Set the number of dependencies for a task.
   * @param taskId task ID
   * @param value number of dependencies
   */
  public setTaskNumDeps = async (taskId: string, value: number) => {
    await this._db.update(tasks)
    .set({ numDeps: value })
    .where(eq(tasks.taskId, taskId))
  }

  /**
   * Delete a task and all dependencies with this task, 
   * and update the number of dependencies for tasks that depend on this task.
   * @param taskId task ID
   */
  public deleteTask = async (taskId: string) => {
    const task = await this._db.select()
    .from(tasks)
    .where(eq(tasks.taskId, taskId))
    if (task[0].isComplete) {
      await this._db.batch([
        this._db.delete(deps)
        .where(or(
          eq(deps.source, taskId),
          eq(deps.dest, taskId)
        )),
        this._db.delete(tasks)
        .where(eq(tasks.taskId, taskId))
      ])
    } else {
      await this._db.batch([
        this._db.update(tasks)
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
        )),

        this._db.update(tasks)
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
        )),

        this._db.delete(deps)
        .where(or(
          eq(deps.source, taskId),
          eq(deps.dest, taskId)
        )),

        this._db.delete(tasks)
        .where(eq(tasks.taskId, taskId))
      ])
    }
  }

  /**
   * Get all dependencies between tasks for a board.
   * @param boardId board ID
   * @returns array of dependencies (source task ID, dest task ID)
   */
  public getDeps = async (boardId: string) => {
    return await this._db.select({
      source: deps.source,
      dest: deps.dest
    })
    .from(deps)
    .innerJoin(tasks, eq(deps.source, tasks.taskId))
    .where(eq(tasks.boardId, boardId))
  }

  /**
   * Get information about tasks where a task is the destination of a dependency.
   * @param dest destination task ID
   * @returns task ID, title, number of dependencies, and completion status
   */
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

  /**
   * Get information about tasks where a task is the source of a dependency.
   * @param source source task ID
   * @returns task ID, title, number of dependencies, and completion status
   */
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

  /**
   * Add a dependency between two tasks.
   * @param source source task ID
   * @param dest destination task ID
   * @param newDepsNum mew number of dependencies for the source task
   */
  public addDeps = async (source: string, dest: string, newDepsNum: number) => {
    await this._db.batch([
      this._db.insert(deps)
      .values({ source, dest }),

      this._db.update(tasks)
      .set({ numDeps: newDepsNum })
      .where(eq(tasks.taskId, source))
    ])
  }

  /**
   * Remove a dependency between two tasks.
   * @param source source task ID
   * @param dest destination task ID
   * @param newDepsNum new number of dependencies for the source task
   */
  public removeDeps = async (source: string, dest: string, newDepsNum: number) => {
    await this._db.batch([
      this._db.delete(deps)
      .where(and(
        eq(deps.source, source),
        eq(deps.dest, dest)
      )),

      this._db.update(tasks)
      .set({ numDeps: newDepsNum })
      .where(eq(tasks.taskId, source))
    ])
    
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

/**
 * Get the database instance.
 * @param e H3 event, pass directly from the event handler
 * @returns database instance
 */
export const useDB = (e: H3Event) => {
  if (!dbInstance) {
    dbInstance = new db(e)
  }
  return dbInstance
}
