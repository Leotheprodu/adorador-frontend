'use client';

import { RefreshIcon, LayoutIcon, BrandWhatsappIcon } from '@global/icons';

// Mapping icons outside component to avoid re-creation
const ICONS = {
  RefreshIcon: RefreshIcon,
  LayoutIcon: LayoutIcon,
  BrandWhatsappIcon: BrandWhatsappIcon,
};

import {
  HighlightColor,
  VideoHighlightItemProps,
} from '../../_interfaces/videoShowcase.interfaces';

const COLOR_STYLES: Record<
  HighlightColor,
  { bg: string; border: string; iconBg: string; text: string }
> = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800',
    border: 'border-blue-100 dark:border-slate-700',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-600 dark:text-blue-400',
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800',
    border: 'border-indigo-100 dark:border-slate-700',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 dark:to-slate-800',
    border: 'border-purple-100 dark:border-slate-700',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    text: 'text-purple-600 dark:text-purple-400',
  },
};

export const VideoHighlightItem = ({
  iconName,
  title,
  desc,
  color,
}: VideoHighlightItemProps) => {
  const Icon = ICONS[iconName as keyof typeof ICONS];
  const styles = COLOR_STYLES[color as HighlightColor] || COLOR_STYLES.blue;

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm ${styles.bg} ${styles.border}`}
    >
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${styles.iconBg} ${styles.text}`}
      >
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{title}</h3>
      <p
        className="text-sm text-gray-600 dark:text-gray-400"
        dangerouslySetInnerHTML={{ __html: desc }}
      />
    </div>
  );
};
