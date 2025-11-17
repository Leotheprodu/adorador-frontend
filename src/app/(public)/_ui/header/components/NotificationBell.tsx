'use client';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Tabs,
  Tab,
} from '@nextui-org/react';
import { BellIcon } from '@global/icons/BellIcon';
import { useNotificationBell } from './NotificationBell/_hooks/useNotificationBell';
import { NotificationsList } from './NotificationBell/_components/NotificationsList';
import { InvitationsList } from './NotificationBell/_components/InvitationsList';

export const NotificationBell = () => {
  const {
    user,
    invitations,
    loadingInvitations,
    notificationsCount,
    invitationsCount,
    totalCount,
    isOpen,
    setIsOpen,
  } = useNotificationBell();

  if (!user.isLoggedIn) return null;

  return (
    <Popover placement="right-end" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="flat"
          className="relative overflow-visible bg-brand-purple-100 text-brand-purple-700 hover:bg-brand-purple-200 dark:bg-brand-purple-900 dark:text-brand-purple-300 dark:hover:bg-brand-purple-800"
          aria-label="Notificaciones"
          data-testid="notification-bell-button"
        >
          <BellIcon className="text-2xl" />
          {totalCount > 0 && (
            <span
              className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white shadow-lg"
              data-testid="notification-badge"
            >
              {totalCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-50 w-full p-4"
        data-testid="notification-popover"
      >
        <Tabs aria-label="Notificaciones" className="w-full">
          <Tab
            key="notifications"
            title={
              <div className="flex items-center gap-2">
                <span>Notificaciones</span>
                {notificationsCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    {notificationsCount}
                  </span>
                )}
              </div>
            }
          >
            <NotificationsList
              notificationsCount={notificationsCount}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </Tab>
          <Tab
            key="invitations"
            title={
              <div className="flex items-center gap-2">
                <span>Invitaciones</span>
                {invitationsCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    {invitationsCount}
                  </span>
                )}
              </div>
            }
          >
            <InvitationsList
              invitations={invitations}
              isLoading={loadingInvitations}
            />
          </Tab>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
