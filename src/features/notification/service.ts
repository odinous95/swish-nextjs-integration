import { ORDER } from "../orders/types";
import { Repository } from "./repository";
import { Resend } from "./types";

export function createService(repository: Repository, resend: Resend) {
  async function sendOrderConfirmationEmail({
    to,
    name,
    orderId,
    total,
    order,
  }: {
    to: string;
    name: string;
    orderId: string;
    total: number;
    order: ORDER;
  }) {
    try {
      const cartItemsHtml = order.cartItems
        .map(
          (item) =>
            `<li>${item.quantity} x ${item.name} (${item.price.toFixed(2)} kr)</li>`
        )
        .join("");

      const deliveryHtml = `
        <p><strong>Adress:</strong> ${order.address}, ${order.postalCode} ${order.city}</p>
        <p><strong>Telefon:</strong> ${order.phone}</p>
        <p><strong>Leveransdatum:</strong> ${new Date(order.deliveryDate).toLocaleDateString("sv-SE")}</p>
        ${
          order.deliveryTimeWindow
            ? `<p><strong>Leveranstid:</strong> ${order.deliveryTimeWindow}</p>`
            : ""
        }
        ${order.floor ? `<p><strong>Våning:</strong> ${order.floor}</p>` : ""}
        ${order.doorCode ? `<p><strong>Portkod:</strong> ${order.doorCode}</p>` : ""}
        ${order.extra_comment ? `<p><strong>Kommentar:</strong> ${order.extra_comment}</p>` : ""}
      `;

      // 1️⃣ Email to Customer
      await resend.emails.send({
        from: "support@healthyeating.se",
        to,
        subject: "Tack för din beställning!",
        html: `
          <p>Hej ${name},</p>
          <p>Vi har tagit emot din beställning <strong>#${orderId}</strong>.</p>
          <p><strong>Totalt:</strong> ${total.toFixed(2)} kr</p>
          <p>Dina produkter:</p>
          <ul>${cartItemsHtml}</ul>
          ${deliveryHtml}
          <p>Vi återkommer med leveransinfo inom kort.</p>
          <br/>
          <p>Hälsningar,</p>
          <p><strong>Healthy Eating</strong></p>
        `,
      });

      // 2️⃣ Email to Admin
      await resend.emails.send({
        from: "support@healthyeating.se",
        to: "healthyeating774@gmail.com", // Can be changed to a separate admin address
        subject: `Ny beställning lagd (#${orderId})`,
        html: `
          <p><strong>Ny beställning mottagen</strong></p>
          <p><strong>Beställnings-ID:</strong> ${orderId}</p>
          <p><strong>Kund:</strong> ${name} (${to})</p>
          <p><strong>Totalt:</strong> ${total.toFixed(2)} kr</p>
          <p><strong>Produkter:</strong></p>
          <ul>${cartItemsHtml}</ul>
          <p><strong>Leveransinformation:</strong></p>
          ${deliveryHtml}
          <p><strong>Betalningsmetod:</strong> ${order.paymentMethod || "Ej angiven"}</p>
          <p><strong>Enhetstyp:</strong> ${order.deviceType}</p>
        `,
      });

      return { success: true };
    } catch (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }
  }

  return {
    sendOrderConfirmationEmail,
  };
}
