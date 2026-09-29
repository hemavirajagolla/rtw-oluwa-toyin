// Delivery zones and flat fees (in Naira) offered at checkout. We deliver within Nigeria only.
export const SHIPPING_ZONES = [
  { id: "lekki-ikoyi-vi", label: "Within Lekki 1, Ikoyi & Victoria Island", fee: 3000 },
  { id: "island", label: "Within The Island", fee: 5000 },
  { id: "mainland", label: "Within The Mainland", fee: 7000 },
  { id: "nigeria", label: "Within Nigeria", fee: 12000 },
] as const;

export type ShippingZoneId = (typeof SHIPPING_ZONES)[number]["id"];

export const DEFAULT_SHIPPING_ZONE: ShippingZoneId = SHIPPING_ZONES[0].id;

// Falls back to the default zone for unknown ids (e.g. an old value saved in the browser).
export function getShippingZone(id: string) {
  return SHIPPING_ZONES.find((zone) => zone.id === id) ?? SHIPPING_ZONES[0];
}

export const LOWEST_SHIPPING_FEE = Math.min(...SHIPPING_ZONES.map((zone) => zone.fee));
