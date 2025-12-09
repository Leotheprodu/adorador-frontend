'use client';

import { Select, SelectItem, Chip } from "@heroui/react";

interface BandSelectorProps {
    bandId: string;
    userBands: Array<{ id: number; name: string }>;
    selectedBandName: string;
    onBandChange: (bandId: string) => void;
}

export const BandSelector = ({
    bandId,
    userBands,
    selectedBandName,
    onBandChange,
}: BandSelectorProps) => {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-brand-purple-100 bg-white/80 p-3 backdrop-blur-sm dark:border-brand-purple-800 dark:bg-default-100/80">
            <span className="whitespace-nowrap text-sm font-medium text-brand-purple-700 dark:text-brand-purple-300">
                Tu grupo de alabanza:
            </span>
            <Select
                size="sm"
                aria-label="Seleccionar banda"
                selectedKeys={bandId ? [bandId] : []}
                onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys).join('');
                    onBandChange(selectedValue);
                }}
                classNames={{
                    trigger:
                        'h-8 bg-white border-brand-purple-200 dark:bg-default-100 dark:border-brand-purple-700',
                }}
                renderValue={() => (
                    <Chip
                        size="sm"
                        className="bg-gradient-to-r from-brand-purple-500 to-brand-pink-500 text-white"
                    >
                        {selectedBandName}
                    </Chip>
                )}
            >
                {userBands.map((band) => (
                    <SelectItem key={band.id.toString()}>{band.name}</SelectItem>
                ))}
            </Select>
        </div>
    );
};
