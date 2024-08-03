import React, { useEffect, useState } from 'react';
import { ReactElement } from 'react';
import { useValidateDomainQuery } from '@/state/slices/authApiSlice'; // Adjust the import path accordingly
import Index from '@/pages/(auth)/error'; // Adjust the import path accordingly

export default function ValidatedRoute({ children }: { children: ReactElement }) {
  const { isLoading, error }: any = useValidateDomainQuery();
  if (window.location.pathname === '/') {
    if (error?.data?.message === 'Invalid Subdomain') {
      return <Index />;
    }
    if (error?.data?.message !== 'Valid Subdomain' && isLoading) {
      return <div style={{ marginTop: '20%', textAlign: 'center' }}>Loading...</div>;
    }
  }

  setTimeout(() => {
    return children;
  }, 2000);

  return children;
}