'use client';
import { useState } from 'react';
import {
  useBandMembers,
  type BandMember,
} from '@app/(public)/grupos/_hooks/useBandMembers';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Button,
  Chip,
  User,
} from '@nextui-org/react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { InviteMemberModal } from './InviteMemberModal';
import { EditMemberModal } from './EditMemberModal';
import {
  CrownIcon,
  CalendarIcon,
  EditIcon,
  PlusIcon,
  UsersIcon,
} from '@global/icons';

interface BandMembersProps {
  bandId: number;
}

export const BandMembers = ({ bandId }: BandMembersProps) => {
  const user = useStore($user);
  const { data: members, isLoading, error } = useBandMembers(bandId);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const isAdmin = CheckUserStatus({
    isLoggedIn: true,
    checkBandId: bandId,
    checkBandAdmin: true,
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center py-10">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody>
          <p className="text-danger">Error al cargar los miembros</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple-600">
              <UsersIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Miembros del grupo
              </h2>
              {members && (
                <p className="text-sm text-slate-500">
                  {members.length}{' '}
                  {members.length === 1 ? 'miembro' : 'miembros'}
                </p>
              )}
            </div>
          </div>
          {isAdmin && (
            <Button
              size="sm"
              onPress={() => setIsInviteModalOpen(true)}
              startContent={<PlusIcon className="h-4 w-4" />}
              className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50"
            >
              Invitar miembro
            </Button>
          )}
        </CardHeader>
        <CardBody className="p-6">
          {members && members.length > 0 ? (
            <div className="space-y-2">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isAdmin={isAdmin}
                  currentUserId={user.id}
                  bandId={bandId}
                />
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">
              No hay miembros en este grupo
            </p>
          )}
        </CardBody>
      </Card>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        bandId={bandId}
      />
    </>
  );
};

interface MemberCardProps {
  member: BandMember;
  isAdmin: boolean;
  currentUserId: number;
  bandId: number;
}

const MemberCard = ({
  member,
  isAdmin,
  currentUserId,
  bandId,
}: MemberCardProps) => {
  const isCurrentUser = member.userId === currentUserId;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <User
            name={member.user.name}
            description={
              <div className="flex items-center gap-1">
                <span className="text-xs">{member.role}</span>
              </div>
            }
            avatarProps={{
              name: member.user.name.charAt(0).toUpperCase(),
              size: 'sm',
              className: member.isAdmin
                ? 'bg-yellow-100 text-yellow-600'
                : undefined,
            }}
          />
          <div className="flex gap-1">
            {member.isAdmin && (
              <Chip size="sm" color="warning" variant="flat">
                <span className="flex items-center gap-1">
                  <CrownIcon className="h-3 w-3" /> Admin
                </span>
              </Chip>
            )}
            {member.isEventManager && (
              <Chip size="sm" color="secondary" variant="flat">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" /> Eventos
                </span>
              </Chip>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCurrentUser && (
            <Chip size="sm" variant="flat" color="primary">
              Tú
            </Chip>
          )}
          {isAdmin && (
            <Button
              size="sm"
              isIconOnly
              variant="light"
              aria-label={
                isCurrentUser ? 'Editar mi perfil' : 'Configurar miembro'
              }
              onPress={() => setIsEditModalOpen(true)}
            >
              <EditIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isAdmin && (
        <EditMemberModal
          key={`edit-member-${member.id}-${isEditModalOpen}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          member={member}
          bandId={bandId}
          isSelf={isCurrentUser}
        />
      )}
    </>
  );
};
