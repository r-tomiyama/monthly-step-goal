import { type User, signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { MainLayout } from '../../layouts/MainLayout';
import { StepCounter } from './StepCounter';

interface DashboardPageProps {
  user: User;
}

export const DashboardPage = ({ user }: DashboardPageProps) => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      <StepCounter />
    </MainLayout>
  );
};
