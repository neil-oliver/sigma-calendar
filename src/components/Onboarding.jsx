import React from 'react';
import { Button } from '../components/ui/button';
import { HelpCircle, Settings as SettingsIcon, CalendarRange, Database, Columns3, Palette } from 'lucide-react';

function StepCard({ icon: Icon, title, children, complete = false }) {
  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`h-9 w-9 rounded-md flex items-center justify-center border ${complete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border-border'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium leading-none">{title}</h4>
            {complete && (
              <span className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px]">Configured</span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Onboarding({
  hasSource,
  hasRequiredColumns,
  editMode,
  onOpenSettings,
  onOpenHelp,
}) {
  return (
    <div className="h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="rounded-xl border border-border bg-card text-card-foreground p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarRange className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold tracking-tight">Sigma Calendar</h2>
                <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs">Overview</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Visualize your Sigma data as a calendar. Configure your source and required columns to get started. For a deeper guide, open Help.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-2" onClick={onOpenHelp}>
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
              <Button size="sm" className="gap-2" onClick={onOpenSettings} disabled={!editMode}>
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {!editMode && (
            <div className="mt-4 rounded-md border border-border bg-muted/30 text-muted-foreground px-4 py-3 text-sm">
              Enable Edit Mode in the Sigma properties panel to open Settings and configure the plugin.
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StepCard icon={Database} title="Choose Source" complete={hasSource}>
              Pick a Sigma element for your data. Each row becomes a calendar event.
            </StepCard>
            <StepCard icon={Columns3} title="Select Required Columns" complete={hasRequiredColumns}>
              Set <span className="font-medium">Event Title</span> and <span className="font-medium">Start Date</span> columns.
            </StepCard>
            <StepCard icon={Palette} title="Optional: Styling">
              Tweak themes and colors in Settings to match your dashboard.
            </StepCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;


