
const chart = document.getElementById("chart");

function renderBars(values, activeStep, sortedSet = new Set()) {
  const max = Math.max(...values, 1);
  const active = new Map();

  if (activeStep) {
    activeStep.indices.forEach(index => {
      active.set(index, activeStep.type);
    });
  }

  chart.innerHTML = "";

  values.forEach((value, index) => {
    const slot = document.createElement("div");
    slot.className = "bar-slot";

    const label = document.createElement("span");
    label.className = "bar-value";
    label.textContent = value;

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${Math.max(3, value / max * 82)}%`;

    if (sortedSet.has(index) || activeStep?.type === "done") {
      bar.classList.add("sorted");
    } else if (
      active.get(index) === "swap" ||
      active.get(index) === "move"
    ) {
      bar.classList.add("swap");
    } else if (active.get(index) === "compare") {
      bar.classList.add("compare");
    }

    const indexLabel = document.createElement("span");
    indexLabel.className = "bar-index";
    indexLabel.textContent = index;

    slot.append(label, bar, indexLabel);
    chart.append(slot);
  });
}