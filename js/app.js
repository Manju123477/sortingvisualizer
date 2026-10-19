
const $ = id => document.getElementById(id);

const descriptions = {
  bubble: [
    "Bubble Sort",
    "Compares adjacent elements and swaps them when they are in the wrong order. Larger values gradually move toward the end.",
    "O(n)", "O(n²)", "O(n²)", "O(1)"
  ],
  selection: [
    "Selection Sort",
    "Finds the smallest value in the unsorted section and places it at the next position.",
    "O(n²)", "O(n²)", "O(n²)", "O(1)"
  ],
  insertion: [
    "Insertion Sort",
    "Builds a sorted section one value at a time by shifting larger values and inserting the current value.",
    "O(n)", "O(n²)", "O(n²)", "O(1)"
  ],
  merge: [
    "Merge Sort",
    "Divides the array into smaller sections, sorts them, and merges the sorted sections.",
    "O(n log n)", "O(n log n)", "O(n log n)", "O(n)"
  ],
  quick: [
    "Quick Sort",
    "Partitions values around a pivot, then sorts the sections on either side.",
    "O(n log n)", "O(n log n)", "O(n²)", "O(log n) average"
  ],
  heap: [
    "Heap Sort",
    "Builds a max heap, repeatedly moves the maximum to the end, and restores the heap.",
    "O(n log n)", "O(n log n)", "O(n log n)", "O(1)"
  ],
  shell: [
    "Shell Sort",
    "Uses progressively smaller gaps to move out-of-place values before finishing with an insertion-style pass.",
    "Depends on gaps", "Depends on gaps", "Often O(n²)", "O(1)"
  ]
};

let original = [];
let steps = [];
let stepIndex = 0;
let playing = false;
let timer = null;
let elapsedTimer = null;
let startTime = 0;
let comparisons = 0;
let changes = 0;
let sorted = new Set();

function randomArray() {
  const size = Number($("arraySize").value);

  original = Array.from(
    { length: size },
    () => Math.floor(Math.random() * 96) + 5
  );

  resetPlayback();
}

function speedDelay() {
  return [1200, 650, 300, 120, 35][
    Number($("speed").value) - 1
  ];
}

function updateSpeedLabel() {
  $("speedValue").textContent = [
    "Slow", "Easy", "Normal", "Fast", "Very fast"
  ][Number($("speed").value) - 1];
}

function updateStats() {
  $("comparisons").textContent = comparisons.toLocaleString();
  $("swaps").textContent = changes.toLocaleString();

  $("progressText").textContent =
    `${stepIndex} / ${steps.length} operations`;

  $("elapsed").textContent = startTime
    ? `${((Date.now() - startTime) / 1000).toFixed(1)}s`
    : "0.0s";
}

function updateArrayText(values) {
  $("arrayValues").textContent = `[ ${values.join(", ")} ]`;
}

function stopPlayback() {
  playing = false;
  clearTimeout(timer);
  clearInterval(elapsedTimer);
  timer = null;
  elapsedTimer = null;
}

function resetPlayback() {
  stopPlayback();

  stepIndex = 0;
  comparisons = 0;
  changes = 0;
  sorted = new Set();
  startTime = 0;

  steps = makeSteps(original, $("algorithm").value);

  renderBars(original, null, sorted);
  updateArrayText(original);
  updateStats();

  $("statusText").textContent = "Ready to sort";
  $("stepDescription").textContent =
  
 $("liveStepTitle").textContent = "Ready to explore?";
 $("liveStepExplanation").textContent =
  "Press Start or Step to see what the algorithm is doing and why each operation happens.";
    "Press Start to play the animation, or Step to inspect one operation at a time.";

  $("startBtn").disabled = false;
  $("startBtn").textContent = "▶ Start";
  $("pauseBtn").disabled = true;
}

function finish() {
  stopPlayback();

  sorted = new Set(original.map((_, i) => i));

  const finalArray = steps.length
    ? steps[steps.length - 1].array
    : original;

  renderBars(finalArray, {
    type: "done",
    indices: [...sorted]
  }, sorted);

  updateArrayText(finalArray);

  $("startBtn").disabled = true;
  $("startBtn").textContent = "✓ Complete";
  $("pauseBtn").disabled = true;

  $("statusText").textContent = "Sorting complete";
  $("stepDescription").textContent =
    "All values are sorted. Choose another algorithm or generate a new array.";

  updateStats();
}

