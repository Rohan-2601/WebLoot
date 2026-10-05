import dns from "dns/promises";
import net from "net";

const isPrivateIP = (ip) => {
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    return (
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) ||
      parts[0] === 0
    );
  } else if (net.isIPv6(ip)) {
    return (
      ip === '::1' ||
      ip.toLowerCase().startsWith('fc') ||
      ip.toLowerCase().startsWith('fd') ||
      ip.toLowerCase().startsWith('fe8') ||
      ip.toLowerCase().startsWith('fe9') ||
      ip.toLowerCase().startsWith('fea') ||
      ip.toLowerCase().startsWith('feb')
    );
  }
  return false;
};

export const validateUrlSafety = async (urlStr) => {
  let parsedUrl;
  try {
    parsedUrl = new URL(urlStr);
  } catch {
    throw new Error("Invalid URL format");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("Only HTTP and HTTPS protocols are allowed");
  }

  const hostname = parsedUrl.hostname;
  
  if (hostname.toLowerCase() === "localhost") {
    throw new Error("Localhost is not allowed");
  }

  if (net.isIP(hostname)) {
    if (isPrivateIP(hostname)) {
      throw new Error("Private/Internal IPs are not allowed");
    }
  } else {
    try {
      const addresses = await dns.lookup(hostname);
      if (isPrivateIP(addresses.address)) {
        throw new Error("Resolves to a private/internal IP");
      }
    } catch (err) {
      throw new Error(`DNS resolution failed: ${err.message}`);
    }
  }

  return parsedUrl;
};
