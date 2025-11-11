// Colores para tarjetas según marca (igual que app móvil)
export function getCardColor(cardType?: string, cardBrand?: string): string {
  const brand = cardBrand?.toLowerCase() || cardType?.toLowerCase() || '';
  
  if (brand.includes('visa')) {
    return '#2563EB'; // Azul
  }
  if (brand.includes('mastercard') || brand.includes('master')) {
    return '#DC2626'; // Rojo
  }
  if (brand.includes('amex') || brand.includes('american')) {
    return '#16A34A'; // Verde
  }
  
  // Por tipo de tarjeta si no hay marca
  if (cardType?.toLowerCase() === 'debit') {
    return '#2563EB'; // Azul para débito
  }
  if (cardType?.toLowerCase() === 'credit') {
    return '#DC2626'; // Rojo para crédito
  }
  if (cardType?.toLowerCase() === 'prepaid') {
    return '#EA580C'; // Naranja para prepago
  }
  
  return '#6B7280'; // Gris por defecto
}

export function getCardGradient(cardType?: string, cardBrand?: string): string {
  const brand = cardBrand?.toLowerCase() || cardType?.toLowerCase() || '';
  
  if (brand.includes('visa')) {
    return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'; // Azul/Índigo
  }
  if (brand.includes('mastercard') || brand.includes('master')) {
    return 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'; // Rojo/Naranja
  }
  
  // Por tipo de tarjeta
  if (cardType?.toLowerCase() === 'debit') {
    return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
  }
  if (cardType?.toLowerCase() === 'credit') {
    return 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
  }
  if (cardType?.toLowerCase() === 'prepaid') {
    return 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)';
  }
  
  return 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)';
}

// Colores para cuentas según tipo (igual que app móvil)
export function getAccountColor(accountType?: string): string {
  const type = accountType?.toLowerCase() || '';
  
  if (type === 'savings' || type === 'ahorro' || type === 'personal') {
    return '#16A34A'; // Verde
  }
  if (type === 'checking' || type === 'corriente' || type === 'business') {
    return '#2563EB'; // Azul
  }
  if (type === 'microcredit' || type === 'microcredito') {
    return '#EA580C'; // Naranja
  }
  if (type === 'fixeddeposit' || type === 'plazofijo') {
    return '#9333EA'; // Púrpura
  }
  
  return '#6B7280'; // Gris por defecto
}

export function getAccountGradient(accountType?: string): string {
  const color = getAccountColor(accountType);
  
  // Crear gradiente más claro para el fondo
  if (color === '#16A34A') {
    return 'linear-gradient(135deg, #D1FAE5 0%, #16A34A 100%)'; // Verde
  }
  if (color === '#2563EB') {
    return 'linear-gradient(135deg, #DBEAFE 0%, #2563EB 100%)'; // Azul
  }
  if (color === '#EA580C') {
    return 'linear-gradient(135deg, #FED7AA 0%, #EA580C 100%)'; // Naranja
  }
  if (color === '#9333EA') {
    return 'linear-gradient(135deg, #E9D5FF 0%, #9333EA 100%)'; // Púrpura
  }
  
  return 'linear-gradient(135deg, #F3F4F6 0%, #6B7280 100%)';
}

// Colores para solicitudes según producto (igual que app móvil)
export function getApplicationColor(productId?: string): string {
  if (!productId) return '#6B7280';
  
  const product = productId.toUpperCase();
  
  switch (product) {
    case 'CRED_IND':
      return '#2563EB'; // Azul
    case 'CRED_GRUP':
      return '#16A34A'; // Verde
    case 'MIC_PROD':
      return '#EA580C'; // Naranja
    case 'CRED_RESP':
      return '#9333EA'; // Púrpura
    case 'MICROEMP':
      return '#0D9488'; // Teal
    case 'CRED_VERDE':
      return '#65A30D'; // Verde claro
    default:
      return '#6B7280'; // Gris
  }
}

export function getApplicationGradient(productId?: string): string {
  const color = getApplicationColor(productId);
  
  if (color === '#2563EB') {
    return 'linear-gradient(135deg, #DBEAFE 0%, #2563EB 100%)'; // Azul
  }
  if (color === '#16A34A') {
    return 'linear-gradient(135deg, #D1FAE5 0%, #16A34A 100%)'; // Verde
  }
  if (color === '#EA580C') {
    return 'linear-gradient(135deg, #FED7AA 0%, #EA580C 100%)'; // Naranja
  }
  if (color === '#9333EA') {
    return 'linear-gradient(135deg, #E9D5FF 0%, #9333EA 100%)'; // Púrpura
  }
  if (color === '#0D9488') {
    return 'linear-gradient(135deg, #CCFBF1 0%, #0D9488 100%)'; // Teal
  }
  if (color === '#65A30D') {
    return 'linear-gradient(135deg, #ECFCCB 0%, #65A30D 100%)'; // Verde claro
  }
  
  return 'linear-gradient(135deg, #F3F4F6 0%, #6B7280 100%)';
}

// Función auxiliar para obtener color oscuro para texto
export function getDarkTextColor(baseColor: string): string {
  // Si es un color claro, usar texto oscuro, si no, usar blanco
  const lightColors = ['#D1FAE5', '#DBEAFE', '#FED7AA', '#E9D5FF', '#CCFBF1', '#ECFCCB'];
  if (lightColors.some(c => baseColor.includes(c))) {
    return '#111827'; // Casi negro
  }
  return '#FFFFFF'; // Blanco
}

