import { HistoryPoint } from '../api/types';
import { Plant } from '../data/plants';

export interface MilestoneResult {
  daysElapsed: number;
  daysRemaining: number | null; // null if past milestone
  estimatedDate: Date | null;
  progressPercent: number; // 0-100
  stressDaysCount: number;
  stageIndex: number; // which growthStage index we're at
}

/**
 * Groups an array of HistoryPoint values by calendar day (UTC) and returns
 * the set of ISO date strings that had at least one out-of-range reading.
 */
function countStressDays(
  history: HistoryPoint[],
  optimalMoistureMin: number,
  optimalMoistureMax: number,
): number {
  if (history.length === 0) return 0;

  const stressDaySet = new Set<string>();
  for (const point of history) {
    const isStress =
      point.value < optimalMoistureMin || point.value > optimalMoistureMax;
    if (isStress) {
      // group by UTC day so each calendar day counts at most once
      const dayKey = point.timestamp.toISOString().slice(0, 10);
      stressDaySet.add(dayKey);
    }
  }
  return stressDaySet.size;
}

export function calculateMilestone(
  plant: Plant,
  plantingDate: Date,
  currentStageIndex: number,
  history: HistoryPoint[],
  optimalMoistureMin: number,
  optimalMoistureMax: number,
): MilestoneResult {
  const now = new Date();
  const msPerDay = 86_400_000;
  const daysElapsed = Math.max(
    0,
    Math.floor((now.getTime() - plantingDate.getTime()) / msPerDay),
  );

  const baseDays = Math.round(
    (plant.daysToMilestoneMin + plant.daysToMilestoneMax) / 2,
  );

  const stressDaysCount = countStressDays(
    history,
    optimalMoistureMin,
    optimalMoistureMax,
  );

  const estimatedDays = baseDays + stressDaysCount;

  const rawProgress = estimatedDays > 0 ? daysElapsed / estimatedDays : 1;
  const progressPercent = Math.min(100, Math.max(0, Math.round(rawProgress * 100)));

  const isPastMilestone = daysElapsed >= estimatedDays;
  const daysRemaining = isPastMilestone ? null : estimatedDays - daysElapsed;

  let estimatedDate: Date | null = null;
  if (!isPastMilestone) {
    estimatedDate = new Date(plantingDate.getTime() + estimatedDays * msPerDay);
  }

  // Stage index: which growth stage we're currently in, based on progress.
  // Use currentStageIndex if explicitly set past 0, otherwise derive from progress.
  const numStages = plant.growthStages.length;
  let stageIndex: number;
  if (currentStageIndex > 0) {
    stageIndex = Math.min(currentStageIndex, numStages - 1);
  } else {
    stageIndex = Math.min(
      Math.floor((progressPercent / 100) * numStages),
      numStages - 1,
    );
  }

  return {
    daysElapsed,
    daysRemaining,
    estimatedDate,
    progressPercent,
    stressDaysCount,
    stageIndex,
  };
}
