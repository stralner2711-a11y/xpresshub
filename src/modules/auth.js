export function normalizeEmployeeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function loginInviteContext(href = globalThis.location?.href || '') {
  try {
    const url = new URL(href);
    const invite = String(url.searchParams.get('invite') || '').trim();
    const email = normalizeEmployeeEmail(url.searchParams.get('email') || '');
    return { invite, email, valid: Boolean(invite && email) };
  } catch {
    return { invite: '', email: '', valid: false };
  }
}

export function inviteLink(employee, invitationId = '', options = {}) {
  const baseUrl = String(options.appUrl || 'https://xpresshub-seven.vercel.app/').trim();
  const url = new URL(baseUrl);
  const email = normalizeEmployeeEmail(employee?.email || employee?.invitationEmail || '');
  url.searchParams.set('invite', String(invitationId || employee?.invitationId || options.localInvitationId?.() || '').trim());
  if (email) url.searchParams.set('email', email);
  return url.toString();
}

export function inviteMessage(employee, invitationId = '', options = {}) {
  const invitationUrl = inviteLink(employee, invitationId || employee?.invitationId || '', options);
  const downloadUrl = String(options.downloadPageUrl || 'https://stralner2711-a11y.github.io/xpresshub/download.html').trim();
  const name = employee?.name || '';
  return {
    subject: 'XpressIntra konto',
    invitationUrl,
    downloadUrl,
    body: `Hej ${name}\n\nDu er oprettet til XpressIntra.\n\n1. Åbn dette personlige invitationslink:\n${invitationUrl}\n\n2. Vælg din egen personlige adgangskode med det samme.\n\nHvis appen ikke er installeret endnu, kan du bruge downloadsiden her:\n${downloadUrl}\n\nVigtigt: linket er kun til første oprettelse og virker kun med din arbejdsmail.\n\nHilsen XpressBudet`,
  };
}

export function personalPasswordError(password) {
  if (String(password || '').length < 8) return 'Din personlige kode skal være mindst 8 tegn';
  if (!/[a-z]/.test(password)) return 'Din personlige kode skal have mindst ét lille bogstav';
  if (!/[A-Z]/.test(password)) return 'Din personlige kode skal have mindst ét stort bogstav';
  if (!/[0-9]/.test(password)) return 'Din personlige kode skal have mindst ét tal';
  return '';
}

globalThis.XpressIntraAuth = {
  normalizeEmployeeEmail,
  loginInviteContext,
  inviteLink,
  inviteMessage,
  personalPasswordError,
};
