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

const HEIGHT_MAP: Record<LogoSize, number> = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 72,
};

// 컬러 로고 (헤더 등 밝은 배경)
function LogoColor({ size = 'md' }: { size?: LogoSize }) {
  const h = HEIGHT_MAP[size];
  return (
    <Image
      src="/logo.png"
      alt="울산매일UTV"
      width={0}
      height={0}
      sizes="300px"
      style={{ height: h, width: 'auto' }}
      priority
    />
  );
}

// 흰색 로고 (푸터 등 어두운 배경)
function LogoWhite({ size = 'md' }: { size?: LogoSize }) {
  const h = HEIGHT_MAP[size];
  return (
    <Image
      src="/logo-white.png"
      alt="울산매일UTV"
      width={0}
      height={0}
      sizes="300px"
      style={{ height: h, width: 'auto' }}
      priority
    />
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
        'inline-flex items-center justify-center rounded-sm font-bold leading-none select-none',
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
      const badgeSizeMap: Record<LogoSize, string> = {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2 py-1',
        lg: 'text-sm px-2.5 py-1',
        xl: 'text-base px-3 py-1.5',
      };
      return (
        <span
          className={clsx(
            'inline-flex items-center justify-center bg-brand-red text-white font-bold leading-none rounded-sm',
            badgeSizeMap[size ?? 'md'],
          )}
          style={{ letterSpacing: '0.05em' }}
        >
          UTV
        </span>
      );
    }
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
