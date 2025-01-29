import type { z } from "zod";
import type { db } from "../db/db";
import type { H3Event } from "h3"

export const checkAPIEnabled = () => {
  return
  // throw createError({
  //   statusCode: 400,
  //   statusMessage: 'The API is temporarily disabled. Please try again later.'
  // })
}

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

export const checkTaskExists = async (db: db, boardId: string, taskId: string) => {
  if (!(await db.isTaskExists(boardId, taskId))) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task ID"
    })
  }
}

export const canSetComplete = (
  isOwner: boolean, publicPerms: number
) => {
  if (isOwner) {
    return true
  } else {
    return publicPerms >= 1
  }
}

export const canEdit = (
  isOwner: boolean, publicPerms: number
) => {
  if (isOwner) {
    return true
  } else {
    return publicPerms === 2
  }
}

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

export const getUserId = async (e: H3Event) => {
  const session = await getUserSession(e)
  if (session.user) {
    return session.user.userId
  } else {
    return null
  }
}

export const requireUserId = async (e: H3Event) => {
  const session = await requireUserSession(e)
  return session.user.userId
}
