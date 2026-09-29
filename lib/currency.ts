// All prices on the site are whole Naira amounts. Formats 180000 as "₦180,000".
// Commas are added by hand (not toLocaleString) so server and browser always render the same text.
export function formatNaira(amount: number) {
  return `₦${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
