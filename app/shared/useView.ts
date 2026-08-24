'use client';

import { useEffect, useState } from 'react';
import { navItems } from './data';
import type { View } from './types';

export function useView(): [View, (view: View) => void] {
  const getView = (): View => {
    const value = window.location.hash.replace('#', '') as View;
    return navItems.some((item) => item.id === value) ? value : 'overview';
  };
  const [view, setViewState] = useState<View>('overview');
  useEffect(() => {
    const sync = () => setViewState(getView());
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  const setView = (next: View) => { window.location.hash = next; setViewState(next); };
  return [view, setView];
}
