import { motion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  Facebook,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Pencil,
  Send,
  Settings,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { ContactInfo } from '../types/portfolio';
import { MagneticButton } from './MagneticButton';

interface ContactSectionProps {
  contact: ContactInfo;
  onEditContact: () => void;
}

interface DeliveryStatus {
  configured: boolean;
  mode: 'smtp' | 'webhook' | 'unconfigured';
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validateForm(values: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (values.subject.trim().length < 3) {
    errors.subject = 'Please enter a subject (at least 3 characters).';
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Please enter a message (at least 10 characters).';
  }
  return errors;
}

export function ContactSection({ contact, onEditContact }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverStatus, setServerStatus] = useState<DeliveryStatus | null>(null);
  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/contact/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((json: DeliveryStatus | null) => {
        if (active && json) setServerStatus(json);
      })
      .catch(() => {
        // Ignore silent status check failure
      });
    return () => {
      active = false;
    };
  }, []);

  const hasClientWebhook = Boolean(contact.webhookUrl && contact.webhookUrl.trim());
  const isDeliveryConfigured = Boolean(serverStatus?.configured || hasClientWebhook);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    const validation = validateForm({ name, email, subject, message });
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          webhookUrl: contact.webhookUrl.trim() || undefined,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        errors?: FormErrors;
      };

      if (response.ok && payload.ok) {
        setSubmitResult({
          type: 'success',
          text: payload.message || 'Your message has been delivered.',
        });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setErrors({});
        return;
      }

      if (payload.errors) {
        setErrors(payload.errors);
      }

      if (payload.code === 'DELIVERY_NOT_CONFIGURED' || response.status === 503) {
        setSubmitResult({
          type: 'warning',
          text:
            payload.message ||
            'Message not sent: live delivery is not configured yet. Set SMTP environment variables or add an HTTPS webhook URL in Contact Settings.',
        });
      } else {
        setSubmitResult({
          type: 'error',
          text: payload.message || 'Could not deliver your message. Please try again.',
        });
      }
    } catch {
      setSubmitResult({
        type: 'error',
        text: 'Network error while attempting to reach the contact endpoint.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}`
    : '';

  const mailtoHref = contact.email
    ? `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(
        subject || 'Portfolio Inquiry'
      )}&body=${encodeURIComponent(
        `${name ? `From: ${name} (${email})\n\n` : ''}${message}`
      )}`
    : '';

  const channels = [
    {
      label: 'Email',
      value: contact.email || 'Not configured yet',
      href: contact.email ? `mailto:${contact.email}` : '',
      icon: Mail,
    },
    {
      label: 'WhatsApp',
      value: contact.whatsapp || 'Not configured yet',
      href: whatsappHref,
      icon: MessageCircle,
    },
    {
      label: 'Facebook',
      value: contact.facebook ? 'View Facebook Profile' : 'Profile URL not set',
      href: contact.facebook,
      icon: Facebook,
    },
    {
      label: 'LinkedIn',
      value: contact.linkedin ? 'View LinkedIn Profile' : 'Profile URL not set',
      href: contact.linkedin,
      icon: Linkedin,
    },
    {
      label: 'GitHub',
      value: contact.github ? 'View GitHub Profile' : 'Profile URL not set',
      href: contact.github,
      icon: Github,
    },
  ];

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F5F7FF]/10 pb-6"
        >
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#1677FF]">
              06 · GET IN TOUCH
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F7FF] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              LET&apos;S BUILD SOMETHING AMAZING
            </h2>
            <p className="mt-3 max-w-xl text-base text-[#A0A8BC]">
              Have a project idea or want to collaborate? Let&apos;s connect and create something
              extraordinary.
            </p>
          </div>

          <button
            type="button"
            onClick={onEditContact}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#F5F7FF]/12 bg-[#101426]/80 px-3.5 py-2 text-xs font-medium text-[#A0A8BC] whitespace-nowrap shrink-0 transition-colors hover:border-[#1677FF]/50 hover:text-[#F5F7FF]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Edit Contact Info</span>
          </button>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Direct Contact Channels */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between gap-6"
          >
            <div className="space-y-3">
              {channels.map(({ label, value, href, icon: Icon }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group flex items-center justify-between rounded-2xl border border-[#F5F7FF]/10 bg-[#101426]/70 p-4 transition-all duration-150 hover:border-[#1677FF]/55 hover:bg-[#101426]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F5F7FF]/10 bg-[#080A12] text-[#1677FF] group-hover:text-[#F5F7FF]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#A0A8BC]">{label}</p>
                        <p className="truncate text-sm font-semibold text-[#F5F7FF]">{value}</p>
                      </div>
                    </div>
                  </a>
                ) : (
                  <button
                    key={label}
                    type="button"
                    onClick={onEditContact}
                    className="group flex w-full items-center justify-between rounded-2xl border border-[#F5F7FF]/8 bg-[#101426]/45 p-4 text-left transition-colors hover:border-[#873BFF]/45 hover:bg-[#101426]/80"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F5F7FF]/10 bg-[#080A12] text-[#A0A8BC]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#A0A8BC]">{label}</p>
                        <p className="truncate text-sm font-medium text-[#A0A8BC]/80">{value}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#1677FF] opacity-80 group-hover:opacity-100 whitespace-nowrap shrink-0">
                      Configure
                    </span>
                  </button>
                )
              )}
            </div>

            {/* Delivery Configuration Info Box */}
            <div className="rounded-2xl border border-[#F5F7FF]/10 bg-[#101426]/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#F5F7FF]">
                    Message Delivery Transport
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#A0A8BC]">
                    {isDeliveryConfigured
                      ? serverStatus?.configured
                        ? serverStatus.message
                        : 'Live HTTPS webhook endpoint configured in Portfolio Studio.'
                      : 'No SMTP credentials or webhook URL configured yet. Configure one to enable real message delivery.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onEditContact}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#F5F7FF]/12 bg-[#080A12] text-[#A0A8BC] hover:border-[#1677FF] hover:text-[#F5F7FF]"
                  aria-label="Configure message delivery endpoint"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Validated Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-[#F5F7FF]/12 bg-[#101426]/75 p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-[#A0A8BC]"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Enter your full name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className={`mt-2 w-full rounded-xl border bg-[#080A12] px-4 py-3 text-sm text-[#F5F7FF] placeholder:text-[#A0A8BC]/45 transition-colors focus:outline-none ${
                      errors.name
                        ? 'border-rose-500/80 focus:border-rose-400'
                        : 'border-[#F5F7FF]/12 focus:border-[#1677FF]'
                    }`}
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1.5 text-xs text-rose-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-[#A0A8BC]"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className={`mt-2 w-full rounded-xl border bg-[#080A12] px-4 py-3 text-sm text-[#F5F7FF] placeholder:text-[#A0A8BC]/45 transition-colors focus:outline-none ${
                      errors.email
                        ? 'border-rose-500/80 focus:border-rose-400'
                        : 'border-[#F5F7FF]/12 focus:border-[#1677FF]'
                    }`}
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1.5 text-xs text-rose-400">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-medium text-[#A0A8BC]"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                  }}
                  placeholder="Project inquiry, AI automation, or web design"
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  className={`mt-2 w-full rounded-xl border bg-[#080A12] px-4 py-3 text-sm text-[#F5F7FF] placeholder:text-[#A0A8BC]/45 transition-colors focus:outline-none ${
                    errors.subject
                      ? 'border-rose-500/80 focus:border-rose-400'
                      : 'border-[#F5F7FF]/12 focus:border-[#1677FF]'
                  }`}
                />
                {errors.subject && (
                  <p id="contact-subject-error" className="mt-1.5 text-xs text-rose-400">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium text-[#A0A8BC]"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  placeholder="Tell me about your goals, timeline, and what we can build together..."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className={`mt-2 w-full resize-y rounded-xl border bg-[#080A12] px-4 py-3 text-sm text-[#F5F7FF] placeholder:text-[#A0A8BC]/45 transition-colors focus:outline-none ${
                    errors.message
                      ? 'border-rose-500/80 focus:border-rose-400'
                      : 'border-[#F5F7FF]/12 focus:border-[#1677FF]'
                  }`}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1.5 text-xs text-rose-400">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Honest Submission Feedback */}
              {submitResult && (
                <div
                  role="status"
                  className={`mt-5 flex flex-col gap-3 rounded-xl border p-4 text-xs leading-relaxed ${
                    submitResult.type === 'success'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : submitResult.type === 'warning'
                      ? 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {submitResult.type === 'success' ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    )}
                    <span>{submitResult.text}</span>
                  </div>

                  {submitResult.type === 'warning' && (
                    <div className="flex flex-wrap items-center gap-3 pl-6">
                      <button
                        type="button"
                        onClick={onEditContact}
                        className="rounded-lg border border-amber-300/35 bg-[#080A12]/60 px-3 py-1.5 font-semibold text-amber-100 hover:bg-[#080A12]"
                      >
                        Configure Webhook Endpoint
                      </button>
                      {mailtoHref && (
                        <a
                          href={mailtoHref}
                          className="rounded-lg border border-[#F5F7FF]/20 bg-[#080A12]/60 px-3 py-1.5 font-semibold text-[#F5F7FF] hover:border-[#1677FF]"
                        >
                          Open in Email Client
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-[#A0A8BC]">{contact.location}</span>
                <MagneticButton
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#873BFF] px-6 py-3 text-sm font-semibold text-[#F5F7FF] whitespace-nowrap shrink-0 shadow-[0_8px_28px_rgba(22,119,255,0.28)] transition-opacity disabled:opacity-60"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
