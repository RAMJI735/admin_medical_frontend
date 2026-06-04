'use client';

import { use } from 'react';
import SuppliersView from '@views/suppliers';

export default function SuppliersPage({ params }) {
  const resolvedParams = use(params);
  return <SuppliersView activeTab={resolvedParams.activeTab} />;
}
