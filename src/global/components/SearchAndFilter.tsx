import { SearchIcon } from '@global/icons';
import { SearchAndFilterProps } from '@global/interfaces/listComponentsInterfaces';

export const SearchAndFilter = ({
    searchTerm,
    onSearchChange,
    searchPlaceholder,
    filterButtons,
}: SearchAndFilterProps) => {
    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search input */}
            <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-5 w-5 text-slate-400 dark:text-slate-300" />
                </div>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-lg border-2 border-slate-200 bg-white/80 py-2 pl-10 pr-4 text-sm transition-all duration-200 focus:border-brand-purple-600 focus:outline-none focus:ring-2 focus:ring-brand-purple-200 dark:border-purple-800 dark:bg-gray-900/80 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">{filterButtons}</div>
        </div>
    );
};
