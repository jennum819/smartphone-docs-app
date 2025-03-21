'use client';

import React, { useState } from 'react';
import axios from 'axios';
import MarkdownViewer from '@/components/MarkdownViewer';
import ProgressBar from '@/components/ProgressBar';
import { detectFileType } from '@/utils/fileConverter';

export default function Home() {
  const [url, setUrl] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [conversionErrors, setConversionErrors] = useState<Array<{section: string, reason: string}>>([]);
  const [fileType, setFileType] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError('URLを入力してください');
      return;
    }
    
    try {
      setIsLoading(true);
      setProgress(10);
      setError('');
      setMarkdown('');
      setConversionErrors([]);
      
      // ファイルタイプを検出して表示
      const detectedType = detectFileType(url);
      setFileType(detectedType);
      
      if (detectedType === 'unknown') {
        setError('未対応のファイル形式です');
        setIsLoading(false);
        return;
      }
      
      setProgress(30);
      
      // APIを呼び出して変換
      const response = await axios.post('/api/convert', { url });
      
      setProgress(90);
      
      const { markdown, conversionErrors } = response.data;
      
      setMarkdown(markdown);
      if (conversionErrors && conversionErrors.length > 0) {
        setConversionErrors(conversionErrors);
      }
      
      setProgress(100);
    } catch (error) {
      console.error('変換エラー:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || '変換中にエラーが発生しました');
      } else {
        setError('変換中にエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">スマートフォン向け資料共有アプリ</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="PDFまたはGoogleドキュメント/スライドのURLを入力"
              className="flex-1 p-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              disabled={isLoading}
            >
              {isLoading ? '変換中...' : '変換'}
            </button>
          </div>
        </form>
        
        {isLoading && (
          <div className="mb-8">
            <ProgressBar progress={progress} label="変換中" />
          </div>
        )}
        
        {error && (
          <div className="p-4 mb-8 bg-red-50 border border-red-300 rounded-md text-red-700">
            {error}
          </div>
        )}
        
        {fileType && !error && (
          <div className="mb-4 text-sm text-gray-600">
            検出されたファイル形式: <span className="font-medium">{fileType}</span>
          </div>
        )}
        
        {markdown && (
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-gray-50 p-3 border-b border-gray-200">
              <h2 className="text-lg font-medium">変換結果</h2>
            </div>
            <div className="p-4">
              <MarkdownViewer markdown={markdown} conversionErrors={conversionErrors} />
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>PDFやGoogleドキュメント/スライドをスマートフォンに最適化されたマークダウン表示に変換します</p>
          <p className="mt-1">画像はタップで拡大できます</p>
        </div>
      </div>
    </main>
  );
}
