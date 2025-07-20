import React from 'react';

function EventChip({ event, onClick, compact = false }) {
  return (
    <div
      className={`
        rounded px-2 py-1 text-xs cursor-pointer hover:opacity-80 truncate
        ${compact ? 'text-white' : 'text-white'}
      `}
      style={{ backgroundColor: event.color }}
      onClick={() => onClick && onClick()}
    >
      {event.title}
    </div>
  );
}

export default EventChip; 