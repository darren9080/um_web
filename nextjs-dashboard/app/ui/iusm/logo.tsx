import Link from 'next/link';
import { clsx } from 'clsx';

type LogoVariant = 'full' | 'korean' | 'utv' | 'icon';
type LogoColor = 'dark' | 'white';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  variant?: LogoVariant;
  color?: LogoColor;
  size?: LogoSize;
  href?: string;
  className?: string;
}

const SIZE_MAP: Record<LogoSize, { height: number; textSize: string; badgeSize: string }> = {
  sm:  { height: 28, textSize: 'text-lg',    badgeSize: 'text-[10px]' },
  md:  { height: 36, textSize: 'text-2xl',   badgeSize: 'text-xs' },
  lg:  { height: 48, textSize: 'text-3xl',   badgeSize: 'text-sm' },
  xl:  { height: 64, textSize: 'text-4xl',   badgeSize: 'text-base' },
};

function LogoFull({ color = 'dark', size = 'md' }: Pick<LogoProps, 'color' | 'size'>) {
  const { textSize, badgeSize } = SIZE_MAP[size ?? 'md'];
  const isDark = color === 'dark';

  return (
    <span className="inline-flex items-center gap-1.5 select-none">
      <span
        className={clsx(
          'font-bold tracking-tight leading-none',
          'font-noto-sans',
          textSize,
          isDark ? 'text-brand-charcoal' : 'text-white',
        )}
        style={{ letterSpacing: '-0.02em' }}
      >
        울산매일
      </span>
      <UTVBadge size={size} />
    </span>
  );
}

function LogoKorean({ color = 'dark', size = 'md' }: Pick<LogoProps, 'color' | 'size'>) {
  const { textSize } = SIZE_MAP[size ?? 'md'];
  const isDark = color === 'dark';

  return (
    <span
      className={clsx(
        'inline-flex items-center select-none',
        'font-bold tracking-tight leading-none font-noto-sans',
        textSize,
        isDark ? 'text-brand-charcoal' : 'text-white',
      )}
      style={{ letterSpacing: '-0.02em' }}
    >
      울산매일
    </span>
  );
}

function UTVBadge({ size = 'md' }: { size?: LogoSize }) {
  const { badgeSize } = SIZE_MAP[size ?? 'md'];
  const px = size === 'sm' ? 'px-1.5 py-0.5' : size === 'xl' ? 'px-3 py-1.5' : 'px-2 py-1';

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center',
        'bg-brand-red text-white font-bold leading-none',
        'rounded-sm select-none font-inter',
        px,
        badgeSize,
      )}
      style={{ letterSpacing: '0.05em' }}
    >
      UTV
    </span>
  );
}

function LogoIcon({ color = 'dark', size = 'md' }: Pick<LogoProps, 'color' | 'size'>) {
  const sizeMap: Record<LogoSize, string> = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const isDark = color === 'dark';

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-sm',
        'font-bold leading-none font-noto-sans select-none',
        sizeMap[size ?? 'md'],
        isDark
          ? 'bg-brand-charcoal text-white'
          : 'bg-white text-brand-charcoal',
      )}
    >
      U
    </span>
  );
}

export function Logo({ variant = 'full', color = 'dark', size = 'md', href, className }: LogoProps) {
  const logo = (() => {
    switch (variant) {
      case 'korean': return <LogoKorean color={color} size={size} />;
      case 'utv':    return <UTVBadge size={size} />;
      case 'icon':   return <LogoIcon color={color} size={size} />;
      default:       return <LogoFull color={color} size={size} />;
    }
  })();

  if (href) {
    return (
      <Link href={href} className={clsx('inline-flex items-center', className)}>
        {logo}
      </Link>
    );
  }

  return <span className={clsx('inline-flex items-center', className)}>{logo}</span>;
}

export default Logo;
