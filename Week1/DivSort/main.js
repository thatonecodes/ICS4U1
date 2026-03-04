const arrayToSort = [2,5,6,3,1,23,56,78,5,2,0];

function getDivEntropy() {
    const divs = document.querySelectorAll("div");
    return divs.length || 1;
}

function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}

function divEntropySort(arr) {
    const S = getDivEntropy();

    const buckets = Array.from({ length: S }, () => []);

    for (const value of arr) {
        const index = Math.abs(value) % S;
        buckets[index].push(value);
    }

    const result = [];
    for (const bucket of buckets) {
        if (bucket.length > 0) {
            insertionSort(bucket);
            result.push(...bucket);
        }
    }

    return { result, entropy: S };
}

const originalEl = document.getElementById("original");
const sortedEl = document.getElementById("sorted");
const btn = document.getElementById("sortBtn");

originalEl.textContent = JSON.stringify(arrayToSort);

btn.onclick = () => {
    const { result, entropy } = divEntropySort([...arrayToSort]);

    sortedEl.innerHTML =
        JSON.stringify(result) +
        "<br><br><strong>Div entropy:</strong> " + entropy;
};

const divButton = document.querySelector(".divBtn");

divButton.addEventListener("click", () => {
  const newDiv = document.createElement("div");
  document.body.appendChild(newDiv);
});
