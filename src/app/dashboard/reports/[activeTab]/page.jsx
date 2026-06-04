'use client';

import { use } from 'react';
import ReportsView from '@views/reports';

export default function ReportsPage({ params }) {
  const resolvedParams = use(params);
  return <ReportsView activeTab={resolvedParams.activeTab} />;
}
