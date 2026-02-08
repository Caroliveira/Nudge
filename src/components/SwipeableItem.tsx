import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useTransform, PanInfo, MotionValue } from 'framer-motion';
import { SWIPE_CONFIG } from '../constants';

interface SwipeableItemProps {
  children: React.ReactNode;
  onSwipeRight?: () => void;
  renderLeftBackground?: (x: MotionValue<number>) => React.ReactNode;
  onSwipeLeft?: () => void;
  renderRightBackground?: (x: MotionValue<number>) => React.ReactNode;
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
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const rightOpacity = useTransform(x, (val) => (val < 0 ? 1 : 0));
  const leftOpacity = useTransform(x, (val) => (val > 0 ? 1 : 0));

  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    };
  }, []);

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Small timeout to prevent click immediately after drag release
    dragTimeoutRef.current = setTimeout(() => {
        isDragging.current = false;
    }, SWIPE_CONFIG.DRAG_END_TIMEOUT_MS);

    const currentX = info.offset.x;
    const threshold = SWIPE_CONFIG.THRESHOLD_PX;

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
        <motion.div 
          className="absolute inset-y-0 right-0 w-full"
          style={{ 
            opacity: rightOpacity,
          }}
        >
          {renderRightBackground(x)}
        </motion.div>
      )}

      {renderLeftBackground && (
        <motion.div 
            className="absolute inset-y-0 left-0 w-full"
            style={{ 
                opacity: leftOpacity,
            }}
        >
            {renderLeftBackground(x)}
        </motion.div>
      )}

      <motion.div
        className="relative z-10"
        style={{ x }}
        drag="x"
        dragConstraints={{ 
            left: onSwipeLeft ? -SWIPE_CONFIG.DRAG_CONSTRAINT_PX : 0, 
            right: onSwipeRight ? SWIPE_CONFIG.DRAG_CONSTRAINT_PX : 0 
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
