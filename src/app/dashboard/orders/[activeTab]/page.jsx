'use client';

import { use } from 'react';
import OrdersView from '@views/orders/orders';

export default function OrdersPage({ params }) {
  const resolvedParams = use(params);
  return <OrdersView activeTab={resolvedParams.activeTab} />;
}
