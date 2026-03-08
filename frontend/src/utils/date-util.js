export function calculateFinishTime(tasks, sessions) {
  const n = tasks.reduce((sum, task) => sum + (task.total - task.completed), 0);
  if (n <= 0) return 0;

  const k = 2;
  const Tp = sessions[0].duration / 60;
  const Tsb = sessions[1].duration / 60;
  const Tlb = sessions[2].duration / 60;

  const nLb = Math.floor((n - 1) / k);
  const nSb = n - 1 - nLb;

  const totalMinutes = n * Tp + nLb * Tlb + nSb * Tsb;
  return totalMinutes;
}

export function displayTime(time) {
  return time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
