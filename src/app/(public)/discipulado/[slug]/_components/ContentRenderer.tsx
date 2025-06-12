type ContentBlock = {
  type: 'paragraph' | 'image' | 'verse' | 'combined';
  title?: string;
  text?: string;
  image?: string;
};

export default function ContentRenderer({
  content,
}: {
  content: ContentBlock[];
}) {
  return (
    <div className="space-y-6">
      {content.map((block, index) => {
        if (block.type === 'verse') {
          return (
            <div
              key={index}
              className="rounded-lg border-l-4 border-blue-500 bg-gray-100 p-4"
            >
              {block.title && (
                <p className="font-semibold text-blue-600">{block.title}</p>
              )}
              <p className="italic text-gray-700">{block.text}</p>
            </div>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <div key={index}>
              {block.title && (
                <h2 className="mb-1 text-lg font-semibold">{block.title}</h2>
              )}
              <p className="whitespace-pre-line text-gray-800">{block.text}</p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
