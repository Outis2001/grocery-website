/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate delivery fee based on agreed pricing:
 * - Free delivery over LKR 5000
 * - Base fee LKR 100 + LKR 40 per km
 * - Express delivery adds LKR 150
 */
export function calculateDeliveryFee(
  distanceKm: number,
  cartTotal: number,
  isExpress: boolean = false
): number {
  const FREE_DELIVERY_THRESHOLD = parseFloat(
    process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD || '5000'
  );
  const BASE_FEE = parseFloat(process.env.NEXT_PUBLIC_BASE_DELIVERY_FEE || '100');
  const PER_KM_FEE = parseFloat(process.env.NEXT_PUBLIC_PER_KM_FEE || '40');
  const EXPRESS_FEE = parseFloat(process.env.NEXT_PUBLIC_EXPRESS_FEE || '150');

  let deliveryFee = 0;

  // Option 3: Free delivery over threshold
  if (cartTotal >= FREE_DELIVERY_THRESHOLD) {
    deliveryFee = 0;
  } else {
    // Option 4: Base + Per km
    deliveryFee = BASE_FEE + distanceKm * PER_KM_FEE;
  }

  // Option 5: Express delivery add-on
  if (isExpress) {
    deliveryFee += EXPRESS_FEE;
  }

  return Math.round(deliveryFee);
}

/**
 * Check if a location is within delivery radius
 */
export function isWithinDeliveryRadius(
  shopLat: number,
  shopLng: number,
  customerLat: number,
  customerLng: number
): { withinRadius: boolean; distance: number } {
  const MAX_RADIUS = parseFloat(process.env.NEXT_PUBLIC_MAX_DELIVERY_RADIUS_KM || '5');

  const distance = calculateDistance(shopLat, shopLng, customerLat, customerLng);

  return {
    withinRadius: distance <= MAX_RADIUS,
    distance,
  };
}
