import React from 'react';
import { startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import MiniMonthView from './MiniMonthView';

function YearView({ 
  currentDate, 
  events, 
  settings, 
  onEventClick, 
  onEventModalOpen, 
  onEventPreviewOpen, 
  onDateClick 
}) {
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
        {months.map((month) => (
          <MiniMonthView
            key={month.toISOString()}
            month={month}
            events={events}
            settings={settings}
            onEventClick={onEventClick}
            onEventPreviewOpen={onEventPreviewOpen}
            onDateClick={onDateClick}
          />
        ))}
      </div>
    </div>
  );
}

export default YearView; 