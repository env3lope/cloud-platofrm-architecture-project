export class InMemoryProcessedEventStore {
  private readonly processedEvents = new Set<string>();

  private readonly inProgress = new Map<string, Promise<void>>();

  async executeOnce(
    eventId: string,
    operation: () => Promise<void>
  ): Promise<boolean> {
    if (this.processedEvents.has(eventId)) {
      console.log(`Дублікат події ${eventId} пропущено`);
      return false;
    }

    const existingOperation = this.inProgress.get(eventId);

    if (existingOperation) {
      await existingOperation;
      console.log(`Повторну обробку події ${eventId} пропущено`);
      return false;
    }

    const processing = operation();

    this.inProgress.set(eventId, processing);

    try {
      await processing;
      this.processedEvents.add(eventId);
      return true;
    } finally {
      this.inProgress.delete(eventId);
    }
  }
}
