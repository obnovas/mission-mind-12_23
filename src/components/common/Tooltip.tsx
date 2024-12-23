import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [show, setShow] = React.useState(false);
  const timeoutRef = React.useRef<number>();
  const elementRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShow(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShow(false);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (show && elementRef.current && tooltipRef.current) {
      const elementRect = elementRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Calculate initial position (centered above element)
      let left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
      const top = elementRect.top - tooltipRect.height - 8; // 8px gap
      
      // Check if tooltip would overflow right edge
      if (left + tooltipRect.width > viewportWidth - 20) {
        left = viewportWidth - tooltipRect.width - 20;
      }
      
      // Check if tooltip would overflow left edge
      if (left < 20) {
        left = 20;
      }

      tooltipRef.current.style.left = `${left}px`;
      tooltipRef.current.style.top = `${top}px`;
    }
  }, [show]);

  return (
    <div 
      ref={elementRef}
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && (
        <div 
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-xs font-medium bg-white rounded-lg shadow-lg border border-neutral-200 whitespace-normal max-w-xs text-neutral-700 ${className}`}
        >
          {content}
          <div 
            className="absolute w-2 h-2 bg-white border-t border-l border-neutral-200 transform rotate-45 -translate-x-1/2 left-1/2"
            style={{ bottom: '-5px', transform: 'rotate(-135deg)' }}
          />
        </div>
      )}
    </div>
  );
}