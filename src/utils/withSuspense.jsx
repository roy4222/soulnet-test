import React, { Suspense } from 'react';

export const withSuspense = (Component, FallbackComponent = null) => {
  return function WithSuspenseWrapper(props) {
    return (
      <Suspense fallback={FallbackComponent || <div>載入中...</div>}>
        <Component {...props} />
      </Suspense>
    );
  };
}; 