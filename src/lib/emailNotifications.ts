// Utility for sending email notifications (replace with your provider logic)
// Example usage: await sendEmailNotification({ to, subject, message })

export async function sendEmailNotification({ to, subject, message }: { to: string, subject: string, message: string }) {
  // TODO: Integrate with EmailJS, Resend, SMTP, or your backend API
  // Example:
  // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ to, subject, message }) });
  console.log(`📧 [Email] To: ${to} | Subject: ${subject} | Message: ${message}`);
}
