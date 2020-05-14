export const balanceOf = (address) => '0x70a08231' + address.padStart(64, '0')
export const cdps = (address) => '0x840c7e24' + address.padStart(64, '0')
export const approve10M = () =>
  '0x095ea7b30000000000000000000000003ffbc08b878d489fec0c80fa65c9b3933b361764000000000000000000000000000000000000000000084595161401484a000000'
export const allowance = (address) =>
  '0xdd62ed3e' +
  address.padStart(64, '0') +
  '0000000000000000000000003ffbc08b878d489fec0c80fa65c9b3933b361764'

export const lock = (amount) =>
  '0xe2233cbd' + Number(amount).toString(16).padStart(64, '0')

export const unlock = (amount, proof) =>
  '0x25d6f6cf' +
  Number(amount).toString(16).padStart(64, '0') +
  '40'.padStart(64, '0') +
  (proof.length / 2).toString(16).padStart(64, '0') +
  proof

export const borrow = (amount, proof) =>
  '0x3186c0d9' +
  Number(amount).toString(16).padStart(64, '0') +
  '40'.padStart(64, '0') +
  (proof.length / 2).toString(16).padStart(64, '0') +
  proof

export const returnDebt = (amount) =>
  '0xd2cedf04' + Number(amount).toString(16).padStart(64, '0')

export const liquidate = (address, proof) =>
  '0x0eccd2c9' +
  address.padStart(64, '0') +
  '40'.padStart(64, '0') +
  (proof.length / 2).toString(16).padStart(64, '0') +
  proof

export const transfer = (address, amount) =>
  '0xa9059cbb' +
  address.padStart(64, '0') +
  Number(amount).toString(16).padStart(64, '0')
