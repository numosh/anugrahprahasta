"use client";

interface AudioPlayerProps {
  youtubeId: string;
}

export default function AudioPlayer({ youtubeId }: AudioPlayerProps) {
  // Menggunakan YouTube Embed dengan parameter untuk menyembunyikan video terkait
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`;

  return (
    <iframe 
      src={embedUrl} 
      width="100%" 
      height="100%" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ border: 'none', display: 'block', backgroundColor: '#000' }}
      title="YouTube Player"
    />
  );
}
