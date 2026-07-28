const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const root = path.resolve(__dirname, '..');
  const chatUrl = `${pathToFileURL(path.join(root, 'src', 'modules', 'chat.js')).href}?qa=${Date.now()}`;
  const chat = await import(chatUrl);
  const schema = fs.readFileSync(path.join(root, 'supabase', 'schema.sql'), 'utf8');

  const truckDriver = { vehicleType: 'truck' };
  const vanDriver = { vehicleType: 'van' };
  assert(chat.hasChannelAccess('truck', truckDriver), 'A truck driver should see the truck channel');
  assert(!chat.hasChannelAccess('van', truckDriver), 'A truck driver should not see the van channel');
  assert(chat.hasChannelAccess('van', vanDriver), 'A van driver should see the van channel');
  assert(!chat.hasChannelAccess('truck', vanDriver), 'A van driver should not see the truck channel');

  const employees = {
    'driver-a': { id: 'driver-a', name: 'Anna Andersen', initials: 'AA', role: 'Lastbilchauffør', truck: 'LB 12' },
    'driver-b': { id: 'driver-b', name: 'Bent Bilen', initials: 'BB', role: 'Varebilschauffør', truck: 'VB 8' },
  };
  const row = {
    id: 42,
    sender_id: 'driver-a',
    body: 'Kan du hente for mig?',
    created_at: '2026-07-28T08:15:00.000Z',
    media_attachments: [],
  };
  const forSender = chat.messageFromSupabaseRow(row, 'driver-a', {
    employeeById: id => employees[id],
    currentEmployee: () => employees['driver-a'],
  });
  const forRecipient = chat.messageFromSupabaseRow(row, 'driver-b', {
    employeeById: id => employees[id],
    currentEmployee: () => employees['driver-b'],
  });
  assert.strictEqual(forSender.side, 'me', 'The sender should see the message as their own');
  assert.strictEqual(forRecipient.side, 'them', 'The recipient should see the message as incoming');
  assert.strictEqual(forRecipient.senderName, 'Anna Andersen', 'The recipient should see the correct sender profile');
  assert.strictEqual(forRecipient.senderRole, 'Lastbilchauffør', 'The recipient should see the sender role');

  assert(
    schema.includes("c.channel_type = 'direct' and private.is_conversation_member(c.id)"),
    'Direct conversations must require conversation membership'
  );
  assert(
    schema.includes('on public.messages for select to authenticated using (private.can_read_conversation(conversation_id));'),
    'Message reads must be protected by conversation access'
  );
  assert(
    schema.includes('sender_id = auth.uid() and private.can_read_conversation(conversation_id)'),
    'A user must only send as themselves inside an allowed conversation'
  );
  assert(
    schema.includes("last_updated_at > now() - interval '15 minutes'"),
    'Old GPS positions must not be shown as live'
  );
  assert(
    schema.includes("visibility = 'pickup' and visible_to_user_id = auth.uid()"),
    'Pickup GPS must only be visible to its intended colleague'
  );
  assert(
    schema.includes('using (user_id = auth.uid() and private.is_active_employee())'),
    'Employees must only update their own active GPS sharing'
  );

  console.log('Multi-user contract smoke test passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
