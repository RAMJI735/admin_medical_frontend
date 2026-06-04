'use client';

import { use } from 'react';
import CouponsView from '@views/coupons/coupons';

export default function CouponsPage({ params }) {
  const resolvedParams = use(params);
  return <CouponsView activeTab={resolvedParams.activeTab} />;
}
