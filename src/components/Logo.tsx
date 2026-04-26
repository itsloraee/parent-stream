import { Play } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  showTagline?: boolean;
}

export default function Logo({
  size = 'lg',
  showTitle = true,
  showTagline = true,
}: LogoProps) {
  const dimensions = {
    sm: { box: 'w-12 h-12', icon: 16, title: 'text-xl', tagline: 'text-xs' },
    md: { box: 'w-16 h-16', icon: 22, title: 'text-2xl', tagline: 'text-sm' },
    lg: { box: 'w-20 h-20', icon: 30, title: 'text-3xl', tagline: 'text-sm' },
  }[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${dimensions.box} rounded-2xl bg-gradient-brand flex items-center justify-center logo-glow`}
      >
        <Play className="text-white fill-white ml-1" size={dimensions.icon} />
      </div>
      {showTitle && (
        <h1
          className={`${dimensions.title} font-light tracking-[0.3em] text-ink-primary text-center`}
        >
          Parent Stream
        </h1>
      )}
      {showTagline && (
        <p className={`${dimensions.tagline} text-ink-secondary text-center`}>
          Votre plateforme dédiée à la parentalité
        </p>
      )}
    </div>
  );
}
