'use client';

import { use } from 'react';
import UsersRolesView from '@views/usersRoles';

export default function UsersRolesPage({ params }) {
  const resolvedParams = use(params);
  return <UsersRolesView activeTab={resolvedParams.activeTab} />;
}
