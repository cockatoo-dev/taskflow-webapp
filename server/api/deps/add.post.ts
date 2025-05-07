import { z } from "zod"
import { useDB } from "~~/server/db/db"

type DepsData = { source: string, dest: string }[]

// Filter dependency data to only include dependencies for the given source.
const getDepsNew = (data: DepsData, source: string) => {
  const deps = []
  for (const d of data) {
    if (d.source == source) {
      deps.push(d)
    }
  }
  return deps;
}

// Recursive DFS logic for checking if a new dependency would create a cycle.
const checkCycleNew = (data: DepsData, checked: string[], newSource: string, newDest: string) => {
  const deps = getDepsNew(data, newDest)
  for (const item of deps) {
    if (item.dest == newSource) {
      return true
    } else if (!checked.includes(item.dest)) {
      if (checkCycleNew(data, checked, newSource, item.dest)) {
        return true
      } else {
        checked.push(item.dest)
      }
    }
  }
  return false
}

// Check if adding a dependency from newSource to newDest would create a cycle.
const checkCycle = (data: DepsData, newSource: string, newDest: string) => {
  return checkCycleNew(data, [], newSource, newDest)
}

const bodySchema = z.object({
  boardId: z.string(),
  source: z.string(),
  dest: z.string()
})

// POST /api/deps/add
// Adds a dependency between two tasks on a board.
export default defineEventHandler(async (e) => {  
  await checkAPIWriteEnabled(e)
  
  const userId = await getUserId(e)
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)
  if (bodyData.source === bodyData.dest) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot create a dependency with the same task."
    })
  }

  const db = useDB(e)
  const boardInfo = await getBoardInfo(db, bodyData.boardId, userId)
  if (!canEdit(boardInfo.isOwner, boardInfo.publicPerms)) {
    throw createError({
      statusCode: 403,
      statusMessage: "You do not have permission to edit tasks on this board."
    })
  }

  const depsExists = await db.isDepsExist(bodyData.source, bodyData.dest)
  if (depsExists) {
    throw createError({
      statusCode: 400,
      statusMessage: "Dependency already exists."
    })
  }
 
  const tasksInfo = await db.getTaskPair(bodyData.boardId, bodyData.source, bodyData.dest)
  if (tasksInfo.length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: "One or more task IDs are invalid."
    })
  }

  let newNum: number
  if (tasksInfo[1].isComplete) {
    newNum = tasksInfo[0].numDeps
  } else if (tasksInfo[0].numDeps < 1) {
    newNum = 1
  } else {
    newNum = tasksInfo[0].numDeps + 1
  }
  
  const depsList = await db.getDeps(boardInfo.boardId)

  if (checkCycle(depsList, bodyData.source, bodyData.dest)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot create a circular dependency."
    })
  }

  await db.addDeps(bodyData.source, bodyData.dest, newNum)
  setResponseStatus(e, 204)
})
