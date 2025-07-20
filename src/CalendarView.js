import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import Tooltip, { EventTooltip, DateTooltip } from './components/ui/tooltip';
import EventDetailModal, { EventPreviewModal } from './components/EventDetailModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Grid3X3, 
  Clock
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  addWeeks, 
  subWeeks, 
  addDays, 
  subDays,
  addYears,
  subYears,
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  isSameMonth,
  isToday
} from 'date-fns';
import { getEventsForDate } from './utils/dataProcessor';

function CalendarView({ data, settings, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(settings.defaultView || 'month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Navigation functions
  const navigatePrevious = () => {
    switch (currentView) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(subYears(currentDate, 1));
        break;
      default:
        break;
    }
  };

  const navigateNext = () => {
    switch (currentView) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(addYears(currentDate, 1));
        break;
      default:
        break;
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  // Modal handling functions
  const handleEventModalOpen = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEventPreviewOpen = (event) => {
    setSelectedEvent(event);
    setShowPreviewModal(true);
  };

  const handleEventAction = (eventId, date) => {
    if (onEventClick) {
      onEventClick(eventId, date);
    }
  };

  const handleDateClick = (date) => {
    if (onEventClick) {
      onEventClick(null, format(date, 'yyyy-MM-dd'));
    }
  };

  // Get title based on current view and date
  const getTitle = () => {
    switch (currentView) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: settings.weekStartsOn });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: settings.weekStartsOn });
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
      default:
        return '';
    }
  };

  // Render the appropriate view
  const renderView = () => {
    const commonProps = {
      currentDate,
      events: data.events,
      settings,
      onEventClick: handleEventAction,
      onEventModalOpen: handleEventModalOpen,
      onEventPreviewOpen: handleEventPreviewOpen,
      onDateClick: handleDateClick
    };

    switch (currentView) {
      case 'month':
        return <MonthView {...commonProps} />;
      case 'week':
        return <WeekView {...commonProps} />;
      case 'day':
        return <DayView {...commonProps} />;
      case 'year':
        return <YearView {...commonProps} />;
      default:
        return <MonthView {...commonProps} />;
    }
  };

  if (!data || !data.events) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Calendar Data</h3>
          <p className="text-muted-foreground">Please check your data source configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header with navigation and view controls */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateToday}>
            Today
          </Button>
        </div>

        <h1 className="text-xl font-semibold">{getTitle()}</h1>

        <div className="flex items-center gap-2">
          <Select value={currentView} onValueChange={setCurrentView}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Month
                </div>
              </SelectItem>
              <SelectItem value="week">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Week
                </div>
              </SelectItem>
              <SelectItem value="day">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Day
                </div>
              </SelectItem>
              <SelectItem value="year">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Year
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar content */}
      <div className="flex-1 overflow-auto">
        {renderView()}
      </div>

      {/* Event Modals */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onEventAction={handleEventAction}
        settings={settings}
      />
      
      <EventPreviewModal
        event={selectedEvent}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onViewDetails={() => {
          setShowPreviewModal(false);
          setShowEventModal(true);
        }}
        onEventAction={handleEventAction}
      />
    </div>
  );
}

// Month View Component
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

// Week View Component
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

// Day View Component
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

// Year View Component
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

// Mini Month View for Year View
function MiniMonthView({ 
  month, 
  events, 
  settings, 
  onEventClick, 
  onEventPreviewOpen, 
  onDateClick 
}) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: settings.weekStartsOn });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: settings.weekStartsOn });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 text-center">
        {format(month, 'MMMM')}
      </h3>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Mini weekday headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-xs text-center text-muted-foreground p-1">
            {day}
          </div>
        ))}
        
        {/* Mini calendar days */}
        {days.map((day) => {
          const dayEvents = getEventsForDate(events, day);
          const isCurrentMonth = isSameMonth(day, month);
          const isTodayDate = isToday(day);

          const tooltipContent = dayEvents.length > 0 ? (
            <div className="text-center">
              <div className="font-semibold mb-1">
                {format(day, 'EEEE, MMMM d')}
              </div>
              <div className="text-xs text-gray-300 dark:text-gray-600 mb-2">
                {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
              </div>
              {dayEvents.slice(0, 3).map(event => (
                <div key={event.id} className="text-xs mb-1">
                  <span 
                    className="inline-block w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: event.color }}
                  />
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-400">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          ) : null;

          const dayComponent = (
            <div
              className={`
                text-xs p-1 text-center relative cursor-pointer hover:bg-muted/50
                ${!isCurrentMonth ? 'text-muted-foreground' : ''}
                ${isTodayDate ? 'bg-blue-100 dark:bg-blue-950/30 rounded' : ''}
              `}
              onClick={() => {
                if (dayEvents.length > 0) {
                  onEventPreviewOpen && onEventPreviewOpen(dayEvents[0]);
                } else {
                  onDateClick && onDateClick(day);
                }
              }}
            >
              {format(day, 'd')}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );

          return (
            <div key={day.toISOString()}>
              {dayEvents.length > 0 && tooltipContent && settings.showEventTooltips ? (
                <Tooltip content={tooltipContent} delay={settings.tooltipDelay}>
                  {dayComponent}
                </Tooltip>
              ) : settings.showDateTooltips ? (
                <DateTooltip date={day} onDateClick={onDateClick}>
                  {dayComponent}
                </DateTooltip>
              ) : (
                dayComponent
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Event Chip Component
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

// Event Card Component for Day View
function EventCard({ event, onClick, onSecondaryClick }) {
  return (
    <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => onClick && onClick()}
        >
          <h3 className="font-semibold text-lg">{event.title}</h3>
          {event.description && (
            <p className="text-muted-foreground mt-1">{event.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>
              {event.allDay 
                ? 'All day' 
                : `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`
              }
            </span>
            {event.category && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: event.color, color: 'white' }}>
                {event.category}
              </span>
            )}
          </div>
          
          {/* Additional fields */}
          {Object.keys(event.additionalFields || {}).length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(event.additionalFields).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="font-medium text-muted-foreground">{key}:</span>
                  <span className="ml-1">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        {onSecondaryClick && (
          <div className="ml-4 flex flex-col gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onSecondaryClick();
              }}
            >
              Select
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarView; 