// Pure domain rules for shared shopping-list updates.
// Access identity MUST come from a verified server-side session, never a client ID.
// Database integration must persist the version and operation id atomically.
const EDIT_ROLES = new Set(['owner','editor']);
const TYPES = new Set(['add','change_quantity','check','uncheck','remove']);
const ID_RE = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const UNITS = new Set(['pcs','kg','g','l','ml']);
function ensure(test, code) { if (!test) throw Object.assign(new Error(code), { code }); }
function saneName(value) {
  const name = typeof value === 'string' ? value.normalize('NFC').trim().replace(/\s+/g,' ') : '';
  ensure(name.length >= 1 && name.length <= 120 && !/[\u0000-\u001f\u007f]/.test(name), 'invalid_name');
  return name;
}
function saneQuantity(value) {
  ensure(typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 100000 &&
    Math.round(value * 1000) === value * 1000, 'invalid_quantity');
  return value;
}
export function applyShoppingOperation({ list, membership, operation }) {
  ensure(list && typeof list === 'object' && Number.isSafeInteger(list.version) && list.version >= 0 &&
    Array.isArray(list.items) && list.items.length <= 500, 'invalid_list');
  ensure(membership && membership.verified === true && EDIT_ROLES.has(membership.role), 'forbidden');
  ensure(operation && typeof operation === 'object' && TYPES.has(operation.type), 'invalid_operation');
  ensure(ID_RE.test(operation.idempotency_key), 'invalid_idempotency_key');
  ensure(Number.isSafeInteger(operation.expected_version) && operation.expected_version === list.version, 'revision_conflict');
  const items = list.items.map(item => ({ ...item }));
  const id = operation.item_id;
  ensure(ID_RE.test(id), 'invalid_item_id');
  const index = items.findIndex(item => item.id === id);
  if (operation.type === 'add') {
    ensure(index === -1 && items.length < 500, 'item_already_exists_or_full');
    ensure(UNITS.has(operation.unit), 'invalid_unit');
    items.push({id,name:saneName(operation.name),quantity:saneQuantity(operation.quantity),unit:operation.unit,checked:false});
  } else {
    ensure(index >= 0, 'item_not_found');
    if (operation.type === 'remove') items.splice(index,1);
    if (operation.type === 'check') items[index].checked = true;
    if (operation.type === 'uncheck') items[index].checked = false;
    if (operation.type === 'change_quantity') {
      items[index].quantity = saneQuantity(operation.quantity);
      if (operation.unit !== undefined) {
        ensure(UNITS.has(operation.unit), 'invalid_unit');
        items[index].unit = operation.unit;
      }
    }
  }
  return { ...list, version: list.version + 1, items };
}
