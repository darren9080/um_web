import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';

type LogoVariant = 'full' | 'utv' | 'icon';
type LogoColor = 'dark' | 'white';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  variant?: LogoVariant;
  color?: LogoColor;
  size?: LogoSize;
  href?: string;
  className?: string;
}

const SIZE_MAP: Record<LogoSize, { width: number; height: number; textSize: string; badgeSize: string }> = {
  sm:  { width: 120, height: 28, textSize: 'text-lg',  badgeSize: 'text-[10px]' },
  md:  { width: 160, height: 38, textSize: 'text-2xl', badgeSize: 'text-xs' },
  lg:  { width: 210, height: 50, textSize: 'text-3xl', badgeSize: 'text-sm' },
  xl:  { width: 280, height: 66, textSize: 'text-4xl', badgeSize: 'text-base' },
};

// 컬러 로고 (헤더 등 밝은 배경)
function LogoColor({ size = 'md' }: { size?: LogoSize }) {
  const { width, height } = SIZE_MAP[size];
  return (
    <Image
      src="/logo.png"
      alt="울산매일UTV"
      width={width}
      height={height}
      style={{ height, width: 'auto' }}
      priority
    />
  );
}

// 흰색 로고 (푸터 등 어두운 배경) — logo-white.png 준비 전까지 텍스트 폴백
function LogoWhite({ size = 'md' }: { size?: LogoSize }) {
  const { textSize, badgeSize } = SIZE_MAP[size];
  const px = size === 'sm' ? 'px-1.5 py-0.5' : size === 'xl' ? 'px-3 py-1.5' : 'px-2 py-1';

  return (
    <span className="inline-flex items-center gap-1.5 select-none">
      <span
        className={clsx('font-bold tracking-tight leading-none font-noto-sans text-white', textSize)}
        style={{ letterSpacing: '-0.02em' }}
      >
        울산매일
      </span>
      <span
        className={clsx(
          'inline-flex items-center justify-center',
          'bg-brand-red text-white font-bold leading-none rounded-sm font-inter',
          px, badgeSize,
        )}
        style={{ letterSpacing: '0.05em' }}
      >
        UTV
      </span>
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

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-sm font-bold leading-none font-noto-sans select-none',
        sizeMap[size ?? 'md'],
        color === 'dark' ? 'bg-brand-charcoal text-white' : 'bg-white text-brand-charcoal',
      )}
    >
      U
    </span>
  );
}

export function Logo({ variant = 'full', color = 'dark', size = 'md', href, className }: LogoProps) {
  const logo = (() => {
    if (variant === 'icon') return <LogoIcon color={color} size={size} />;
    if (variant === 'utv') {
      const { badgeSize } = SIZE_MAP[size ?? 'md'];
      const px = size === 'sm' ? 'px-1.5 py-0.5' : size === 'xl' ? 'px-3 py-1.5' : 'px-2 py-1';
      return (
        <span
          className={clsx(
            'inline-flex items-center justify-center bg-brand-red text-white font-bold leading-none rounded-sm font-inter',
            px, badgeSize,
          )}
          style={{ letterSpacing: '0.05em' }}
        >
          UTV
        </span>
      );
    }
    // full variant
    return color === 'white' ? <LogoWhite size={size} /> : <LogoColor size={size} />;
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
