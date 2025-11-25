import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { $event } from '@stores/event';
import { userRoles } from '@global/config/constants';
import { useMemo } from 'react';

export const useEventPermissions = () => {
    const user = useStore($user);
    const eventStore = useStore($event);

    const isAdminEvent = useMemo(() => {
        if (user?.isLoggedIn && user?.roles.includes(userRoles.admin.id)) {
            return true;
        }

        if (user?.isLoggedIn && user?.membersofBands) {
            return user.membersofBands.some(
                (band) => band.band.id === eventStore?.bandId && band.isAdmin,
            );
        }

        return false;
    }, [user, eventStore]);

    const isEventManager = useMemo(() => {
        if (user?.isLoggedIn && user?.membersofBands) {
            const bandMembership = user.membersofBands.find(
                (band) => band.band.id === eventStore?.bandId,
            );
            return Boolean(
                bandMembership &&
                bandMembership.isEventManager &&
                !bandMembership.isAdmin,
            );
        }
        return false;
    }, [user, eventStore]);

    const showActionButtons = isAdminEvent || isEventManager;

    return { isAdminEvent, isEventManager, showActionButtons };
};
