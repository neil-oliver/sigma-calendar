import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { getEventsForDate } from '../../utils/dataProcessor';
import EventChip from './EventChip';
import { DateTooltip, EventTooltip } from '../ui/tooltip';

function MonthView({ 
  currentDate, 
  events, 
  settings, 
  onEventClick, 
  onEventModalOpen, 
  onEventPreviewOpen, 
  onDateClick 
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: settings.weekStartsOn });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: settings.weekStartsOn });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Adjust weekdays based on settings
  if (settings.weekStartsOn === 1) {
    weekDays.push(weekDays.shift()); // Move Sunday to end
  }

  return (
    <div className="h-full flex flex-col">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {days.map((day) => {
          const dayEvents = getEventsForDate(events, day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`
                border-r border-b border-border p-2 min-h-24 flex flex-col
                ${!isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''}
                ${isTodayDate ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
              `}
            >
              {/* Day number with date tooltip */}
              {settings.showDateTooltips ? (
                <DateTooltip date={day} onDateClick={onDateClick}>
                  <div className={`
                    text-sm font-medium mb-1 cursor-pointer hover:bg-muted/30 rounded px-1 py-0.5
                    ${isTodayDate ? 'text-blue-600 dark:text-blue-400' : ''}
                  `}>
                    {format(day, 'd')}
                  </div>
                </DateTooltip>
              ) : (
                <div 
                  className={`
                    text-sm font-medium mb-1 cursor-pointer hover:bg-muted/30 rounded px-1 py-0.5
                    ${isTodayDate ? 'text-blue-600 dark:text-blue-400' : ''}
                  `}
                  onClick={() => onDateClick && onDateClick(day)}
                >
                  {format(day, 'd')}
                </div>
              )}

              {/* Events */}
              <div className="flex-1 space-y-1">
                {dayEvents.slice(0, settings.dayMaxEvents || 3).map((event) => {
                  const eventChip = (
                    <EventChip
                      event={event}
                      onClick={() => onEventClick && onEventClick(event.id, format(day, 'yyyy-MM-dd'))}
                      compact={true}
                    />
                  );

                  // Respect interaction mode settings
                  if (!settings.showEventTooltips || settings.eventInteractionMode === 'modal') {
                    return <div key={`${event.id}-${day.toISOString()}`}>{eventChip}</div>;
                  }

                  return (
                    <EventTooltip 
                      key={`${event.id}-${day.toISOString()}`} 
                      event={event}
                      delay={settings.tooltipDelay}
                    >
                      {eventChip}
                    </EventTooltip>
                  );
                })}
                {dayEvents.length > (settings.dayMaxEvents || 3) && (
                  <div 
                    className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => onEventPreviewOpen && onEventPreviewOpen(dayEvents[settings.dayMaxEvents || 3])}
                  >
                    +{dayEvents.length - (settings.dayMaxEvents || 3)} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthView; 