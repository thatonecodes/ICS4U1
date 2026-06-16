import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import BasePage from '@/views/site/BasePage';
import Loading from '@/components/feedback/Loading';

const VISITED_KEY = 'a5_visited';

export default function HomeGate() {
  const { currentUser, loading } = useAuth();
  const hasVisited = localStorage.getItem(VISITED_KEY) === 'true';

  if (!hasVisited) {
    return <BasePage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return <Navigate to="/home" replace />;
}
