import { useState, useEffect } from 'react';


const useMatchMedia =  (query) => {
  if (typeof window != 'object') return;
  if (!window.matchMedia) return;

  const [matches, setMatches] = useState(matchMedia(query).matches);

  useEffect(() => {
    const media = matchMedia(query);

    if (media.matches != matches) setMatches(media.matches);

    const listener = () => setMatches(media.matches);

    media.addEventListener
      ? media.addEventListener('change', listener)
      : media.addListener(listener);

    return () => media.removeEventListener
      ? media.removeEventListener('change', listener)
      : media.removeListener(listener);
  }, []);

  return matches;
};


export default useMatchMedia;
