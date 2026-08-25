// Currency & Unit Formatting Helpers (INR Default)

export function formatPrice(amount, currency = 'INR') {
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₹';
  const rate = currency === 'USD' ? 0.012 : currency === 'EUR' ? 0.011 : 1.0;
  const converted = Math.round(amount * rate);

  if (currency === 'INR' || !currency) {
    return `₹${converted.toLocaleString('en-IN')}`;
  }
  return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

export function calculateWh(voltageStr, ahStr) {
  const v = parseFloat(voltageStr) || 12;
  const ah = parseFloat(ahStr) || 100;
  return Math.round(v * ah);
}

export function calculateDollarsPerWh(price, voltageStr, ahStr) {
  const wh = calculateWh(voltageStr, ahStr);
  if (!wh) return '₹0.00';
  return `₹${(price / wh).toFixed(2)} / Wh`;
}
