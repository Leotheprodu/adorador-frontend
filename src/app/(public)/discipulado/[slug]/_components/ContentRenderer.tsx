import { BookOpenIcon } from '@global/icons';

type ContentBlock = {
  type: 'paragraph' | 'image' | 'verse' | 'combined';
  title?: string;
  titleIcon?: 'fire' | 'brain' | 'hands' | 'heart' | 'users' | 'musical';
  text?: string;
  image?: string;
};

export default function ContentRenderer({
  content,
}: {
  content: ContentBlock[];
}) {
  return (
    <div className="space-y-8">
      {content.map((block, index) => {
        if (block.type === 'verse') {
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-blue-500/10 via-brand-purple-500/5 to-transparent p-6 shadow-lg ring-1 ring-brand-blue-500/20 transition-all hover:shadow-xl"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-blue-500 to-brand-purple-500" />
              <div className="ml-2">
                {block.title && (
                  <p className="mb-2 flex items-center gap-2 font-bold text-brand-blue-600">
                    <BookOpenIcon className="h-5 w-5" />
                    {block.title}
                  </p>
                )}
                <p className="italic leading-relaxed text-slate-700 dark:text-slate-200">
                  {block.text}
                </p>
              </div>
            </div>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <div key={index} className="space-y-3">
              {block.title && (
                <h2 className="text-xl font-bold text-slate-800 transition-colors hover:text-brand-purple-500 dark:text-slate-50">
                  {block.title}
                </h2>
              )}
              <p className="whitespace-pre-line text-base leading-relaxed text-slate-700 dark:text-slate-100">
                {block.text}
              </p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
