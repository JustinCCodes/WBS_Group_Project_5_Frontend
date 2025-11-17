import { useEffect } from "react";

// Hook to disable body scroll when active is true
export function useDisableBodyScroll(active: boolean) {
  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [active]);
}
