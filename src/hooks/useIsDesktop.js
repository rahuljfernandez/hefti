import { useEffect, useState } from 'react';

export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const resize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return isDesktop;
}
