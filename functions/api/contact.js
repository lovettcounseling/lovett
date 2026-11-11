/**
 * Contact form handler for lovettcounselingandconsulting.com
 * Cloudflare Pages Function: POST /api/contact
 *
 * Environment variables (Pages > Settings > Variables and Secrets, set for
 * both Production and Preview):
 *   RESEND_API_KEY    required, secret. Resend API key.
 *   TO_EMAIL          required. Where inquiries land
 *                     (lovettcounselingandconsulting@gmail.com).
 *   FROM_EMAIL        required. Verified Resend sender, either a bare address
 *                     (website@notify.lovettcounselingandconsulting.com) or
 *                     "Name <address>".
 *   HEALTH_TOKEN      optional, secret. Enables the daily health check.
 *   HEALTH_TO         optional. Where health checks go (Chad only).
 *   TURNSTILE_SECRET  optional, secret. Turns on the Cloudflare Turnstile check.
 *
 * Optional binding:
 *   SUBMISSIONS       KV namespace. When bound, every real inquiry is saved
 *                     for 30 days before any email is sent, so a lead is never
 *                     lost even if email delivery fails.
 *
 * Health check: POST with header "x-health-token: <HEALTH_TOKEN>" and any valid
 * name, email and message. It sends one email to HEALTH_TO with a
 * "[Health check]" subject, skips the auto-reply and the saved copy, and never
 * touches the practice inbox.
 */

const PRACTICE = 'Lovett Counseling & Consulting';
const SITE = 'lovettcounselingandconsulting.com';
const PHONE = '(530) 802-0437';
const PRACTICE_EMAIL = 'lovettcounselingandconsulting@gmail.com';

const TOPICS = {
  individual: 'Individual therapy',
  couples: 'Couples therapy',
  consulting: 'Consulting or training',
  other: 'Something else',
};
const FOLLOW_UP = { email: 'Email', phone: 'Phone', text: 'Text' };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || '').trim());

