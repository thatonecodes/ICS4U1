//Array we must sort
const arrayToSort: number[] = [2, 5, 6, 3, 1, 23, 56, 78, 5, 2, 0];

function getDivEntropy(): number {
    const divs: NodeListOf<HTMLDivElement> = document.querySelectorAll("div");
    return divs.length || 1; // no / 0
}

function insertionSort(arr: number[]): number[] {
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


// THE DIVSORT IMPLEMENTATION
function divEntropySort(arr: number[]): number[] {
    const S = getDivEntropy();
    console.log("Div entropy scale:", S);

    const buckets: number[][] = Array.from({ length: S }, () => []);
    for (const value of arr) {
        const index = Math.abs(value) % S;
        buckets[index].push(value);
    }

    const result: number[] = [];
    for (const bucket of buckets) {
        if (bucket.length > 0) {
            insertionSort(bucket);
            result.push(...bucket);
        }
    }

    return result;
}

const sorted = divEntropySort(arrayToSort);
console.log("Original:", arrayToSort);
console.log("Sorted:", sorted);
