'use client';

import { use } from 'react';
import PaymentsView from '@views/payments';

export default function PaymentsPage({ params }) {
  const resolvedParams = use(params);
  return <PaymentsView activeTab={resolvedParams.activeTab} />;
}
