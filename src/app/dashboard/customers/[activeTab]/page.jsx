'use client';

import { use } from 'react';
import CustomersView from '@views/customers';

export default function CustomersPage({ params }) {
  const resolvedParams = use(params);
  return <CustomersView activeTab={resolvedParams.activeTab} />;
}
