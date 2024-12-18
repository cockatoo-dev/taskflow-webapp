import type { z } from "zod";
import type { db } from "../db/db";

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
