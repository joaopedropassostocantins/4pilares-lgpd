/**
 * EMV PIX Payload Generator
 * Generates valid PIX "copia e cola" codes for different amounts
 */

interface PixGeneratorParams {
  amount: number;
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  txId: string;
}

/**
 * Generate a valid EMV PIX payload (copia e cola)
 * Based on the EMV QR Code specification for PIX
 */
export function generatePixPayload({
  amount,
  pixKey,
  merchantName,
  merchantCity,
  txId,
}: PixGeneratorParams): string {
  // EMV PIX structure components
  const payload: Record<string, string> = {};

  // 00: Payload Format Indicator
  payload["00"] = "01";

  // 01: Point of Initiation Method (01 = Static)
  payload["01"] = "12";

  // 26: Merchant Account Information (PIX key)
  const pixKeyInfo = `0014br.gov.bcb.pix0136${pixKey}`;
  payload["26"] = pixKeyInfo;

  // 52: Merchant Category Code
  payload["52"] = "0000";

  // 53: Transaction Currency (986 = BRL)
  payload["53"] = "986";

  // 54: Transaction Amount
  const amountStr = amount.toFixed(2).replace(".", "");
  payload["54"] = amountStr.padStart(13, "0");

  // 58: Country Code
  payload["58"] = "BR";

  // 59: Merchant Name
  const merchantNameTruncated = merchantName.substring(0, 25);
  payload["59"] = merchantNameTruncated.padEnd(25, " ");

  // 60: Merchant City
  const merchantCityTruncated = merchantCity.substring(0, 15);
  payload["60"] = merchantCityTruncated.padEnd(15, " ");

  // 62: Additional Data Field Template
  const txIdStr = txId.substring(0, 25);
  payload["62"] = `05${String(txIdStr.length).padStart(2, "0")}${txIdStr}`;

  // 63: CRC16 (will be calculated at the end)
  payload["63"] = "0000";

  // Build the payload string
  let pixString = "";
  for (const [key, value] of Object.entries(payload)) {
    if (key !== "63") {
      pixString += key + String(value.length).padStart(2, "0") + value;
    }
  }

  // Calculate CRC16
  const crc = calculateCRC16(pixString + "6304");
  pixString += "6304" + crc;

  return pixString;
}

/**
 * Calculate CRC16 checksum for EMV PIX
 */
function calculateCRC16(data: string): string {
  let crc = 0xffff;
  const poly = 0x1021;

  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc << 1;
      if (crc & 0x10000) {
        crc = (crc ^ poly) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}
