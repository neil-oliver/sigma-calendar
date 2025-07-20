/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { client, useConfig, useElementData, useElementColumns, useVariable, useActionTrigger } from '@sigmacomputing/plugin';
import { Button } from './components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';
import Settings, { DEFAULT_SETTINGS } from './Settings';
import { processCalendarData } from './utils/dataProcessor';
import CalendarView from './CalendarView';
import './App.css';

// Configure the plugin editor panel
client.config.configureEditorPanel([
  { name: 'source', type: 'element' },
  { name: 'ID', type: 'column', source: 'source', allowMultiple: false, label: 'ID Column' },
  { name: 'title', type: 'column', source: 'source', allowMultiple: false, label: 'Event Title' },
  { name: 'startDate', type: 'column', source: 'source', allowMultiple: false, label: 'Start Date' },
  { name: 'endDate', type: 'column', source: 'source', allowMultiple: false, label: 'End Date (Optional)' },
  { name: 'description', type: 'column', source: 'source', allowMultiple: false, label: 'Description (Optional)' },
  { name: 'category', type: 'column', source: 'source', allowMultiple: false, label: 'Category/Color (Optional)' },
  { name: 'eventFields', type: 'column', source: 'source', allowMultiple: true, label: 'Additional Fields' },
  { name: 'selectedEventID', type: 'variable', label: 'Selected Event ID Variable' },
  { name: 'selectedDate', type: 'variable', label: 'Selected Date Variable' },
  { name: 'config', type: 'text', label: 'Settings Config (JSON)', defaultValue: "{}" },
  { name: 'editMode', type: 'toggle', label: 'Edit Mode' },
  { name: 'onEventClick', type: 'action-trigger', label: 'Event Click Action' }
]);

function App() {
  const config = useConfig();
  const sigmaData = useElementData(config.source);
  const elementColumns = useElementColumns(config.source);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Get variables and action trigger
  const [eventIdVariable, setEventIdVariable] = useVariable(config.selectedEventID);
  const [dateVariable, setDateVariable] = useVariable(config.selectedDate);
  const triggerEventClick = useActionTrigger(config.onEventClick);

  // Debug: Log element columns structure
  console.log('Element Columns:', elementColumns);
  
  // Debug: Log current variable values
  console.log('Current variables:', {
    eventIdVariable,
    dateVariable,
    hasEventClickTrigger: !!triggerEventClick
  });

  // Parse config JSON and load settings
  useEffect(() => {
    if (config.config && config.config.trim()) {
      try {
        const parsedConfig = JSON.parse(config.config);
        const newSettings = { ...DEFAULT_SETTINGS, ...parsedConfig };
        setSettings(newSettings);
      } catch (err) {
        console.error('Invalid config JSON:', err);
        setSettings(DEFAULT_SETTINGS);
      }
    } else {
      setSettings(DEFAULT_SETTINGS);
    }
  }, [config.config]);

  // Process calendar data with column information
  const calendarData = processCalendarData(sigmaData, config, settings, elementColumns);

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
  };

  const handleEventClick = async (eventId, date) => {
    try {
      console.log('Event click triggered:', { eventId, date });
      
      // Set the variables
      setEventIdVariable(eventId);
      setDateVariable(date);
      
      // Trigger the action
      if (triggerEventClick) {
        triggerEventClick();
      }
      
      console.log('Variables set and action triggered:', {
        eventId,
        date
      });
    } catch (error) {
      console.error('Error handling event click:', error);
      setError(`Failed to handle event click: ${error.message}`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-10">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!config.source || !config.title || !config.startDate) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-10">
        <div className="text-center max-w-xl">
          <h3 className="text-lg font-semibold mb-2">Calendar Plugin</h3>
          <p className="text-muted-foreground">Please configure the data source, event title, and start date columns.</p>
        </div>
      </div>
    );
  }

  if (!sigmaData || !calendarData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-10">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">Loading calendar data...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {config.editMode && (
        <Button 
          className="absolute top-5 right-5 z-10 gap-2"
          onClick={() => setShowSettings(true)}
          size="sm"
        >
          <SettingsIcon className="h-4 w-4" />
          Settings
        </Button>
      )}
      
      <CalendarView 
        data={calendarData}
        settings={settings}
        onEventClick={handleEventClick}
      />
      
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentSettings={settings}
        onSave={handleSettingsSave}
        client={client}
        elementColumns={elementColumns}
        config={config}
      />
    </div>
  );
}

export default App; 