import React from 'react';

const MockHead = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
MockHead.displayName = 'NextHead';

export default MockHead;
