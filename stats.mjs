// @ts-check
import os from 'node:os';

export function getStats() {
  const cpus = os.cpus().reduce((acc, { model }) => ({
    ...acc,
    [model]: (acc[model] || 0) + 1,
  }), {});
  
  const platform = os.platform();
  const release = os.release();
  const arch = os.arch();
  
  return `${platform} ${release}, ${Object.entries(cpus).map(([name, count]) => `${name} (${count} core)`)} ${arch}`;
}
