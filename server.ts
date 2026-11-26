import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  webhookUrl?: unknown;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isSafeHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    // Block localhost and obvious private network ranges (SSRF guard)
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
      host.endsWith('.internal')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true';

  if (host && user && pass && recipient) {
    return { host, port, secure, user, pass, recipient };
  }
  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  // Check configurable delivery status (never returns secrets)
  app.get('/api/contact/status', (_req, res) => {
    const smtp = getSmtpConfig();
    const envWebhook = process.env.CONTACT_WEBHOOK_URL?.trim();
    const webhookConfigured = Boolean(envWebhook && isSafeHttpsUrl(envWebhook));

    if (smtp) {
      res.json({
        configured: true,
        mode: 'smtp',
        message: 'Server SMTP mail delivery is active.',
      });
      return;
    }

    if (webhookConfigured) {
      res.json({
        configured: true,
        mode: 'webhook',
        message: 'Server webhook delivery is active.',
      });
      return;
    }

    res.json({
      configured: false,
      mode: 'unconfigured',
      message:
        'Configure SMTP environment variables or add an HTTPS webhook endpoint (such as Formspree) in Portfolio Settings for live delivery.',
    });
  });

  // Real contact message delivery endpoint
  app.post('/api/contact', async (req, res) => {
    const body = (req.body || {}) as ContactPayload;

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const customWebhook =
      typeof body.webhookUrl === 'string' ? body.webhookUrl.trim() : '';

    const errors: Record<string, string> = {};
    if (name.length < 2 || name.length > 120) {
      errors.name = 'Please enter your name (2–120 characters).';
    }
    if (!isValidEmail(email) || email.length > 160) {
      errors.email = 'Please enter a valid email address.';
    }
    if (subject.length < 3 || subject.length > 180) {
      errors.subject = 'Please enter a subject (3–180 characters).';
    }
    if (message.length < 10 || message.length > 4000) {
      errors.message = 'Please enter a message (10–4000 characters).';
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Please correct the highlighted fields.',
        errors,
      });
      return;
    }

    const smtp = getSmtpConfig();
    if (smtp) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port,
          secure: smtp.secure,
          auth: {
            user: smtp.user,
            pass: smtp.pass,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${smtp.user}>`,
          to: smtp.recipient,
          replyTo: email,
          subject: `[Portfolio Inquiry] ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #111827;">
              <h2 style="margin-bottom: 12px;">New Portfolio Message</h2>
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
              <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
              <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
            </div>
          `,
        });

        res.json({
          ok: true,
          mode: 'smtp',
          message: 'Your message has been delivered via email.',
        });
        return;
      } catch (err) {
        console.error('SMTP delivery failed:', err);
        res.status(502).json({
          ok: false,
          code: 'DELIVERY_FAILED',
          message:
            'The email server rejected or failed to deliver this message. Please verify SMTP settings.',
        });
        return;
      }
    }

    const envWebhook = process.env.CONTACT_WEBHOOK_URL?.trim();
    const targetWebhook = envWebhook || customWebhook;

    if (targetWebhook) {
      if (!isSafeHttpsUrl(targetWebhook)) {
        res.status(400).json({
          ok: false,
          code: 'INVALID_WEBHOOK',
          message: 'Configured webhook URL must be a valid public HTTPS endpoint.',
        });
        return;
      }

      try {
        const response = await fetch(targetWebhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
            submittedAt: new Date().toISOString(),
            source: 'MD. Asraful Islam Adib Portfolio',
          }),
        });

        if (!response.ok) {
          res.status(502).json({
            ok: false,
            code: 'WEBHOOK_REJECTED',
            message: `Configured endpoint responded with status ${response.status}. Message was not delivered.`,
          });
          return;
        }

        res.json({
          ok: true,
          mode: 'webhook',
          message: 'Your message has been delivered successfully.',
        });
        return;
      } catch (err) {
        console.error('Webhook delivery failed:', err);
        res.status(502).json({
          ok: false,
          code: 'WEBHOOK_UNREACHABLE',
          message: 'Could not reach the configured delivery endpoint.',
        });
        return;
      }
    }

    // Honest response when no real transport is configured (never fake success)
    res.status(503).json({
      ok: false,
      code: 'DELIVERY_NOT_CONFIGURED',
      message:
        'Live message delivery is not configured yet. Configure SMTP environment variables on the server or add an HTTPS webhook URL (e.g., Formspree) in Portfolio Settings.',
    });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Production build not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
