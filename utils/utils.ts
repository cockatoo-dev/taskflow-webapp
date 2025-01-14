export const BUTTON_UI_OBJECT = {
  variant: {
    solid: 'bg-{color}-500 dark:bg-{color}-500 hover:bg-{color}-600 dark:hover:bg-{color}-400 disabled:bg-{color}-500 dark:disabled:bg-{color}-500 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-500 text-slate-100 dark:text-slate-900 text-base font-bold',
    ghost: 'hover:bg-{color}-100 dark:hover:bg-{color}-900 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-500 text-{color}-600 dark:text-{color}-400 text-base'
  }
}

export const TEXT_INPUT_UI_OBJECT = {
  placeholder: 'placeholder-slate-400 dark:placeholder-slate-600',
  size: {sm: 'text-base', lg: 'text-2xl'},
  color: {variant: {outline: 'focus:ring-{color}-500 dark:focus:ring-{color}-500 text-slate-800 dark:text-slate-200'}}
}

export const DROPDOWN_UI_OBJECT = {item: {
  ring: 'ring-teal-500 dark:ring-teal-500',
  size: 'text-base',
  active:'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400',
  inactive:'text-teal-600 dark:text-teal-400',
  icon: {active: 'text-teal-600 dark:text-teal-400', inactive: 'text-teal-600 dark:text-teal-400'}
}}

export const taskSortNum = (isComplete: boolean, numDeps: number) => {
  if (isComplete) {
    return 0
  } else if (numDeps <= 0) {
    return 2
  } else {
    return 1
  }
}

export const canSetComplete = (boardInfoData: {isOwner: boolean, publicPerms: number}) => {
  if (boardInfoData.isOwner) {
    return true
  } else {
    return boardInfoData.publicPerms >= 1
  }
}

export const canEdit = (boardInfoData: {isOwner: boolean, publicPerms: number}) => {
  if (boardInfoData.isOwner) {
    return true
  } else {
    return boardInfoData.publicPerms === 2
  }
}
