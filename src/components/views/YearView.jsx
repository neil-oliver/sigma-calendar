import React from 'react';
import { startOfYear, endOfYear, eachMonthOfInterval, format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { getEventsForDate } from '../../utils/dataProcessor';
import MiniMonthView from './MiniMonthView';

function YearView({ 
  currentDate, 
  events, 
  settings, 
  onEventClick, 
  onEventModalOpen, 
  onEventPreviewOpen, 
  onDateClick,
  mini = false
}) {
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  // Mini view - month-level aggregation
  if (mini) {
    return (
      <div className="h-full p-4">
        <h3 className="text-lg font-semibold mb-3 text-center">
          {format(currentDate, 'yyyy')}
        </h3>
        
        <div className="grid grid-cols-3 gap-2 max-w-full">
          {months.map((month) => {
            // Get all events for this month
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);
            const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
            const monthEvents = monthDays.reduce((acc, day) => {
              return acc.concat(getEventsForDate(events, day));
            }, []);
            
            return (
              <div
                key={month.toISOString()}
                className="text-center p-2 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors min-h-16"
                onClick={() => onDateClick && onDateClick(month)}
              >
                <div className="text-xs font-medium mb-1">
                  {format(month, 'MMM')}
                </div>
                <div className="flex justify-center">
                  {monthEvents.length > 0 && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                {monthEvents.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {monthEvents.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Regular year view
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