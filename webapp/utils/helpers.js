import assert from 'bsert';
/* Given a Set
 * @param {String} _name - name input to confirm if unique
 * @param {Set} set - set of names to confirm if unique or not
 * @returns {String} name - unique name given passed set of names
 */
export function createUnique(_name, set) {
  assert(set instanceof Set, 'Must pass a set to test unique');
  let name = _name.slice();
  if (set.has(name)) {
    // find unique suffix by incrementing counter
    let counter = 1;
    while (set.has(`${name}-${counter}`)) {
      counter++;
    }
    return `${name}-${counter}`;
  }
  return name;
}

export default {
  createUnique
};
