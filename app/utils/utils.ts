import { FetchError } from 'ofetch'

// Web app URL
export const BASE_URL = 'taskflow-webapp.pages.dev'

// Class lists and configuration objects for various UI components

export const BUTTON_UI_OBJECT = {
  variant: {
    solid: 'bg-{color}-500 dark:bg-{color}-500 hover:bg-{color}-600 dark:hover:bg-{color}-400 disabled:bg-{color}-500 dark:disabled:bg-{color}-500 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-500 text-slate-100 dark:text-slate-900 text-base font-bold',
    ghost: 'hover:bg-{color}-100 dark:hover:bg-{color}-900 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-500 text-{color}-600 dark:text-{color}-400 text-base font-normal'
  },
  default: {
    loadingIcon: 'heroicons:arrow-path-16-solid'
  }
}

export const BUTTON_SOLID_CLASS = 'text-base font-bold text-slate-100 dark:text-slate-900'
export const BUTTON_GHOST_CLASS = 'text-base font-normal'
export const GITHUB_BUTTON_CLASS = 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-slate-100 dark:text-slate-900 text-base font-bold'

export const GITHUB_BUTTON_UI_OBJECT = {
  color: {black: {solid: 'bg-black hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-slate-200 dark:text-slate-800 text-base font-bold'}}
}

export const TEXT_INPUT_UI = {base: 'text-base text-slate-800 dark:text-slate-200'}

export const TEXT_INPUT_UI_OBJECT = {
  placeholder: 'placeholder-slate-500 dark:placeholder-slate-500',
  size: {sm: 'text-base', lg: 'text-2xl'},
  color: {white: {outline: 'bg-white dark:bg-black ring-slate-300 dark:ring-slate-700 focus:ring-teal-500 dark:focus:ring-teal-500 text-slate-800 dark:text-slate-200'}},
  icon: {color: 'text-slate-500 dark:text-slate-500'},
}

export const DROPDOWN_UI = {item: 'text-base font-normal'}

export const DROPDOWN_UI_OBJECT = {item: {
  ring: 'ring-teal-500 dark:ring-teal-500',
  size: 'text-base',
  active:'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400',
  inactive:'text-teal-600 dark:text-teal-400',
  icon: {active: 'text-teal-600 dark:text-teal-400', inactive: 'text-teal-600 dark:text-teal-400'}
}}

/**
 * Generates a number for a task based on completion and dependencies, used for sorting tasks.
 * @param isComplete task completion status
 * @param numDeps number of dependencies
 * @returns number for sorting (0: completed, 1: not ready, 2: ready)
 */
export const taskSortNum = (isComplete: boolean, numDeps: number) => {
  if (isComplete) {
    return 0
  } else if (numDeps <= 0) {
    return 2
  } else {
    return 1
  }
}

/**
 * Checks if the user has permission to set a task as complete.
 * Owner OR public permissions = 1 or 2
 * @param boardInfoData object containing board information
 * @returns boolean indicating if the user can set the task as complete 
 */
export const canSetComplete = (boardInfoData: {isOwner: boolean, publicPerms: number}) => {
  if (boardInfoData.isOwner) {
    return true
  } else {
    return boardInfoData.publicPerms >= 1
  }
}

/**
 * Checks if the user has permission to edit a task.
 * Owner OR public permissions = 2
 * @param boardInfoData object containing board information
 * @returns boolean indicating if the user can edit the task
 */
export const canEdit = (boardInfoData: {isOwner: boolean, publicPerms: number}) => {
  if (boardInfoData.isOwner) {
    return true
  } else {
    return boardInfoData.publicPerms === 2
  }
}

/**
 * Handles errors from fetch requests.
 * @param e error object
 * @param messageRef reactive message ref
 */
export const fetchErrorHandler = (e: unknown, messageRef: Ref<string>) => {
  if (e instanceof FetchError) {
    messageRef.value = e.data.message
  } else if (e instanceof Error) {
    messageRef.value = e.message
    throw e
  } else {
    throw e
  }
}
