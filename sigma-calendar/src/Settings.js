import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Switch } from './components/ui/switch';
import { HelpCircle } from 'lucide-react';
import HelpModal from './HelpModal';
import { getColumnName } from './utils/columnHelper';

// Default settings for calendar
export const DEFAULT_SETTINGS = {
  defaultView: 'month', // 'month', 'week', 'year', 'day'
  weekStartsOn: 0, // 0 = Sunday, 1 = Monday
  timeFormat: '12h', // '12h', '24h'
  showWeekNumbers: false,
  showWeekends: true,
  eventDisplay: 'block', // 'block', 'list-item', 'background', 'inverse-background'
  eventHeight: 'auto', // 'auto', 'fixed'
  eventTimeFormat: 'short', // 'short', 'long', 'none'
  firstDay: 0, // 0 = Sunday, 1 = Monday
  dayMaxEvents: 3, // Maximum events to show per day before showing "more" link
  dayMaxEventRows: 3, // Maximum rows of events in month view
  slotDuration: '00:30:00', // Duration of time slots in agenda views
  scrollTime: '06:00:00', // Time to scroll to initially
  allDaySlot: true, // Show all-day slot in agenda views
  businessHours: {
    start: '09:00',
    end: '17:00',
    daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
  },
  eventColorByCategory: true, // Use category column for event colors
  customEventColors: {}, // Custom color mapping for categories
  showEventTooltips: true,
  enableEventClick: true,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  viewSpecificSettings: {
    month: {
      fixedWeekCount: false,
      showNonCurrentDates: true
    },
    week: {
      dayHeaders: true,
      slotMinTime: '00:00:00',
      slotMaxTime: '24:00:00'
    },
    day: {
      dayHeaders: true,
      slotMinTime: '06:00:00',
      slotMaxTime: '22:00:00'
    }
  }
};

function Settings({ 
  isOpen, 
  onClose, 
  currentSettings, 
  onSave, 
  client,
  elementColumns = {},
  config = {}
}) {
  const [tempSettings, setTempSettings] = useState(currentSettings);
  const [showHelp, setShowHelp] = useState(false);

  // Update temp settings when current settings change
  useEffect(() => {
    // Ensure all required properties exist with defaults
    const settingsWithDefaults = {
      ...DEFAULT_SETTINGS,
      ...currentSettings
    };
    setTempSettings(settingsWithDefaults);
  }, [currentSettings]);

  const handleSave = () => {
    const configJson = JSON.stringify(tempSettings, null, 2);
    
    try {
      client.config.set({ config: configJson });
      onSave(tempSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleCancel = () => {
    setTempSettings(currentSettings);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <DialogTitle>Calendar Settings</DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelp(true)}
                className="gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultView">Default View</Label>
              <Select
                value={tempSettings.defaultView}
                onValueChange={(value) => setTempSettings({ ...tempSettings, defaultView: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month View</SelectItem>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="day">Day View</SelectItem>
                  <SelectItem value="year">Year View</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Choose the initial calendar view</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekStartsOn">Week Starts On</Label>
              <Select
                value={tempSettings.weekStartsOn.toString()}
                onValueChange={(value) => setTempSettings({ ...tempSettings, weekStartsOn: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select first day of week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">First day of the week</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format</Label>
              <Select
                value={tempSettings.timeFormat}
                onValueChange={(value) => setTempSettings({ ...tempSettings, timeFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Time display format</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDisplay">Event Display Style</Label>
              <Select
                value={tempSettings.eventDisplay}
                onValueChange={(value) => setTempSettings({ ...tempSettings, eventDisplay: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event display style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Block (Default)</SelectItem>
                  <SelectItem value="list-item">List Item</SelectItem>
                  <SelectItem value="background">Background</SelectItem>
                  <SelectItem value="inverse-background">Inverse Background</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">How events are displayed on the calendar</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dayMaxEvents">Max Events Per Day</Label>
              <Select
                value={tempSettings.dayMaxEvents.toString()}
                onValueChange={(value) => setTempSettings({ ...tempSettings, dayMaxEvents: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select max events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Events</SelectItem>
                  <SelectItem value="3">3 Events</SelectItem>
                  <SelectItem value="4">4 Events</SelectItem>
                  <SelectItem value="5">5 Events</SelectItem>
                  <SelectItem value="0">No Limit</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Maximum events shown per day before "more" link</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="showWeekNumbers">Show Week Numbers</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showWeekNumbers"
                  checked={tempSettings.showWeekNumbers}
                  onCheckedChange={(checked) => setTempSettings({ ...tempSettings, showWeekNumbers: checked })}
                />
                <Label htmlFor="showWeekNumbers" className="text-sm font-normal">
                  {tempSettings.showWeekNumbers ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">Display week numbers in the calendar</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="showWeekends">Show Weekends</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showWeekends"
                  checked={tempSettings.showWeekends}
                  onCheckedChange={(checked) => setTempSettings({ ...tempSettings, showWeekends: checked })}
                />
                <Label htmlFor="showWeekends" className="text-sm font-normal">
                  {tempSettings.showWeekends ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">Include weekends in the calendar view</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventColorByCategory">Color by Category</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="eventColorByCategory"
                  checked={tempSettings.eventColorByCategory}
                  onCheckedChange={(checked) => setTempSettings({ ...tempSettings, eventColorByCategory: checked })}
                />
                <Label htmlFor="eventColorByCategory" className="text-sm font-normal">
                  {tempSettings.eventColorByCategory ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">Use category column to color-code events</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="showEventTooltips">Event Tooltips</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showEventTooltips"
                  checked={tempSettings.showEventTooltips}
                  onCheckedChange={(checked) => setTempSettings({ ...tempSettings, showEventTooltips: checked })}
                />
                <Label htmlFor="showEventTooltips" className="text-sm font-normal">
                  {tempSettings.showEventTooltips ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">Show detailed information when hovering over events</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enableEventClick">Event Click Actions</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableEventClick"
                  checked={tempSettings.enableEventClick}
                  onCheckedChange={(checked) => setTempSettings({ ...tempSettings, enableEventClick: checked })}
                />
                <Label htmlFor="enableEventClick" className="text-sm font-normal">
                  {tempSettings.enableEventClick ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">Enable clicking on events to trigger actions</p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
    </>
  );
}

export default Settings; 