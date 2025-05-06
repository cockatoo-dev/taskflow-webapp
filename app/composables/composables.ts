/**
 * Check if animations should be enabled based on browser media query.
 * @returns true if animations should be enabled, false otherwise
 */
export const useMotionSafe = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion)')
  return computed(() => {
    return !prefersReducedMotion.value
  })
}
