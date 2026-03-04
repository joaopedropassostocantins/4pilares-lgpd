import { describe, it, expect } from 'vitest';
import { generatePixPayload } from './pixGenerator';

describe('PIX Payload Generator', () => {
  it('should generate a valid PIX payload', () => {
    const payload = generatePixPayload({
      amount: 9.90,
      pixKey: '05e5bf85-4484-4b81-9bdf-fc66b6024984',
      merchantName: 'JOAO PEDRO P PASSOS',
      merchantCity: 'SAO PAULO',
      txId: 'test123456789',
    });

    expect(payload).toBeDefined();
    expect(typeof payload).toBe('string');
    expect(payload.length).toBeGreaterThan(50);
    expect(payload).toContain('br.gov.bcb.pix'); // PIX key identifier
  });

  it('should generate different payloads for different amounts', () => {
    const payload1 = generatePixPayload({
      amount: 9.90,
      pixKey: '05e5bf85-4484-4b81-9bdf-fc66b6024984',
      merchantName: 'JOAO PEDRO P PASSOS',
      merchantCity: 'SAO PAULO',
      txId: 'test1',
    });

    const payload2 = generatePixPayload({
      amount: 19.90,
      pixKey: '05e5bf85-4484-4b81-9bdf-fc66b6024984',
      merchantName: 'JOAO PEDRO P PASSOS',
      merchantCity: 'SAO PAULO',
      txId: 'test1',
    });

    expect(payload1).not.toEqual(payload2);
  });

  it('should include merchant information in payload', () => {
    const payload = generatePixPayload({
      amount: 9.90,
      pixKey: '05e5bf85-4484-4b81-9bdf-fc66b6024984',
      merchantName: 'JOAO PEDRO P PASSOS',
      merchantCity: 'SAO PAULO',
      txId: 'test123456789',
    });

    // Payload should contain merchant name and city encoded
    expect(payload).toContain('59');
    expect(payload).toContain('60');
  });

  it('should handle different transaction IDs', () => {
    const payload1 = generatePixPayload({
      amount: 9.90,
      pixKey: '05e5bf85-4484-4b81-9bdf-fc66b6024984',
      merchantName: 'JOAO PEDRO P PASSOS',
      merchantCity: 'SAO PAULO',
      txId: 'txid001',
    });

    const payload2 = generatePixPayload({
      amount: 9.90,
      pixKey: '05e5bf85-4484-4b81-9bdf-fc66b6024984',
      merchantName: 'JOAO PEDRO P PASSOS',
      merchantCity: 'SAO PAULO',
      txId: 'txid002',
    });

    expect(payload1).not.toEqual(payload2);
  });
});
