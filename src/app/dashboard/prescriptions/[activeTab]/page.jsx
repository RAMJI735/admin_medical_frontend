'use client';

import { use } from 'react';
import PrescriptionsView from '@views/prescriptions';

export default function PrescriptionsPage({ params }) {
  const resolvedParams = use(params);
  return <PrescriptionsView activeTab={resolvedParams.activeTab} />;
}
