import { MicrophoneIcon, FolderMusicIcon } from '@global/icons';
import { PrimaryButton } from '@global/components/buttons';
import { BandActionsProps } from '../_interfaces/bandCardInterfaces';

export const BandActions = ({ bandId, eventId }: BandActionsProps) => {
    return (
        <div className="px-6 py-5">
            <div className="flex flex-col gap-3">
                {eventId && (
                    <PrimaryButton
                        href={`/grupos/${bandId}/eventos/${eventId}`}
                        startContent={<MicrophoneIcon className="h-4 w-4" />}
                        className="w-full bg-gradient-to-r from-brand-pink-500 to-brand-purple-600"
                    >
                        Ver Evento
                    </PrimaryButton>
                )}

                <PrimaryButton
                    href={`/grupos/${bandId}`}
                    startContent={<FolderMusicIcon className="h-5 w-5" />}
                    className="w-full"
                >
                    Administrar Grupo
                </PrimaryButton>
            </div>
        </div>
    );
};
