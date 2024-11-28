// deno-lint-ignore-file no-unused-vars
import { container } from '@/container/mod.ts';
import { permission, PermissionDecoratorException } from '@/security/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('permission decorator', () => {
  it('should register a valid permission class in the container', () => {
    @permission()
    // @ts-ignore: trust me
    class TestPermission {
      check() {
        return true;
      }
    }

    // Verify the permission was registered in the container
    const registeredPermission = container.get('TestPermission');
    expect(registeredPermission).toBeDefined();
    expect(registeredPermission?.constructor.name).toBe('TestPermission');
  });

  it('should throw PermissionDecoratorException for invalid class names', () => {
    expect(() => {
      @permission()
      // @ts-ignore: trust me
      class InvalidClass {
        check() {
          return true;
        }
      }
    }).toThrow(PermissionDecoratorException);
  });
});
