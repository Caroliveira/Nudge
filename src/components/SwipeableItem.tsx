import React, { useState, useRef } from 'react';

interface SwipeableItemProps {
  children: React.ReactNode;
  
  // Right swipe (reveals left background) - e.g. Edit
  onSwipeRight?: () => void;
  renderLeftBackground?: (offset: number) => React.ReactNode;
  
  // Left swipe (reveals right background) - e.g. Delete
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
  className = ''
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle primary button
    if (e.button !== 0) return;
    
    startX.current = e.clientX;
    isDragging.current = false;
    
    // Capture pointer to track drag even if mouse leaves the element
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;

    const diff = e.clientX - startX.current;
    
    // If we moved more than 5px, consider it a drag
    if (Math.abs(diff) > 5) isDragging.current = true;

    // Allow sliding left (negative) for delete, right (positive) for edit
    // Limit to -300px and +300px
    const newOffset = Math.max(-300, Math.min(300, diff));
    
    // Only allow sliding right if onSwipeRight is provided
    if (newOffset > 0 && !onSwipeRight) return setOffsetX(0);
    
    // Only allow sliding left if onSwipeLeft is provided
    if (newOffset < 0 && !onSwipeLeft) return setOffsetX(0);

    setOffsetX(newOffset);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    startX.current = null;

    // Threshold logic
    if (offsetX < -150 && onSwipeLeft) {
      onSwipeLeft();
    } else if (offsetX > 150 && onSwipeRight) {
      onSwipeRight();
      setOffsetX(0);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl touch-pan-y select-none ${className}`}>
      {/* Right Background (Revealed by swiping left) */}
      {renderRightBackground && (
        <div 
          className="absolute inset-y-0 right-0 w-full"
          style={{ opacity: offsetX < 0 ? 1 : 0 }}
        >
          {renderRightBackground(offsetX)}
        </div>
      )}

      {/* Left Background (Revealed by swiping right) */}
      {renderLeftBackground && (
        <div 
            className="absolute inset-y-0 left-0 w-full"
            style={{ opacity: offsetX > 0 ? 1 : 0 }}
        >
            {renderLeftBackground(offsetX)}
        </div>
      )}

      {/* Foreground Content */}
      <div
        className="relative z-10"
        style={{ transform: `translateX(${offsetX}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div onClickCapture={(e) => {
            if (isDragging.current) {
                e.preventDefault();
                e.stopPropagation();
            }
        }}>
            {children}
        </div>
      </div>
    </div>
  );
};

export default SwipeableItem;
