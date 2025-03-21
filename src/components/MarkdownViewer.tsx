import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ImageViewer from './ImageViewer';

interface MarkdownViewerProps {
  markdown: string;
  conversionErrors?: Array<{section: string, reason: string}>;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdown, conversionErrors = [] }) => {
  return (
    <div className="w-full">
      {/* マークダウンコンテンツ */}
      <div className="prose prose-sm max-w-none sm:prose lg:prose-lg mx-auto px-4 py-2">
        <ReactMarkdown
          components={{
            img: ({ node, ...props }) => (
              <ImageViewer src={props.src || ''} alt={props.alt || ''} />
            ),
            // スマートフォン向けにテーブルをレスポンシブに
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200" {...props} />
              </div>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      {/* 変換エラーがある場合に表示 */}
      {conversionErrors.length > 0 && (
        <div className="mt-8 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
          <h3 className="text-lg font-medium text-yellow-800">変換できなかった箇所</h3>
          <ul className="mt-2 list-disc list-inside text-sm text-yellow-700">
            {conversionErrors.map((error, index) => (
              <li key={index}>
                <span className="font-medium">{error.section}:</span> {error.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MarkdownViewer;
