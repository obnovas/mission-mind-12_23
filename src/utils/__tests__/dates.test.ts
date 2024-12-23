import { describe, it, expect } from 'vitest';
import { calculateNextCheckInDate, formatDate, isValidDateString } from '../dates';

describe('dates utils', () => {
  describe('calculateNextCheckInDate', () => {
    it('should calculate next date for daily frequency', () => {
      const baseDate = new Date('2024-03-01');
      const result = calculateNextCheckInDate('Daily', baseDate);
      expect(result.toISOString().split('T')[0]).toBe('2024-03-02');
    });

    it('should calculate next date for weekly frequency', () => {
      const baseDate = new Date('2024-03-01');
      const result = calculateNextCheckInDate('Weekly', baseDate);
      expect(result.toISOString().split('T')[0]).toBe('2024-03-08');
    });

    it('should calculate next date for monthly frequency', () => {
      const baseDate = new Date('2024-03-01');
      const result = calculateNextCheckInDate('Monthly', baseDate);
      expect(result.toISOString().split('T')[0]).toBe('2024-04-01');
    });

    it('should use current date when no date provided', () => {
      const result = calculateNextCheckInDate('Daily');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(result.toISOString().split('T')[0]).toBe(tomorrow.toISOString().split('T')[0]);
    });
  });

  describe('formatDate', () => {
    it('should format valid date string', () => {
      const result = formatDate('2024-03-01T00:00:00.000Z');
      expect(result).toBe('Mar 1, 2024');
    });

    it('should handle null date', () => {
      const result = formatDate(null);
      expect(result).toBe('N/A');
    });

    it('should handle undefined date', () => {
      const result = formatDate(undefined);
      expect(result).toBe('N/A');
    });

    it('should handle invalid date string', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('N/A');
    });
  });

  describe('isValidDateString', () => {
    it('should return true for valid date string', () => {
      expect(isValidDateString('2024-03-01T00:00:00.000Z')).toBe(true);
    });

    it('should return false for invalid date string', () => {
      expect(isValidDateString('invalid-date')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidDateString(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidDateString(undefined)).toBe(false);
    });
  });
});