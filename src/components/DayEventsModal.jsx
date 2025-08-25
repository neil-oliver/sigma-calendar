import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import EventChip from './views/EventChip';

const DayEventsModal = ({ 
  date, 
  events, 
  isOpen, 
  onClose, 
  onEventClick,
  settings = {}
}) => {
  if (!date || !events) return null;

  const sortedEvents = [...events].sort((a, b) => {
    // Sort all-day events first, then by start time
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    if (a.allDay && b.allDay) return a.title.localeCompare(b.title);
    return a.start.getTime() - b.start.getTime();
  });

  const formatEventTime = (event) => {
    if (event.allDay) {
      return 'All day';
    }
    
    const timeFormat = settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a';
    return `${format(event.start, timeFormat)} - ${format(event.end, timeFormat)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {format(date, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </div>
        </DialogHeader>
        
        <div className="space-y-3">
          {sortedEvents.map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <EventChip
                      event={event}
                      onClick={() => {
                        if (onEventClick) {
                          onEventClick(event.id, format(date, 'yyyy-MM-dd'));
                          onClose();
                        }
                      }}
                      compact={false}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    {formatEventTime(event)}
                  </div>
                  
                  {event.description && (
                    <div className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {event.description}
                    </div>
                  )}
                  
                  {event.category && (
                    <div className="flex items-center gap-2 mt-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: event.color }}
                      />
                      <span className="text-sm text-muted-foreground">{event.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayEventsModal;
