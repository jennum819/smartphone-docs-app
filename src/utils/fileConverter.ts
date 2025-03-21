import axios from 'axios';

/**
 * ファイルタイプを判別する関数
 */
export const detectFileType = (url: string): string => {
  if (!url) return 'unknown';
  
  // URLからファイル拡張子を取得
  const extension = url.split('.').pop()?.toLowerCase();
  
  // Google DocsやSlidesのURLかどうかを判定
  if (url.includes('docs.google.com')) {
    if (url.includes('/document/')) return 'google-doc';
    if (url.includes('/presentation/')) return 'google-slide';
    if (url.includes('/spreadsheets/')) return 'google-sheet';
  }
  
  // 拡張子に基づいてファイルタイプを返す
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'ppt':
    case 'pptx':
      return 'powerpoint';
    case 'doc':
    case 'docx':
      return 'word';
    case 'xls':
    case 'xlsx':
      return 'excel';
    case 'md':
    case 'markdown':
      return 'markdown';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return 'image';
    default:
      return 'unknown';
  }
};

/**
 * ファイルをダウンロードする関数
 */
export const downloadFile = async (url: string): Promise<ArrayBuffer> => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    console.error('ファイルのダウンロードに失敗しました:', error);
    throw new Error('ファイルのダウンロードに失敗しました');
  }
};

/**
 * Google DocsのURLからエクスポートURLを生成する関数
 */
export const getGoogleDocsExportUrl = (url: string, format: string = 'pdf'): string => {
  // Google DocsのURLからドキュメントIDを抽出
  const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!matches || !matches[1]) {
    throw new Error('無効なGoogle DocsのURLです');
  }
  
  const docId = matches[1];
  
  // エクスポート用のURLを生成
  return `https://docs.google.com/document/d/${docId}/export?format=${format}`;
};

/**
 * Google SlidesのURLからエクスポートURLを生成する関数
 */
export const getGoogleSlidesExportUrl = (url: string, format: string = 'pdf'): string => {
  // Google SlidesのURLからプレゼンテーションIDを抽出
  const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!matches || !matches[1]) {
    throw new Error('無効なGoogle SlidesのURLです');
  }
  
  const presentationId = matches[1];
  
  // エクスポート用のURLを生成
  return `https://docs.google.com/presentation/d/${presentationId}/export/${format}`;
};

/**
 * 変換できなかった箇所を記録する関数
 */
export const logConversionError = (section: string, reason: string): void => {
  console.warn(`変換エラー: ${section} - ${reason}`);
  // ここで変換エラーを記録する処理を追加できます
};

/**
 * 進捗状況を計算する関数
 */
export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};
