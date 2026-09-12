/** Builds a wa.me deep link with a prefilled message, e.g. from a ContactInfo.whatsapp field. */
export function buildWhatsAppUrl(rawNumber: string, message: string): string {
  const digits = rawNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildTelUrl(rawNumber: string): string {
  return `tel:${rawNumber.replace(/\s+/g, '')}`;
}
