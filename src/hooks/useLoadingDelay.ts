import { useState, useEffect } from 'react';

export function useLoadingDelay(isLoading: boolean, delay = 300) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      timer = setTimeout(() => {
        setShowLoader(true);
      }, delay);
    } else {
      setShowLoader(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, delay]);

  return showLoader;
}