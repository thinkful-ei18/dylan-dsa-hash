'use strict';

class HashMap {
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Key error');
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    if (this._slots[index]) this.length--;
    this._slots[index] = {
      key,
      value,
      deleted: false
    };
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if (slot === undefined || (slot.key == key && !slot.deleted)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

function main() {
  const hash = new HashMap();
  hash.set('Hobbit', 'Bilbo');
  hash.set('Hobbit', 'Frodo');
  hash.set('Wizard', 'Gandolf');
  hash.set('Human', 'Aragon');
  hash.set('Elf', 'Legolas');
  hash.set('Maiar', 'The Necromancer');
  hash.set('Maiar', 'Sauron');
  hash.set('RingBearer', 'Gollum');
  hash.set('LadyOfLight', 'Galadriel');
  hash.set('HalfElven', 'Arwen');
  hash.set('Ent', 'Treebeard');
  console.log(hash);
  console.log(hash.get('Maiar'));
}

// main();

function isPalindrome(str) {
  const pal = new HashMap();
  let oddCount = 0;
  str = str.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  for (let i = 0; i < str.length; i++) {
    try {
      let value = pal.get(str[i]);
      pal.set(str[i], value + 1);
    } catch (error) {
      pal.set(str[i], 1);
    }
  }

  for (let i = 0; i < str.length; i++) {
    let value = pal.get(str[i]);
    if (value % 2 !== 0) oddCount++;
    if (oddCount > 1) return false;
  }
  return true;
}

// console.log(isPalindrome('a man a plan a canal panama'));

function groupAnagrams(arr) {
  const ana = new HashMap();

  arr.forEach((word, index) => {
    let sorted = word
      .split('')
      .sort()
      .join('');
    try {
      let value = ana.get(sorted);
      value.push(index);
      ana.set(sorted, value);
    } catch (error) {
      ana.set(sorted, [index]);
    }
  });

  let result = new Array(ana.length);

  for (let i = 0; i < arr.length; i++) {
    let sorted = arr[i]
      .split('')
      .sort()
      .join('');
    try {
      let value = ana.get(sorted);
      value = value.map(index => {
        return arr[index];
      });
      result[i] = value;
      ana.remove(sorted);
    } catch (error) {
      continue;
    }
  }
  return result;
}

// console.log(groupAnagrams(['the', 'dog', 'teh']));

class _Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertLast(value) {
    let node = new _Node(value);
    if (this.head === null) return (this.head = node);
    let tempNode = this.head;
    while (tempNode.next !== null) {
      tempNode = tempNode.next;
    }
    tempNode.next = node;
  }
}

class ChainHash {
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  _findSlot(key) {
    const hash = ChainHash._hashString(key);
    return hash % this._capacity;
  }

  get(key) {
    const index = this._findSlot(key);
    
    if (this._slots[index] === undefined) {
      throw new Error('Key error');
    }
    let tempNode = this._slots[index].head;
    while (tempNode !== null) {
      if (tempNode.value.key === key) {
        return tempNode.value.value;
      }
      tempNode = tempNode.next;
    }
    return null;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    if (!this._slots[index]) {
      let list = new LinkedList();
      this._slots[index] = list;
      this.length++;
      return this._slots[index].insertLast({ key, value, deleted: false });
    }
    let tempNode = this._slots[index].head;
    while (tempNode !== null) {
      if (tempNode.value.key === key) {
        return (tempNode.value = { key, value, deleted: false });
      }
      tempNode = tempNode.next;
    }
    this._slots[index].insertLast({ key, value, deleted: false });
  }

  remove(key) {
    const index = this._findSlot(key);
    if (index === undefined) {
      throw new Error('Key error');
    }
    index.value.deleted = true;
    this.length--;
    this._deleted++;
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.value.key, slot.value.value);
      }
    }
  }
}

ChainHash.MAX_LOAD_RATIO = 0.9;
ChainHash.SIZE_RATIO = 3;

function main2() {
  const hash = new ChainHash();
  hash.set('Hobbit', 'Bilbo');
  hash.set('Hobbit', 'Frodo');
  hash.set('Wizard', 'Gandolf');
  hash.set('Human', 'Aragon');
  hash.set('Elf', 'Legolas');
  hash.set('Maiar', 'The Necromancer');
  hash.set('Maiar', 'Sauron');
  hash.set('RingBearer', 'Gollum');
  hash.set('LadyOfLight', 'Galadriel');
  hash.set('HalfElven', 'Arwen');
  hash.set('Ent', 'Treebeard');
  console.log(JSON.stringify(hash, null, 4));
  console.log(hash.get('Maiar'));
}

main2();
