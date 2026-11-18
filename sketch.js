// ============================================================
// DARWIN'S FINCH EVOLUTION SIMULATION
// BIOL 212L
//
// Five activities:
// 1. Rainfall and natural selection
// 2. Heritability
// 3. Variation
// 4. Island size and stochasticity
// 5. Design an experiment
//
// This is a teaching model, not a literal reconstruction
// of the genetics of Geospiza fortis.
// ============================================================


// ============================================================
// GLOBAL SETTINGS
// ============================================================

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 850;

const BEAK_MIN = 5;
const BEAK_MAX = 13;

const DEFAULT_POPULATION = 1000;
const DEFAULT_CARRYING_CAPACITY = 1000;

const DEFAULT_SD = 0.825;
const DEFAULT_MEAN = 9.5;
const DEFAULT_HERITABILITY = 0.76;

const SELECTION_STRENGTH = 1.5;

const RAINFALL_LEVELS = [15, 35, 55, 75, 95];


// ============================================================
// SEED DISTRIBUTIONS
// ============================================================

const SEED_DISTRIBUTIONS = {

  15: {
    hard: 0.80,
    medium: 0.15,
    soft: 0.05
  },

  35: {
    hard: 0.60,
    medium: 0.30,
    soft: 0.10
  },

  55: {
    hard: 0.20,
    medium: 0.60,
    soft: 0.20
  },

  75: {
    hard: 0.10,
    medium: 0.35,
    soft: 0.55
  },

  95: {
    hard: 0.05,
    medium: 0.15,
    soft: 0.80
  }

};


// ============================================================
// BEAK DEPTH OPTIMA
// ============================================================

const SEED_OPTIMA = {

  hard: 11.0,
  medium: 9.0,
  soft: 7.0

};


// ============================================================
// SIMULATION STATE
// ============================================================

let activity = 1;

let rainfall = 55;

let generation = 0;

let running = false;


// Activity 1
let population = [];
let population2 = [];

let activity1S1 = 0;
let activity1R1 = 0;
let activity1PredictedR1 = 0;

let activity1S2 = 0;
let activity1R2 = 0;
let activity1PredictedR2 = 0;


// Activity 2
let islandA = [];
let islandB = [];


// Activity 3
let variationPopulation = [];


// Activity 4
let largeIsland = [];
let smallIsland = [];


// Activity 5
let experimentPopulation = [];


// ============================================================
// ACTIVITY PARAMETERS
// ============================================================

// Activity 1

let activity1Mean = 9.5;
let activity1SmallMean = 8.0;
let activity1LargeMean = 10.5;
let activity1SD = 0.825;
let activity1Heritability = 0.76;
let activity1Capacity = 1000;


// Activity 2

let islandAHeritability = 0.4;
let islandBHeritability = 0.9;

let activity2Mean = 9.5;
let activity2SD = 0.825;
let activity2Capacity = 1000;


// Activity 3

let lowVariationSD = 0.2;
let highVariationSD = 1.8;

let selectedVariationSD = lowVariationSD;

let activity3Mean = 11.0;
let activity3Heritability = 0.76;
let activity3Capacity = 1000;


// Activity 4

let largeCapacity = 1000;
let smallCapacity = 100;

let activity4Mean = 9.5;
let activity4SD = 0.825;
let activity4Heritability = 0.76;


// Activity 4 replicate system

let activity4LargeResults = [];
let activity4SmallResults = [];

const ACTIVITY4_REPLICATES = 10;
const ACTIVITY4_GENERATIONS = 10;

let activity4ReplicateRunning = false;
let activity4CurrentReplicate = 0;
let activity4CurrentGeneration = 0;

let activity4ReplicateLarge = [];
let activity4ReplicateSmall = [];


// Activity 5

let experimentMean = 9.0;
let experimentSD = 1.0;
let experimentHeritability = 0.76;
let experimentCapacity = 1000;


// ============================================================
// STATISTICS
// ============================================================

let currentS = 0;
let currentR = 0;
let predictedR = 0;


// ============================================================
// P5 SETUP
// ============================================================

