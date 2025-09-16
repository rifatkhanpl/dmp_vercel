import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFormValidation } from '../../hooks/useFormValidation';
import { z } from 'zod';

const testSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older')
});

describe('useFormValidation', () => {
  it('should initialize with empty data', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: testSchema,
        onSubmit: vi.fn()
      })
    );

    expect(result.current.data).toEqual({});
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });

  it('should update field values', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: testSchema,
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.updateField('name', 'John Doe');
    });

    expect(result.current.data.name).toBe('John Doe');
    expect(result.current.isDirty).toBe(true);
  });

  it('should validate fields and show errors', async () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: testSchema,
        onSubmit: vi.fn(),
        debounceMs: 0 // No debounce for testing
      })
    );

    act(() => {
      result.current.updateField('email', 'invalid-email');
    });

    // Wait for validation
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.isValid).toBe(false);
  });

  it('should sanitize inputs when enabled', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema: testSchema,
        onSubmit: vi.fn(),
        sanitizeInputs: true
      })
    );

    act(() => {
      result.current.updateField('name', '<script>alert("xss")</script>John');
    });

    expect(result.current.data.name).not.toContain('<script>');
    expect(result.current.data.name).toContain('John');
  });

  it('should handle form submission', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    
    const { result } = renderHook(() =>
      useFormValidation({
        schema: testSchema,
        onSubmit: mockSubmit
      })
    );

    // Set valid data
    act(() => {
      result.current.updateField('name', 'John Doe');
      result.current.updateField('email', 'john@example.com');
      result.current.updateField('age', 25);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25
    });
  });

  it('should prevent submission with validation errors', async () => {
    const mockSubmit = vi.fn();
    
    const { result } = renderHook(() =>
      useFormValidation({
        schema: testSchema,
        onSubmit: mockSubmit
      })
    );

    // Set invalid data
    act(() => {
      result.current.updateField('email', 'invalid-email');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });
});