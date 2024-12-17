export const taskSortNum = (isComplete: boolean, numDeps: number) => {
  if (isComplete) {
    return 0
  } else if (numDeps <= 0) {
    return 2
  } else {
    return 1
  }
}