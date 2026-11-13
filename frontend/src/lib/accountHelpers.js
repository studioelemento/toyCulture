import { getDisplayName } from './userDisplay';

export function accountIdentity(user) {
  const displayName = user ? getDisplayName(user) : 'Guest';
  const displayEmail = user?.email || '';
  const displayFirstName = displayName.split(' ')[0] || 'there';
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .slice(0, 2)
      .join('') || 'TC';

  return { displayName, displayEmail, displayFirstName, initials };
}

export function mapStoreOrder(order) {
  const dateObj = new Date(order.createdAt);
  const dateFormatted = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeFormatted = dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const firstItem = order.items?.[0];
  const extraCount = (order.items?.length || 1) - 1;
  const title = firstItem?.product_name
    ? `${firstItem.product_name}${extraCount > 0 ? ` + ${extraCount} more` : ''}`
    : 'ToyCulture Order';
  const statusUpper = (order.status || 'PLACED').toUpperCase();

  let statusText = 'Placed';
  let statusType = 'processing';
  let lineColor = 'bg-amber-500';
  let progressWidth = '20%';
  let hasTrack = false;
  let isCancelled = false;

  if (statusUpper === 'CONFIRMED' || statusUpper === 'PACKED') {
    statusText = statusUpper === 'PACKED' ? 'Packed' : 'Confirmed';
    statusType = 'processing';
    progressWidth = '45%';
    hasTrack = true;
  } else if (statusUpper === 'SHIPPED') {
    statusText = 'Shipped';
    statusType = 'shipped';
    lineColor = 'bg-emerald-500';
    progressWidth = '75%';
    hasTrack = true;
  } else if (statusUpper === 'DELIVERED') {
    statusText = 'Delivered';
    statusType = 'delivered';
    lineColor = 'bg-blue-600';
    progressWidth = '100%';
  } else if (statusUpper === 'CANCELLED' || statusUpper === 'RETURNED' || statusUpper === 'REFUNDED') {
    statusText = statusUpper === 'CANCELLED' ? 'Cancelled' : statusUpper === 'RETURNED' ? 'Returned' : 'Refunded';
    statusType = 'cancelled';
    lineColor = 'bg-purple-400';
    progressWidth = '100%';
    isCancelled = true;
  }

  const shortDate = dateFormatted.split(' ').slice(0, 2).join(' ');
  const steps = isCancelled
    ? [
        { label: 'Ordered', date: shortDate, done: true },
        { label: statusText, date: 'Updated', done: true, isCancelled: true },
      ]
    : [
        { label: 'Ordered', date: shortDate, done: true },
        {
          label: 'Shipped',
          date: ['SHIPPED', 'DELIVERED'].includes(statusUpper) ? 'Done' : '-',
          done: ['SHIPPED', 'DELIVERED'].includes(statusUpper),
          current: statusUpper === 'SHIPPED',
        },
        {
          label: 'Out for Delivery',
          date: statusUpper === 'DELIVERED' ? 'Done' : '-',
          done: statusUpper === 'DELIVERED',
        },
        {
          label: 'Delivered',
          date: statusUpper === 'DELIVERED' ? 'Done' : '-',
          done: statusUpper === 'DELIVERED',
        },
      ];

  return {
    id: order.order_number || order.id?.slice(0, 8),
    rawId: order.id,
    date: dateFormatted,
    time: timeFormatted,
    itemsCount: `${order.items?.length || 1} item${order.items?.length === 1 ? '' : 's'}`,
    title,
    brand: firstItem?.product_name ? '' : '',
    amount: `₹${Number(order.total_amount || 0).toLocaleString('en-IN')}`,
    amountValue: Number(order.total_amount || 0),
    status: statusText,
    statusType,
    statusUpper,
    hasTrack,
    image: firstItem?.product_image || '',
    steps,
    progressWidth,
    lineColor,
  };
}

export function extractList(payload) {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.orders)) return payload.data.orders;
  return [];
}

export function formatAddress(addr) {
  if (!addr) return null;
  const typeUpper = String(addr.address_type || addr.type || 'HOME').toUpperCase();
  const type = typeUpper === 'WORK' || typeUpper === 'OFFICE' ? 'Office' : typeUpper === 'HOME' ? 'Home' : 'Other';
  return {
    id: addr.id,
    type,
    isDefault: Boolean(addr.is_primary ?? addr.isDefault),
    name: `${addr.first_name || ''} ${addr.last_name || ''}`.trim() || addr.name || '',
    line1: addr.address || addr.line1 || addr.addressLine1 || '',
    line2: addr.landmark || addr.line2 || addr.addressLine2 || '',
    city: addr.place || addr.city || '',
    state: addr.state || '',
    pincode: addr.pincode || addr.pin || '',
    phone: addr.phone || addr.mobile || '',
    first_name: addr.first_name || '',
    last_name: addr.last_name || '',
  };
}

export function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}
