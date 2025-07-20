import React from 'react';
import { format } from 'date-fns';
import { getEventsForDate } from '../../utils/dataProcessor';
import EventCard from './EventCard';

function DayView({ 
  currentDate, 
  events, 
  settings, 
  onEventClick, 
  onEventModalOpen, 
  onEventPreviewOpen, 
  onDateClick 
}) {
  const dayEvents = getEventsForDate(events, currentDate);

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No events for this day</div>
            </div>
          ) : (
            dayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventModalOpen && onEventModalOpen(event)}
                onSecondaryClick={() => onEventClick && onEventClick(event.id, format(currentDate, 'yyyy-MM-dd'))}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DayView; 