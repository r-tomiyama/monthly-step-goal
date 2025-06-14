import { Box, Tab, Tabs } from '@mui/material';
import { type User, signOut } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../../../config/firebase';
import { MainLayout } from '../../layouts/MainLayout';
import { CumulativeStepsChart } from './CumulativeStepsChart';
import { MonthlyStepsChart } from './MonthlyStepsChart';
import { StepCounter } from './StepCounter';

interface DashboardPageProps {
  user: User;
}

export const DashboardPage = ({ user }: DashboardPageProps) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleTabChange = (_: unknown, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <MainLayout
      user={user}
      onLogout={handleLogout}
      stepCounter={<StepCounter />}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="累積表示" />
          <Tab label="日次表示" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {currentTab === 0 && <CumulativeStepsChart />}
        {currentTab === 1 && <MonthlyStepsChart />}
      </Box>
    </MainLayout>
  );
};
