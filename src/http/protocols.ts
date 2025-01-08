/**
 * Array of common internet and network protocols.
 * Includes transport protocols, application protocols, and internet protocols.
 * Defined as a readonly constant array to prevent modification.
 */
export const HTTP_PROTOCOLS = [
  'TCP',
  'SMTP',
  'PPP',
  'FTP',
  'SFTP',
  'HTTP',
  'HTTPS',
  'TELNET',
  'POP3',
  'IPv4',
  'IPv6',
  'ICMP',
  'UDP',
  'IMAP',
  'SSH',
  'Gopher',
] as const;
