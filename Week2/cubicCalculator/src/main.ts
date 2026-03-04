import "./style.css";

interface RootArray {
	real: number,
	i:    number
}

const cubicSolve = (a: number, b: number, c: number, d: number): RootArray[] => {
	const roots: RootArray[] = [];

	const p = c / a - (b * b) / (3 * a * a);
	const q = (2 * b * b * b) / (27 * a * a * a) - (b * c) / (3 * a * a) + d / a;

	const discriminant = (q * q) / 4 + (p * p * p) / 27;

	if (discriminant > 0) {
		// One real root
		const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
		const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
		const realRoot = u + v - b / (3 * a);
		roots.push({ real: realRoot, i: 0 });
	} else if (discriminant === 0) {
		// All roots real, at least two are equal
		const u = Math.cbrt(-q / 2);
		roots.push({ real: 2 * u - b / (3 * a), i: 0 });
		roots.push({ real: -u - b / (3 * a), i: 0 });
	} else {
		// Three distinct real roots
		const r = Math.sqrt(-p / 3);
		const phi = Math.acos(-q / (2 * Math.sqrt((-p * p * p) / 27)));
		for (let k = 0; k < 3; k++) {
			const realRoot = 2 * r * Math.cos((phi + 2 * Math.PI * k) / 3) - b / (3 * a);
			roots.push({ real: realRoot, i: 0 });
		}
	}

	return roots;
};


const aElement = document.getElementById("a") as HTMLInputElement;
const bElement = document.getElementById("b") as HTMLInputElement;
const cElement = document.getElementById("c") as HTMLInputElement;
const dElement = document.getElementById("d") as HTMLInputElement;

const roots = cubicSolve(+aElement.value, +bElement.value, +cElement.value, +dElement.value);
const tBody = document.querySelector("tbody");

if (tBody) {
	const row = document.createElement("tr");

	const xValueCell = document.createElement("td");
	xValueCell.textContent = "X";
	row.appendChild(xValueCell);

	const yValueCell = document.createElement("td");
	yValueCell.textContent = "Y";
	row.appendChild(yValueCell);

	const discriminantCell = document.createElement("td");
	discriminantCell.textContent = "Discriminant";
	row.appendChild(discriminantCell);

	roots.forEach((root, index) => {
		const rootCell = document.createElement("td");
		rootCell.textContent = `Root ${index + 1}: ${root.real} + ${root.i}i`;
		row.appendChild(rootCell);
	});

	tBody.appendChild(row);
}