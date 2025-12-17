'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDisclosure } from '@heroui/react';
import { useEventTimeLeft } from '@global/hooks/useEventTimeLeft';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { BandsWithMembersCount } from '../_interfaces/bandsInterface';

export const useBandCard = (band: BandsWithMembersCount) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const events = useMemo(
    () =>
      band.events
        ?.slice()
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ) ?? [],
    [band.events],
  );

  const [isCurrentEvent, setIsCurrentEvent] = useState(false);

  const { eventTimeLeft } = useEventTimeLeft(events[currentEventIndex]?.date);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    if (events[currentEventIndex]) {
      setIsCurrentEvent(
        new Date(events[currentEventIndex].date).setHours(0, 0, 0, 0) ===
          new Date().setHours(0, 0, 0, 0),
      );
    }
  }, [currentEventIndex, events]);

  const isUserAuthorized = CheckUserStatus({
    isLoggedIn: true,
    checkBandId: band.id,
    checkBandAdmin: true,
  });

  const handleNextEvent = () => {
    setCurrentEventIndex((prevIndex) =>
      Math.min(prevIndex + 1, events.length - 1),
    );
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return {
    currentEventIndex,
    events,
    isCurrentEvent,
    eventTimeLeft,
    isEditOpen,
    onEditOpen,
    onEditClose,
    isDeleteOpen,
    onDeleteOpen,
    onDeleteClose,
    isUserAuthorized,
    handleNextEvent,
    handlePrevEvent,
  };
};
