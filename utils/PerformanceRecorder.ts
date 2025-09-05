export interface PerformanceLog {
  action: string;
  durationMs: number;
}

export class PerformanceRecorder {
  private flowName: string = '';
  private logs: PerformanceLog[] = [];
  private lastAction: string = '';
  private lastTimestamp: number = 0;
  private started: boolean = false;

  startFlow(flowName: string) {
    this.flowName = flowName;
    this.logs = [];
    this.lastAction = '';
    this.lastTimestamp = 0;
    this.started = false;
    console.log(`\n--- Starting Performance Flow: ${flowName} ---`);
  }

  start(action: string) {
    this.lastAction = action;
    this.lastTimestamp = Date.now();
    this.started = true;
    console.log(`Start: ${action}`);
  }

  nextAction(action: string) {
    if (!this.started) {
      throw new Error('PerformanceRecorder: Call start() before nextAction().');
    }
    const now = Date.now();
    const duration = now - this.lastTimestamp;
    this.logs.push({ action: this.lastAction, durationMs: duration });
    console.log(`End: ${this.lastAction} | Duration: ${duration} ms`);
    this.lastAction = action;
    this.lastTimestamp = now;
    console.log(`Start: ${action}`);
  }

  end() {
    if (!this.started) {
      throw new Error('PerformanceRecorder: Call start() before end().');
    }
    const now = Date.now();
    const duration = now - this.lastTimestamp;
    this.logs.push({ action: this.lastAction, durationMs: duration });
    console.log(`End: ${this.lastAction} | Duration: ${duration} ms`);
    this.started = false;
    this.printSummary();
  }

  getLogs(): PerformanceLog[] {
    return [...this.logs];
  }

  private printSummary() {
    console.log(`\n--- Performance Summary for Flow: ${this.flowName} ---`);
    console.table(this.logs.map(log => ({ Action: log.action, 'Duration (ms)': log.durationMs })));
    const total = this.logs.reduce((sum, log) => sum + log.durationMs, 0);
    console.log(`Total Duration: ${total} ms\n`);
  }
}