function applyNextStep() {
  if (stepIndex >= steps.length) {
    finish();
    return;
  }

  const step = steps[stepIndex];

  if (step.type === "compare") comparisons++;

  if (step.type === "swap" || step.type === "move") {
    changes++;
  }

  if (step.type === "mark") {
    step.indices.forEach(i => sorted.add(i));
  }

  if (step.type === "done") {
    sorted = new Set(original.map((_, i) => i));
  }

  renderBars(step.array, step, sorted);
  updateArrayText(step.array);


$("stepDescription").textContent = step.message;

const title = $("liveStepTitle");
const explanation = $("liveStepExplanation");

if (step.type === "compare") {
  title.textContent = "Comparing elements";
  explanation.textContent =
    step.message +
    " The highlighted blue bars are the values currently being examined.";
} else if (step.type === "swap") {
  title.textContent = "Swapping elements";
  explanation.textContent =
    step.message +
    " The yellow bars show the elements involved in this change.";
} else if (step.type === "move") {
  title.textContent = "Moving an element";
  explanation.textContent =
    step.message +
    " The algorithm is moving a value to its correct position.";
} else if (step.type === "mark") {
  title.textContent = "Progress made";
  explanation.textContent =
    step.message +
    " This step identifies progress toward the sorted array.";
} else if (step.type === "done") {
  title.textContent = "Array sorted successfully!";
  explanation.textContent =
    "Every element is now in ascending order. Try another algorithm and compare its behavior.";
}

$("statusText").textContent =
  step.type === "done"
    ? "Sorting complete"
    : `Step ${stepIndex + 1}: ${step.type}`;

  stepIndex++;
  updateStats();

  if (stepIndex >= steps.length) {
    finish();
  }
}

function playTick() {
  if (!playing) return;

  applyNextStep();

  if (playing) {
    timer = setTimeout(playTick, speedDelay());
  }
}

function startPlayback() {
  if (playing || stepIndex >= steps.length) return;

  if (!startTime) {
    startTime = Date.now();
    elapsedTimer = setInterval(updateStats, 100);
  }

  playing = true;

  $("startBtn").disabled = true;
  $("pauseBtn").disabled = false;
  $("statusText").textContent = "Sorting in progress…";

  playTick();
}

function stepOnce() {
  if (playing) {
    stopPlayback();
  }

  if (stepIndex >= steps.length) return;

  if (!startTime) startTime = Date.now();

  $("startBtn").disabled = false;
  $("startBtn").textContent = "▶ Resume";
  $("pauseBtn").disabled = true;

  applyNextStep();
}

function updateAlgorithmInfo() {
  const info = descriptions[$("algorithm").value];

  $("algorithmTitle").textContent = info[0];
  $("aboutTitle").textContent = `What is ${info[0]}?`;
  $("description").textContent = info[1];

  $("bestTime").textContent = info[2];
  $("avgTime").textContent = info[3];
  $("worstTime").textContent = info[4];
  $("spaceTime").textContent = info[5];
}

// Button events
$("startBtn").addEventListener("click", startPlayback);

$("pauseBtn").addEventListener("click", () => {
  stopPlayback();

  $("startBtn").disabled = false;
  $("startBtn").textContent = "▶ Resume";
  $("pauseBtn").disabled = true;

  $("statusText").textContent = "Paused";
});

$("stepBtn").addEventListener("click", stepOnce);
$("resetBtn").addEventListener("click", resetPlayback);
$("newArrayBtn").addEventListener("click", randomArray);

$("arraySize").addEventListener("input", () => {
  $("sizeValue").textContent = $("arraySize").value;
  randomArray();
});

$("speed").addEventListener("input", updateSpeedLabel);

$("algorithm").addEventListener("change", () => {
  updateAlgorithmInfo();
  resetPlayback();
});

// Initialize the website
updateSpeedLabel();
updateAlgorithmInfo();
randomArray();

 // Initialize the website
updateSpeedLabel();
updateAlgorithmInfo();
randomArray();

// ADD THE NEW CODE BELOW THIS LINE
$("applyArrayBtn").addEventListener("click", () => {
  const input = $("customArray").value.trim();
  const message = $("arrayInputMessage");

  if (!input) {
    message.textContent =
      "Enter numbers to use a custom array.";
    message.style.color = "#ffbd45";
    return;
  }

  const parts = input.split(/[,\s]+/).filter(Boolean);

  if (parts.length < 2 || parts.length > 80) {
    message.textContent = "Enter between 2 and 80 numbers.";
    message.style.color = "#ffbd45";
    return;
  }

  const values = parts.map(Number);

  if (values.some(value => !Number.isSafeInteger(value))) {
    message.textContent = "Enter valid whole numbers only.";
    message.style.color = "#ffbd45";
    return;
  }

  original = values;
  $("arraySize").value = values.length;
  $("sizeValue").textContent = values.length;

  resetPlayback();

  message.textContent =
    `Custom array loaded: ${values.length} elements.`;
  message.style.color = "#32d296";
});