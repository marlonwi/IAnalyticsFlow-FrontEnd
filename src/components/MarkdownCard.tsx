import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface MarkdownCardProps {
  text: string;
}

const MarkdownCard: React.FC<MarkdownCardProps> = ({ text }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-2xl shadow-lg w-full md:w-5/6 lg:w-2/3 overflow-auto">
      <ReactMarkdown
        children={text}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="mb-2 text-gray-200" {...props} />,
          li: ({ node, ...props }) => <li className="ml-4 list-disc text-gray-200" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
        }}
      />
    </div>
  );
};

export default MarkdownCard;
