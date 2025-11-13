'use client';

import { Button } from '@nextui-org/react';
import { HeartIcon } from '@global/icons';

interface BlessingButtonProps {
  isBlessed: boolean;
  count: number;
  onPress: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BlessingButton = ({
  isBlessed,
  count,
  onPress,
  isLoading = false,
  size = 'sm',
}: BlessingButtonProps) => {
  return (
    <Button
      size={size}
      variant="light"
      startContent={
        <HeartIcon
          className={`h-5 w-5 ${isBlessed ? 'fill-red-500 text-red-500' : ''}`}
        />
      }
      onPress={onPress}
      isLoading={isLoading}
      className={isBlessed ? 'text-red-500' : ''}
    >
      {count > 0 ? count : ''}
    </Button>
  );
};
