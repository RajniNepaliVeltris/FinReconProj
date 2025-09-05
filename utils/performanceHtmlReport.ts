import { PerformanceLog } from './PerformanceRecorder';

export function generatePerformanceHtmlReport(flowName: string, logs: PerformanceLog[]): string {
  const total = logs.reduce((sum, log) => sum + log.durationMs, 0);
  const rows = logs.map(log => `
      <tr>
        <td>${log.action}</td>
        <td>${log.durationMs} ms</td>
      </tr>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Performance Report - ${flowName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2em; }
    table { border-collapse: collapse; width: 60%; margin: 2em 0; }
    th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
    th { background: #f4f4f4; }
    tfoot td { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Performance Report: ${flowName}</h1>
  <table>
    <thead>
      <tr><th>Action</th><th>Duration (ms)</th></tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
    <tfoot>
      <tr><td>Total</td><td>${total} ms</td></tr>
    </tfoot>
  </table>
</body>
</html>`;
}
