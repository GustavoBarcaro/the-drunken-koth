import React from 'react';

interface AuthProps {
  children: React.ReactNode;
}

export const Auth = ({ children }: AuthProps) => {
  return <>{children}</>;
};
