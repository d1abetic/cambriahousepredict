import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PredictAdminPage from '../predict/admin';

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/predict/admin');
  }, [router]);

  return <PredictAdminPage />;
}
