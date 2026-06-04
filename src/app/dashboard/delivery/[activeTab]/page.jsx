'use client';

import { use } from 'react';
import DeliveryView from '@views/delivery';

export default function DeliveryPage({ params }) {
  const resolvedParams = use(params);
  return <DeliveryView activeTab={resolvedParams.activeTab} />;
}
