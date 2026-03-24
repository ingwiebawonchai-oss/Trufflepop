let playerName = localStorage.getItem("playerName") || null;

document.addEventListener("DOMContentLoaded", () => {

    let count = Number(localStorage.getItem("currentScore")) || 0;
    let clickPower = Number(localStorage.getItem("clickPower")) || 1;
    let autoPower = Number(localStorage.getItem("autoPower")) || 0;

    let multiplier = 1;
    let lastClick = 0;

    const click = document.getElementById("click");
    const counter = document.getElementById("count");
    const leaderboardBody = document.getElementById("leaderboardBody");
    const nameInput = document.getElementById("name");

    counter.textContent = count;

    if (playerName) {
        nameInput.value = playerName;
        nameInput.disabled = true;
    }

    click.addEventListener("click", (e) => {

        const now = Date.now();

        if (now - lastClick < 500) {
            multiplier++;
        } else {
            multiplier = 1;
        }

        const gain = clickPower * multiplier;

        count += gain;

        counter.textContent = count;

        floatingText(e.clientX, e.clientY, "+" + gain);

        click.style.animation = "none";
        click.offsetHeight;
        click.style.animation = "shake 0.4s";

        lastClick = now;

        autoSave();

        saveGame();

    });

    function floatingText(x, y, text) {

        const el = document.createElement("div");

        el.className = "floatText";
        el.textContent = text;

        el.style.left = x + "px";
        el.style.top = y + "px";

        document.body.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 800);

    }

    window.buyClickUpgrade = function () {

        if (count >= 100) {

            count -= 100;

            clickPower++;

            counter.textContent = count;

            saveGame();

        }

    }

    window.buyAutoClick = function () {

        if (count >= 500) {

            count -= 500;

            autoPower++;

            counter.textContent = count;

            saveGame();

        }

    }

    setInterval(() => {

        if (autoPower > 0) {

            count += autoPower;

            counter.textContent = count;

            autoSave();

            saveGame();

        }

    }, 1000);

    function saveGame() {

        localStorage.setItem("currentScore", count);
        localStorage.setItem("clickPower", clickPower);
        localStorage.setItem("autoPower", autoPower);

    }

    function autoSave() {

        if (!playerName) return;

        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

        const playerIndex = leaderboard.findIndex(p =>
            p.name.toLowerCase() === playerName.toLowerCase()
        );

        if (playerIndex !== -1) {

            if (count > leaderboard[playerIndex].score) {
                leaderboard[playerIndex].score = count;
            }

        } else {

            leaderboard.push({
                name: playerName,
                score: count
            });

        }

        leaderboard.sort((a, b) => b.score - a.score);

        leaderboard = leaderboard.slice(0, 10);

        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

        renderLeaderboard();

    }

    function renderLeaderboard() {

        if (!leaderboardBody) return;

        const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

        leaderboardBody.innerHTML = "";

        leaderboard.forEach((player, index) => {

            const row = document.createElement("tr");

            let medal = "";

            if (index === 0) medal = "🥇";
            else if (index === 1) medal = "🥈";
            else if (index === 2) medal = "🥉";

            row.innerHTML = `
<td>#${index + 1} ${medal}</td>
<td>${player.name}</td>
<td>${player.score}</td>
`;

            if (playerName && player.name.toLowerCase() === playerName.toLowerCase()) {
                row.classList.add("me");
            }

            leaderboardBody.appendChild(row);

        });

    }

    renderLeaderboard();

    nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            startGame();
        }
    });

});

function startGame() {

    const input = document.getElementById("name");

    const name = input.value.trim();

    if (name === "") {
        alert("Enter name first");
        return;
    }

    playerName = name;

    localStorage.setItem("playerName", name);

    input.disabled = true;

}