import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Button } from './components/ui/button';


function HelpModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Calendar Plugin Help</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">Overview</h3>
            <p className="text-muted-foreground">
              The Calendar Plugin displays your Sigma data as events in a flexible calendar interface. 
              It supports multiple views (month, week, day, year) and can handle both single-day and multi-day events.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Required Configuration</h3>
            <div className="space-y-2">
              <div>
                <strong>Data Source:</strong> Select your Sigma data table containing event information
              </div>
              <div>
                <strong>Event Title:</strong> Column containing the event titles/names
              </div>
              <div>
                <strong>Start Date:</strong> Column containing event start dates (required)
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Optional Configuration</h3>
            <div className="space-y-2">
              <div>
                <strong>End Date:</strong> Column for event end dates (for multi-day events)
              </div>
              <div>
                <strong>Description:</strong> Column containing event descriptions
              </div>
              <div>
                <strong>Category/Color:</strong> Column for categorizing and color-coding events
              </div>
              <div>
                <strong>Additional Fields:</strong> Extra columns to display in event details
              </div>
              <div>
                <strong>ID Column:</strong> Unique identifier for events (used with variables)
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Calendar Views</h3>
            <div className="space-y-2">
              <div>
                <strong>Month View:</strong> Traditional monthly calendar with events displayed as colored blocks
              </div>
              <div>
                <strong>Week View:</strong> Seven-day view showing more event details
              </div>
              <div>
                <strong>Day View:</strong> Single day with full event cards and descriptions
              </div>
              <div>
                <strong>Year View:</strong> Twelve mini-month calendars showing event distribution
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Event Types</h3>
            <div className="space-y-2">
              <div>
                <strong>Single-day Events:</strong> Events that occur on one day (meetings, deadlines)
              </div>
              <div>
                <strong>Multi-day Events:</strong> Events that span multiple days (projects, vacations)
              </div>
              <div>
                <strong>All-day Events:</strong> Events without specific times (holidays, milestones)
              </div>
              <div>
                <strong>Timed Events:</strong> Events with specific start/end times
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Interactivity</h3>
            <div className="space-y-2">
              <div>
                <strong>Event Clicking:</strong> Configure action triggers to respond to event clicks
              </div>
              <div>
                <strong>Variables:</strong> Set up variables to capture selected event IDs and dates
              </div>
              <div>
                <strong>Color Coding:</strong> Automatically color events by category or set custom colors
              </div>
              <div>
                <strong>Tooltips:</strong> Hover over events to see additional details
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Settings</h3>
            <div className="space-y-2">
              <div>
                <strong>Default View:</strong> Choose which calendar view loads initially
              </div>
              <div>
                <strong>Week Start:</strong> Set whether weeks start on Sunday or Monday
              </div>
              <div>
                <strong>Time Format:</strong> Choose between 12-hour or 24-hour time display
              </div>
              <div>
                <strong>Event Display:</strong> Control how events appear on the calendar
              </div>
              <div>
                <strong>Max Events:</strong> Limit how many events show per day in month view
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Example Data Structure</h3>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
{`| Event Title    | Start Date | End Date   | Category | Priority | Assignee |
|----------------|------------|------------|----------|----------|----------|
| Sprint Planning| 2024-01-15 | 2024-01-15 | Meeting  | High     | Team     |
| Product Launch | 2024-01-20 | 2024-01-25 | Project  | Critical | Marketing|
| Code Review    | 2024-01-22 | 2024-01-22 | Task     | Medium   | Dev Team |`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Use consistent date formats for reliable parsing</li>
              <li>Categories will automatically get unique colors if not specified</li>
              <li>Enable Edit Mode to access the Settings panel</li>
              <li>Configure variables and actions for interactive dashboards</li>
              <li>Use the Year view to see long-term patterns and planning</li>
            </ul>
          </section>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HelpModal; 