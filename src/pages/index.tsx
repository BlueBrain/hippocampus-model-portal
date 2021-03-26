import React from 'react';

import HomeView from '../views/Home';
import MainLayout from '../layouts/MainLayout';
import styles from '../styles/Home.module.scss'


export default function Home() {
  return (
    <MainLayout>
      <HomeView />
    </MainLayout>
  )
}
