function defaultInitialsFromName(name = '') {
  return String(name || 'XB').split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'XB';
}

function defaultVehicleLabel(vehicleType) {
  if (vehicleType === 'truck') return 'Lastbil';
  if (vehicleType === 'van') return 'Varebil';
  return 'Kontor';
}

function defaultSearchable(value = '') {
  return String(value || '').toLowerCase();
}

export function cleanPhone(phone = '') {
  return String(phone).replace(/[^\d+]/g, '');
}

export function infoSourceFromHref(href = '') {
  return href?.includes('fstyr.dk') ? 'Færdselsstyrelsen'
    : href?.includes('miljoezoner.dk') ? 'Miljøzoner'
    : href?.includes('vejafgifter.dk') ? 'Vejafgifter'
    : href?.includes('ela.europa.eu') ? 'European Labour Authority'
    : href?.includes('itd.dk') ? 'ITD'
    : href?.includes('at.dk') ? 'Arbejdstilsynet'
    : href?.includes('virk.dk') ? 'Virk'
    : href?.includes('xpressbudet.dk') ? 'XpressBudet'
    : href?.includes('europa.eu') ? 'EU'
    : href?.startsWith('tel:') ? 'Telefon'
    : 'Intern';
}

export function buildInfoLinks(infoDetails = {}, infoSections = []) {
  return Object.entries(infoDetails).flatMap(([category, section]) =>
    section.rows.map(([title, description, href]) => ({
      id: `${category}-${title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-')}`,
      category,
      title,
      description,
      href,
      icon: infoSections.find(item => item.id === category)?.icon || 'info',
      source: infoSourceFromHref(href),
    }))
  );
}

export function filterInfoLinks({ links = [], activeCategory = 'all', query = '', favorites = [], searchable = defaultSearchable } = {}) {
  const normalizedQuery = searchable(String(query || '').trim());
  return links.filter(item =>
    (activeCategory === 'all' || item.category === activeCategory || (activeCategory === 'favorites' && favorites.includes(item.id)))
    && (!normalizedQuery || searchable(`${item.title} ${item.description} ${item.source}`).includes(normalizedQuery))
  );
}

export function contactDirectoryEntries({ companyContacts = [], employees = [], vehicleLabel = defaultVehicleLabel, initialsFromName = defaultInitialsFromName } = {}) {
  const employeeContacts = employees
    .filter(employee => employee.employmentStatus !== 'offboarded')
    .map(employee => ({
      id: `employee-${employee.id}`,
      name: employee.name || 'Kollega',
      role: `${employee.role || vehicleLabel(employee.vehicleType)} · ${employee.truck || employee.department || 'XpressBudet'}`,
      group: employee.department || vehicleLabel(employee.vehicleType),
      phone: employee.phone || '',
      email: employee.email || '',
      initials: employee.initials || initialsFromName(employee.name),
      priority: false,
      employeeId: employee.id,
    }));
  return [...companyContacts, ...employeeContacts];
}

export function resultTitle(activeCategory = 'all', infoSections = []) {
  if (activeCategory === 'favorites') return 'Dine favoritter';
  if (activeCategory === 'all') return 'Søgeresultater';
  return infoSections.find(section => section.id === activeCategory)?.title || 'Resultater';
}

globalThis.XpressIntraInfoCenter = {
  cleanPhone,
  infoSourceFromHref,
  buildInfoLinks,
  filterInfoLinks,
  contactDirectoryEntries,
  resultTitle,
};
