export function crc16(str) {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export function generateDynamicQRIS(staticString, amount) {
  try {
    if (!staticString) return null;
    let str = staticString.trim();
    if (str.includes('010211')) str = str.replace('010211', '010212');
    str = str.replace(/54\d{2}\d+(?=58)/, '');
    str = str.replace(/6304[0-9A-Fa-f]{4}$/, '');
    const amountStr = Math.round(amount).toString();
    const amountLen = amountStr.length.toString().padStart(2, '0');
    const amountTag = `54${amountLen}${amountStr}`;
    const insertIndex = str.indexOf('5802');
    if (insertIndex === -1) return null;
    const finalStrWithTag = str.slice(0, insertIndex) + amountTag + str.slice(insertIndex);
    const toCalculateCRC = finalStrWithTag + '6304';
    const crc = crc16(toCalculateCRC);
    return toCalculateCRC + crc;
  } catch (e) {
    return null;
  }
}