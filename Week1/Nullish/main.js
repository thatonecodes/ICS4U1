const prophecies = [
    name => `The operator sees you, ${name}.`,
    name => `${name}, you shall never confuse falsy with nullish again.`,
    name => `Balance follows ${name}. ?? approves.`,
    name => `${name} will debug a bug in one attempt.`,
    name => `Where others use ||, ${name} uses wisdom.`,
    name => `${name} respects existence.`
];

function getProphecy(userInput) {
    const name = userInput ?? "mysterious developer";
    const p = prophecies[Math.floor(Math.random() * prophecies.length)];
    return p(name);
}

document.getElementById("prophecyBtn").onclick = () => {
    const raw = document.getElementById("nameInput").value;
    const value = raw === "" ? null : raw;

    const message = getProphecy(value);
    document.getElementById("output").textContent = message;
};
