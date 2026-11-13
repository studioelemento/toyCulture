/**
 * Returns true when the user may continue; otherwise shows a message and opens login.
 */
export function requireLoginForPurchase({
  isLoggedIn,
  isBootstrapping,
  openAuthDrawer,
  showToast,
}) {
  if (isBootstrapping) return false;
  if (isLoggedIn) return true;

  const message = 'Please log in to complete your purchase.';
  showToast?.(message);
  openAuthDrawer?.('login', message);
  return false;
}

export function requireLoginForReview({
  isLoggedIn,
  isBootstrapping,
  openAuthDrawer,
  onBlocked,
}) {
  if (isBootstrapping) return false;
  if (isLoggedIn) return true;

  const message = 'Please log in to write a product review.';
  onBlocked?.(message);
  openAuthDrawer?.('login', message);
  return false;
}
