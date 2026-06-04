'use client';

import { use } from 'react';
import MedicinesView from '@views/medicines';

export default function MedicinesPage({ params }) {
  const resolvedParams = use(params);
  return <MedicinesView activeTab={resolvedParams.activeTab} />;
}
