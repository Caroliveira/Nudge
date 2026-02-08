import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, PanInfo } from 'framer-motion';

interface SwipeableItemProps {
  children: React.ReactNode;
  onSwipeRight?: () => void;
  renderLeftBackground?: (offset: number) => React.ReactNode;
  onSwipeLeft?: () => void;
  renderRightBackground?: (offset: number) => React.ReactNode;
  className?: string;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({
  children,
  onSwipeRight,
  renderLeftBackground,
  onSwipeLeft,
  renderRightBackground,
  className = '',
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const x = useMotionValue(0);
  const isDragging = useRef(false);

  useMotionValueEvent(x, "change", (latest) => {
    setOffsetX(latest);
  });

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Small timeout to prevent click immediately after drag release
    setTimeout(() => {
        isDragging.current = false;
    }, 50);

    const currentX = info.offset.x;
    const threshold = 150;

    if (currentX < -threshold && onSwipeLeft) onSwipeLeft();
    else if (currentX > threshold && onSwipeRight) onSwipeRight();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && onSwipeLeft) {
      onSwipeLeft();
      e.preventDefault();
    } 
    else if (e.key === 'Enter' && onSwipeRight) {
      onSwipeRight();
      e.preventDefault();
    }
  };

  const descriptionId = React.useId();

  return (
    <div 
      className={`relative overflow-hidden rounded-xl touch-pan-y select-none focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="listitem"
      aria-describedby={descriptionId}
    >
      <span id={descriptionId} className="sr-only">
        {onSwipeLeft ? 'Press Delete or Backspace to remove. ' : ''}
        {onSwipeRight ? 'Press Enter to edit. ' : ''}
      </span>


      {renderRightBackground && (
        <div 
          className="absolute inset-y-0 right-0 w-full"
          style={{ 
            opacity: offsetX < 0 ? 1 : 0,
            visibility: offsetX < 0 ? 'visible' : 'hidden'
          }}
          aria-hidden={offsetX >= 0}
        >
          {renderRightBackground(offsetX)}
        </div>
      )}

      {renderLeftBackground && (
        <div 
            className="absolute inset-y-0 left-0 w-full"
            style={{ 
                opacity: offsetX > 0 ? 1 : 0,
                visibility: offsetX > 0 ? 'visible' : 'hidden'
            }}
            aria-hidden={offsetX <= 0}
        >
            {renderLeftBackground(offsetX)}
        </div>
      )}

      <motion.div
        className="relative z-10"
        style={{ x }}
        drag="x"
        dragConstraints={{ 
            left: onSwipeLeft ? -300 : 0, 
            right: onSwipeRight ? 300 : 0 
        }}
        dragElastic={0}
        dragSnapToOrigin
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClickCapture={(e) => {
            if (isDragging.current) {
                e.preventDefault();
                e.stopPropagation();
            }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SwipeableItem;
