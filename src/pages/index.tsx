import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PredictPlayerPage from './predict';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/predict');
  }, [router]);

  return <PredictPlayerPage />;
}
