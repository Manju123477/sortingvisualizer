
function makeSteps(input, algorithm) {
  const a = [...input];
  const steps = [];

  function record(type, indices = [], message = "", extra = {}) {
    steps.push({
      type,
      indices,
      message,
      array: [...a],
      ...extra
    });
  }

  if (algorithm === "bubble") {
    for (let end = a.length - 1; end > 0; end--) {
      let changed = false;

      for (let j = 0; j < end; j++) {
        record("compare", [j, j + 1],
          `Compare ${a[j]} and ${a[j + 1]}.`);

        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          changed = true;
          record("swap", [j, j + 1],
            `Swap the adjacent values.`);
        }
      }

      record("mark", [end],
        `${a[end]} is in its final position.`);

      if (!changed) break;
    }
  }

  else if (algorithm === "selection") {
    for (let i = 0; i < a.length - 1; i++) {
      let min = i;

      for (let j = i + 1; j < a.length; j++) {
        record("compare", [min, j],
          `Compare ${a[min]} and ${a[j]}.`);

        if (a[j] < a[min]) min = j;
      }

      if (min !== i) {
        [a[i], a[min]] = [a[min], a[i]];
        record("swap", [i, min],
          `Move the minimum value to index ${i}.`);
      }

      record("mark", [i], `${a[i]} is sorted.`);
    }
  }

  else if (algorithm === "insertion") {
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;

      while (j >= 0) {
        record("compare", [j, j + 1],
          `Compare ${a[j]} with ${key}.`);

        if (a[j] <= key) break;

        a[j + 1] = a[j];
        record("move", [j, j + 1],
          `Move ${a[j]} one position right.`);
        j--;
      }

      a[j + 1] = key;
      record("move", [j + 1],
        `Insert ${key} at index ${j + 1}.`);
    }
  }

  else if (algorithm === "merge") {
    function mergeSort(lo, hi) {
      if (hi - lo <= 1) return;

      const mid = Math.floor((lo + hi) / 2);
      mergeSort(lo, mid);
      mergeSort(mid, hi);

      const left = a.slice(lo, mid);
      const right = a.slice(mid, hi);
      let i = 0, j = 0, k = lo;

      while (i < left.length && j < right.length) {
        record("compare", [lo + i, mid + j],
          `Compare ${left[i]} and ${right[j]}.`);

        a[k] = left[i] <= right[j]
          ? left[i++]
          : right[j++];

        record("move", [k], `Write ${a[k]} at index ${k}.`);
        k++;
      }

      while (i < left.length) {
        a[k] = left[i++];
        record("move", [k], `Copy ${a[k]} to index ${k}.`);
        k++;
      }

      while (j < right.length) {
        a[k] = right[j++];
        record("move", [k], `Copy ${a[k]} to index ${k}.`);
        k++;
      }

      record("mark",
        Array.from({ length: hi - lo }, (_, x) => lo + x),
        "This section has been merged.");
    }

    mergeSort(0, a.length);
  }

  else if (algorithm === "quick") {
    function quickSort(lo, hi) {
      if (lo >= hi) return;

      const pivot = a[hi];
      let i = lo;

      for (let j = lo; j < hi; j++) {
        record("compare", [j, hi],
          `Compare ${a[j]} with pivot ${pivot}.`);

        if (a[j] < pivot) {
          if (i !== j) {
            [a[i], a[j]] = [a[j], a[i]];
            record("swap", [i, j],
              "Move a smaller value left of the pivot.");
          }
          i++;
        }
      }

      [a[i], a[hi]] = [a[hi], a[i]];
      record("swap", [i, hi], `Place pivot at index ${i}.`);
      record("mark", [i], `Pivot ${a[i]} is in position.`);

      quickSort(lo, i - 1);
      quickSort(i + 1, hi);
    }

    quickSort(0, a.length - 1);
  }

  else if (algorithm === "heap") {
    function heapify(n, i) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n) {
        record("compare", [left, largest],
          `Compare ${a[left]} with ${a[largest]}.`);

        if (a[left] > a[largest]) largest = left;
      }

      if (right < n) {
        record("compare", [right, largest],
          `Compare ${a[right]} with ${a[largest]}.`);

        if (a[right] > a[largest]) largest = right;
      }

      if (largest !== i) {
        [a[i], a[largest]] = [a[largest], a[i]];
        record("swap", [i, largest], "Restore the max heap.");
        heapify(n, largest);
      }
    }

    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {
      heapify(a.length, i);
    }

    for (let end = a.length - 1; end > 0; end--) {
      [a[0], a[end]] = [a[end], a[0]];
      record("swap", [0, end], "Move the maximum to the end.");
      record("mark", [end], `${a[end]} is sorted.`);
      heapify(end, 0);
    }
  }

  else if (algorithm === "shell") {
    for (
      let gap = Math.floor(a.length / 2);
      gap > 0;
      gap = Math.floor(gap / 2)
    ) {
      for (let i = gap; i < a.length; i++) {
        const temp = a[i];
        let j = i;

        while (j >= gap) {
          record("compare", [j - gap, j],
            `Compare values using gap ${gap}.`);

          if (a[j - gap] <= temp) break;

          a[j] = a[j - gap];
          record("move", [j - gap, j],
            `Shift ${a[j]} forward.`);
          j -= gap;
        }

        a[j] = temp;
        record("move", [j], `Place ${temp} at index ${j}.`);
      }
    }
  }

  record(
    "done",
    Array.from({ length: a.length }, (_, i) => i),
    "Sorting complete!"
  );

  return steps;
}