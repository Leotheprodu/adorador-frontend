import { useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { $event } from '@stores/event';
import { userRoles } from '@global/config/constants';

export const useEventPermissions = () => {
    const user = useStore($user);
    const event = useStore($event);

    // Verificar si es administrador del sistema
    const isSystemAdmin = useMemo(
        () => user?.isLoggedIn && user?.roles.includes(userRoles.admin.id),
        [user],
    );

    // Obtener la membresía de la banda actual
    const bandMembership = useMemo(() => {
        if (user.isLoggedIn && user.membersofBands) {
            return user.membersofBands.find(
                (membership) => membership.band.id === event.bandId,
            );
        }
        return undefined;
    }, [user, event]);

    // Verificar si es administrador de la banda (NO solo event manager) O administrador del sistema
    const isAdminEvent = useMemo(
        () => Boolean((bandMembership && bandMembership.isAdmin) || isSystemAdmin),
        [bandMembership, isSystemAdmin],
    );

    // Verificar si es event manager (puede cambiar canciones durante el evento pero no modificar el evento)
    const isEventManager = useMemo(
        () =>
            Boolean(
                bandMembership &&
                bandMembership.isEventManager &&
                !bandMembership.isAdmin,
            ),
        [bandMembership],
    );

    // Verificar si es miembro del grupo pero NO admin ni event manager (solo puede ver)
    // Los admins del sistema NO deben aparecer como "solo miembros"
    const isBandMemberOnly = useMemo(
        () =>
            Boolean(
                bandMembership &&
                !bandMembership.isAdmin &&
                !bandMembership.isEventManager &&
                !isSystemAdmin,
            ),
        [bandMembership, isSystemAdmin],
    );

    // Determinar si mostrar botones (admin o event manager)
    const showActionButtons = isAdminEvent || isEventManager;

    return {
        isSystemAdmin,
        isAdminEvent,
        isEventManager,
        isBandMemberOnly,
        showActionButtons,
        bandMembership,
    };
};
