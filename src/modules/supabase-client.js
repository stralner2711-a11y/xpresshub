export const defaultSupabaseConfig = {
  url: 'https://mtfbdoajzmlgqbeiubxe.supabase.co',
  anonKey: 'sb_publishable_O5_UP9V86eoCG_5f7xksCQ_uoW0jcJd',
};

export function resolveSupabaseConfig({ injected = {}, local = {}, defaults = defaultSupabaseConfig } = {}) {
  return {
    url: String(injected.url || local.url || defaults.url || '').trim(),
    anonKey: String(injected.anonKey || injected.key || local.anonKey || local.key || defaults.anonKey || '').trim(),
  };
}

export function supabaseStatusFromConfig(config = {}, hasNativeClient = false) {
  if (!config.url || !config.anonKey) {
    return { ready: false, label: 'Demo', detail: 'Supabase mangler URL og offentlig anon key' };
  }
  if (!hasNativeClient) {
    return { ready: true, label: 'Online', detail: 'Klar via indbygget Supabase-login' };
  }
  return { ready: true, label: 'Online', detail: 'Klar til Supabase Auth og database' };
}

export function profileFromSupabaseRow(row, user, privateDetails, currentProfile = {}) {
  return {
    name: row.full_name || currentProfile.name || '',
    phone: row.phone || currentProfile.phone || '',
    email: row.email || user.email || currentProfile.email || '',
    role: row.role || currentProfile.role || 'Chauffør',
    accessRole: row.access_role || currentProfile.accessRole || 'employee',
    vehicleType: row.vehicle_type || currentProfile.vehicleType || 'truck',
    truck: row.truck || currentProfile.truck || '',
    department: row.department || currentProfile.department || '',
    license: row.license_summary || currentProfile.license || '',
    emergencyContact: privateDetails.emergency_contact || currentProfile.emergencyContact || '',
    languages: row.languages || currentProfile.languages || '',
    logbook: Boolean(row.logbook_enabled ?? currentProfile.logbook),
    employmentStatus: row.employment_status || currentProfile.employmentStatus || 'active',
    passwordResetRequired: Boolean(row.password_reset_required),
  };
}

export function employeeFromSupabaseRow(row, userId, initialsFromName = fallbackInitialsFromName) {
  return {
    id: row.id,
    name: row.full_name || 'Medarbejder',
    initials: initialsFromName(row.full_name || 'Medarbejder'),
    role: row.role || 'Chauffør',
    accessRole: row.access_role || 'employee',
    vehicleType: row.vehicle_type || 'van',
    truck: row.truck || '',
    status: row.id === userId ? 'Online' : 'Medarbejder',
    location: row.department || '',
    phone: row.phone || '',
    email: row.email || '',
    department: row.department || '',
    license: row.license_summary || '',
    languages: row.languages || '',
    employmentStatus: row.employment_status || 'active',
    passwordResetRequired: Boolean(row.password_reset_required),
    online: row.id === userId,
    sharing: false,
  };
}

function fallbackInitialsFromName(name = '') {
  return String(name || 'XB').split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'XB';
}

globalThis.XpressIntraSupabaseClient = {
  defaultSupabaseConfig,
  resolveSupabaseConfig,
  supabaseStatusFromConfig,
  profileFromSupabaseRow,
  employeeFromSupabaseRow,
};