// Constant-time compare so the health token can't be guessed by timing.
function sameToken(a = '', b = '') {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const label = (text, top = 14) =>
  `<div style="font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#8B8576;margin:${top}px 0 4px;">${esc(text)}</div>`;
const value = (html) =>
  `<div style="font-family:${SANS};font-size:16px;color:#2C2618;line-height:1.4;">${html}</div>`;

function shell(inner, footerNote) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2EBE0;font-family:${SANS};color:#2C2618;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F2EBE0;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background:#FFFFFF;">
      <tr><td style="background:#3E4A35;padding:28px 32px;">
        <div style="font-family:${SERIF};font-size:22px;color:#F2EBE0;line-height:1;">Lovett Counseling</div>
        <div style="font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#D9A892;margin-top:6px;">&amp; Consulting &middot; Denver</div>
      </td></tr>
      ${inner}
    </table>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;margin-top:18px;">
      <tr><td align="center" style="font-family:${SANS};font-size:11px;color:rgba(44,38,24,0.55);padding:8px 16px;line-height:1.6;">${footerNote}</td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function notification(f) {
  const subject = `Re: Your message to ${PRACTICE}`;
  const inner = `
      <tr><td style="padding:36px 32px 8px;">
        <div style="font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.26em;text-transform:uppercase;color:#A07B6B;margin-bottom:14px;">New message from the website</div>
        <h1 style="margin:0;font-family:${SERIF};font-size:30px;font-weight:500;line-height:1.15;color:#2C2618;">${esc(f.name)} reached out.</h1>
      </td></tr>
      <tr><td style="padding:24px 32px 8px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F8F3E8;border-left:3px solid #A07B6B;">
          <tr><td style="padding:18px 22px;">
            ${label('Email', 0)}${value(`<a href="mailto:${esc(f.email)}" style="color:#A07B6B;text-decoration:none;font-weight:600;">${esc(f.email)}</a>`)}
            ${f.phone ? label('Phone') + value(esc(f.phone)) : ''}
            ${label('Reaching out about')}${value(esc(f.topicLabel))}
            ${label('Preferred follow-up')}${value(esc(f.followUp))}
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:28px 32px 8px;">
        <div style="font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:0.26em;text-transform:uppercase;color:#A07B6B;margin-bottom:14px;">Their message</div>
        <div style="font-family:${SERIF};font-size:17px;line-height:1.65;color:#2C2618;white-space:pre-wrap;">${esc(f.message)}</div>
      </td></tr>
      <tr><td style="padding:32px 32px 8px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
          <td style="background:#3E4A35;">
            <a href="mailto:${esc(f.email)}?subject=${encodeURIComponent(subject)}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#F2EBE0;text-decoration:none;">Reply to ${esc(f.name)} &rarr;</a>
          </td>
        </tr></table>
        <div style="font-family:${SANS};font-size:12px;color:#8B8576;margin-top:14px;line-height:1.5;">Hitting Reply in your inbox also works. It goes straight to ${esc(f.name)}.</div>
      </td></tr>
      <tr><td style="padding:24px 32px 36px;">
        <hr style="border:none;border-top:1px solid rgba(44,38,24,0.1);margin:0 0 16px;">
        <div style="font-family:${SANS};font-size:11px;color:#8B8576;line-height:1.6;">Submitted ${esc(f.when)}<br>Via the contact form at <a href="https://${SITE}" style="color:#A07B6B;text-decoration:none;">${SITE}</a></div>
      </td></tr>`;
  const text = [
    `${f.name} reached out through ${SITE}.`,
    '',
    `Email: ${f.email}`,
    f.phone ? `Phone: ${f.phone}` : null,
    `Reaching out about: ${f.topicLabel}`,
    `Preferred follow-up: ${f.followUp}`,
    '',
    f.message,
    '',
    `Submitted ${f.when}`,
  ].filter((l) => l !== null).join('\n');
  return {
    html: shell(inner, 'Someone used the contact form on your website. Reply to this email to answer them directly.'),
    text,
  };
}

function autoReply(f) {
  const first = f.name.split(/\s+/)[0];
  const inner = `
      <tr><td style="padding:36px 32px 8px;">
        <h1 style="margin:0;font-family:${SERIF};font-size:28px;font-weight:500;line-height:1.2;color:#2C2618;">Thank you, ${esc(first)}. Your message came through.</h1>
      </td></tr>
      <tr><td style="padding:20px 32px 8px;font-family:${SERIF};font-size:17px;line-height:1.65;color:#2C2618;">
        <p style="margin:0 0 16px;">I read every message myself, and I'll get back to you within two business days, usually sooner.</p>
        <p style="margin:0 0 16px;">If you don't hear from me by then, please call or text <a href="tel:+15308020437" style="color:#A07B6B;">${PHONE}</a> or email <a href="mailto:${PRACTICE_EMAIL}" style="color:#A07B6B;">${PRACTICE_EMAIL}</a>. Sometimes a message gets lost, and I'd hate to miss you.</p>
        <p style="margin:0;">Whitney</p>
      </td></tr>
      <tr><td style="padding:24px 32px 36px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F8F3E8;border-left:3px solid #A07B6B;">
          <tr><td style="padding:16px 20px;font-family:${SANS};font-size:13px;line-height:1.6;color:#2C2618;">
            If you're in crisis or need support right now, call or text <a href="tel:988" style="color:#A07B6B;font-weight:600;">988</a>, any time, day or night. I'm not able to respond to emergencies by email.
          </td></tr>
        </table>
      </td></tr>`;
  const text = [
    `Thank you, ${first}. Your message came through.`,
    '',
    "I read every message myself, and I'll get back to you within two business days, usually sooner.",
    '',
    `If you don't hear from me by then, please call or text ${PHONE} or email ${PRACTICE_EMAIL}.`,
    '',
    'Whitney',
    '',
    "If you're in crisis or need support right now, call or text 988, any time, day or night. I'm not able to respond to emergencies by email.",
  ].join('\n');
  return {
    html: shell(inner, `${PRACTICE} &middot; Denver, Colorado &middot; <a href="https://${SITE}" style="color:rgba(44,38,24,0.55);">${SITE}</a>`),
    text,
  };
}

async function send(env, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
}

export async function onRequestPost({ request, env, waitUntil }) {
  let data;
  try {
    const ct = request.headers.get('content-type') || '';
    data = ct.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData());
  } catch {
    return json({ ok: false, error: 'Could not read that submission.' }, 400);
  }

  // Honeypot: people never see this field, so anything in it is a bot.
  if (data._gotcha || data.company) return json({ ok: true });

  // A health check with a wrong or missing token is refused outright, so a
  // misconfigured monitor can never land a test in the practice inbox.
  const healthHeader = request.headers.get('x-health-token');
  const health = healthHeader !== null && sameToken(healthHeader, env.HEALTH_TOKEN || '');
  if (healthHeader !== null && !health) return json({ ok: false, error: 'Unauthorized.' }, 401);

  const topicKey = String(data.topic || 'other');
  const followKey = String(data.preferred_contact || 'email');
  const f = {
    name: String(data.name || '').trim().slice(0, 120),
    email: String(data.email || data._replyto || '').trim().slice(0, 200),
    phone: String(data.phone || '').trim().slice(0, 60),
    message: String(data.message || '').trim().slice(0, 5000),
    topicLabel: TOPICS[topicKey] || TOPICS.other,
    followUp: FOLLOW_UP[followKey] || FOLLOW_UP.email,
    when: new Date().toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'full', timeStyle: 'short' }) + ' MT',
  };

  if (!f.name || !validEmail(f.email) || !f.message) {
    return json({ ok: false, error: 'Please add your name, a valid email, and a message.' }, 400);
  }

  if (env.TURNSTILE_SECRET && !health) {
    const body = new FormData();
    body.append('secret', env.TURNSTILE_SECRET);
    body.append('response', data['cf-turnstile-response'] || '');
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) body.append('remoteip', ip);
    const v = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
      .then((r) => r.json())
      .catch(() => ({ success: false }));
    if (!v.success) return json({ ok: false, error: 'The spam check didn’t go through. Please try again.' }, 400);
  }

  if (!env.RESEND_API_KEY || !env.TO_EMAIL || !env.FROM_EMAIL) {
    return json({ ok: false, error: 'Email is not configured yet.' }, 500);
  }
  if (health && !env.HEALTH_TO) {
    return json({ ok: false, error: 'HEALTH_TO is not set.' }, 500);
  }

  const from = /</.test(env.FROM_EMAIL) ? env.FROM_EMAIL : `${PRACTICE} <${env.FROM_EMAIL}>`;

  // Save first, so the inquiry survives even if every email below fails.
  if (env.SUBMISSIONS && !health) {
    const key = `inquiry:${new Date().toISOString()}:${crypto.randomUUID().slice(0, 8)}`;
    try {
      await env.SUBMISSIONS.put(key, JSON.stringify({ ...f, delivered: false }), { expirationTtl: 60 * 60 * 24 * 30 });
      f.savedKey = key;
    } catch (err) {
      console.error('KV save failed', err);
    }
  }

  const note = notification(f);
  try {
    await send(env, {
      from,
      to: [health ? env.HEALTH_TO : env.TO_EMAIL],
      reply_to: f.email,
      subject: `${health ? '[Health check] ' : ''}New inquiry from ${f.name}`,
      html: note.html,
      text: note.text,
    });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: `Your message didn't go through. Please call or text ${PHONE}, or email ${PRACTICE_EMAIL}.` }, 502);
  }

  if (f.savedKey) {
    waitUntil(env.SUBMISSIONS.put(f.savedKey, JSON.stringify({ ...f, delivered: true }), { expirationTtl: 60 * 60 * 24 * 30 }).catch(() => {}));
  }

  // The visitor's confirmation is a courtesy. If it fails, the inquiry still
  // reached Whitney, so the visitor still sees success.
  if (!health) {
    const reply = autoReply(f);
    waitUntil(
      send(env, {
        from,
        to: [f.email],
        reply_to: env.TO_EMAIL,
        subject: `Thanks for reaching out to ${PRACTICE}`,
        html: reply.html,
        text: reply.text,
      }).catch((err) => console.error('Auto-reply failed', err)),
    );
  }

  return json({ ok: true });
}

export const onRequest = () => json({ ok: false, error: 'Method not allowed.' }, 405);
