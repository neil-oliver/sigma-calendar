import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { 
  HelpCircle, Database, Fingerprint, Type, CalendarDays, Columns3, Info, Eye, SlidersHorizontal, Paintbrush, AlertTriangle
} from 'lucide-react';


function HelpModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Calendar Help & Guide
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
            <p className="text-sm text-muted-foreground">
              Display your Sigma data as events in a flexible calendar. Supports Month, Week, Day, and Year views. Configure columns and styling in Settings.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <Database className="h-4 w-4" />
              Quick Start
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Select <span className="font-medium">Source</span> (Sigma element).</li>
              <li>Set <span className="font-medium">Event Title</span>, <span className="font-medium">Start Date</span>, and optionally <span className="font-medium">End Date</span>, <span className="font-medium">Description</span>, <span className="font-medium">Category/Color</span>.</li>
              <li>Optionally choose <span className="font-medium">Additional Fields</span> to show in event details.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <SlidersHorizontal className="h-4 w-4" />
              Required Configuration <Badge variant="secondary">Required</Badge>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Fingerprint className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">ID Column</div>
                  <div className="text-muted-foreground">Unique identifier for each event (used with variables).</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Type className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Event Title</div>
                  <div className="text-muted-foreground">Primary title shown on events and in details.</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Start Date</div>
                  <div className="text-muted-foreground">Required to place events on the calendar.</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Columns3 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Source</div>
                  <div className="text-muted-foreground">Sigma element containing your event data.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card text-card-foreground p-4 space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Optional Columns <Badge variant="secondary">Optional</Badge>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><span className="font-medium">End Date</span>: For multi-day events.</li>
              <li><span className="font-medium">Description</span>: Additional details shown in modals/tooltips.</li>
              <li><span className="font-medium">Category/Color</span>: Categorize and color-code events.</li>
              <li><span className="font-medium">Additional Fields</span>: Extra columns to show in detail view.</li>
            </ul>
            <div className="rounded-md border border-border bg-muted/30 text-muted-foreground text-sm p-3 flex gap-2">
              <Info className="h-4 w-4 mt-0.5" />
              Event colors can be driven by category or customized in Settings.
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4" />
              Views
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><span className="font-medium">Month</span>: Grid of days with event chips.</li>
              <li><span className="font-medium">Week</span>: Seven-day view with more detail.</li>
              <li><span className="font-medium">Day</span>: Focused list of events for a single day.</li>
              <li><span className="font-medium">Year</span>: Twelve mini calendars to visualize distribution.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <SlidersHorizontal className="h-4 w-4" />
              Interactivity & Variables
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><span className="font-medium">Event Click</span>: Configure an action in the editor to run when an event is clicked.</li>
              <li><span className="font-medium">Variables</span>: Selected Event ID and Selected Date are set on clicks.</li>
              <li><span className="font-medium">Tooltips & Modals</span>: Configure via Settings → Event Interaction.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Paintbrush className="h-4 w-4" />
              Styling
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Select a theme: Light, Dark, Ocean Blue, Forest Green, Royal Purple, or Custom.</li>
              <li>Enable <span className="font-medium">Dynamic Theming</span> to preview changes live.</li>
              <li>Customize CSS color tokens when using Custom theme.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              Troubleshooting
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><span className="font-medium">No events?</span> Ensure Source, Event Title, and Start Date are set.</li>
              <li><span className="font-medium">Colors not as expected?</span> Check Category mapping and Styling settings.</li>
              <li><span className="font-medium">Clicks not triggering?</span> Add an Event Click action in the editor and ensure variables are set.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card text-card-foreground p-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Info className="h-4 w-4" />
              Feedback & Issues
            </h4>
            <p className="text-sm text-muted-foreground">
              Found a bug or have a feature request? Please report it using GitHub Issues at{' '}
              <a
                href="https://github.com/neil-oliver/sigma-calendar"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                github.com/neil-oliver/sigma-calendar
              </a>
              .
            </p>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button onClick={onClose}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default HelpModal; 