'use client';

import { use } from 'react';
import StoreSettingsView from '@views/storeSettings';

export default function StoreSettingsPage({ params }) {
  const resolvedParams = use(params);
  return <StoreSettingsView activeTab={resolvedParams.activeTab} />;
}
