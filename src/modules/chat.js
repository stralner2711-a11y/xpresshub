function defaultInitialsFromName(name = '') {
  return String(name || 'XB').split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'XB';
}

function defaultSearchable(value = '') {
  return String(value || '').toLowerCase();
}

export function hasChannelAccess(channel, profile = {}, helpers = {}) {
  if (channel === 'truck') return profile.vehicleType === 'truck';
  if (channel === 'van') return profile.vehicleType === 'van';
  return true;
}

export function canAccessChat(chat, profile = {}, helpers = {}) {
  if (!chat.channel) return true;
  return hasChannelAccess(chat.channel, profile, helpers);
}

export function canReadAudience(audience = 'Alle medarbejdere', profile = {}, helpers = {}) {
  const normalized = String(audience || '').toLowerCase();
  if (normalized === 'all' || normalized.includes('alle')) return true;
  if (normalized === 'truck' || normalized.includes('lastbil')) return hasChannelAccess('truck', profile, helpers);
  if (normalized === 'van' || normalized.includes('varebil')) return hasChannelAccess('van', profile, helpers);
  return true;
}

export function chatFromConversationRow(row, latestMessage = null, helpers = {}) {
  const initialsFromName = helpers.initialsFromName || defaultInitialsFromName;
  const isAll = row.channel_type === 'all';
  const isTruck = row.channel_type === 'truck';
  const isVan = row.channel_type === 'van';
  const title = row.title || (row.channel_type === 'direct' ? 'Direkte samtale' : 'Samtale');
  return {
    id: row.id,
    name: title,
    initials: isAll ? 'FC' : isTruck ? 'LB' : isVan ? 'VB' : initialsFromName(title),
    preview: latestMessage?.body || 'Ingen beskeder endnu',
    time: latestMessage?.created_at ? new Date(latestMessage.created_at).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }) : '',
    unread: 0,
    community: isAll,
    channel: isTruck ? 'truck' : isVan ? 'van' : null,
    online: true,
  };
}

export function messageFromSupabaseRow(row, userId, helpers = {}) {
  const employeeById = helpers.employeeById || (() => null);
  const currentEmployee = helpers.currentEmployee || (() => null);
  const initialsFromName = helpers.initialsFromName || defaultInitialsFromName;
  const attachment = Array.isArray(row.media_attachments) ? row.media_attachments[0] : null;
  const sender = employeeById(row.sender_id) || (row.sender_id === userId ? currentEmployee() : null);
  return {
    id: row.id,
    senderId: row.sender_id,
    side: row.sender_id === userId ? 'me' : 'them',
    senderName: sender?.name || 'Kollega',
    senderInitials: sender?.initials || initialsFromName(sender?.name || 'Kollega'),
    senderRole: sender?.role || '',
    senderVehicle: sender?.truck || '',
    body: row.body,
    time: row.created_at ? new Date(row.created_at).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }) : '',
    createdAt: row.created_at,
    image: attachment ? {
      src: attachment.signedUrl || '',
      name: attachment.file_name,
      storagePath: attachment.storage_path,
      type: attachment.mime_type,
      size: attachment.size_bytes,
    } : null,
  };
}

globalThis.XpressIntraChat = {
  hasChannelAccess,
  canAccessChat,
  canReadAudience,
  chatFromConversationRow,
  messageFromSupabaseRow,
};
