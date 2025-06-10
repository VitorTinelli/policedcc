import React from 'react';

interface HabboProfilePictureProps {
  username: string;
  size?: 's' | 'm' | 'l';
  headOnly?: boolean;
  direction?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';
  action?: 'wav' | 'std' | 'crr' | 'sit' | 'lay' | 'wave';
}

export const HabboProfilePicture: React.FC<HabboProfilePictureProps> = ({
  username,
  size = 'l',
  headOnly = false,
  direction = '4',
  action = 'std'
}) => {
  const getImageUrl = () => {
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
  };

  return (
    <img
      src={getImageUrl()}
      alt={`Avatar de ${username}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};