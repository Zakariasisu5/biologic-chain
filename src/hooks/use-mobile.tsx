
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  
  React.useEffect(() => {
    // Initial check based on window width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check immediately on mount
    checkIsMobile()
    
    // Add event listeners for screen size changes
    window.addEventListener("resize", checkIsMobile)
    
    // Media query listener as a fallback
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mediaQuery.addEventListener("change", checkIsMobile)
    
    return () => {
      window.removeEventListener("resize", checkIsMobile)
      mediaQuery.removeEventListener("change", checkIsMobile)
    }
  }, [])

  return isMobile
}
