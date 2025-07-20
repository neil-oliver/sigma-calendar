import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import { getEventsForDate } from '../../utils/dataProcessor';
import EventChip from './EventChip';
import { DateTooltip, EventTooltip } from '../ui/tooltip';

function WeekView({ 
  currentDate, 
  events, 
  settings, 
  onEventClick, 
  onEventModalOpen, 
  onEventPreviewOpen, 
  onDateClick 
}) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: settings.weekStartsOn });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: settings.weekStartsOn });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="h-full flex flex-col">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {days.map((day) => {
          const dayHeader = (
            <div className="p-3 text-center border-r border-border last:border-r-0 cursor-pointer hover:bg-muted/30">
              <div className="text-sm font-medium text-muted-foreground">
                {format(day, 'EEE')}
              </div>
              <div className={`
                text-lg font-semibold mt-1
                ${isToday(day) ? 'text-blue-600 dark:text-blue-400' : ''}
              `}>
                {format(day, 'd')}
              </div>
            </div>
          );

          return settings.showDateTooltips ? (
            <DateTooltip key={day.toISOString()} date={day} onDateClick={onDateClick}>
              {dayHeader}
            </DateTooltip>
          ) : (
            <div key={day.toISOString()} onClick={() => onDateClick && onDateClick(day)}>
              {dayHeader}
            </div>
          );
        })}
      </div>

      {/* Week grid */}
      <div className="flex-1 grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = getEventsForDate(events, day);

          return (
            <div
              key={day.toISOString()}
              className={`
                border-r border-border p-2 min-h-full flex flex-col
                ${isToday(day) ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
              `}
            >
              <div className="space-y-1">
                {dayEvents.map((event) => {
                  const eventChip = (
                    <EventChip
                      event={event}
                      onClick={() => onEventClick && onEventClick(event.id, format(day, 'yyyy-MM-dd'))}
                      compact={false}
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeekView; 