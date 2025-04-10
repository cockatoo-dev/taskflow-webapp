export default defineAppConfig({
  ui: {
    colors: {
      primary: 'teal',
      gray: 'slate'
    },
    toast: {
      slots: {
        title: 'text-base font-bold text-slate-800 dark:text-slate-200',
        description: 'text-base font-normal text-slate-800 dark:text-slate-200'
      }
    }
    // button: {
    //   variants: {
        
    //     size: {
    //       md: {base: 'text-base'}
    //     },
    //     variant: {
    //       ghost: 'font-normal'
    //     },
    //   },
    //   compoundVariants: [
    //     {
    //       color: 'primary',
    //       variant: 'solid',
    //       class: 'font-bold text-slate-100 dark:text-slate-900',
    //     },
    //     {
    //       color: 'success',
    //       variant: 'solid',
    //       class: 'font-bold text-slate-100 dark:text-slate-900',
    //     },
    //     {
    //       color: 'error',
    //       variant: 'solid',
    //       class: 'font-bold text-slate-100 dark:text-slate-900',
    //     }
    //   ]
    // },
    // input: {
    //   slots: {
    //     base: 'text-slate-800 dark:text-slate-200'
    //   },
    //   variants: {
    //     size: {
    //       md: {base: 'text-base'},
    //       xl: {base: 'text-2xl'}
    //     }
    //   }
    // }
  }
})
