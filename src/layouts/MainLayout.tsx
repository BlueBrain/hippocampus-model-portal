import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

const MainLayout: React.FC = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
