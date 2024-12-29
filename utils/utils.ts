export const taskSortNum = (isComplete: boolean, numDeps: number) => {
  if (isComplete) {
    return 0
  } else if (numDeps <= 0) {
    return 2
  } else {
    return 1
  }
}

// export const buttonUIObject = async (colour: string) => {
//   return {
//     variant: {
//       solid: `bg-${colour}-500 dark:bg-${colour}-500 hover:bg-${colour}-600 dark:bg-${colour}-400 disabled:bg-${colour}-500 dark:disabled:bg-${colour}-500 focus-visible:outline-${colour}-500 dark:focus-visible:outline-${colour}-400 text-slate-100 dark:text-slate-900`,
//       ghost: `hover:bg-${colour}-100 dark:hover:bg-${colour}-900 focus-visible:outline-${colour}-500 dark:focus-visible:outline-${colour}-400 text-slate-100 dark:text-slate-900`
//     }
//   }
// }

export const BUTTON_UI_OBJECT = {
  variant: {
    solid: 'bg-{color}-500 dark:bg-{color}-500 hover:bg-{color}-600 dark:bg-{color}-400 disabled:bg-{color}-500 dark:disabled:bg-{color}-500 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400 text-slate-100 dark:text-slate-900 text-base font-bold',
    ghost: 'hover:bg-{color}-100 dark:hover:bg-{color}-900 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400 text-{color}-600 dark:text-{color}-400 text-base'
  }
}

export const TEXT_INPUT_UI_OBJECT = {
  placeholder: 'placeholder-slate-400 dark:placeholder-slate-600',
  size: {sm: 'text-base', lg: 'text-2xl font-bold'},
  color: {variant: {outline: 'focus:ring-{color}-500 dark:focus:ring-{color}-500 text-slate-800 dark:text-slate-200'}}
}