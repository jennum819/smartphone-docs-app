import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ImageViewerProps {
  src: string;
  alt?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt = '画像' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div className="w-full my-4 overflow-hidden bg-gray-100 rounded-lg">
      {!isLoaded && !error && (
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">画像を読み込み中...</div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center h-48">
          <div className="text-red-500">画像の読み込みに失敗しました</div>
        </div>
      )}
      
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        centerOnInit
        wheel={{ step: 0.1 }}
      >
        <TransformComponent>
          <img 
            src={src} 
            alt={alt} 
            className={`w-full object-contain ${isLoaded ? 'block' : 'hidden'}`}
            onLoad={handleLoad}
            onError={handleError}
          />
        </TransformComponent>
      </TransformWrapper>
      
      {isLoaded && (
        <div className="p-2 text-xs text-center text-gray-500">
          ピンチイン/アウトまたはダブルタップで拡大・縮小できます
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
