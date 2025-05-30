import { Repository } from "./repository";
import { Resend } from "./types";

export function createService(repository: Repository, resend: Resend) {
  async function sendOrderConfirmationEmail({
    to,
    name,
    orderId,
    total,
  }: {
    to: string;
    name: string;
    orderId: string;
    total: number;
  }) {
    try {
      const result = await resend.emails.send({
        from: "odin@odinobusi.online", // or your verified domain
        to,
        subject: "Tack för din beställning!",
        html: `
        <p>Hej ${name},</p>
        <p>Vi har tagit emot din beställning <strong>#${orderId}</strong>.</p>
        <p>Totalt belopp: <strong>${total.toFixed(2)} kr</strong></p>
        <p>Vi återkommer med leveransinfo inom kort.</p>
        <br/>
        <p>Hälsningar,</p>
        <p><strong>Healthy Eating</strong></p>
      `,
      });

      return result;
    } catch (error) {
      console.error("Email send error:", error);
    }
  }
  return {
    sendOrderConfirmationEmail,
  };
}
