export const useMotionSafe = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion)')
  return computed(() => {
    return !prefersReducedMotion.value
  })
}
