import React from 'react';

import GlossaryView from '../views/Glossary';
import MainLayout from '../layouts/MainLayout';


export default function Home() {
  return (
    <MainLayout>
      <GlossaryView />
    </MainLayout>
  )
}
