import { ORDER } from "../orders/types";
import { Repository } from "./repository";
import { Resend } from "./types";

export function createService(repository: Repository, resend: Resend) {
  async function sendOrderConfirmationEmail({
    to,
    name,
    orderId,
    total_price,
    order,
  }: {
    to: string;
    name: string;
    orderId: string;
    total_price: number;
    order: ORDER;
  }) {
    try {
      const cartItemsHtml = order.cart_items
        .map(
          (item) =>
            `<li>${item.quantity} x ${item.name} (${item.price.toFixed(2)} kr)</li>`
        )
        .join("");

      const deliveryHtml = `
        <p><strong>Adress:</strong> ${order.address}, ${order.postal_code} ${order.city}</p>
        <p><strong>Telefon:</strong> ${order.phone}</p>
        <p><strong>Leveransdatum:</strong> ${new Date(order.delivery_date).toLocaleDateString("sv-SE")}</p>
        ${
          order.delivery_time_window
            ? `<p><strong>Leveranstid:</strong> ${order.delivery_time_window}</p>`
            : ""
        }
        ${order.floor ? `<p><strong>Våning:</strong> ${order.floor}</p>` : ""}
        ${order.door_code ? `<p><strong>Portkod:</strong> ${order.door_code}</p>` : ""}
        ${order.extra_comment ? `<p><strong>Kommentar:</strong> ${order.extra_comment}</p>` : ""}
      `;

      // 1️⃣ Email to Customer
      await resend.emails.send({
        from: "support@healthyeating.se",
        to,
        subject: "Vi har tagit emot din beställning – Healthy Eating",
        html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://iili.io/FYJOQ5u.png" alt="Healthy Eating" width="120" style="margin-bottom: 10px;" />
      </div>

      <p>Hej ${name},</p>

      <p>Tack för din beställning <strong>#${orderId}</strong> hos <strong>Healthy Eating</strong>!</p>

      <p><strong>Ordervärde:</strong> ${total_price.toFixed(2)} kr</p>

      <p><strong>Produkter:</strong></p>
      <ul>${cartItemsHtml}</ul>

      ${deliveryHtml}

      <p>Vi har nu påbörjat hanteringen av din beställning och återkommer snart med information om leverans.</p>

      <p>Om du har några frågor eller vill uppdatera din order, kontakta oss gärna på <a href="mailto:support@healthyeating.se">support@healthyeating.se</a>.</p>

      <br/>
      <p>Med vänliga hälsningar,</p>
      <p><strong>Teamet på Healthy Eating</strong></p>
    </div>
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
          <p><strong>Totalt:</strong> ${total_price.toFixed(2)} kr</p>
          <p><strong>Produkter:</strong></p>
          <ul>${cartItemsHtml}</ul>
          <p><strong>Leveransinformation:</strong></p>
          ${deliveryHtml}
          <p><strong>Betalningsmetod:</strong> ${order.payment_method || "Ej angiven"}</p>
          <p><strong>Enhetstyp:</strong> ${order.device_type}</p>
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
