import { MusicNoteIcon } from '@global/icons';
import { Draggable } from '@hello-pangea/dnd';
import { SongCardWithControlsProps } from '../_interfaces/songCardInterfaces';
import { SongCardContent } from './SongCardContent';
import { SongDragHandle } from './SongDragHandle';
import { TransposeControlPopover } from './TransposeControlPopover';

export const SongCardWithControls = ({
  data,
  index,
  isAdminEvent,
  songOrder,
  setSongOrder,
}: SongCardWithControlsProps) => {
  // Si no es admin, mostrar sin drag & drop
  if (!isAdminEvent) {
    return (
      <div className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-brand-purple-200 hover:shadow-md dark:bg-black">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 text-sm font-bold text-brand-purple-700">
          {data.order}
        </span>
        <SongCardContent data={data} />
        <div className="text-slate-300 transition-colors duration-200 group-hover:text-brand-purple-400">
          <MusicNoteIcon className="h-5 w-5" />
        </div>
      </div>
    );
  }

  // Con drag & drop para admins
  return (
    <Draggable draggableId={data.song.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group flex items-center gap-3 rounded-lg border-2 p-4 transition-all duration-200 ${snapshot.isDragging
            ? 'z-50 scale-105 border-brand-purple-400 bg-brand-purple-50 shadow-2xl dark:border-brand-purple-800 dark:bg-brand-purple-800'
            : 'border-slate-200 bg-white shadow-sm hover:border-brand-purple-300 hover:shadow-md dark:border-gray-700 dark:bg-black dark:hover:border-brand-purple-400'
            }`}
        >
          {/* Drag Handle */}
          <SongDragHandle dragHandleProps={provided.dragHandleProps} />

          {/* Número de orden */}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 text-sm font-bold text-brand-purple-700">
            {data.order}
          </span>

          {/* Información de la canción */}
          <SongCardContent data={data} />

          {/* Controles de transposición */}
          <TransposeControlPopover
            data={data}
            index={index}
            songOrder={songOrder}
            setSongOrder={setSongOrder}
          />

          {/* Icono decorativo */}
          <div className="text-slate-300 transition-colors duration-200 group-hover:text-brand-purple-400">
            <MusicNoteIcon className="h-5 w-5" />
          </div>
        </div>
      )}
    </Draggable>
  );
};

