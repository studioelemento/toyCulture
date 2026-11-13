export function getDisplayName(user) {
  if (!user) return 'Guest';
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return full || user.name || user.email?.split('@')[0] || 'User';
}

export function mapLegacyUser(user) {
  if (!user) return null;
  return {
    ...user,
    name: getDisplayName(user),
    username: user.email,
  };
}