function setup() {

  createCanvas(
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  textFont("Arial");

  resetCurrentActivity();

}


// ============================================================
// MAIN DRAW LOOP
// ============================================================

function draw() {

  background(248);

  drawHeader();

  drawActivityTabs();


  if (activity === 1) {

    drawActivity1();

  } else if (activity === 2) {

    drawActivity2();

  } else if (activity === 3) {

    drawActivity3();

  } else if (activity === 4) {

    drawActivity4();

  } else if (activity === 5) {

    drawActivity5();

  }


  // Normal continuous simulation

  if (running) {

    runGenerationForCurrentActivity();

  }


  // Activity 4 replicate simulations

  if (activity4ReplicateRunning) {

    runActivity4ReplicateStep();

  }

}


// ============================================================
// HEADER
// ============================================================

function drawHeader() {

  fill(30);

  textSize(25);

  textStyle(BOLD);

  text(
    "Darwin's Finch Evolution Simulation",
    30,
    35
  );

  textStyle(NORMAL);

}


// ============================================================
// ACTIVITY TABS
// ============================================================

function drawActivityTabs() {

  let labels = [

    "1  Rainfall & Selection",
    "2  Heritability",
    "3  Variation",
    "4  Island Size",
    "5  Design an Experiment"

  ];


  let x = 30;


  for (let i = 0; i < labels.length; i++) {

    let w = 205;


    if (i + 1 === activity) {

      fill(70, 120, 180);

    } else {

      fill(210);

    }


    rect(
      x,
      55,
      w,
      35,
      6
    );


    fill(30);

    textSize(13);

    textAlign(
      CENTER,
      CENTER
    );

    text(
      labels[i],
      x + w / 2,
      72
    );

    textAlign(
      LEFT,
      BASELINE
    );


    x += w + 8;

  }

}


// ============================================================
// ACTIVITY 1
// ============================================================

function drawActivity1() {

  drawActivityTitle(
    "Activity 1: Rainfall and Natural Selection",
    "Do different starting populations converge under the same environmental conditions?"
  );


  drawRainfallControls(
    30,
    175
  );


  drawPopulationPanel(
    population,
    30,
    230,
    560,
    170,
    "Small-start population (8.0 mm starting mean beak depth)"
  );


  drawPopulationPanel(
    population2,
    30,
    405,
    560,
    170,
    "Large-start population (10.5 mm starting mean beak depth)"
  );


  drawFitnessGraph(
    620,
    230,
    530,
    300
  );


  drawSeedDistribution(
    30,
    615,
    300,
    180
  );


  drawStatisticsBox(
    350,
    615,
    380,
    180,
    population,
    activity1Heritability
  );


  drawControls(
    760,
    615,
    390,
    180
  );


  drawActivityInstructions(
    30,
    815,
    1120,
    65,
    "Choose a rainfall level. Run generations one at a time or continuously. Compare how the two starting populations change under the same environmental conditions."
  );

}


// ============================================================
// ACTIVITY 2
// ============================================================

function drawActivity2() {

  drawActivityTitle(
    "Activity 2: Heritability",
    "How does heritability affect the rate of evolutionary change?"
  );


  drawRainfallControls(
    30,
    205
  );


  drawPopulationPanel(
    islandA,
    30,
    230,
    545,
    280,
    "Island A   h² = " +
    islandAHeritability.toFixed(2)
  );


  drawPopulationPanel(
    islandB,
    600,
    230,
    545,
    280,
    "Island B   h² = " +
    islandBHeritability.toFixed(2)
  );


  drawComparisonStatistics();


  drawControls(
    760,
    555,
    390,
    180
  );


  drawActivityInstructions(
    30,
    760,
    1120,
    65,
    "Both islands experience the same environment and begin with the same distribution. Compare how quickly their beak distributions respond when heritability differs."
  );

}


// ============================================================
// ACTIVITY 3
// ============================================================

function drawActivity3() {

  drawActivityTitle(
    "Activity 3: Variation",
    "How does the amount of variation affect evolutionary change?"
  );


  drawPopulationPanel(
    variationPopulation,
    30,
    230,
    560,
    300,
    "Population Mean = " +
    calculateMean(
      variationPopulation
    ).toFixed(2) +
    " mm   N = " +
    variationPopulation.length
  );


  drawFitnessGraph(
    620,
    230,
    530,
    300
  );


  drawVariationControls();


  drawControls(
    760,
    555,
    390,
    180
  );


  drawActivityInstructions(
    30,
    760,
    1120,
    65,
    "Compare populations with different amounts of phenotypic variation. Begin away from the environmental optimum and observe whether selection can produce evolutionary change."
  );

}


// ============================================================
// ACTIVITY 4
// ============================================================

function drawActivity4() {

  drawActivityTitle(
    "Activity 4: Island Size and Stochasticity",
    "Why can identical populations follow different evolutionary paths?"
  );


  drawPopulationPanel(
    largeIsland,
    30,
    230,
    545,
    280,
    "Large Island   N = " +
    largeIsland.length
  );


  drawPopulationPanel(
    smallIsland,
    600,
    230,
    545,
    280,
    "Small Island   N = " +
    smallIsland.length
  );


  drawActivity4Results();


  drawControls(
    760,
    555,
    390,
    180
  );


  drawActivityInstructions(
    30,
    760,
    1120,
    65,
    "Run the same experiment repeatedly. Compare the spread of final outcomes for large and small populations."
  );

}


// ============================================================
// ACTIVITY 5
// ============================================================

function drawActivity5() {

  drawActivityTitle(
    "Activity 5: Design an Experiment",
    "Choose your starting population and rainfall. Predict what will happen, then test your prediction."
  );


  // Rainfall controls

  drawRainfallControls(
    30,
    175
  );


  drawPopulationPanel(
    experimentPopulation,
    30,
    230,
    560,
    300,
    "Your Population   N = " +
    experimentPopulation.length +
  "   Mean = " +
  calculateMean(experimentPopulation).toFixed(2) +
  " mm"
  );


  drawFitnessGraph(
    620,
    230,
    530,
    300
  );


  drawExperimentControls();


  drawControls(
    760,
    555,
    390,
    180
  );


  drawActivityInstructions(
    30,
    760,
    1120,
    65,
    "Design an experiment by choosing the starting mean, variation, heritability, population size, and rainfall. Predict the direction and amount of evolutionary change before running the simulation."
  );

}


// ============================================================
// ACTIVITY TITLES
// ============================================================

function drawActivityTitle(
  title,
  subtitle
) {

  fill(30);

  textSize(20);

  textStyle(BOLD);

  text(
    title,
    30,
    120
  );

  textStyle(NORMAL);

  textSize(14);

  fill(80);

  text(
    subtitle,
    30,
    140
  );

}


// ============================================================
// RAINFALL CONTROLS
// ============================================================

function drawRainfallControls(
  x,
  y
) {

  fill(40);

  textSize(15);

  text(
    "Rainfall:",
    x,
    y
  );


  for (
    let i = 0;
    i < RAINFALL_LEVELS.length;
    i++
  ) {

    let r =
      RAINFALL_LEVELS[i];

    let bx =
      x + 90 + i * 85;


    if (r === rainfall) {

      fill(70, 120, 180);

    } else {

      fill(215);

    }


    rect(
      bx,
      y - 20,
      70,
      32,
      5
    );


    fill(30);

    textAlign(
      CENTER,
      CENTER
    );

    text(
      r + " cm",
      bx + 35,
      y - 4
    );

    textAlign(
      LEFT,
      BASELINE
    );

  }

}


// ============================================================
// POPULATION PANEL
// ============================================================

function drawPopulationPanel(
  pop,
  x,
  y,
  w,
  h,
  title
) {

  stroke(190);

  fill(255);

  rect(
    x,
    y,
    w,
    h,
    8
  );

  noStroke();

  fill(30);

  textSize(16);

  textStyle(BOLD);

  text(
    title,
    x + 15,
    y + 25
  );

  textStyle(NORMAL);


  if (pop.length === 0) {

    fill(170, 40, 40);

    textSize(18);

    text(
      "Population extinct",
      x + 20,
      y + h / 2
    );

    return;

  }


  drawHistogram(
    pop,
    x + 15,
    y + 45,
    w - 30,
    h - 65
  );

}


// ============================================================
// HISTOGRAM
// ============================================================

function drawHistogram(
  pop,
  x,
  y,
  w,
  h
) {

  let bins = 32;

  let counts = new Array(bins).fill(0);

  for (let beak of pop) {
    let index = floor(
      map(beak, BEAK_MIN, BEAK_MAX, 0, bins)
    );

    index = constrain(index, 0, bins - 1);
    counts[index]++;
  }

  // Only Activity 3 uses a fixed vertical scale.
  let showYAxis = (activity === 3);
  let maxCount = showYAxis ? 600 : max(counts);

  // Axes
  stroke(170);

  line(x, y + h, x + w, y + h);
  line(x, y, x, y + h);

  // Numbered y-axis for Activity 3 only
  if (showYAxis) {
    fill(70);
    noStroke();
    textSize(10);
    textAlign(LEFT, CENTER);

    for (let value = 0; value <= 600; value += 50) {
      let tickY =
        y + h - map(value, 0, 600, 0, h - 10);

      // Place numbers just inside the left edge
      text(value, x + 4, tickY);

      // Draw subtle horizontal gridlines
      stroke(220);
      line(x + 30, tickY, x + w, tickY);
      noStroke();
    }

    textAlign(LEFT, BASELINE);
  }
  // Histogram bars
  noStroke();
  fill(90, 130, 180);

  for (let i = 0; i < bins; i++) {
    let barWidth = w / bins;

    let barHeight = 0;

    if (maxCount > 0) {
      barHeight = map(
        counts[i],
        0,
        maxCount,
        0,
        h - 10
      );
    }

    rect(
      x + i * barWidth,
      y + h - barHeight,
      barWidth - 1,
      barHeight
    );
  }

  // Beak-depth labels
  fill(70);
  textSize(11);
  textAlign(LEFT, BASELINE);

  text(BEAK_MIN + " mm", x, y + h + 15);
  text(BEAK_MAX + " mm", x + w - 35, y + h + 15);

  // Mean indicator
  let meanValue = calculateMean(pop);

  let meanX = map(
    meanValue,
    BEAK_MIN,
    BEAK_MAX,
    x,
    x + w
  );

  stroke(180, 50, 50);
  strokeWeight(2);
  line(meanX, y, meanX, y + h);

  strokeWeight(1);
  noStroke();
}

// ============================================================
// FITNESS GRAPH
// ============================================================

function drawFitnessGraph(
  x,
  y,
  w,
  h
) {

  stroke(190);

  fill(255);

  rect(
    x,
    y,
    w,
    h,
    8
  );

  noStroke();

  fill(30);

  textSize(16);

  textStyle(BOLD);

  text(
    "Fitness landscape",
    x + 15,
    y + 25
  );

  textStyle(NORMAL);


  let graphX =
    x + 45;

  let graphY =
    y + 45;

  let graphW =
    w - 70;

  let graphH =
    h - 75;


  stroke(170);

  line(
    graphX,
    graphY + graphH,
    graphX + graphW,
    graphY + graphH
  );

  line(
    graphX,
    graphY,
    graphX,
    graphY + graphH
  );


  noFill();

  stroke(60, 110, 160);

  strokeWeight(2);

  beginShape();


  for (
    let i = 0;
    i <= 200;
    i++
  ) {

    let beak =
      map(
        i,
        0,
        200,
        BEAK_MIN,
        BEAK_MAX
      );


    let f =
      fitness(beak);


    let px =
      map(
        beak,
        BEAK_MIN,
        BEAK_MAX,
        graphX,
        graphX + graphW
      );


    let py =
      map(
        f,
        0,
        1,
        graphY + graphH,
        graphY
      );


    vertex(
      px,
      py
    );

  }


  endShape();


    let optimum = getFoodOptimum();

  if (activity === 3) {
    optimum = 9.0;
  } else if (activity !== 5) {

    if (rainfall === 15) optimum = 11.0;
    if (rainfall === 35) optimum = 10.0;
    if (rainfall === 55) optimum = 9.0;
    if (rainfall === 75) optimum = 8.0;
    if (rainfall === 95) optimum = 7.0;

  }


  let optimumX =
    map(
      optimum,
      BEAK_MIN,
      BEAK_MAX,
      graphX,
      graphX + graphW
    );


  stroke(180, 60, 60);

  drawingContext.setLineDash(
    [5, 5]
  );


  line(
    optimumX,
    graphY,
    optimumX,
    graphY + graphH
  );


  drawingContext.setLineDash(
    []
  );


  noStroke();

  fill(70);

  textSize(11);

  text(
    "Beak depth (mm)",
    graphX + 80,
    graphY + graphH + 30
  );


  push();

  translate(
    graphX - 30,
    graphY + graphH / 2
  );

  rotate(-HALF_PI);

  text(
    "Relative fitness",
    0,
    0
  );

  pop();


  fill(180, 60, 60);

  text(
    "Optimal Beak Depth: " +
    optimum.toFixed(1) +
    " mm",
    graphX + 10,
    graphY + 15
  );

}


// ============================================================
// SEED DISTRIBUTION
// ============================================================

function drawSeedDistribution(
  x,
  y,
  w,
  h
) {

  stroke(190);

  fill(255);

  rect(
    x,
    y,
    w,
    h,
    8
  );

  noStroke();

  fill(30);

  textSize(15);

  textStyle(BOLD);

  text(
    "Seeds",
    x + 15,
    y + 25
  );

  textStyle(NORMAL);


  let seeds =
    getSeedDistribution();


  let values = [

    seeds.hard,
    seeds.medium,
    seeds.soft

  ];


  let labels = [

    "Hard",
    "Medium",
    "Soft"

  ];


  for (
    let i = 0;
    i < 3;
    i++
  ) {

    let yy =
      y + 50 + i * 38;


    fill(215);

    rect(
      x + 15,
      yy,
      190,
      20,
      4
    );


    fill(90, 130, 180);

    rect(
      x + 15,
      yy,
      190 * values[i],
      20,
      4
    );


    fill(30);

    textSize(12);

    text(
      labels[i] +
      "  " +
      round(values[i] * 100) +
      "%",
      x + 215,
      yy + 15
    );

  }

}


// ============================================================
// STATISTICS BOX
// ============================================================

function drawStatisticsBox(
  x,
  y,
  w,
  h,
  pop,
  h2
) {

  stroke(190);

  fill(255);

  rect(
    x,
    y,
    w,
    h,
    8
  );

  noStroke();

  fill(30);

  textSize(15);

  textStyle(BOLD);

  text(
    "Evolutionary statistics",
    x + 15,
    y + 25
  );

  textStyle(NORMAL);

  textSize(12);


  let mean1 =
    population.length > 0
      ? calculateMean(population)
      : 0;


  let mean2 =
    population2.length > 0
      ? calculateMean(population2)
      : 0;


  text(
    "Generation: " +
    generation,
    x + 15,
    y + 50
  );


  textStyle(BOLD);

  text(
    "Small-start population",
    x + 15,
    y + 75
  );

  textStyle(NORMAL);

  text(
    "Mean: " +
    mean1.toFixed(2) +
    " mm",
    x + 15,
    y + 94
  );


  text(
    "S: " +
    activity1S1.toFixed(3) +
    "   R: " +
    activity1R1.toFixed(3),
    x + 15,
    y + 113
  );


  textStyle(BOLD);

  text(
    "Large-start population",
    x + 190,
    y + 75
  );

  textStyle(NORMAL);

  text(
    "Mean: " +
    mean2.toFixed(2) +
    " mm",
    x + 190,
    y + 94
  );


  text(
    "S: " +
    activity1S2.toFixed(3) +
    "   R: " +
    activity1R2.toFixed(3),
    x + 190,
    y + 113
  );


  fill(80);

  textSize(11);

  text(
    "Predicted R = h²S",
    x + 15,
    y + 145
  );


  text(
    "Small: " +
    activity1PredictedR1.toFixed(3),
    x + 15,
    y + 163
  );


  text(
    "Large: " +
    activity1PredictedR2.toFixed(3),
    x + 190,
    y + 163
  );

}


// ============================================================
// ACTIVITY 2 STATISTICS
// ============================================================

function drawComparisonStatistics() {

  stroke(190);

  fill(255);

  rect(
    30,
    555,
    700,
    180,
    8
  );

  noStroke();

  fill(30);

  textSize(15);

  textStyle(BOLD);


  if (activity === 2) {

    text(
      "Compare the two populations",
      45,
      580
    );

  } else {

    text(
      "Current simulation",
      45,
      580
    );

  }


  textStyle(NORMAL);

  textSize(13);


  if (activity === 2) {

    let meanA =
      islandA.length > 0
        ? calculateMean(islandA)
        : 0;


    let meanB =
      islandB.length > 0
        ? calculateMean(islandB)
        : 0;


    text(
      "Generation: " +
      generation,
      45,
      610
    );


    text(
      "Island A mean: " +
      meanA.toFixed(2) +
      " mm",
      45,
      640
    );


    text(
      "Island B mean: " +
      meanB.toFixed(2) +
      " mm",
      45,
      665
    );


    text(
      "Difference in means: " +
      abs(meanA - meanB).toFixed(2) +
      " mm",
      45,
      690
    );


    text(
      "Both islands experience the same rainfall: " +
      rainfall +
      " cm",
      330,
      640
    );

  }

}


// ============================================================
// ACTIVITY 4 RESULTS
// ============================================================

function drawActivity4Results() {

  stroke(190);

  fill(255);

  rect(
    30,
    555,
    700,
    180,
    8
  );

  noStroke();

  fill(30);

  textSize(15);

  textStyle(BOLD);

   text(
    "Results from 10 repeated experiments",
    45,
    580
  );

  textStyle(NORMAL);

  textSize(12);


  if (
    activity4ReplicateRunning
  ) {

    text(
      "Running replicate " +
      (activity4CurrentReplicate + 1) +
      " of " +
      ACTIVITY4_REPLICATES +
      "   Generation " +
      activity4CurrentGeneration +
      " of " +
      ACTIVITY4_GENERATIONS,
      45,
      605
    );

  } else if (
    activity4LargeResults.length === 0
  ) {

    text(
      "Click \"Run 10 replicates\" to compare repeated outcomes.",
      45,
      610
    );

  } else {

    text(
      "Each dot = final mean beak depth from one replicate",
      45,
      605
    );

    text(
      "Compare the spread of dots between large and small populations.",
      45,
      620
    );

  }


  let plotX = 45;
  let plotY = 615;
  let plotW = 650;
  let plotH = 105;


  stroke(210);

  line(
    plotX,
    plotY + plotH,
    plotX + plotW,
    plotY + plotH
  );


  // Scale the graph around the actual replicate results

  let allResults =
    activity4LargeResults.concat(
      activity4SmallResults
    );


  let plotMin = 8.5;
  let plotMax = 9.7;


  if (allResults.length > 0) {

    let dataMin = min(allResults);
    let dataMax = max(allResults);

    let padding = 0.05;


    plotMin =
      floor(
        (dataMin - padding) * 10
      ) / 10;


    plotMax =
      ceil(
        (dataMax + padding) * 10
      ) / 10;


    if (plotMax - plotMin < 0.4) {

      let center =
        (plotMin + plotMax) / 2;


      plotMin =
        floor(
          (center - 0.2) * 10
        ) / 10;


      plotMax =
        ceil(
          (center + 0.2) * 10
        ) / 10;

    }

  }


  noStroke();

  fill(80);

  textSize(10);


  text(
    plotMin.toFixed(1),
    plotX,
    plotY + plotH + 14
  );


  text(
    (
      (plotMin + plotMax) / 2
    ).toFixed(1),
    plotX + plotW / 2 - 10,
    plotY + plotH + 14
  );


  text(
    plotMax.toFixed(1),
    plotX + plotW - 18,
    plotY + plotH + 14
  );


  textAlign(CENTER, BASELINE);

  text(
    "Final mean beak depth (mm)",
    plotX + plotW / 2,
    plotY + plotH + 30
  );

  textAlign(LEFT, BASELINE);


  fill(70);

  textSize(11);


  text(
    "Large",
    plotX,
    plotY + 29
  );


  text(
    "Small",
    plotX,
    plotY + 79
  );


  // Large population replicate dots

  for (
    let i = 0;
    i < activity4LargeResults.length;
    i++
  ) {

    let value =
      activity4LargeResults[i];


    let px =
      map(
        value,
        plotMin,
        plotMax,
        plotX + 60,
        plotX + plotW
      );


    fill(70, 120, 180);

    noStroke();

    circle(
      px,
      plotY + 25,
      12
    );

  }


  // Small population replicate dots

  for (
    let i = 0;
    i < activity4SmallResults.length;
    i++
  ) {

    let value =
      activity4SmallResults[i];


    let px =
      map(
        value,
        plotMin,
        plotMax,
        plotX + 60,
        plotX + plotW
      );


    fill(180, 100, 80);

    noStroke();

    circle(
      px,
      plotY + 75,
      12
    );

  }


  if (
    activity4LargeResults.length > 0 &&
    !activity4ReplicateRunning
  ) {

    let largeMean =
      calculateMean(
        activity4LargeResults
      );


    let smallMean =
      calculateMean(
        activity4SmallResults
      );


    fill(70);

    textSize(11);


    text(
      "Large island mean = " +
      largeMean.toFixed(2) +
      " mm",
      500,
      610
    );


    text(
      "Small island mean = " +
      smallMean.toFixed(2) +
      " mm",
      500,
      625
    );

  }

}


// ============================================================
// VARIATION CONTROLS
// ============================================================

function drawVariationControls() {

  stroke(190);

  fill(255);

  rect(
    30,
    555,
    700,
    180,
    8
  );

  noStroke();

  fill(30);

  textSize(15);

  textStyle(BOLD);

  text(
    "Variation",
    45,
    580
  );

  textStyle(NORMAL);

  textSize(13);


  text(
    "Low variation: SD = " +
    lowVariationSD,
    45,
    615
  );


  text(
    "High variation: SD = " +
    highVariationSD,
    45,
    645
  );


  text(
    "Current population SD: " +
    currentPopulationSD().toFixed(2),
    45,
    675
  );


   if (selectedVariationSD === lowVariationSD) {

    fill(70, 120, 180);

  } else {

    fill(215);

  }

  rect(
    300,
    600,
    150,
    32,
    5
  );


  if (selectedVariationSD === highVariationSD) {

    fill(70, 120, 180);

  } else {

    fill(215);

  }

  rect(
    470,
    600,
    150,
    32,
    5
  );


  fill(30);

  textAlign(
    CENTER,
    CENTER
  );


  text(
    "Low variation",
    375,
    616
  );


  text(
    "High variation",
    545,
    616
  );


  textAlign(
    LEFT,
    BASELINE
  );

}


// ============================================================
// EXPERIMENT CONTROLS
// ============================================================

function drawExperimentControls() {

  stroke(190);

  fill(255);

  rect(
    30,
    555,
    700,
    180,
    8
  );

  noStroke();

  fill(30);

  textSize(15);

  textStyle(BOLD);

  text(
    "Choose your experimental conditions",
    45,
    580
  );

  textStyle(NORMAL);


  // Starting mean

  fill(50);

  textSize(12);

  text(
    "Starting mean:",
    45,
    605
  );


  let meanOptions = [
    7.0,
    9.0,
    10.5,
    12.0
  ];


  for (
    let i = 0;
    i < meanOptions.length;
    i++
  ) {

    let bx =
      130 + i * 75;


    if (
      experimentMean ===
      meanOptions[i]
    ) {

      fill(70, 120, 180);

    } else {

      fill(220);

    }


    rect(
      bx,
      590,
      65,
      25,
      4
    );


    fill(30);

    textAlign(
      CENTER,
      CENTER
    );

    text(
      meanOptions[i].toFixed(1) +
      " mm",
      bx + 32.5,
      602
    );

  }


  // Starting SD

  textAlign(
    LEFT,
    BASELINE
  );

  fill(50);

  text(
    "SD:",
    45,
    635
  );


  let sdOptions = [
    0.25,
    0.50,
    1.00,
    1.50
  ];


  for (
    let i = 0;
    i < sdOptions.length;
    i++
  ) {

    let bx =
      130 + i * 75;


    if (
      experimentSD ===
      sdOptions[i]
    ) {

      fill(70, 120, 180);

    } else {

      fill(220);

    }


    rect(
      bx,
      620,
      65,
      25,
      4
    );


    fill(30);

    textAlign(
      CENTER,
      CENTER
    );

    text(
      sdOptions[i].toFixed(2),
      bx + 32.5,
      632
    );

  }


  // Heritability

  textAlign(
    LEFT,
    BASELINE
  );

  fill(50);

  text(
    "Heritability:",
    45,
    665
  );


  let hOptions = [
    0.25,
    0.50,
    0.76,
    0.90
  ];


  for (
    let i = 0;
    i < hOptions.length;
    i++
  ) {

    let bx =
      130 + i * 75;


    if (
      experimentHeritability ===
      hOptions[i]
    ) {

      fill(70, 120, 180);

    } else {

      fill(220);

    }


    rect(
      bx,
      650,
      65,
      25,
      4
    );


    fill(30);

    textAlign(
      CENTER,
      CENTER
    );

    text(
      hOptions[i].toFixed(2),
      bx + 32.5,
      662
    );

  }


  // Population size

  textAlign(
    LEFT,
    BASELINE
  );

  fill(50);

  text(
    "Population:",
    430,
    605
  );


  let populationOptions = [
    100,
    250,
    500,
    1000
  ];


  for (
    let i = 0;
    i < populationOptions.length;
    i++
  ) {

    let bx =
      505 + i * 55;


    if (
      experimentCapacity ===
      populationOptions[i]
    ) {

      fill(70, 120, 180);

    } else {

      fill(220);

    }


    rect(
      bx,
      590,
      48,
      25,
      4
    );


    fill(30);

    textAlign(
      CENTER,
      CENTER
    );

    text(
      populationOptions[i],
      bx + 24,
      602
    );

  }


  // Current conditions summary

  textAlign(
    LEFT,
    BASELINE
  );

  fill(80);

  textSize(11);

  text(
    "Current:",
    430,
    638
  );


  text(
    "Mean " +
    experimentMean.toFixed(1) +
    " mm",
    480,
    638
  );


  text(
    "SD " +
    experimentSD.toFixed(2),
    565,
    638
  );


  text(
    "h² " +
    experimentHeritability.toFixed(2),
    635,
    638
  );


  text(
    "Rainfall " +
    rainfall +
    " cm",
    430,
    658
  );


  text(
    "Food optimum " +
    getFoodOptimum().toFixed(1) +
    " mm",
    540,
    658
  );


  // Fitness snapshot

  fill(30);

  textSize(11);

  text(
    "Fitness at current rainfall:",
    430,
    682
  );


  text(
    "7 mm = " +
    fitness(7).toFixed(2),
    430,
    702
  );


  text(
    "9 mm = " +
    fitness(9).toFixed(2),
    500,
    702
  );


  text(
    "11 mm = " +
    fitness(11).toFixed(2),
    570,
    702
  );


  text(
    "12 mm = " +
    fitness(12).toFixed(2),
    645,
    702
  );


  textAlign(
    LEFT,
    BASELINE
  );

}


// ============================================================
// EXPERIMENT STATISTICS
// ============================================================

function drawExperimentStatistics() {

  noStroke();
  fill(30);
  textStyle(BOLD);
  textSize(15);

  text(
    "Generation: " + generation,
    30,
    550
  );

  text(
    "Mean beak depth: " +
    calculateMean(experimentPopulation).toFixed(2) +
    " mm",
    200,
    550
  );

  textStyle(NORMAL);

}


// ============================================================
// GENERAL CONTROLS
// ============================================================

function drawControls(
  x,
  y,
  w,
  h
) {

  stroke(190);

  fill(255);

  rect(
    x,
    y,
    w,
    h,
    8
  );

  noStroke();

  fill(30);

  textSize(15);

  textStyle(BOLD);

  text(
    "Simulation controls",
    x + 15,
    y + 25
  );

  textStyle(NORMAL);


  // Run one generation

  fill(70, 120, 180);

  rect(
    x + 15,
    y + 45,
    165,
    35,
    5
  );


  // Continuous

  fill(
    running
      ? 180
      : 100
  );

  rect(
    x + 195,
    y + 45,
    165,
    35,
    5
  );


  // Reset

  fill(215);

  rect(
    x + 15,
    y + 95,
    165,
    35,
    5
  );


  // Activity 4 replicate button

  if (activity === 4) {

    fill(215);

    rect(
      x + 195,
      y + 95,
      165,
      35,
      5
    );

  }


  fill(255);

  textSize(12);

  textAlign(
    CENTER,
    CENTER
  );


  text(
    "Run 1 generation",
    x + 97,
    y + 62
  );


  text(
    running
      ? "Pause"
      : "Run continuously",
    x + 277,
    y + 62
  );


  fill(30);


  text(
    "Reset",
    x + 97,
    y + 112
  );


  if (activity === 4) {

    text(
      activity4ReplicateRunning
        ? "Running..."
        : "Run 10 replicates",
      x + 277,
      y + 112
    );

  }


  textAlign(
    LEFT,
    BASELINE
  );


  fill(90);

  textSize(11);

  text(
    "Generation: " +
    generation,
    x + 15,
    y + 150
  );

}


// ============================================================
// INSTRUCTIONS
// ============================================================

function drawActivityInstructions(
  x,
  y,
  w,
  h,
  message
) {

  stroke(190);

  fill(240);

  rect(
    x,
    y,
    w,
    h,
    8
  );

  noStroke();

  fill(50);

  textSize(13);

  text(
    message,
    x + 15,
    y + 25
  );

}


// ============================================================
// MOUSE CONTROLS
// ============================================================

function mousePressed() {


  // ----------------------------------------------------------
  // Activity tabs
  // ----------------------------------------------------------

  if (
    mouseY >= 55 &&
    mouseY <= 90
  ) {

    if (
      mouseX >= 30 &&
      mouseX <= 235
    ) {

      activity = 1;

    }

    else if (
      mouseX >= 243 &&
      mouseX <= 448
    ) {

      activity = 2;

    }

    else if (
      mouseX >= 456 &&
      mouseX <= 661
    ) {

      activity = 3;

    }

    else if (
      mouseX >= 669 &&
      mouseX <= 874
    ) {

      activity = 4;

    }

    else if (
      mouseX >= 882 &&
      mouseX <= 1087
    ) {

      activity = 5;

    }


    running = false;

    activity4ReplicateRunning = false;

    resetCurrentActivity();

    return;

  }


  // ----------------------------------------------------------
  // Rainfall controls
  // ----------------------------------------------------------

  let rainfallY = 0;


  if (activity === 1) {

    rainfallY = 175;

  }

  else if (activity === 2) {

    rainfallY = 205;

  }

  else if (activity === 5) {

    rainfallY = 175;

  }


  if (
    (activity === 1 ||
     activity === 2 ||
     activity === 5) &&

    mouseY >= rainfallY - 20 &&
    mouseY <= rainfallY + 12
  ) {

    for (
      let i = 0;
      i < RAINFALL_LEVELS.length;
      i++
    ) {

      let bx =
        120 + i * 85;


      if (
        mouseX >= bx &&
        mouseX <= bx + 70
      ) {

        rainfall =
          RAINFALL_LEVELS[i];


        if (activity !== 1) {
  running = false;
  resetCurrentActivity();
}

return;

      }

    }

  }


  // ----------------------------------------------------------
  // General control coordinates
  // ----------------------------------------------------------

   let controlX = 760;
  let controlY = (activity === 1) ? 615 : 555;


  // ----------------------------------------------------------
  // Run one generation
  // ----------------------------------------------------------

  if (
    mouseX >= controlX + 15 &&
    mouseX <= controlX + 180 &&
    mouseY >= controlY + 45 &&
    mouseY <= controlY + 80
  ) {

    running = false;

    runGenerationForCurrentActivity();

    return;

  }


  // ----------------------------------------------------------
  // Continuous
  // ----------------------------------------------------------

  if (
    mouseX >= controlX + 195 &&
    mouseX <= controlX + 360 &&
    mouseY >= controlY + 45 &&
    mouseY <= controlY + 80
  ) {

    if (!activity4ReplicateRunning) {

      running = !running;

    }

    return;

  }


  // ----------------------------------------------------------
  // Reset
  // ----------------------------------------------------------

  if (
    mouseX >= controlX + 15 &&
    mouseX <= controlX + 180 &&
    mouseY >= controlY + 95 &&
    mouseY <= controlY + 130
  ) {

    running = false;

    activity4ReplicateRunning = false;

    resetCurrentActivity();

    return;

  }


  // ----------------------------------------------------------
  // Activity 4 replicate button
  // ----------------------------------------------------------

  if (
    activity === 4 &&
    mouseX >= controlX + 195 &&
    mouseX <= controlX + 360 &&
    mouseY >= controlY + 95 &&
    mouseY <= controlY + 130
  ) {

    startActivity4Replicates();

    return;

  }


  // ----------------------------------------------------------
  // Activity 3 variation buttons
  // ----------------------------------------------------------

  if (activity === 3) {

    if (
      mouseX >= 300 &&
      mouseX <= 450 &&
      mouseY >= 600 &&
      mouseY <= 632
    ) {

      running = false;

      selectedVariationSD = lowVariationSD;

      variationPopulation =
        createPopulation(
          activity3Mean,
          selectedVariationSD,
          activity3Capacity
        );

      generation = 0;

      return;

    }


    if (
      mouseX >= 470 &&
      mouseX <= 620 &&
      mouseY >= 600 &&
      mouseY <= 632
    ) {

      running = false;

      selectedVariationSD = highVariationSD;

variationPopulation = [];

for (let i = 0; i < activity3Capacity; i++) {
  let beak;

  do {
    beak = randomGaussian(activity3Mean, highVariationSD);
  } while (beak < BEAK_MIN || beak > BEAK_MAX);

  variationPopulation.push(beak);
}

generation = 0;

return;

    }

  }


  // ----------------------------------------------------------
  // Activity 5 experimental-condition buttons
  // ----------------------------------------------------------

  if (activity === 5) {


    // Starting mean

    let meanOptions = [
      7.0,
      9.0,
      10.5,
      12.0
    ];


    for (
      let i = 0;
      i < meanOptions.length;
      i++
    ) {

      let bx =
        130 + i * 75;


      if (
        mouseX >= bx &&
        mouseX <= bx + 65 &&
        mouseY >= 590 &&
        mouseY <= 615
      ) {

        experimentMean =
          meanOptions[i];

        running = false;

        resetCurrentActivity();

        return;

      }

    }


    // Starting SD

    let sdOptions = [
      0.25,
      0.50,
      1.00,
      1.50
    ];


    for (
      let i = 0;
      i < sdOptions.length;
      i++
    ) {

      let bx =
        130 + i * 75;


      if (
        mouseX >= bx &&
        mouseX <= bx + 65 &&
        mouseY >= 620 &&
        mouseY <= 645
      ) {

        experimentSD =
          sdOptions[i];

        running = false;

        resetCurrentActivity();

        return;

      }

    }


    // Heritability

    let hOptions = [
      0.25,
      0.50,
      0.76,
      0.90
    ];


    for (
      let i = 0;
      i < hOptions.length;
      i++
    ) {

      let bx =
        130 + i * 75;


      if (
        mouseX >= bx &&
        mouseX <= bx + 65 &&
        mouseY >= 650 &&
        mouseY <= 675
      ) {

        experimentHeritability =
          hOptions[i];

        running = false;

        resetCurrentActivity();

        return;

      }

    }


    // Population size

    let populationOptions = [
      100,
      250,
      500,
      1000
    ];


    for (
      let i = 0;
      i < populationOptions.length;
      i++
    ) {

      let bx =
        505 + i * 55;


      if (
        mouseX >= bx &&
        mouseX <= bx + 48 &&
        mouseY >= 590 &&
        mouseY <= 615
      ) {

        experimentCapacity =
          populationOptions[i];

        running = false;

        resetCurrentActivity();

        return;

      }

    }

  }

}


// ============================================================
// START ACTIVITY 4 REPLICATES
// ============================================================

function startActivity4Replicates() {

  running = false;

  activity4LargeResults = [];

  activity4SmallResults = [];

  activity4CurrentReplicate = 0;

  activity4CurrentGeneration = 0;


  activity4ReplicateLarge =
    createPopulation(
      activity4Mean,
      activity4SD,
      largeCapacity
    );


  activity4ReplicateSmall =
    createPopulation(
      activity4Mean,
      activity4SD,
      smallCapacity
    );


  largeIsland =
    activity4ReplicateLarge;

  smallIsland =
    activity4ReplicateSmall;

  generation = 0;


  activity4ReplicateRunning = true;

}


// ============================================================
// RUN ONE STEP OF ACTIVITY 4 REPLICATE SYSTEM
// ============================================================

function runActivity4ReplicateStep() {

  if (!activity4ReplicateRunning) {

    return;

  }


  let largeResult =
    evolvePopulation(
      activity4ReplicateLarge,
      activity4Heritability,
      largeCapacity
    );


  let smallResult =
    evolvePopulation(
      activity4ReplicateSmall,
      activity4Heritability,
      smallCapacity
    );


  activity4ReplicateLarge =
    largeResult.population;


  activity4ReplicateSmall =
    smallResult.population;


  largeIsland =
    activity4ReplicateLarge;

  smallIsland =
    activity4ReplicateSmall;


  activity4CurrentGeneration++;

  generation =
    activity4CurrentGeneration;


  if (
    activity4CurrentGeneration >=
    ACTIVITY4_GENERATIONS
  ) {

    activity4LargeResults.push(
      calculateMean(
        activity4ReplicateLarge
      )
    );


    activity4SmallResults.push(
      calculateMean(
        activity4ReplicateSmall
      )
    );


    activity4CurrentReplicate++;

    activity4CurrentGeneration = 0;


    if (
      activity4CurrentReplicate <
      ACTIVITY4_REPLICATES
    ) {

      activity4ReplicateLarge =
        createPopulation(
          activity4Mean,
          activity4SD,
          largeCapacity
        );


      activity4ReplicateSmall =
        createPopulation(
          activity4Mean,
          activity4SD,
          smallCapacity
        );


      largeIsland =
        activity4ReplicateLarge;

      smallIsland =
        activity4ReplicateSmall;

      generation = 0;

    } else {

      activity4ReplicateRunning = false;

    }

  }

}


// ============================================================
// RESET CURRENT ACTIVITY
// ============================================================

function resetCurrentActivity() {

  generation = 0;

  currentS = 0;

  currentR = 0;

  predictedR = 0;


  if (activity === 1) {

  population =
    createPopulation(
      activity1SmallMean,
      activity1SD,
      activity1Capacity
    );

  population2 =
    createPopulation(
      activity1LargeMean,
      activity1SD,
      activity1Capacity
    );

}


  if (activity === 2) {

    islandA =
      createPopulation(
        activity2Mean,
        activity2SD,
        activity2Capacity
      );


    islandB =
      createPopulation(
        activity2Mean,
        activity2SD,
        activity2Capacity
      );

  }


  if (activity === 3) {

  variationPopulation = [];

  for (let i = 0; i < activity3Capacity; i++) {
    let beak;

    do {
      beak = randomGaussian(activity3Mean, selectedVariationSD);
    } while (beak < BEAK_MIN || beak > BEAK_MAX);

    variationPopulation.push(beak);
  }

}


  if (activity === 4) {

    largeIsland =
      createPopulation(
        activity4Mean,
        activity4SD,
        largeCapacity
      );


    smallIsland =
      createPopulation(
        activity4Mean,
        activity4SD,
        smallCapacity
      );


    activity4LargeResults = [];

    activity4SmallResults = [];

    activity4ReplicateRunning = false;

  }


  if (activity === 5) {

    experimentPopulation =
      createPopulation(
        experimentMean,
        experimentSD,
        experimentCapacity
      );

  }

}


// ============================================================
// CREATE POPULATION
// ============================================================

function createPopulation(
  meanValue,
  standardDeviation,
  size
) {

  let newPopulation = [];


  for (
    let i = 0;
    i < size;
    i++
  ) {

    let beak =
      randomGaussian(
        meanValue,
        standardDeviation
      );


    beak =
      constrain(
        beak,
        BEAK_MIN,
        BEAK_MAX
      );


    newPopulation.push(
      beak
    );

  }


  return newPopulation;

}


// ============================================================
// GET SEED DISTRIBUTION
// ============================================================

function getSeedDistribution() {

  return SEED_DISTRIBUTIONS[
    rainfall
  ];

}


// ============================================================
// FOOD OPTIMUM
// ============================================================

function getFoodOptimum() {

  if (activity === 5) {

    if (rainfall === 15) return 11.0;
    if (rainfall === 35) return 10.0;
    if (rainfall === 55) return 9.0;
    if (rainfall === 75) return 8.0;
    if (rainfall === 95) return 7.0;

  }


  let seeds =
    getSeedDistribution();


  return (
    seeds.hard * SEED_OPTIMA.hard +
    seeds.medium * SEED_OPTIMA.medium +
    seeds.soft * SEED_OPTIMA.soft
  );

}


// ============================================================
// SEED-SPECIFIC FITNESS
// ============================================================

function seedFitness(
  beak,
  optimum
) {

  return exp(
    -SELECTION_STRENGTH *
    sq(
      beak - optimum
    )
  );

}


// ============================================================
// OVERALL FITNESS
// ============================================================

function fitness(beak) {

  if (activity === 5) {

    return seedFitness(
      beak,
      getFoodOptimum()
    );

  }
 if (activity === 3) {
    return seedFitness(beak, 9.0);
  }

  let optimum;

if (rainfall === 15) optimum = 11.0;
if (rainfall === 35) optimum = 10.0;
if (rainfall === 55) optimum = 9.0;
if (rainfall === 75) optimum = 8.0;
if (rainfall === 95) optimum = 7.0;

return seedFitness(
  beak,
  optimum
);
}

// ============================================================
// RUN GENERATION FOR CURRENT ACTIVITY
// ============================================================

function runGenerationForCurrentActivity() {

 if (activity === 1) {

  let result =
    evolvePopulation(
      population,
      activity1Heritability,
      activity1Capacity
    );


  population =
    result.population;


  activity1S1 =
    result.S;


  activity1R1 =
    result.R;


  activity1PredictedR1 =
    result.predictedR;


  let result2 =
    evolvePopulation(
      population2,
      activity1Heritability,
      activity1Capacity
    );


  population2 =
    result2.population;


  activity1S2 =
    result2.S;


  activity1R2 =
    result2.R;


  activity1PredictedR2 =
    result2.predictedR;

}


  if (activity === 2) {

    let resultA =
      evolvePopulation(
        islandA,
        islandAHeritability,
        activity2Capacity
      );


    let resultB =
      evolvePopulation(
        islandB,
        islandBHeritability,
        activity2Capacity
      );


    islandA =
      resultA.population;


    islandB =
      resultB.population;

  }


  if (activity === 3) {

    let result =
      evolvePopulation(
        variationPopulation,
        activity3Heritability,
        activity3Capacity
      );


    variationPopulation =
      result.population;


    currentS =
      result.S;


    currentR =
      result.R;


    predictedR =
      result.predictedR;

  }


  if (activity === 4) {

    let resultLarge =
      evolvePopulation(
        largeIsland,
        activity4Heritability,
        largeCapacity
      );


    let resultSmall =
      evolvePopulation(
        smallIsland,
        activity4Heritability,
        smallCapacity
      );


    largeIsland =
      resultLarge.population;


    smallIsland =
      resultSmall.population;

  }


  if (activity === 5) {

    let result =
      evolvePopulation(
        experimentPopulation,
        experimentHeritability,
        experimentCapacity
      );


    experimentPopulation =
      result.population;


    currentS =
      result.S;


    currentR =
      result.R;


    predictedR =
      result.predictedR;

  }


  generation++;

}


// ============================================================
// CORE EVOLUTIONARY MODEL
// ============================================================

function evolvePopulation(
  oldPopulation,
  heritability,
  carryingCapacity
) {

  if (
    oldPopulation.length === 0
  ) {

    return {

      population: [],
      S: 0,
      R: 0,
      predictedR: 0

    };

  }


  let originalMean =
    calculateMean(
      oldPopulation
    );


  // Calculate fitness

  let fitnessValues = [];


  for (
    let beak of oldPopulation
  ) {

    fitnessValues.push(
      fitness(beak)
    );

  }


  // Survival

  let survivors = [];

  let survivorFitness = [];


  for (
    let i = 0;
    i < oldPopulation.length;
    i++
  ) {

    let w =
      fitnessValues[i];


    let survivalProbability =
      0.35 +
      0.60 * w;


    if (
      random() <
      survivalProbability
    ) {

      survivors.push(
        oldPopulation[i]
      );


      survivorFitness.push(
        w
      );

    }

  }


  // Extinction

  if (
    survivors.length === 0
  ) {

    return {

      population: [],
      S: 0,
      R: 0,
      predictedR: 0

    };

  }


  // Selection differential

  let selectedMean =
    calculateMean(
      survivors
    );


  let S =
    selectedMean -
    originalMean;


  // Cumulative fitness

  let cumulative = [];

  let runningTotal = 0;


  for (
    let i = 0;
    i < survivorFitness.length;
    i++
  ) {

    runningTotal +=
      survivorFitness[i];


    cumulative.push(
      runningTotal
    );

  }


  let totalFitness =
    runningTotal;


  let offspring = [];


  // Environmental component

  let environmentalSD =
    DEFAULT_SD *
    0.25 *
    sqrt(
      max(
        0.01,
        1 - heritability
      )
    );


   // Generate offspring

  for (
    let i = 0;
    i < carryingCapacity;
    i++
  ) {

    let r =
      random() *
      totalFitness;

    let low = 0;

    let high =
      cumulative.length - 1;

    while (
      low < high
    ) {

      let middle =
        floor(
          (low + high) / 2
        );

      if (
        cumulative[middle] < r
      ) {

        low =
          middle + 1;

      } else {

        high =
          middle;

      }

    }

    let parentBeak =
      survivors[low];

    let parentalDeviation =
      parentBeak -
      originalMean;

    let inheritedDeviation =
      heritability *
      parentalDeviation;

    let environmentalDeviation =
      randomGaussian(
        0,
        environmentalSD
      );

    let offspringBeak =
      originalMean +
      inheritedDeviation +
      environmentalDeviation;

    offspringBeak =
      constrain(
        offspringBeak,
        BEAK_MIN,
        BEAK_MAX
      );

    offspring.push(
      offspringBeak
    );

  }


  // Response to selection

  let offspringMean =
    calculateMean(
      offspring
    );


  let R =
    offspringMean -
    originalMean;


  let predictedR =
    heritability *
    S;


  return {

    population:
      offspring,

    S:
      S,

    R:
      R,

    predictedR:
      predictedR

  };

}


// ============================================================
// CALCULATE MEAN
// ============================================================

function calculateMean(values) {

  if (
    values.length === 0
  ) {

    return 0;

  }


  let total = 0;


  for (
    let value of values
  ) {

    total += value;

  }


  return (
    total /
    values.length
  );

}


// ============================================================
// CURRENT POPULATION SD
// ============================================================

function currentPopulationSD() {

  if (
    variationPopulation.length < 2
  ) {

    return 0;

  }


  let m =
    calculateMean(
      variationPopulation
    );


  let sum = 0;


  for (
    let value of variationPopulation
  ) {

    sum +=
      sq(
        value - m
      );

  }


  return sqrt(
    sum /
    variationPopulation.length
  );

}