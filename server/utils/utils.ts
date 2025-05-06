import type { z } from "zod";
import type { db } from "../db/db";
import type { H3Event } from "h3"

// Quick way to manually enable or disable the API.
// May be used during manual testing.
// This is not used in production.
export const checkAPIEnabled = () => {
  return
  // throw createError({
  //   statusCode: 400,
  //   statusMessage: 'The API is temporarily disabled. Please try again later.'
  // })
}

// Check the result of a zod parse. 
// If it fails, throw an error with a 400 status code
// and a message indicating that the request format is invalid.
// If it succeeds, return the parsed data.
// This is used to check the result of a zod parse in the API handlers.
export const checkParseResult = <T>(b: z.SafeParseReturnType<T, T>) => {
  if (!b.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request format"
    })
  } else {
    return b.data
  }
}

// Check if a task exists on a board.
export const checkTaskExists = async (db: db, boardId: string, taskId: string) => {
  if (!(await db.isTaskExists(boardId, taskId))) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task ID"
    })
  }
}

// Check if a user has permission to mark a task as completed.
// Owner OR public permissions = 1 or 2
export const canSetComplete = (
  isOwner: boolean, publicPerms: number
) => {
  if (isOwner) {
    return true
  } else {
    return publicPerms >= 1
  }
}

// Check if a user has permission to edit a task.
// Owner OR public permissions = 2
export const canEdit = (
  isOwner: boolean, publicPerms: number
) => {
  if (isOwner) {
    return true
  } else {
    return publicPerms === 2
  }
}

// Get information about a board.
// This includes the board ID, whether the user is the owner of the board,
// the title of the board, and the public permissions of the board.
export const getBoardInfo = async (db: db, boardId: string, userId: string | null) => {
  const dbData = await db.getBoard(boardId)
  if (dbData.length === 0) {
    throw createError({
      status: 400,
      message: 'Invalid board ID.'
    })
  } else {
    return {
      boardId: dbData[0].boardId,
      isOwner: dbData[0].ownerId === userId,
      title: dbData[0].title,
      publicPerms: dbData[0].publicPerms
    }
  }
}

// Get the user ID from the session, 
// or null if the user is not logged in.
export const getUserId = async (e: H3Event) => {
  const session = await getUserSession(e)
  if (session.user) {
    return session.user.userId
  } else {
    return null
  }
}

// Get the user ID from the session, 
// or throw an error if the user is not logged in.
export const requireUserId = async (e: H3Event) => {
  const session = await requireUserSession(e)
  return session.user.userId
}
