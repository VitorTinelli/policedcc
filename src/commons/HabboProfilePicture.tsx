import React, { useState, useMemo, memo } from 'react';

interface HabboProfilePictureProps {
  username: string;
  size?: 's' | 'm' | 'l';
  headOnly?: boolean;
  direction?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';
  action?: 'wav' | 'std' | 'crr' | 'sit' | 'lay' | 'wave';
}

export const HabboProfilePicture: React.FC<HabboProfilePictureProps> = memo(({
  username,
  size = 'l',
  headOnly = false,
  direction = '4',
  action = 'std'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loadStartTime] = useState(Date.now());

  const imageUrl = useMemo(() => {
    // Usar a URL principal do Habbo Brasil
    const baseUrl = 'https://www.habbo.com.br/habbo-imaging/avatarimage';
    const params = new URLSearchParams({
      user: username,
      action: action,
      direction: direction,
      head_direction: '3',
      img_format: 'png',
      gesture: 'sml',
      headonly: headOnly ? '1' : '0',
      size: size,
    });

    return `${baseUrl}?${params.toString()}`;
  }, [username, action, direction, headOnly, size]);

  const handleImageLoad = () => {
    const loadTime = Date.now() - loadStartTime;
    console.log(`✅ Avatar de ${username} carregado em ${loadTime}ms`);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const loadTime = Date.now() - loadStartTime;
    console.log(`❌ Erro ao carregar avatar de ${username} após ${loadTime}ms:`, event);
    setImageError(true);
    setImageLoaded(false);
  };

  const getSizeInPixels = (s: string) => {
    switch (s) {
      case 'l': return 64;
      case 'm': return 32;
      case 's': return 16;
      default: return 32;
    }
  };

  const sizePixels = getSizeInPixels(size);

  // Estado de erro - mostrar placeholder
  if (imageError) {
    return (
      <div 
        style={{ 
          width: sizePixels,
          height: sizePixels,
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          fontSize: sizePixels > 32 ? '20px' : '14px',
          color: '#6c757d',
          flexDirection: 'column',
          textAlign: 'center'
        }}
        title={`Avatar de ${username} não disponível`}
      >
        <div>👤</div>
        {sizePixels > 32 && (
          <div style={{ fontSize: '8px', marginTop: '2px' }}>
            {username.substring(0, 6)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'relative', 
      width: sizePixels, 
      height: sizePixels,
      backgroundColor: imageLoaded ? 'transparent' : '#f8f9fa',
      borderRadius: '6px',
      overflow: 'hidden'
    }}>
      {/* Loading indicator */}
      {!imageLoaded && !imageError && (
        <div 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            zIndex: 1
          }}
        >
          <div style={{
            width: Math.min(20, sizePixels * 0.4),
            height: Math.min(20, sizePixels * 0.4),
            border: '2px solid #e9ecef',
            borderTop: '2px solid #6c757d',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}

      {/* A imagem em si */}
      <img
        src={imageUrl}
        alt={`Avatar de ${username}`}
        style={{ 
          width: sizePixels,
          height: sizePixels,
          display: 'block',
          objectFit: 'contain'
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        // Tentar carregar imediatamente sem lazy loading
      />
    </div>
  );
});