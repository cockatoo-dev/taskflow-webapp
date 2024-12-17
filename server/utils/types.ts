export type TaskInfo = {
  id: string,
  title: string,
  description: string,
  isReady: boolean,
  isComplete: boolean
}

export type TaskDepsInfo = {
  id: string,
  title: string,
  isReady: boolean,
  isComplete: boolean
}

export type Task = {
  id: string,
  title: string,
  description: string,
  isComplete: boolean,
  isReady: boolean,
  deps: TaskDepsInfo[]
}
