
/*
Paradise - Browser Version
Translated from Python (Pygame) to JavaScript (HTML Canvas)

How to use:
1. Place this file next to an HTML file.
2. Add: <canvas id="gameCanvas" width="1000" height="500"></canvas>
3. Add: <script src="game.js"></script>
4. Place image assets in the same folder or update paths.
*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 1000;
const HEIGHT = 500;
const GROUND_LEVEL = HEIGHT - 116.75;

// -------------------- Assets --------------------
function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

const images = {
    main: loadImage("background4paradise.jpg"),
    atm: loadImage("atm_background.png"),
    slot: loadImage("slot_background.png"),
    pink1: loadImage("pink_eyes_1T.png"),
    pink2: loadImage("pink_eyes_2T.png"),
    shopIntro: loadImage("shop_intro.png"),
    shopBuy: loadImage("shop_buy.png"),
    exitBlocked: loadImage("exit_blocked.png"),
    title: loadImage("title_screen.png"),
    username: loadImage("username_screen.png"),
    win1: loadImage("win_screen1.png"),
    win2: loadImage("win_screen2.png"),
    time: loadImage("time_screen.png"),
    leaderboard: loadImage("leaderboard_screen.png"),
    playerR: loadImage("lumite.sprite.png"),
};

// -------------------- Game State --------------------
let gameState = "title";
let currentScene = "main_room";

let wallet = 100;
let atmBalance = 900;
let atmMax = 900;

let username = "";
let leaderboard = [];

let startTime = 0;
let completionTime = 0;

// -------------------- Player --------------------
const player = {
    x: 100,
    y: GROUND_LEVEL,
    w: 50,
    h: 80,
    vx: 0,
    vy: 0,
    speed: 5,
    jump: 15,
    gravity: 1.5,
    jumping: false,
    facingRight: true
};

// -------------------- Input --------------------
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

canvas.addEventListener("mousedown", handleClick);

function handleClick(e) {
    if (gameState === "title") {
        gameState = "username";
    } else if (gameState === "username") {
        gameState = "playing";
        startTime = performance.now();
        resetGame();
    }
}

// -------------------- Helpers --------------------
function intersects(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

function resetGame() {
    wallet = 100;
    atmBalance = 900;
    player.x = 100;
    player.y = GROUND_LEVEL;
    currentScene = "main_room";
}

// -------------------- Game Loop --------------------
let lastTime = 0;

function loop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// -------------------- Update --------------------
function update(dt) {
    if (gameState !== "playing") return;

    player.vx = 0;

    if (keys["ArrowLeft"] || keys["a"]) {
        player.vx = -player.speed;
        player.facingRight = false;
    }
    if (keys["ArrowRight"] || keys["d"]) {
        player.vx = player.speed;
        player.facingRight = true;
    }
    if ((keys[" "] || keys["ArrowUp"] || keys["w"]) && !player.jumping) {
        player.vy = -player.jump;
        player.jumping = true;
    }

    player.vy += player.gravity;
    player.x += player.vx;
    player.y += player.vy;

    if (player.y >= GROUND_LEVEL) {
        player.y = GROUND_LEVEL;
        player.vy = 0;
        player.jumping = false;
    }

    player.x = Math.max(0, Math.min(player.x, WIDTH - player.w));
}

// -------------------- Draw --------------------
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (gameState === "title") {
        ctx.drawImage(images.title, 0, 0, WIDTH, HEIGHT);
        return;
    }

    if (gameState === "username") {
        ctx.drawImage(images.username, 0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "black";
        ctx.font = "20px monospace";
        ctx.fillText(username || "Click to start", 300, 200);
        return;
    }

    if (gameState === "playing") {
        ctx.drawImage(images.main, 0, 0, WIDTH, HEIGHT);

        // Player
        ctx.drawImage(images.playerR, player.x, player.y, player.w, player.h);

        // HUD
        ctx.fillStyle = "green";
        ctx.font = "20px monospace";
        ctx.fillText("$" + wallet.toFixed(2), WIDTH - 160, 40);
    }
}
