// Hook to track Firebase auth state
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export const useFirebaseAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return { isAuthenticated, isLoading };
};
