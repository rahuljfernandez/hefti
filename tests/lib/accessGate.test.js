import { describe, expect, it } from 'vitest';
import { isEduGovEmail, isPublicPath } from '../../src/lib/accessGate';

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

describe('isEduGovEmail', () => {
  it('allows .edu and .gov addresses', () => {
    expect(isEduGovEmail('name@cornell.edu')).toBe(true);
    expect(isEduGovEmail('Name@CMS.HHS.GOV')).toBe(true);
  });

  it('rejects other domains', () => {
    expect(isEduGovEmail('name@gmail.com')).toBe(false);
    expect(isEduGovEmail('name@school.edu.com')).toBe(false);
  });
});
