"use client";

import CreateEventContent from "./_components/create-event-content";

export default function CreateEventPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create an Event</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Home</span>
          <span>/</span>
          <span>Events</span>
          <span>/</span>
          <span className="text-primary font-medium">Create an Event</span>
        </div>
      </div>
      <CreateEventContent />
    </div>
  );
}
