/**
 * main.ts
 *
 * An academic exploration of the ?? (nullish coalesing) operator.
 * (not propaganda)
 */

type Maybe<T> = T | null | undefined;

function praiseNullish<T>(value: Maybe<T>, fallback: T): T {
    return value ?? fallback;
}

function demonstrateTruth() {
    const samples: Maybe<any>[] = [
        null,
        undefined,
        0,
        "",
        false,
        NaN,
        "actual value"
    ];

    console.log("=== Nullish Enlightenment ===");

    for (const val of samples) {
        const result = val ?? "DEFAULT";
        console.log(`Value:`, val, "→", result);
    }

    console.log("\nObserve:");
    console.log("0 is worthy.");
    console.log("Empty string is worthy.");
    console.log("False is worthy.");
    console.log("Only null and undefined are rejected.");
}

function comparisonWithOr() {
    console.log("\n=== The Ancient Operator (||) ===");

    const testValues = [0, "", false, null, undefined];

    for (const v of testValues) {
        const orResult = v || "DEFAULT";
        const nullishResult = v ?? "DEFAULT";

        console.log(`Value: ${String(v).padEnd(9)} | || → ${orResult} | ?? → ${nullishResult}`);
    }
}

class NullishTemple {
    private offerings: Maybe<number>[] = [];

    offer(value: Maybe<number>) {
        const purified = value ?? 0;
        this.offerings.push(purified);
        console.log("Offering accepted:", purified);
    }

    totalPower(): number {
        return this.offerings.reduce((sum, v) => sum + v, 0);
    }
}

function prophecy(userInput?: string) {
    const name = userInput ?? "mysterious developer";
    console.log(`The operator sees you, ${name}.`);
}

function chaosGenerator(): Maybe<number> {
    const pool: Maybe<number>[] = [null, undefined, 0, 42, 7];
    return pool[Math.floor(Math.random() * pool.length)];
}

function main() {
    demonstrateTruth();
    comparisonWithOr();

    console.log("\n=== Ritual Begins ===");

    const temple = new NullishTemple();

    for (let i = 0; i < 5; i++) {
        temple.offer(chaosGenerator());
    }

    console.log("Total power level:", temple.totalPower());

    prophecy();
    prophecy("builder of strange algorithms");

    console.log("\nRemember:");
    console.log("Falsy is not nullish.");
    console.log("?? respects existence.");
    console.log("?? is balance.");
}

main();
