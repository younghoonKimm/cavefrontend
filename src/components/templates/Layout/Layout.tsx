import React, { useEffect, useState } from 'react';
import { DefaultButton } from '@/components/atoms/Button';
import { Comp } from '@/types/common/common';
import useAuth from '@/hooks/useAuth';
import { logOutAPI } from '@/api/auth';
import Nav from './Nav';

interface LayoutProps extends Comp {
  isNav?: boolean;
}

function Layout({ children, isNav = false }: LayoutProps) {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    setShowComponent(true);
  }, []);

  return (
    <div>
      <header>{/* <Nav /> */}</header>
      <main role="main"> {showComponent ? children : null}</main>
      <footer></footer>
    </div>
  );
}

export default Layout;
