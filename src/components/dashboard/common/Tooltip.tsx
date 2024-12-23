import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [show, setShow] = React.useState(false);
  const timeoutRef = React.useRef<number>();

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShow(true);
    }, 200);
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

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && (
        <div 
          className={`absolute z-50 px-3 py-2 text-xs font-medium bg-white border border-neutral-200 
            rounded-lg shadow-lg whitespace-normal max-w-xs text-neutral-700 ${className}`}
          style={{ transform: 'translateY(-50%)' }}
        >
          {content}
          <div 
            className="absolute w-2 h-2 bg-white border-l border-b border-neutral-200 transform rotate-45 -translate-y-1/2 -left-1"
            style={{ top: '50%' }}
          />
        </div>
      )}
    </div>
  );
}