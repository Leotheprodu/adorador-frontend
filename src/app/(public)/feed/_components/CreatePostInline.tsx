'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Textarea,
  Select,
  SelectItem,
  Input,
  Avatar,
  Card,
  CardBody,
  Chip,
  Divider,
  Tooltip,
} from '@nextui-org/react';
import {
  SendIcon,
  MusicalNoteIcon,
  HandsIcon,
  XMarkIcon,
  YoutubeIcon,
} from '@global/icons';
import { CreatePostDto, PostType } from '../_interfaces/feedInterface';
import { extractYouTubeId, isValidYouTubeId } from '@global/utils/formUtils';
import { useBandSongsWebSocket } from '@global/hooks/useBandSongsWebSocket';
import { $user } from '@stores/users';
import { useStore } from '@nanostores/react';

interface CreatePostInlineProps {
  onSubmit: (data: CreatePostDto) => void;
  isLoading?: boolean;
  userBands: Array<{ id: number; name: string }>;
  bandSongs?: Array<{ id: number; title: string; artist: string | null }>;
  selectedBandId?: number;
  onBandChange?: (bandId: number) => void;
}

export const CreatePostInline = ({
  onSubmit,
  isLoading,
  userBands,
  bandSongs = [],
  selectedBandId,
  onBandChange,
}: CreatePostInlineProps) => {
  const user = useStore($user);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Estados del formulario
  const [isExpanded, setIsExpanded] = useState(false);
  const [postType, setPostType] = useState<PostType>('SONG_SHARE');
  const [bandId, setBandId] = useState<string>(
    selectedBandId?.toString() ||
      (userBands.length === 1 ? userBands[0].id.toString() : ''),
  );
  const [content, setContent] = useState('');
  const [sharedSongId, setSharedSongId] = useState('');
  const [requestedSongTitle, setRequestedSongTitle] = useState('');
  const [requestedSongArtist, setRequestedSongArtist] = useState('');
  const [requestedYoutubeUrl, setRequestedYoutubeUrl] = useState('');

  // Conectar al WebSocket para actualizaciones en tiempo real de canciones
  useBandSongsWebSocket({
    bandId: selectedBandId,
    enabled: isExpanded && !!selectedBandId,
  });

  // Auto-focus cuando se expande
  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  // Auto-seleccionar primera banda si solo hay una
  useEffect(() => {
    if (userBands.length === 1 && !bandId) {
      const firstBandId = userBands[0].id.toString();
      setBandId(firstBandId);
      if (onBandChange) {
        onBandChange(userBands[0].id);
      }
    }
  }, [userBands, bandId, onBandChange]);

  const handleYouTubeChange = (value: string) => {
    const videoId = extractYouTubeId(value);
    setRequestedYoutubeUrl(videoId);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    resetForm();
  };

  // Función para procesar caracteres de escape
  const processEscapeCharacters = (text: string) => {
    return text
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r');
  };

  const resetForm = () => {
    setPostType('SONG_SHARE');
    setContent('');
    setSharedSongId('');
    setRequestedSongTitle('');
    setRequestedSongArtist('');
    setRequestedYoutubeUrl('');
  };

  const handleSubmit = () => {
    let title = '';

    // Generar título según el tipo de post
    if (postType === 'SONG_SHARE' && sharedSongId) {
      const selectedSong = bandSongs.find(
        (song) => song.id === parseInt(sharedSongId),
      );
      title = selectedSong ? selectedSong.title : 'Canción compartida';
    } else if (postType === 'SONG_REQUEST' && requestedSongTitle) {
      title = requestedSongTitle;
    }

    const data: CreatePostDto = {
      type: postType,
      bandId: parseInt(bandId),
      title,
    };

    // El contenido va como descripción opcional (ya está procesado automáticamente)
    if (content.trim()) {
      data.description = content.trim();
    }

    if (postType === 'SONG_SHARE' && sharedSongId) {
      data.sharedSongId = parseInt(sharedSongId);
    }

    if (postType === 'SONG_REQUEST') {
      data.requestedSongTitle = requestedSongTitle;
      if (requestedSongArtist.trim()) {
        data.requestedArtist = requestedSongArtist.trim();
      }
      if (requestedYoutubeUrl.trim()) {
        data.requestedYoutubeUrl = requestedYoutubeUrl.trim();
      }
    }

    onSubmit(data);
    resetForm();
    setIsExpanded(false);
  };

  const isValid = () => {
    if (!bandId) return false;

    if (postType === 'SONG_SHARE') {
      return !!sharedSongId;
    }

    if (postType === 'SONG_REQUEST') {
      return requestedSongTitle.trim().length > 0;
    }

    return false;
  };

  const getSelectedBandName = () => {
    const band = userBands.find((b) => b.id.toString() === bandId);
    return band ? band.name : 'Seleccionar banda';
  };

  const getSelectedSongInfo = () => {
    if (!sharedSongId) return null;
    const song = bandSongs.find((s) => s.id.toString() === sharedSongId);
    return song;
  };

  return (
    <Card className="w-full border border-divider bg-gradient-to-br from-white to-gray-50/50 shadow-md">
      <CardBody className="p-0">
        {!isExpanded ? (
          // Vista compacta - similar a Facebook
          <div className="p-4">
            <div
              className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-default-50/50"
              onClick={handleExpand}
            >
              <Avatar
                size="md"
                name={user?.name || 'Usuario'}
                className="flex-shrink-0 ring-2 ring-brand-purple-100"
                classNames={{
                  base: 'bg-gradient-to-br from-brand-purple-400 to-brand-pink-400',
                }}
              />
              <div className="flex min-h-[44px] flex-1 items-center rounded-full border border-default-200 bg-gradient-to-r from-default-100 to-default-50 px-4 text-default-500 transition-all duration-200 hover:border-brand-purple-200 hover:from-default-200 hover:to-default-100 hover:shadow-sm">
                <span className="font-medium">
                  ¿Qué canción quieres compartir hoy?
                </span>
              </div>
              <div className="flex gap-1">
                <Tooltip content="Compartir canción">
                  <Button
                    isIconOnly
                    variant="flat"
                    color="success"
                    size="sm"
                    aria-label="Compartir canción"
                    onPress={() => {
                      handleExpand();
                      setPostType('SONG_SHARE');
                    }}
                    className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
                  >
                    <MusicalNoteIcon className="h-4 w-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Solicitar canción">
                  <Button
                    isIconOnly
                    variant="flat"
                    color="warning"
                    size="sm"
                    aria-label="Solicitar canción"
                    onPress={() => {
                      handleExpand();
                      setPostType('SONG_REQUEST');
                    }}
                    className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100"
                  >
                    <HandsIcon className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        ) : (
          // Vista expandida - formulario completo
          <div className="animate-in fade-in-0 space-y-4 bg-gradient-to-br from-white via-gray-50/30 to-brand-purple-50/20 p-4 duration-300">
            {/* Header con avatar y tipo de post */}
            <div className="flex items-start gap-3">
              <Avatar
                size="md"
                name={user?.name || 'Usuario'}
                className="flex-shrink-0 ring-2 ring-brand-purple-100"
                classNames={{
                  base: 'bg-gradient-to-br from-brand-purple-400 to-brand-pink-400',
                }}
              />
              <div className="flex-1 space-y-4">
                {/* Selector de tipo de post */}
                <div className="flex gap-2">
                  <Button
                    color={postType === 'SONG_SHARE' ? 'success' : 'default'}
                    variant={postType === 'SONG_SHARE' ? 'shadow' : 'bordered'}
                    onPress={() => setPostType('SONG_SHARE')}
                    size="sm"
                    className={`flex-1 transition-all duration-200 ${
                      postType === 'SONG_SHARE'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'border-green-200 bg-white text-green-600 hover:bg-green-50'
                    }`}
                    startContent={<MusicalNoteIcon className="h-4 w-4" />}
                  >
                    Compartir Canción
                  </Button>
                  <Button
                    color={postType === 'SONG_REQUEST' ? 'warning' : 'default'}
                    variant={
                      postType === 'SONG_REQUEST' ? 'shadow' : 'bordered'
                    }
                    onPress={() => setPostType('SONG_REQUEST')}
                    size="sm"
                    className={`flex-1 transition-all duration-200 ${
                      postType === 'SONG_REQUEST'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : 'border-amber-200 bg-white text-amber-600 hover:bg-amber-50'
                    }`}
                    startContent={<HandsIcon className="h-4 w-4" />}
                  >
                    Solicitar Canción
                  </Button>
                </div>

                {/* Selector de banda compacto */}
                <div className="flex items-center gap-3 rounded-lg border border-brand-purple-100 bg-white/80 p-3 backdrop-blur-sm">
                  <span className="whitespace-nowrap text-sm font-medium text-brand-purple-700">
                    Tu grupo de alabanza:
                  </span>
                  <Select
                    size="sm"
                    aria-label="Seleccionar banda"
                    selectedKeys={bandId ? [bandId] : []}
                    onSelectionChange={(keys) => {
                      const selectedValue = Array.from(keys).join('');
                      setBandId(selectedValue);
                      if (selectedValue && onBandChange) {
                        onBandChange(parseInt(selectedValue));
                      }
                    }}
                    classNames={{
                      trigger: 'h-8 bg-white border-brand-purple-200',
                    }}
                    renderValue={() => (
                      <Chip
                        size="sm"
                        className="bg-gradient-to-r from-brand-purple-500 to-brand-pink-500 text-white"
                      >
                        {getSelectedBandName()}
                      </Chip>
                    )}
                  >
                    {userBands.map((band) => (
                      <SelectItem key={band.id.toString()}>
                        {band.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Área de texto principal */}
                <Textarea
                  ref={textareaRef}
                  placeholder={
                    postType === 'SONG_SHARE'
                      ? 'Escribe algo sobre esta canción...'
                      : 'Explica por qué necesitas esta canción...'
                  }
                  value={content}
                  onValueChange={(value) => {
                    // Procesar automáticamente caracteres de escape al escribir/pegar
                    const processedValue = processEscapeCharacters(value);
                    setContent(processedValue);
                  }}
                  minRows={3}
                  maxRows={5}
                  variant="bordered"
                  classNames={{
                    input: 'text-base',
                    inputWrapper:
                      'bg-white/90 border-brand-purple-200 hover:border-brand-purple-300 focus-within:border-brand-purple-400',
                  }}
                />

                {/* Campos específicos según el tipo */}
                {postType === 'SONG_SHARE' && (
                  <div className="rounded-lg border border-green-200 bg-white/80 p-3 backdrop-blur-sm">
                    <Select
                      label="Canción a compartir"
                      placeholder="Selecciona una canción"
                      selectedKeys={sharedSongId ? [sharedSongId] : []}
                      onSelectionChange={(keys) => {
                        const selectedValue = Array.from(keys).join('');
                        setSharedSongId(selectedValue);
                      }}
                      isRequired
                      size="sm"
                      classNames={{
                        trigger:
                          'min-h-unit-10 bg-white border-green-200 hover:border-green-300',
                        label: 'text-green-700 font-medium',
                      }}
                      renderValue={() => {
                        const song = getSelectedSongInfo();
                        return song ? (
                          <div className="flex flex-col py-1">
                            <span className="text-sm font-medium text-green-800">
                              {song.title}
                            </span>
                            {song.artist && (
                              <span className="text-xs text-green-600">
                                {song.artist}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-default-500">
                            Selecciona una canción
                          </span>
                        );
                      }}
                    >
                      {bandSongs.map((song) => (
                        <SelectItem
                          key={song.id.toString()}
                          textValue={song.title}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">{song.title}</span>
                            {song.artist && (
                              <span className="text-small text-default-500">
                                {song.artist}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}

                {postType === 'SONG_REQUEST' && (
                  <div className="space-y-3 rounded-lg border border-amber-200 bg-white/80 p-3 backdrop-blur-sm">
                    <Input
                      label="Título de la canción"
                      placeholder="Ej: Aquí Estoy"
                      value={requestedSongTitle}
                      onValueChange={setRequestedSongTitle}
                      isRequired
                      size="sm"
                      classNames={{
                        inputWrapper:
                          'bg-white border-amber-200 hover:border-amber-300',
                        label: 'text-amber-700 font-medium',
                      }}
                    />
                    <Input
                      label="Artista (opcional)"
                      placeholder="Ej: Hillsong United"
                      value={requestedSongArtist}
                      onValueChange={setRequestedSongArtist}
                      size="sm"
                      classNames={{
                        inputWrapper:
                          'bg-white border-amber-200 hover:border-amber-300',
                        label: 'text-amber-700 font-medium',
                      }}
                    />
                    <Input
                      label="Link de YouTube (opcional)"
                      placeholder="https://youtube.com/watch?v=... o dQw4w9WgXcQ"
                      value={requestedYoutubeUrl}
                      onValueChange={handleYouTubeChange}
                      isClearable
                      onClear={() => setRequestedYoutubeUrl('')}
                      size="sm"
                      description={
                        requestedYoutubeUrl &&
                        isValidYouTubeId(requestedYoutubeUrl)
                          ? '✓ ID válido'
                          : 'Pega el link completo o solo el ID del video'
                      }
                      classNames={{
                        inputWrapper:
                          'bg-white border-amber-200 hover:border-amber-300',
                        label: 'text-amber-700 font-medium',
                        description:
                          requestedYoutubeUrl &&
                          isValidYouTubeId(requestedYoutubeUrl)
                            ? 'text-green-600 font-medium'
                            : 'text-default-500',
                      }}
                      startContent={
                        <YoutubeIcon className="h-4 w-4 text-red-500" />
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            <Divider className="bg-gradient-to-r from-transparent via-brand-purple-200 to-transparent" />

            {/* Footer con acciones */}
            <div className="flex items-center justify-between rounded-lg bg-white/60 p-3 backdrop-blur-sm">
              <Button
                variant="bordered"
                size="sm"
                onPress={handleCollapse}
                startContent={<XMarkIcon className="h-4 w-4" />}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onPress={handleSubmit}
                isLoading={isLoading}
                isDisabled={!isValid()}
                startContent={!isLoading && <SendIcon className="h-4 w-4" />}
                className={`shadow-lg transition-all duration-200 ${
                  postType === 'SONG_SHARE'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700'
                } ${!isValid() ? 'cursor-not-allowed opacity-50' : 'hover:-translate-y-0.5 hover:shadow-xl'} `}
              >
                {postType === 'SONG_SHARE' ? '🎵 Compartir' : '🙏 Solicitar'}
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
