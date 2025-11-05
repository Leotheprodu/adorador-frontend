import React from 'react';
import { renderHook } from '@testing-library/react';
import { userRoles } from '@global/config/constants';
import type { LoggedUser } from '@auth/login/_interfaces/LoginInterface';
import type { EventByIdInterface } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

// Mock @nanostores/react
jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: (store: any) => store.get(),
}));

// Mock the stores with inline factory
jest.mock('@stores/users', () => {
  let value: LoggedUser = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    status: 'inactive',
    roles: [],
    memberships: [],
    membersofBands: [],
    isLoggedIn: false,
  };

  return {
    $user: {
      get: () => value,
      set: (newValue: LoggedUser) => {
        value = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

jest.mock('@stores/event', () => {
  let value: EventByIdInterface = {
    id: 0,
    title: '',
    date: '',
    bandId: 0,
    songs: [],
  };

  return {
    $event: {
      get: () => value,
      set: (newValue: EventByIdInterface) => {
        value = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

// Import after mocks
import { CheckUserStatus } from '../checkUserStatus';
import { $user } from '@stores/users';
import { $event } from '@stores/event';

// Helper to create a default logged user
const createMockUser = (overrides?: Partial<LoggedUser>): LoggedUser => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  birthdate: '1990-01-01',
  status: 'active',
  roles: [],
  memberships: [],
  membersofBands: [],
  isLoggedIn: true,
  ...overrides,
});

// Helper to create a default event
const createMockEvent = (
  overrides?: Partial<EventByIdInterface>,
): EventByIdInterface => ({
  id: 1,
  title: 'Test Event',
  date: '2025-11-05',
  bandId: 10,
  songs: [],
  ...overrides,
});

// Wrapper component for testing hooks that use nanostores
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

describe('CheckUserStatus', () => {
  beforeEach(() => {
    // Reset stores to default state
    $user.set({
      id: 0,
      name: '',
      email: '',
      phone: '',
      birthdate: '',
      status: 'inactive',
      roles: [],
      memberships: [],
      membersofBands: [],
      isLoggedIn: false,
    });

    $event.set({
      id: 0,
      title: '',
      date: '',
      bandId: 0,
      songs: [],
    });

    // Mock console.log to reduce noise
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Admin privileges', () => {
    it('should grant access to admin users regardless of other checks', () => {
      const adminUser = createMockUser({
        roles: [userRoles.admin.id],
      });
      $user.set(adminUser);

      const { result } = renderHook(
        () => CheckUserStatus({ isLoggedIn: false }), // Even with isLoggedIn: false
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
      expect(console.log).toHaveBeenCalledWith(
        'User is an admin, access granted',
      );
    });

    it('should grant access to admin even with negative roles', () => {
      const adminUser = createMockUser({
        roles: [userRoles.admin.id, userRoles.editor.id],
      });
      $user.set(adminUser);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            negativeRoles: [userRoles.editor.id],
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });
  });

  describe('isLoggedIn validation', () => {
    it('should return true when isLoggedIn is not defined (default behavior)', () => {
      const user = createMockUser({ isLoggedIn: false });
      $user.set(user);

      const { result } = renderHook(() => CheckUserStatus({}), {
        wrapper: TestWrapper,
      });

      expect(result.current).toBe(true);
    });

    it('should return true when user is logged in and isLoggedIn is true', () => {
      const user = createMockUser({ isLoggedIn: true });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ isLoggedIn: true }),
        {
          wrapper: TestWrapper,
        },
      );

      expect(result.current).toBe(true);
    });

    it('should return false when user is not logged in but isLoggedIn is required', () => {
      const user = createMockUser({ isLoggedIn: false });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ isLoggedIn: true }),
        {
          wrapper: TestWrapper,
        },
      );

      expect(result.current).toBe(false);
      expect(console.log).toHaveBeenCalledWith(
        'User is not logged in or logged in status does not match',
      );
    });

    it('should return true when user is logged in but isLoggedIn is false', () => {
      const user = createMockUser({ isLoggedIn: true });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ isLoggedIn: false }),
        {
          wrapper: TestWrapper,
        },
      );

      expect(result.current).toBe(false);
    });
  });

  describe('Role validation', () => {
    it('should grant access when user has required role', () => {
      const user = createMockUser({
        roles: [userRoles.editor.id],
      });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ roles: [userRoles.editor.id] }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });

    it('should grant access when user has any of the required roles', () => {
      const user = createMockUser({
        roles: [userRoles.moderator.id],
      });
      $user.set(user);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            roles: [userRoles.editor.id, userRoles.moderator.id],
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });

    it('should deny access when user does not have required role', () => {
      const user = createMockUser({
        roles: [userRoles.user.id],
      });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ roles: [userRoles.editor.id] }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
      expect(console.log).toHaveBeenCalledWith(
        'User does not have the required roles',
      );
    });
  });

  describe('Negative roles validation', () => {
    it('should deny access when user has a negative role', () => {
      const user = createMockUser({
        roles: [userRoles.editor.id, userRoles.user.id],
      });
      $user.set(user);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            negativeRoles: [userRoles.editor.id],
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
      expect(console.log).toHaveBeenCalledWith('User has negative roles');
    });

    it('should grant access when user does not have negative roles', () => {
      const user = createMockUser({
        roles: [userRoles.user.id],
      });
      $user.set(user);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            negativeRoles: [userRoles.editor.id],
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });
  });

  describe('Church membership validation', () => {
    it('should grant access when user has required church membership', () => {
      const user = createMockUser({
        memberships: [
          {
            id: 1,
            church: { id: 5, name: 'Test Church' },
            roles: [],
            since: new Date('2020-01-01'),
          },
        ],
      });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ checkChurchId: 5 }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });

    it('should deny access when user does not have required church membership', () => {
      const user = createMockUser({
        memberships: [
          {
            id: 1,
            church: { id: 3, name: 'Another Church' },
            roles: [],
            since: new Date('2020-01-01'),
          },
        ],
      });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ checkChurchId: 5 }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
      expect(console.log).toHaveBeenCalledWith(
        'User does not have the required church membership',
      );
    });

    it('should grant access when checkChurchId is not provided', () => {
      const user = createMockUser({
        memberships: [],
      });
      $user.set(user);

      const { result } = renderHook(() => CheckUserStatus({}), {
        wrapper: TestWrapper,
      });

      expect(result.current).toBe(true);
    });
  });

  describe('Church roles validation', () => {
    it('should grant access when user has required church role', () => {
      const user = createMockUser({
        memberships: [
          {
            id: 1,
            church: { id: 5, name: 'Test Church' },
            roles: [
              { id: 1, name: 'Pastor', churchRoleId: 1 },
              { id: 2, name: 'Leader', churchRoleId: 2 },
            ],
            since: new Date('2020-01-01'),
          },
        ],
      });
      $user.set(user);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            checkChurchId: 5,
            churchRoles: [1],
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });

    it('should deny access when user does not have required church role', () => {
      const user = createMockUser({
        memberships: [
          {
            id: 1,
            church: { id: 5, name: 'Test Church' },
            roles: [{ id: 2, name: 'Leader', churchRoleId: 2 }],
            since: new Date('2020-01-01'),
          },
        ],
      });
      $user.set(user);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            checkChurchId: 5,
            churchRoles: [1], // Pastor role
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
      expect(console.log).toHaveBeenCalledWith(
        'User does not have the required church roles',
      );
    });

    it('should grant access when churchRoles is not provided', () => {
      const user = createMockUser({
        memberships: [
          {
            id: 1,
            church: { id: 5, name: 'Test Church' },
            roles: [],
            since: new Date('2020-01-01'),
          },
        ],
      });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ checkChurchId: 5 }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });
  });

  describe('Negative church roles validation', () => {
    it('should deny access when user has negative church role', () => {
      const user = createMockUser({
        memberships: [
          {
            id: 1,
            church: { id: 5, name: 'Test Church' },
            roles: [
              { id: 1, name: 'Pastor', churchRoleId: 1 },
              { id: 3, name: 'Banned', churchRoleId: 99 },
            ],
            since: new Date('2020-01-01'),
          },
        ],
      });
      $user.set(user);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            checkChurchId: 5,
            negativeChurchRoles: [99],
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
      expect(console.log).toHaveBeenCalledWith(
        'User has negative church roles',
      );
    });

    it('should grant access when user does not have negative church roles', () => {
      const user = createMockUser({
        memberships: [
          {
            id: 1,
            church: { id: 5, name: 'Test Church' },
            roles: [{ id: 1, name: 'Pastor', churchRoleId: 1 }],
            since: new Date('2020-01-01'),
          },
        ],
      });
      $user.set(user);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            checkChurchId: 5,
            negativeChurchRoles: [99],
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });
  });

  describe('Band membership validation', () => {
    it('should grant access when user is member of required band', () => {
      const user = createMockUser({
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: false,
            isEventManager: false,
            role: 'Guitarist',
            band: { id: 10, name: 'Worship Band' },
          },
        ],
      });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ checkBandId: 10 }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });

    it('should deny access when user is not member of required band', () => {
      const user = createMockUser({
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: false,
            isEventManager: false,
            role: 'Vocalist',
            band: { id: 5, name: 'Another Band' },
          },
        ],
      });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ checkBandId: 10 }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
      expect(console.log).toHaveBeenCalledWith(
        'User does not have the required band membership',
      );
    });

    it('should grant access when checkBandId is not provided', () => {
      const user = createMockUser({
        membersofBands: [],
      });
      $user.set(user);

      const { result } = renderHook(() => CheckUserStatus({}), {
        wrapper: TestWrapper,
      });

      expect(result.current).toBe(true);
    });
  });

  describe('Event admin permission validation', () => {
    it('should grant access when user is event manager for the band', () => {
      const user = createMockUser({
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: false,
            isEventManager: true, // Event manager
            role: 'Leader',
            band: { id: 10, name: 'Worship Band' },
          },
        ],
      });
      $user.set(user);

      const event = createMockEvent({ bandId: 10 });
      $event.set(event);

      const { result } = renderHook(
        () => CheckUserStatus({ checkAdminEvent: true }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });

    it('should deny access when user is not event manager', () => {
      const user = createMockUser({
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: false,
            isEventManager: false, // Not event manager
            role: 'Member',
            band: { id: 10, name: 'Worship Band' },
          },
        ],
      });
      $user.set(user);

      const event = createMockEvent({ bandId: 10 });
      $event.set(event);

      const { result } = renderHook(
        () => CheckUserStatus({ checkAdminEvent: true }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
      expect(console.log).toHaveBeenCalledWith(
        'User does not have admin event permission',
      );
    });

    it('should deny access when user is not logged in', () => {
      const user = createMockUser({
        isLoggedIn: false,
        membersofBands: [],
      });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ checkAdminEvent: true }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
    });

    it('should grant access when checkAdminEvent is false', () => {
      const user = createMockUser({
        membersofBands: [],
      });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ checkAdminEvent: false }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });

    it('should grant access when checkAdminEvent is not provided', () => {
      const user = createMockUser({
        membersofBands: [],
      });
      $user.set(user);

      const { result } = renderHook(() => CheckUserStatus({}), {
        wrapper: TestWrapper,
      });

      expect(result.current).toBe(true);
    });
  });

  describe('Complex scenarios with multiple validations', () => {
    it('should pass all validations for a complete scenario', () => {
      const user = createMockUser({
        roles: [userRoles.editor.id],
        memberships: [
          {
            id: 1,
            church: { id: 5, name: 'Test Church' },
            roles: [{ id: 1, name: 'Pastor', churchRoleId: 1 }],
            since: new Date('2020-01-01'),
          },
        ],
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: true,
            isEventManager: true,
            role: 'Leader',
            band: { id: 10, name: 'Worship Band' },
          },
        ],
      });
      $user.set(user);

      const event = createMockEvent({ bandId: 10 });
      $event.set(event);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            isLoggedIn: true,
            roles: [userRoles.editor.id],
            checkChurchId: 5,
            churchRoles: [1],
            checkBandId: 10,
            checkAdminEvent: true,
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });

    it('should fail when one validation fails in a complex scenario', () => {
      const user = createMockUser({
        roles: [userRoles.editor.id],
        memberships: [
          {
            id: 1,
            church: { id: 5, name: 'Test Church' },
            roles: [{ id: 2, name: 'Member', churchRoleId: 2 }], // Wrong church role
            since: new Date('2020-01-01'),
          },
        ],
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: true,
            isEventManager: true,
            role: 'Leader',
            band: { id: 10, name: 'Worship Band' },
          },
        ],
      });
      $user.set(user);

      const event = createMockEvent({ bandId: 10 });
      $event.set(event);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            isLoggedIn: true,
            roles: [userRoles.editor.id],
            checkChurchId: 5,
            churchRoles: [1], // Requires Pastor role
            checkBandId: 10,
            checkAdminEvent: true,
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
    });

    it('should handle user with multiple roles and memberships', () => {
      const user = createMockUser({
        roles: [userRoles.user.id, userRoles.moderator.id, userRoles.editor.id],
        memberships: [
          {
            id: 1,
            church: { id: 5, name: 'Church A' },
            roles: [{ id: 1, name: 'Pastor', churchRoleId: 1 }],
            since: new Date('2020-01-01'),
          },
          {
            id: 2,
            church: { id: 8, name: 'Church B' },
            roles: [{ id: 2, name: 'Member', churchRoleId: 2 }],
            since: new Date('2021-01-01'),
          },
        ],
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: false,
            isEventManager: false,
            role: 'Member',
            band: { id: 10, name: 'Band A' },
          },
          {
            id: 2,
            isActive: true,
            isAdmin: true,
            isEventManager: true,
            role: 'Leader',
            band: { id: 15, name: 'Band B' },
          },
        ],
      });
      $user.set(user);

      const event = createMockEvent({ bandId: 15 });
      $event.set(event);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            isLoggedIn: true,
            roles: [userRoles.editor.id],
            checkChurchId: 5,
            churchRoles: [1],
            checkAdminEvent: true,
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(true);
    });

    it('should prioritize admin access over negative validations', () => {
      const user = createMockUser({
        roles: [userRoles.admin.id, userRoles.editor.id],
        memberships: [],
        membersofBands: [],
      });
      $user.set(user);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            isLoggedIn: false, // Should fail
            negativeRoles: [userRoles.editor.id], // Should fail
            checkChurchId: 99, // Should fail (no membership)
            churchRoles: [1], // Should fail
            checkBandId: 99, // Should fail (no band membership)
          }),
        { wrapper: TestWrapper },
      );

      // Admin bypasses all checks
      expect(result.current).toBe(true);
      expect(console.log).toHaveBeenCalledWith(
        'User is an admin, access granted',
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle empty user object gracefully', () => {
      $user.set({
        id: 0,
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        status: 'inactive',
        roles: [],
        memberships: [],
        membersofBands: [],
        isLoggedIn: false,
      });

      const { result } = renderHook(() => CheckUserStatus({}), {
        wrapper: TestWrapper,
      });

      expect(result.current).toBe(true);
    });

    it('should handle user with no roles array', () => {
      const user = createMockUser({
        roles: [],
      });
      $user.set(user);

      const { result } = renderHook(
        () => CheckUserStatus({ roles: [userRoles.editor.id] }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
    });

    it('should handle user with empty memberships array', () => {
      const user = createMockUser({
        memberships: [],
      });
      $user.set(user);

      const { result } = renderHook(
        () =>
          CheckUserStatus({
            checkChurchId: 5,
            churchRoles: [1],
          }),
        { wrapper: TestWrapper },
      );

      expect(result.current).toBe(false);
    });

    it('should handle all optional parameters as undefined', () => {
      const user = createMockUser();
      $user.set(user);

      const { result } = renderHook(() => CheckUserStatus({}), {
        wrapper: TestWrapper,
      });

      expect(result.current).toBe(true);
    });
  });
});
