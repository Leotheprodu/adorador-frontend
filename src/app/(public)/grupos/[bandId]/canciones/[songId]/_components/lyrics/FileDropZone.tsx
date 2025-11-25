import { FileDropZoneProps } from '../../_interfaces/lyricsInterfaces';

export const FileDropZone = ({
    isDragging,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onFileSelect,
}: FileDropZoneProps) => {
    return (
        <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative mt-6 rounded-lg border-2 border-dashed p-8 transition-all ${isDragging
                    ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-gray-900'
                    : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-900 dark:hover:border-primary-400 dark:hover:bg-gray-800'
                }`}
        >
            <input
                type="file"
                accept=".txt"
                onChange={onFileSelect}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                id="file-upload-edit"
            />
            <label
                htmlFor="file-upload-edit"
                className="flex cursor-pointer flex-col items-center justify-center space-y-3"
            >
                <div
                    className={`rounded-full p-4 ${isDragging ? 'bg-primary-200 dark:bg-primary-900' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                >
                    <svg
                        className={`h-12 w-12 ${isDragging ? 'text-primary-600' : 'text-slate-500'
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-100">
                        {isDragging
                            ? 'Suelta el archivo aquí'
                            : 'Arrastra tu archivo .txt aquí'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                        o haz clic para seleccionar
                    </p>
                </div>
                <div className="rounded-full bg-primary-100 px-4 py-2 dark:bg-primary-900">
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-200">
                        Solo archivos .txt
                    </span>
                </div>
            </label>
        </div>
    );
};
