'use client';

import SettingsView from '@views/settings';

export default function SettingsPage() {
  const handleProfileUpdate = () => {
    window.dispatchEvent(new Event('currentUserUpdated'));
  };

  return <SettingsView onProfileUpdate={handleProfileUpdate} />;
}
