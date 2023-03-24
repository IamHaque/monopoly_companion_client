// https://github.com/mvasin/react-div-100vh/blob/master/packages/react-div-100vh/src/index.tsx

import React, { forwardRef, useState, useEffect } from 'react';

const Div100vh = forwardRef(({ style, ...other }, ref) => {
  const height = use100vh();

  const styleWithRealHeight = {
    ...style,
    minHeight: height ? `${height}px` : '100vh',
  };
  return <div ref={ref} style={styleWithRealHeight} {...other} />;
});

export default Div100vh;

function use100vh() {
  const [height, setHeight] = useState(measureHeight);

  const wasRenderedOnClientAtLeastOnce = useWasRenderedOnClientAtLeastOnce();

  useEffect(() => {
    if (!wasRenderedOnClientAtLeastOnce) return;

    function setMeasuredHeight() {
      const measuredHeight = measureHeight();
      setHeight(measuredHeight);
    }

    window.addEventListener('resize', setMeasuredHeight);
    return () => window.removeEventListener('resize', setMeasuredHeight);
  }, [wasRenderedOnClientAtLeastOnce]);
  return wasRenderedOnClientAtLeastOnce ? height : null;
}

function measureHeight() {
  if (!isClient()) return null;
  return window.innerHeight;
}

// Once we ended up on the client, the first render must look the same as on
// the server so hydration happens without problems. _Then_ we immediately
// schedule a subsequent update and return the height measured on the client.
// It's not needed for CSR-only apps, but is critical for SSR.
function useWasRenderedOnClientAtLeastOnce() {
  const [wasRenderedOnClientAtLeastOnce, setWasRenderedOnClientAtLeastOnce] =
    useState(false);

  useEffect(() => {
    if (isClient()) {
      setWasRenderedOnClientAtLeastOnce(true);
    }
  }, []);
  return wasRenderedOnClientAtLeastOnce;
}

function isClient() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
