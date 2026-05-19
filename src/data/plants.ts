export interface Plant {
  id: string;
  name: string;
  category: 'Vegetables' | 'Herbs' | 'Fruits' | 'Houseplants' | 'Succulents' | 'Flowers';
  optimalMoistureMin: number; // %
  optimalMoistureMax: number; // %
  optimalTempMin: number; // °F
  optimalTempMax: number; // °F
  daysToMilestoneMin: number;
  daysToMilestoneMax: number;
  milestoneLabel: string;
  growthStages: string[];
  wateringTip: string;
  tempTip: string;
}

export const plants: Plant[] = [
  // ── Vegetables ──────────────────────────────────────────────────────────────
  {
    id: 'tomato',
    name: 'Tomato',
    category: 'Vegetables',
    optimalMoistureMin: 60,
    optimalMoistureMax: 80,
    optimalTempMin: 65,
    optimalTempMax: 85,
    daysToMilestoneMin: 70,
    daysToMilestoneMax: 85,
    milestoneLabel: 'Harvest',
    growthStages: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
    wateringTip:
      'Keep soil consistently moist but never waterlogged. Deep, infrequent watering encourages deep roots.',
    tempTip:
      'Tomatoes thrive between 65–85 °F. Temperatures above 95 °F can cause blossom drop and poor fruit set.',
  },
  {
    id: 'pepper',
    name: 'Bell Pepper',
    category: 'Vegetables',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 65,
    optimalTempMax: 85,
    daysToMilestoneMin: 70,
    daysToMilestoneMax: 90,
    milestoneLabel: 'Harvest',
    growthStages: ['Seedling', 'Vegetative', 'Flowering', 'Fruit set', 'Harvest'],
    wateringTip:
      'Water deeply once or twice a week. Inconsistent watering causes blossom end rot and cracked fruit.',
    tempTip:
      'Peppers prefer warm conditions. Cooler than 55 °F slows growth; heat above 90 °F hinders pollination.',
  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    category: 'Vegetables',
    optimalMoistureMin: 60,
    optimalMoistureMax: 80,
    optimalTempMin: 45,
    optimalTempMax: 70,
    daysToMilestoneMin: 45,
    daysToMilestoneMax: 65,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Seedling', 'Leaf development', 'Harvest'],
    wateringTip:
      'Keep the top inch of soil consistently moist. Shallow roots dry out quickly in hot weather.',
    tempTip:
      'Lettuce is a cool-season crop. Temperatures above 75 °F cause bolting and bitterness.',
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    category: 'Vegetables',
    optimalMoistureMin: 65,
    optimalMoistureMax: 85,
    optimalTempMin: 65,
    optimalTempMax: 90,
    daysToMilestoneMin: 50,
    daysToMilestoneMax: 70,
    milestoneLabel: 'Harvest',
    growthStages: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
    wateringTip:
      'Cucumbers need consistent, deep watering — at least 1 inch per week. Irregular water leads to bitter fruit.',
    tempTip:
      'Cucumbers love warmth. Soil temperature should be at least 60 °F for germination and steady growth.',
  },
  {
    id: 'carrot',
    name: 'Carrot',
    category: 'Vegetables',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 50,
    optimalTempMax: 75,
    daysToMilestoneMin: 70,
    daysToMilestoneMax: 90,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Seedling', 'Root development', 'Harvest'],
    wateringTip:
      'Water lightly but frequently during germination. Once established, deep watering encourages long straight roots.',
    tempTip:
      'Carrots prefer cool soil. Warm summers can cause roots to become woody and lose sweetness.',
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    category: 'Vegetables',
    optimalMoistureMin: 60,
    optimalMoistureMax: 80,
    optimalTempMin: 60,
    optimalTempMax: 90,
    daysToMilestoneMin: 45,
    daysToMilestoneMax: 60,
    milestoneLabel: 'Harvest',
    growthStages: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
    wateringTip:
      'Water at the base to avoid powdery mildew. Zucchini is a heavy drinker — water deeply 2–3 times a week.',
    tempTip:
      'Zucchini thrives in warm conditions. Frost will kill the plant; protect if temperatures dip below 50 °F.',
  },
  {
    id: 'spinach',
    name: 'Spinach',
    category: 'Vegetables',
    optimalMoistureMin: 60,
    optimalMoistureMax: 80,
    optimalTempMin: 40,
    optimalTempMax: 70,
    daysToMilestoneMin: 37,
    daysToMilestoneMax: 50,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Seedling', 'Leaf development', 'Harvest'],
    wateringTip:
      'Keep the soil evenly moist. Spinach has shallow roots so it needs frequent light watering in warm weather.',
    tempTip:
      'Spinach is cold-tolerant and bolts quickly above 75 °F. Ideal soil temperature for germination is 45–65 °F.',
  },
  {
    id: 'green-beans',
    name: 'Green Beans',
    category: 'Vegetables',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 60,
    optimalTempMax: 85,
    daysToMilestoneMin: 50,
    daysToMilestoneMax: 65,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Seedling', 'Flowering', 'Pod fill', 'Harvest'],
    wateringTip:
      'Water deeply once a week. Overhead watering can cause disease — aim at the soil instead.',
    tempTip:
      'Green beans germinate best when soil is above 60 °F. Cold soil causes seed rot and poor emergence.',
  },
  {
    id: 'kale',
    name: 'Kale',
    category: 'Vegetables',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 45,
    optimalTempMax: 75,
    daysToMilestoneMin: 55,
    daysToMilestoneMax: 75,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Seedling', 'Leaf development', 'Harvest'],
    wateringTip:
      'Kale prefers consistently moist soil. Mulching helps retain moisture and keeps roots cool.',
    tempTip:
      'A light frost actually sweetens kale. It grows best between 45–75 °F and tolerates brief freezes.',
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    category: 'Vegetables',
    optimalMoistureMin: 60,
    optimalMoistureMax: 80,
    optimalTempMin: 45,
    optimalTempMax: 75,
    daysToMilestoneMin: 80,
    daysToMilestoneMax: 100,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Seedling', 'Head formation', 'Harvest'],
    wateringTip:
      'Broccoli needs 1–1.5 inches of water per week. Drought stress causes small, loose heads.',
    tempTip:
      'Broccoli prefers cool temperatures. Heads will mature better with nights around 45–50 °F.',
  },

  // ── Herbs ────────────────────────────────────────────────────────────────────
  {
    id: 'basil',
    name: 'Basil',
    category: 'Herbs',
    optimalMoistureMin: 50,
    optimalMoistureMax: 70,
    optimalTempMin: 65,
    optimalTempMax: 85,
    daysToMilestoneMin: 25,
    daysToMilestoneMax: 35,
    milestoneLabel: 'Harvest',
    growthStages: ['Seedling', 'Leafing', 'Harvest-ready'],
    wateringTip:
      'Water basil when the top inch of soil feels dry. Avoid waterlogging — root rot sets in quickly.',
    tempTip:
      'Basil is frost-sensitive and struggles below 50 °F. It loves heat and is happiest at 70–85 °F.',
  },
  {
    id: 'mint',
    name: 'Mint',
    category: 'Herbs',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 30,
    daysToMilestoneMax: 45,
    milestoneLabel: 'Harvest',
    growthStages: ['Seedling', 'Spreading', 'Harvest-ready'],
    wateringTip:
      'Mint likes moist soil but not standing water. Water when the top inch is dry and ensure good drainage.',
    tempTip:
      'Mint grows vigorously in moderate temperatures. It goes dormant in winter but returns in spring.',
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    category: 'Herbs',
    optimalMoistureMin: 25,
    optimalMoistureMax: 50,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 80,
    daysToMilestoneMax: 120,
    milestoneLabel: 'Full maturity',
    growthStages: ['Seedling', 'Establishing', 'Bushing out', 'Mature'],
    wateringTip:
      'Rosemary is drought-tolerant. Water deeply but infrequently — allow the soil to dry out fully between waterings.',
    tempTip:
      'Rosemary prefers warm, dry conditions. It can survive mild frosts but thrives between 55–80 °F.',
  },
  {
    id: 'thyme',
    name: 'Thyme',
    category: 'Herbs',
    optimalMoistureMin: 25,
    optimalMoistureMax: 50,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 75,
    daysToMilestoneMax: 100,
    milestoneLabel: 'Full maturity',
    growthStages: ['Seedling', 'Establishing', 'Bushing out', 'Mature'],
    wateringTip:
      'Thyme prefers dry conditions. Overwatering is the most common killer — let soil dry completely between waterings.',
    tempTip:
      'Thyme is hardy and drought-resistant. It tolerates temperatures down to 0 °F once established.',
  },
  {
    id: 'cilantro',
    name: 'Cilantro',
    category: 'Herbs',
    optimalMoistureMin: 50,
    optimalMoistureMax: 70,
    optimalTempMin: 50,
    optimalTempMax: 75,
    daysToMilestoneMin: 40,
    daysToMilestoneMax: 55,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Seedling', 'Leafing', 'Harvest-ready'],
    wateringTip:
      'Keep soil evenly moist during germination. Once established, water when the top inch feels dry.',
    tempTip:
      'Cilantro bolts quickly in heat. Keep temperatures below 75 °F for leafy growth; it prefers cool seasons.',
  },
  {
    id: 'parsley',
    name: 'Parsley',
    category: 'Herbs',
    optimalMoistureMin: 50,
    optimalMoistureMax: 70,
    optimalTempMin: 50,
    optimalTempMax: 75,
    daysToMilestoneMin: 70,
    daysToMilestoneMax: 90,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Seedling', 'Leaf development', 'Harvest-ready'],
    wateringTip:
      'Parsley needs consistently moist soil. Water regularly and mulch to retain moisture in hot weather.',
    tempTip:
      'Parsley germinates slowly but tolerates light frost. Ideal growing temperature is 50–75 °F.',
  },
  {
    id: 'chives',
    name: 'Chives',
    category: 'Herbs',
    optimalMoistureMin: 50,
    optimalMoistureMax: 70,
    optimalTempMin: 45,
    optimalTempMax: 75,
    daysToMilestoneMin: 60,
    daysToMilestoneMax: 90,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Seedling', 'Leafing', 'Harvest-ready'],
    wateringTip:
      'Water chives regularly but let the soil dry slightly between waterings. They dislike waterlogged conditions.',
    tempTip:
      'Chives are cold-hardy and can survive freezes. They grow best when temperatures are between 45–75 °F.',
  },
  {
    id: 'oregano',
    name: 'Oregano',
    category: 'Herbs',
    optimalMoistureMin: 30,
    optimalMoistureMax: 55,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 80,
    daysToMilestoneMax: 110,
    milestoneLabel: 'Full maturity',
    growthStages: ['Seedling', 'Establishing', 'Bushing out', 'Mature'],
    wateringTip:
      'Oregano is drought-tolerant. Water only when the soil is completely dry — overwatering causes root rot.',
    tempTip:
      'Oregano thrives in warm, dry climates. It is cold-hardy once established and tolerates temperatures down to 20 °F.',
  },
  {
    id: 'dill',
    name: 'Dill',
    category: 'Herbs',
    optimalMoistureMin: 45,
    optimalMoistureMax: 65,
    optimalTempMin: 50,
    optimalTempMax: 77,
    daysToMilestoneMin: 40,
    daysToMilestoneMax: 60,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Seedling', 'Leafing', 'Harvest-ready'],
    wateringTip:
      'Water dill deeply once a week. Its long taproot dislikes frequent shallow watering.',
    tempTip:
      'Dill germinates best in cool soil (60–70 °F). Heat causes bolting — sow in cool seasons for leaf harvest.',
  },
  {
    id: 'sage',
    name: 'Sage',
    category: 'Herbs',
    optimalMoistureMin: 25,
    optimalMoistureMax: 50,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 75,
    daysToMilestoneMax: 100,
    milestoneLabel: 'Full maturity',
    growthStages: ['Seedling', 'Establishing', 'Bushing out', 'Mature'],
    wateringTip:
      'Sage prefers dry conditions. Water deeply once a week and allow soil to dry completely between sessions.',
    tempTip:
      'Sage is drought and heat tolerant once established. Protect from sustained freezes below 15 °F.',
  },

  // ── Fruits ───────────────────────────────────────────────────────────────────
  {
    id: 'strawberry',
    name: 'Strawberry',
    category: 'Fruits',
    optimalMoistureMin: 60,
    optimalMoistureMax: 80,
    optimalTempMin: 60,
    optimalTempMax: 80,
    daysToMilestoneMin: 60,
    daysToMilestoneMax: 90,
    milestoneLabel: 'Harvest',
    growthStages: ['Planting', 'Runner development', 'Flowering', 'Fruiting', 'Harvest'],
    wateringTip:
      'Strawberries need 1–1.5 inches of water per week. Water at the base to avoid botrytis on fruit.',
    tempTip:
      'Strawberries produce best between 60–80 °F. Frost can damage blossoms; use row covers if a cold snap threatens.',
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    category: 'Fruits',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 60,
    daysToMilestoneMax: 90,
    milestoneLabel: 'Harvest',
    growthStages: ['Dormant', 'Budbreak', 'Flowering', 'Berry set', 'Harvest'],
    wateringTip:
      'Blueberries have shallow roots and need consistent moisture. Drip irrigation or soaker hoses work best.',
    tempTip:
      'Blueberries require a cold dormancy period and perform best in moderate temperatures during the growing season.',
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    category: 'Fruits',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 70,
    optimalTempMax: 95,
    daysToMilestoneMin: 70,
    daysToMilestoneMax: 90,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Vegetative', 'Flowering', 'Fruit development', 'Harvest'],
    wateringTip:
      'Water deeply and infrequently. Reduce watering as fruit ripens — too much water dilutes sweetness.',
    tempTip:
      'Watermelons love heat. Soil temperature must be at least 70 °F for germination. Growth stalls below 60 °F.',
  },
  {
    id: 'cantaloupe',
    name: 'Cantaloupe',
    category: 'Fruits',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 65,
    optimalTempMax: 90,
    daysToMilestoneMin: 70,
    daysToMilestoneMax: 90,
    milestoneLabel: 'Harvest',
    growthStages: ['Germination', 'Vegetative', 'Flowering', 'Fruit development', 'Harvest'],
    wateringTip:
      'Water consistently during fruit development, then reduce as melons ripen. Taper off 1 week before harvest.',
    tempTip:
      'Cantaloupe needs warm conditions throughout its season. Cool nights below 55 °F slow fruit sugar development.',
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    category: 'Fruits',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 60,
    daysToMilestoneMax: 80,
    milestoneLabel: 'Harvest',
    growthStages: ['Dormant', 'Primocane growth', 'Flowering', 'Berry development', 'Harvest'],
    wateringTip:
      'Raspberries need about 1 inch of water per week. Mulch heavily to retain moisture and suppress weeds.',
    tempTip:
      'Raspberries prefer moderate temperatures. Extreme heat above 85 °F can cause sunscald on berries.',
  },
  {
    id: 'lemon',
    name: 'Lemon (container)',
    category: 'Fruits',
    optimalMoistureMin: 50,
    optimalMoistureMax: 70,
    optimalTempMin: 55,
    optimalTempMax: 85,
    daysToMilestoneMin: 180,
    daysToMilestoneMax: 270,
    milestoneLabel: 'Harvest',
    growthStages: ['Establishing', 'Vegetative', 'Flowering', 'Fruit set', 'Fruit development', 'Harvest'],
    wateringTip:
      'Water thoroughly, then allow the top 2 inches of soil to dry before watering again. Overwatering is the top killer.',
    tempTip:
      'Lemons are frost-sensitive. Bring container trees indoors when temperatures dip below 32 °F.',
  },
  {
    id: 'cherry-tomato',
    name: 'Cherry Tomato',
    category: 'Fruits',
    optimalMoistureMin: 60,
    optimalMoistureMax: 80,
    optimalTempMin: 65,
    optimalTempMax: 85,
    daysToMilestoneMin: 55,
    daysToMilestoneMax: 70,
    milestoneLabel: 'Harvest',
    growthStages: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
    wateringTip:
      'Water consistently to prevent blossom end rot and fruit cracking. Aim for 1–2 inches per week.',
    tempTip:
      'Cherry tomatoes are slightly more heat-tolerant than slicers but still prefer 65–85 °F for best fruit set.',
  },
  {
    id: 'fig',
    name: 'Fig (container)',
    category: 'Fruits',
    optimalMoistureMin: 40,
    optimalMoistureMax: 65,
    optimalTempMin: 60,
    optimalTempMax: 90,
    daysToMilestoneMin: 90,
    daysToMilestoneMax: 130,
    milestoneLabel: 'Harvest',
    growthStages: ['Dormant', 'Budbreak', 'Vegetative', 'Fruit development', 'Harvest'],
    wateringTip:
      'Figs in containers dry out quickly. Check soil daily in summer and water when the top 1–2 inches are dry.',
    tempTip:
      'Figs love heat and sun. They can handle brief dips to 20 °F but fruiting is best with consistent warmth.',
  },
  {
    id: 'grape',
    name: 'Grape (container)',
    category: 'Fruits',
    optimalMoistureMin: 40,
    optimalMoistureMax: 65,
    optimalTempMin: 60,
    optimalTempMax: 85,
    daysToMilestoneMin: 120,
    daysToMilestoneMax: 180,
    milestoneLabel: 'Harvest',
    growthStages: ['Dormant', 'Budbreak', 'Shoot growth', 'Flowering', 'Berry development', 'Harvest'],
    wateringTip:
      'Grapevines are somewhat drought-tolerant once established. Reduce watering after fruit set to concentrate sugars.',
    tempTip:
      'Grapes prefer warm, dry summers. Excessive humidity encourages fungal disease; ensure good air circulation.',
  },
  {
    id: 'blackberry',
    name: 'Blackberry',
    category: 'Fruits',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 55,
    daysToMilestoneMax: 75,
    milestoneLabel: 'Harvest',
    growthStages: ['Dormant', 'Primocane growth', 'Flowering', 'Berry development', 'Harvest'],
    wateringTip:
      'Blackberries need regular water during fruit development — about 1–2 inches per week. Drip irrigation is ideal.',
    tempTip:
      'Blackberries tolerate a wide range of temperatures but produce best in mild climates (55–80 °F in summer).',
  },

  // ── Houseplants ──────────────────────────────────────────────────────────────
  {
    id: 'pothos',
    name: 'Pothos',
    category: 'Houseplants',
    optimalMoistureMin: 40,
    optimalMoistureMax: 60,
    optimalTempMin: 60,
    optimalTempMax: 85,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Mature', 'Repot due'],
    wateringTip:
      'Allow the top 1–2 inches of soil to dry out before watering. Pothos tolerates drought better than overwatering.',
    tempTip:
      'Pothos thrives in typical indoor temperatures between 60–85 °F. Avoid cold drafts and temperatures below 50 °F.',
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    category: 'Houseplants',
    optimalMoistureMin: 20,
    optimalMoistureMax: 45,
    optimalTempMin: 60,
    optimalTempMax: 85,
    daysToMilestoneMin: 548,
    daysToMilestoneMax: 730,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Mature', 'Repot due'],
    wateringTip:
      'Snake plants store water in their leaves. Water every 2–8 weeks depending on season; less in winter.',
    tempTip:
      'Snake plants tolerate a wide temperature range. Avoid cold drafts and temperatures below 50 °F.',
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily',
    category: 'Houseplants',
    optimalMoistureMin: 50,
    optimalMoistureMax: 70,
    optimalTempMin: 65,
    optimalTempMax: 85,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Blooming', 'Repot due'],
    wateringTip:
      'Peace lilies will droop slightly when thirsty — use this as your cue. Water thoroughly, then allow top inch to dry.',
    tempTip:
      'Peace lilies prefer temperatures between 65–85 °F. Cold drafts and temperatures below 55 °F cause yellowing.',
  },
  {
    id: 'monstera',
    name: 'Monstera',
    category: 'Houseplants',
    optimalMoistureMin: 45,
    optimalMoistureMax: 65,
    optimalTempMin: 65,
    optimalTempMax: 85,
    daysToMilestoneMin: 548,
    daysToMilestoneMax: 730,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Fenestrating', 'Repot due'],
    wateringTip:
      'Water when the top 1–2 inches of soil are dry. Monsteras dislike sitting in wet soil; ensure drainage.',
    tempTip:
      'Monsteras prefer warm, humid conditions. They stop growing below 60 °F and suffer leaf damage below 50 °F.',
  },
  {
    id: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    category: 'Houseplants',
    optimalMoistureMin: 45,
    optimalMoistureMax: 65,
    optimalTempMin: 65,
    optimalTempMax: 85,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Mature', 'Repot due'],
    wateringTip:
      'Water when the top inch of soil is dry. Fiddle leaf figs are sensitive to overwatering and root rot.',
    tempTip:
      'Keep fiddle leaf figs above 55 °F and away from cold windows or AC vents. Consistent warmth promotes growth.',
  },
  {
    id: 'spider-plant',
    name: 'Spider Plant',
    category: 'Houseplants',
    optimalMoistureMin: 40,
    optimalMoistureMax: 65,
    optimalTempMin: 60,
    optimalTempMax: 80,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Producing pups', 'Repot due'],
    wateringTip:
      'Water moderately, allowing the soil to dry slightly between waterings. Brown tips indicate fluoride sensitivity — use filtered water.',
    tempTip:
      'Spider plants are adaptable but prefer 60–80 °F. They will stop producing spiderettes in cold conditions.',
  },
  {
    id: 'zz-plant',
    name: 'ZZ Plant',
    category: 'Houseplants',
    optimalMoistureMin: 20,
    optimalMoistureMax: 45,
    optimalTempMin: 60,
    optimalTempMax: 85,
    daysToMilestoneMin: 548,
    daysToMilestoneMax: 730,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Mature', 'Repot due'],
    wateringTip:
      'ZZ plants are extremely drought tolerant. Water every 2–4 weeks; the rhizomes store water as backup.',
    tempTip:
      'ZZ plants prefer normal indoor temperatures (60–85 °F). They slow growth below 60 °F and dislike frost.',
  },
  {
    id: 'rubber-plant',
    name: 'Rubber Plant',
    category: 'Houseplants',
    optimalMoistureMin: 40,
    optimalMoistureMax: 60,
    optimalTempMin: 60,
    optimalTempMax: 85,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Mature', 'Repot due'],
    wateringTip:
      'Water when the top inch of soil feels dry. Wipe leaves with a damp cloth to keep them dust-free for better light absorption.',
    tempTip:
      'Rubber plants prefer temperatures between 60–85 °F. Keep away from cold drafts and heating vents.',
  },
  {
    id: 'philodendron',
    name: 'Philodendron',
    category: 'Houseplants',
    optimalMoistureMin: 45,
    optimalMoistureMax: 65,
    optimalTempMin: 65,
    optimalTempMax: 85,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Mature', 'Repot due'],
    wateringTip:
      'Allow the top inch to dry between waterings. Yellow leaves usually indicate overwatering.',
    tempTip:
      'Philodendrons prefer warm indoor conditions. Growth slows below 60 °F; protect from cold drafts.',
  },
  {
    id: 'dracaena',
    name: 'Dracaena',
    category: 'Houseplants',
    optimalMoistureMin: 35,
    optimalMoistureMax: 55,
    optimalTempMin: 60,
    optimalTempMax: 80,
    daysToMilestoneMin: 548,
    daysToMilestoneMax: 730,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Mature', 'Repot due'],
    wateringTip:
      'Dracaenas are sensitive to fluoride. Water with filtered or distilled water, and let soil dry between sessions.',
    tempTip:
      'Dracaenas prefer temperatures between 60–80 °F. Cold temperatures below 55 °F cause leaf damage.',
  },

  // ── Succulents ───────────────────────────────────────────────────────────────
  {
    id: 'echeveria',
    name: 'Echeveria',
    category: 'Succulents',
    optimalMoistureMin: 10,
    optimalMoistureMax: 30,
    optimalTempMin: 60,
    optimalTempMax: 80,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Rosette filling', 'Repot due'],
    wateringTip:
      'Use the "soak and dry" method: water thoroughly, then wait until the soil is completely dry before watering again.',
    tempTip:
      'Echeverias prefer warm temperatures (60–80 °F) and full sun. They are not frost-hardy.',
  },
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    category: 'Succulents',
    optimalMoistureMin: 10,
    optimalMoistureMax: 30,
    optimalTempMin: 60,
    optimalTempMax: 80,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Mature', 'Repot due'],
    wateringTip:
      'Water aloe deeply but infrequently. Soggy soil leads to root rot quickly — ensure excellent drainage.',
    tempTip:
      'Aloe vera thrives in temperatures between 55–80 °F. Bring indoors if temperatures drop below 40 °F.',
  },
  {
    id: 'haworthia',
    name: 'Haworthia',
    category: 'Succulents',
    optimalMoistureMin: 15,
    optimalMoistureMax: 35,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Mature', 'Repot due'],
    wateringTip:
      'Haworthias need even less water in winter. Water sparingly year-round — every 2–3 weeks in summer.',
    tempTip:
      'Haworthias tolerate lower light than most succulents. They prefer 55–80 °F and are mildly frost-sensitive.',
  },
  {
    id: 'sedum',
    name: 'Sedum',
    category: 'Succulents',
    optimalMoistureMin: 10,
    optimalMoistureMax: 30,
    optimalTempMin: 50,
    optimalTempMax: 80,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Establishing', 'Growing', 'Budding', 'Peak bloom'],
    wateringTip:
      'Sedums are extremely drought tolerant. Water only when the soil is bone dry; they rot easily if overwatered.',
    tempTip:
      'Many sedums are cold-hardy and can handle freezing temperatures. They do best between 50–80 °F in the growing season.',
  },
  {
    id: 'jade-plant',
    name: 'Jade Plant',
    category: 'Succulents',
    optimalMoistureMin: 15,
    optimalMoistureMax: 35,
    optimalTempMin: 55,
    optimalTempMax: 75,
    daysToMilestoneMin: 548,
    daysToMilestoneMax: 730,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Branching', 'Repot due'],
    wateringTip:
      'Water jade plants thoroughly, then let the soil dry completely. In winter, water even less frequently.',
    tempTip:
      'Jade plants prefer 55–75 °F. They can initiate flowering if exposed to cool nights (around 55 °F) in fall.',
  },
  {
    id: 'cactus-barrel',
    name: 'Barrel Cactus',
    category: 'Succulents',
    optimalMoistureMin: 5,
    optimalMoistureMax: 20,
    optimalTempMin: 60,
    optimalTempMax: 90,
    daysToMilestoneMin: 548,
    daysToMilestoneMax: 1095,
    milestoneLabel: 'Full maturity',
    growthStages: ['Establishing', 'Growing', 'Mature'],
    wateringTip:
      'Water barrel cacti only every 2–4 weeks in summer, and stop almost entirely in winter. Less is always more.',
    tempTip:
      'Barrel cacti love heat. They can survive mild frosts but thrive between 60–90 °F.',
  },
  {
    id: 'sempervivum',
    name: 'Sempervivum (Hens & Chicks)',
    category: 'Succulents',
    optimalMoistureMin: 10,
    optimalMoistureMax: 30,
    optimalTempMin: 40,
    optimalTempMax: 80,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Establishing', 'Growing', 'Producing offsets', 'Peak bloom'],
    wateringTip:
      'Sempervivums are very drought tolerant. Water only when the soil is completely dry.',
    tempTip:
      'One of the hardiest succulents — sempervivums can survive temperatures as low as -30 °F when established.',
  },
  {
    id: 'agave',
    name: 'Agave',
    category: 'Succulents',
    optimalMoistureMin: 5,
    optimalMoistureMax: 25,
    optimalTempMin: 55,
    optimalTempMax: 90,
    daysToMilestoneMin: 548,
    daysToMilestoneMax: 1095,
    milestoneLabel: 'Full maturity',
    growthStages: ['Establishing', 'Growing', 'Mature'],
    wateringTip:
      'Water agaves only every 4–6 weeks in summer and barely at all in winter. They store water in their thick leaves.',
    tempTip:
      'Agaves thrive in hot, dry conditions. Most species tolerate light frost but dislike prolonged freezes.',
  },
  {
    id: 'christmas-cactus',
    name: 'Christmas Cactus',
    category: 'Succulents',
    optimalMoistureMin: 30,
    optimalMoistureMax: 50,
    optimalTempMin: 60,
    optimalTempMax: 80,
    daysToMilestoneMin: 300,
    daysToMilestoneMax: 365,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Establishing', 'Growing', 'Budding', 'Peak bloom'],
    wateringTip:
      'Water more regularly than most succulents — keep soil lightly moist during growth. Reduce water after flowering.',
    tempTip:
      'Cool night temperatures (50–55 °F) trigger budding. Avoid placing near heat vents which can cause bud drop.',
  },
  {
    id: 'gasteria',
    name: 'Gasteria',
    category: 'Succulents',
    optimalMoistureMin: 15,
    optimalMoistureMax: 35,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 365,
    daysToMilestoneMax: 548,
    milestoneLabel: 'Repot',
    growthStages: ['Establishing', 'Growing', 'Mature', 'Repot due'],
    wateringTip:
      'Gasterias are forgiving and tolerate irregular watering. Water every 2–4 weeks and let soil dry fully.',
    tempTip:
      'Gasterias prefer moderate temperatures (55–80 °F) and tolerate low light better than most succulents.',
  },

  // ── Flowers ──────────────────────────────────────────────────────────────────
  {
    id: 'sunflower',
    name: 'Sunflower',
    category: 'Flowers',
    optimalMoistureMin: 50,
    optimalMoistureMax: 70,
    optimalTempMin: 65,
    optimalTempMax: 90,
    daysToMilestoneMin: 70,
    daysToMilestoneMax: 100,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Germination', 'Seedling', 'Vegetative', 'Budding', 'Peak bloom'],
    wateringTip:
      'Water deeply once a week. Sunflowers are drought-tolerant once established but need regular water in early growth.',
    tempTip:
      'Sunflowers thrive in full sun and warm temperatures. They tolerate heat well but frost will kill them.',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    category: 'Flowers',
    optimalMoistureMin: 20,
    optimalMoistureMax: 45,
    optimalTempMin: 55,
    optimalTempMax: 80,
    daysToMilestoneMin: 90,
    daysToMilestoneMax: 120,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Seedling', 'Establishing', 'Vegetative', 'Budding', 'Peak bloom'],
    wateringTip:
      'Lavender is drought-tolerant. Overwatering is the number one cause of failure — water only when soil is dry.',
    tempTip:
      'Lavender prefers warm days and cool nights. It is cold-hardy to about 10 °F once established.',
  },
  {
    id: 'marigold',
    name: 'Marigold',
    category: 'Flowers',
    optimalMoistureMin: 45,
    optimalMoistureMax: 65,
    optimalTempMin: 60,
    optimalTempMax: 90,
    daysToMilestoneMin: 45,
    daysToMilestoneMax: 65,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Germination', 'Seedling', 'Vegetative', 'Budding', 'Peak bloom'],
    wateringTip:
      'Marigolds prefer to dry out slightly between waterings. Overhead watering promotes botrytis — water at soil level.',
    tempTip:
      'Marigolds tolerate heat well but are frost-sensitive. Plant after the last frost date for best results.',
  },
  {
    id: 'rose',
    name: 'Rose',
    category: 'Flowers',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 60,
    optimalTempMax: 85,
    daysToMilestoneMin: 60,
    daysToMilestoneMax: 90,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Dormant', 'Budbreak', 'Vegetative', 'Budding', 'Peak bloom'],
    wateringTip:
      'Water roses deeply (1–2 inches per week) at the base. Wet foliage promotes black spot and powdery mildew.',
    tempTip:
      'Roses bloom best between 60–85 °F. Extreme heat causes smaller blooms; they go dormant in cold winters.',
  },
  {
    id: 'petunia',
    name: 'Petunia',
    category: 'Flowers',
    optimalMoistureMin: 50,
    optimalMoistureMax: 70,
    optimalTempMin: 60,
    optimalTempMax: 85,
    daysToMilestoneMin: 50,
    daysToMilestoneMax: 70,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Seedling', 'Vegetative', 'Budding', 'Peak bloom'],
    wateringTip:
      'Petunias in containers may need daily watering. Water thoroughly when the top inch is dry.',
    tempTip:
      'Petunias bloom best in warm weather (60–85 °F). They wilt in heat above 90 °F and are frost-sensitive.',
  },
  {
    id: 'zinnia',
    name: 'Zinnia',
    category: 'Flowers',
    optimalMoistureMin: 45,
    optimalMoistureMax: 65,
    optimalTempMin: 65,
    optimalTempMax: 90,
    daysToMilestoneMin: 50,
    daysToMilestoneMax: 70,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Germination', 'Seedling', 'Vegetative', 'Budding', 'Peak bloom'],
    wateringTip:
      'Zinnias are fairly drought-tolerant but flower better with regular water. Always water at the base to prevent powdery mildew.',
    tempTip:
      'Zinnias love heat and full sun. They thrive above 65 °F and are killed by frost.',
  },
  {
    id: 'dahlia',
    name: 'Dahlia',
    category: 'Flowers',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 60,
    optimalTempMax: 80,
    daysToMilestoneMin: 90,
    daysToMilestoneMax: 120,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Tuber dormancy', 'Sprouting', 'Vegetative', 'Budding', 'Peak bloom'],
    wateringTip:
      'Do not water dahlia tubers until shoots appear. Once growing, water deeply 2–3 times per week.',
    tempTip:
      'Dahlias prefer moderate temperatures (60–80 °F). Tubers must be dug up and stored before hard frost.',
  },
  {
    id: 'pansy',
    name: 'Pansy',
    category: 'Flowers',
    optimalMoistureMin: 50,
    optimalMoistureMax: 70,
    optimalTempMin: 45,
    optimalTempMax: 65,
    daysToMilestoneMin: 45,
    daysToMilestoneMax: 65,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Seedling', 'Vegetative', 'Budding', 'Peak bloom'],
    wateringTip:
      'Keep pansies evenly moist. They wilt quickly in dry conditions, especially in containers.',
    tempTip:
      'Pansies are cool-season flowers that bloom best between 45–65 °F. They tolerate light frost but wilt in summer heat.',
  },
  {
    id: 'geranium',
    name: 'Geranium',
    category: 'Flowers',
    optimalMoistureMin: 40,
    optimalMoistureMax: 65,
    optimalTempMin: 60,
    optimalTempMax: 80,
    daysToMilestoneMin: 50,
    daysToMilestoneMax: 75,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Seedling', 'Vegetative', 'Budding', 'Peak bloom'],
    wateringTip:
      'Allow the top inch of soil to dry out between waterings. Geraniums are prone to root rot from overwatering.',
    tempTip:
      'Geraniums bloom profusely between 60–80 °F. They are frost-sensitive and should be overwintered indoors.',
  },
  {
    id: 'impatiens',
    name: 'Impatiens',
    category: 'Flowers',
    optimalMoistureMin: 55,
    optimalMoistureMax: 75,
    optimalTempMin: 60,
    optimalTempMax: 80,
    daysToMilestoneMin: 40,
    daysToMilestoneMax: 60,
    milestoneLabel: 'Peak bloom',
    growthStages: ['Seedling', 'Vegetative', 'Budding', 'Peak bloom'],
    wateringTip:
      'Impatiens wilt quickly when dry. Keep soil consistently moist, especially during hot weather.',
    tempTip:
      'Impatiens prefer mild temperatures (60–80 °F) and shade in hot climates. Frost kills them immediately.',
  },
];

export function getPlantById(id: string): Plant | undefined {
  return plants.find((p) => p.id === id);
}

export const CATEGORIES = [
  'All',
  'Vegetables',
  'Herbs',
  'Fruits',
  'Houseplants',
  'Succulents',
  'Flowers',
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];
