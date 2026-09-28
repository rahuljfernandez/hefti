import { describe, expect, it } from 'vitest';
import { isAllowedAccessEmail, isPublicPath } from '../../src/lib/accessGate';

describe('isPublicPath', () => {
  it('treats the landing page as public', () => {
    expect(isPublicPath('/')).toBe(true);
    expect(isPublicPath('/index.html')).toBe(true);
  });

  it('gates product and marketing inner routes', () => {
    expect(isPublicPath('/nursing-homes')).toBe(false);
    expect(isPublicPath('/about')).toBe(false);
    expect(isPublicPath('/contact-us')).toBe(false);
    expect(isPublicPath('/admin/access')).toBe(false);
  });
});

describe('isAllowedAccessEmail', () => {
  it('allows non-Gmail addresses', () => {
    expect(isAllowedAccessEmail('name@cornell.edu')).toBe(true);
    expect(isAllowedAccessEmail('Name@CMS.HHS.GOV')).toBe(true);
    expect(isAllowedAccessEmail('name@outlook.com')).toBe(true);
    expect(isAllowedAccessEmail('name@vanderbilt.edu')).toBe(true);
  });

  it('rejects Gmail unless allowlisted', () => {
    expect(isAllowedAccessEmail('name@gmail.com')).toBe(false);
    expect(isAllowedAccessEmail('name@googlemail.com')).toBe(false);
    expect(isAllowedAccessEmail('')).toBe(false);
  });
});
