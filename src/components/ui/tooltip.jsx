import React, { useState, useRef, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

const Tooltip = ({ 
  children, 
  content, 
  placement = 'top',
  delay = 300,
  className = '',
  disabled = false,
  triggerClassName = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState(placement);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      calculatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top, left;
    let finalPlacement = placement;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + 8;
        break;
      default:
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        finalPlacement = 'top';
    }

    // Adjust for viewport boundaries and track actual final placement
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }
    
    // Vertical adjustments - these change the actual placement
    if (top < 8) {
      top = triggerRect.bottom + 8;
      finalPlacement = 'bottom'; // Tooltip moved below trigger
    }
    if (top + tooltipRect.height > viewportHeight - 8) {
      top = triggerRect.top - tooltipRect.height - 8;
      finalPlacement = 'top'; // Tooltip moved above trigger
    }

    setPosition({ top, left });
    setActualPlacement(finalPlacement);
  }, [placement]);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    setActualPlacement(placement);
  }, [placement]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className={triggerClassName || 'inline-block'}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            fixed z-50 px-3 py-2 text-sm
            bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900
            rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
            pointer-events-none
            ${className}
          `}
          style={{ top: position.top, left: position.left }}
        >
          {content}
          
          {/* Arrow */}
          <div
            className={`
              absolute w-2 h-2 transform rotate-45
              bg-gray-900 dark:bg-gray-100
              ${actualPlacement === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${actualPlacement === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${actualPlacement === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
              ${actualPlacement === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
            `}
          />
        </div>
      )}
    </>
  );
};

// Specialized Event Tooltip Component
const EventTooltip = ({ event, children, placement = 'top', delay = 300, triggerClassName = '' }) => {
  if (!event) return children;

  const formatEventTime = (event) => {
    if (event.allDay) {
      return 'All day';
    }
    
    if (event.start && event.end && 
        format(event.start, 'yyyy-MM-dd') !== format(event.end, 'yyyy-MM-dd')) {
      return `${format(event.start, 'MMM d, h:mm a')} - ${format(event.end, 'MMM d, h:mm a')}`;
    }
    
    if (event.start && event.end) {
      return `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`;
    }
    
    return event.start ? format(event.start, 'h:mm a') : '';
  };

  const tooltipContent = (
    <div className="max-w-xs">
      <div className="font-semibold text-base mb-1">{event.title}</div>
      
      <div className="text-xs text-gray-300 dark:text-gray-600 mb-2">
        {formatEventTime(event)}
      </div>
      
      {event.description && (
        <div className="text-sm mb-2" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.description}
        </div>
      )}
      
      {event.category && (
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: event.color }}
          />
          <span className="text-xs">{event.category}</span>
        </div>
      )}
      
      {event.additionalFields && Object.keys(event.additionalFields).length > 0 && (
        <div className="border-t border-gray-600 dark:border-gray-400 pt-2 mt-2">
          {Object.entries(event.additionalFields).slice(0, 3).map(([key, value]) => (
            <div key={key} className="text-xs flex justify-between gap-2">
              <span className="text-gray-400 dark:text-gray-600 font-medium">{key}:</span>
              <span className="truncate">{value}</span>
            </div>
          ))}
          {Object.keys(event.additionalFields).length > 3 && (
            <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              +{Object.keys(event.additionalFields).length - 3} more fields
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} placement={placement} delay={delay} triggerClassName={triggerClassName}>
      {children}
    </Tooltip>
  );
};

// Date Tooltip for empty dates
const DateTooltip = ({ date, onDateClick, children }) => {
  const tooltipContent = (
    <div className="text-center">
      <div className="font-semibold mb-1">
        {format(date, 'EEEE, MMMM d, yyyy')}
      </div>
      <div className="text-xs text-gray-300 dark:text-gray-600">
        Click to select this date
      </div>
    </div>
  );

  return (
    <Tooltip content={tooltipContent} placement="top">
      <div 
        onClick={() => onDateClick && onDateClick(date)}
        className="cursor-pointer"
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default Tooltip;
export { EventTooltip, DateTooltip }; 