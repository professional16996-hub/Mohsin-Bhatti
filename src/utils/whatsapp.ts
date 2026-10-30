import type { Order, Product, ProductColor } from '../types';

export const OFFICIAL_WHATSAPP_NUMBER = '923210424424';
export const DISPLAY_WHATSAPP_NUMBER = '03210424424';
export const INTERNATIONAL_WHATSAPP = '+923210424424';

/**
 * Creates a direct WhatsApp link with encoded message
 */
export function createWhatsAppUrl(message?: string): string {
  const baseUrl = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}`;
  if (!message) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Pre-filled message for general customer inquiries
 */
export function getGeneralInquiryUrl(): string {
  const message = `Assalam o Alaikum RIWAAYAT WEAR!\nI am browsing your collection on your website and would like to make an inquiry regarding your Pakistani fashion ensembles.`;
  return createWhatsAppUrl(message);
}

/**
 * Pre-filled message for single product order
 */
export function getProductOrderUrl(
  product: Product,
  selectedSize: string,
  selectedColor?: ProductColor
): string {
  const colorName = selectedColor ? selectedColor.name : (product.colors[0]?.name || 'Standard');
  const message = `Assalam o Alaikum RIWAAYAT WEAR!

I would like to order the following product:

*Product:* ${product.name}
*Category:* ${product.category}
*Price:* PKR ${product.price.toLocaleString('en-PK')}
*Selected Size:* ${selectedSize || product.sizes[0] || 'Standard'}
*Selected Color:* ${colorName}
*Fabric:* ${product.fabric}

Please confirm availability and share the payment & delivery details. Thank you!`;

  return createWhatsAppUrl(message);
}

/**
 * Pre-filled message for complete Cart Checkout
 */
export function getCartCheckoutWhatsAppUrl(order: Partial<Order>): string {
  const itemList = (order.items || [])
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}*\n   Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}\n   Price: PKR ${(item.price * item.quantity).toLocaleString('en-PK')}`
    )
    .join('\n\n');

  const message = `Assalam o Alaikum RIWAAYAT WEAR!

I have placed an order on your website with the following details:

*Order ID:* ${order.id || 'NEW'}
*Customer Name:* ${order.customerName}
*Phone Number:* ${order.phone}
*Delivery Address:* ${order.address}, ${order.city}
${order.notes ? `*Delivery Notes:* ${order.notes}\n` : ''}
*Ordered Items:*
${itemList}

*Subtotal:* PKR ${(order.subtotal || 0).toLocaleString('en-PK')}
*Delivery Charges:* ${order.shippingFee === 0 ? 'FREE (Special Offer)' : `PKR ${(order.shippingFee || 0).toLocaleString('en-PK')}`}
*Total Amount:* PKR ${(order.total || 0).toLocaleString('en-PK')}
*Payment Method:* ${order.paymentMethod || 'Cash on Delivery (COD)'}

Please confirm my order and let me know when it will be dispatched from Lahore. Thank you!`;

  return createWhatsAppUrl(message);
}
