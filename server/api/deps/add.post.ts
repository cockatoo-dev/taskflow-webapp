import { dbErrorHandler, useDB } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  
  type DepsData = { source: string, dest: string }[]
  
  const getDepsNew = (data: DepsData, source: string) => {
    const deps = []
    for (const d of data) {
      if (d.source == source) {
        deps.push(d)
      }
    }
    return deps;
  }

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

  const checkCycle = (data: DepsData, newSource: string, newDest: string) => {
    return checkCycleNew(data, [], newSource, newDest)
  }
  
  const body = await readBody(e)
  const db = useDB(e)

  if (body.source == undefined || body.dest == undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request format"
    })
  }

  try {
    const tasksInfo = await db.getTaskPair(body.source, body.dest)
    if (tasksInfo.length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: "One or more task IDs are invalid."
      })
    }

    let newNum
    if (tasksInfo[0].id == body.source) {
      if (tasksInfo[1].isComplete) {
        newNum = tasksInfo[0].numDeps
      } else if (tasksInfo[0].numDeps < 1) {
        newNum = 1
      } else {
        newNum = tasksInfo[0].numDeps + 1
      }
    } else {
      if (tasksInfo[0].isComplete) {
        newNum = tasksInfo[1].numDeps
      } else if (tasksInfo[1].numDeps < 1) {
        newNum = 1
      } else {
        newNum = tasksInfo[1].numDeps + 1
      }
    }
    
    const depsList = await db.getDeps()

    if (checkCycle(depsList, body.source, body.dest)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cannot create a circular dependency."
      })
    }

    await db.addDeps(body.source, body.dest, newNum)
    return {}
  } catch (err) {
    dbErrorHandler(err)
  }
})