import React from 'react';
import { getTooltipPosition } from './tooltipPosition';

interface TooltipContentProps {
  content: string;
  mousePosition: { x: number; y: number } | null;
  className?: string;
}

export function TooltipContent({ content, mousePosition, className = '' }: TooltipContentProps) {
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ left: 0, top: 0, placement: 'right' });

  React.useEffect(() => {
    if (!mousePosition || !tooltipRef.current) return;

    const tooltipPosition = getTooltipPosition(
      mousePosition,
      tooltipRef.current.getBoundingClientRect(),
      window.innerWidth,
      window.innerHeight
    );

    setPosition(tooltipPosition);
  }, [mousePosition]);

  return (
    <div
      ref={tooltipRef}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      className={`absolute z-50 px-3 py-2 text-xs font-medium bg-white rounded-lg shadow-lg border border-neutral-200 whitespace-normal max-w-xs text-neutral-700 pointer-events-none transition-all duration-200 ${className}`}
    >
      {content}
      <div 
        className={`absolute w-2 h-2 bg-white border-t border-l border-neutral-200 transform rotate-45 ${
          position.placement === 'left' ? '-right-1' : '-left-1'
        }`}
        style={{ top: 'calc(50% - 4px)' }}
      />
    </div>
  );
}