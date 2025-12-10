/**
 * Base64 Encoding/Decoding Utilities
 * React Native compatible (replaces Node.js Buffer)
 */

/**
 * Decode base64 string to UTF-8 string
 * Compatible with React Native (no Buffer dependency)
 */
export function base64Decode(base64: string): string {
  try {
    // Use atob if available (web/browser)
    if (typeof atob !== 'undefined') {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    }

    // Fallback: manual base64 decoding for React Native
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';

    base64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');

    for (let i = 0; i < base64.length; i += 4) {
      const enc1 = chars.indexOf(base64.charAt(i));
      const enc2 = chars.indexOf(base64.charAt(i + 1));
      const enc3 = chars.indexOf(base64.charAt(i + 2));
      const enc4 = chars.indexOf(base64.charAt(i + 3));

      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;

      output += String.fromCharCode(chr1);

      if (enc3 !== 64) {
        output += String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output += String.fromCharCode(chr3);
      }
    }

    // Convert to UTF-8
    return decodeURIComponent(escape(output));
  } catch (error) {
    throw new Error(`Failed to decode base64: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Encode UTF-8 string to base64
 * Compatible with React Native (no Buffer dependency)
 */
export function base64Encode(str: string): string {
  try {
    // Use btoa if available (web/browser)
    if (typeof btoa !== 'undefined') {
      return btoa(unescape(encodeURIComponent(str)));
    }

    // Fallback: manual base64 encoding for React Native
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';

    str = unescape(encodeURIComponent(str));

    for (let i = 0; i < str.length; i += 3) {
      const chr1 = str.charCodeAt(i);
      const chr2 = str.charCodeAt(i + 1);
      const chr3 = str.charCodeAt(i + 2);

      const enc1 = chr1 >> 2;
      const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      let enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = 64;
        enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
    }

    return output;
  } catch (error) {
    throw new Error(`Failed to encode base64: ${error instanceof Error ? error.message : String(error)}`);
  }
}

