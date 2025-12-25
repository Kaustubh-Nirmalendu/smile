gsap.registerPlugin(TextPlugin, SplitText, Physics2DPlugin);

const textEl = document.getElementById("text");
const stage = document.getElementById("stage");

const messages = [
    "Merry Christmas for at least the day I'm making this.",
    "I just wanted to make this site for fun...",
    "...and maybe a little more chaos in the world!",
    ""
];

let current = 0;

// Utility to animate old text flying out letter by letter
function explodeOldText(oldTextEl, callback) {
    const split = new SplitText(oldTextEl, {type: "chars"});
    gsap.to(split.chars, {
        duration: 0.7,
        x: () => gsap.utils.random(-100, 100) * 1.5,
        y: () => gsap.utils.random(-100, 100) * 1.5,
        rotation: () => gsap.utils.random(-180, 180),
        opacity: 0,
        stagger: 0.02,
        onComplete: () => {
            split.revert(); // clean up
            oldTextEl.textContent = "";
            callback();
        }
    });
}

function typeNextMessage() {
    if (current >= messages.length) {
        begin();
        return;
    }

    // If text already exists, explode it first
    if (textEl.textContent.length > 0) {
        explodeOldText(textEl, () => animateNewMessage(messages[current]));
    } else {
        animateNewMessage(messages[current]);
    }
}

function animateNewMessage(message) {
    gsap.to(textEl, {
    duration: message.length * 0.07,
    text: message,
    ease: "none",
    onComplete: () => {
        current++;
        setTimeout(typeNextMessage, 1500);
    }
    });
}

window.onload = function() {
    setTimeout(typeNextMessage, 5000); // start after 5 seconds
};

function begin() {
    const giantText = `FUN FACT!!!\nYOU'RE GETTING GRILLED CHICKEN FOR CHRISTMAS WITH EXTRA MANIPULATION FOR MACHAEL LEE VACUUM CLEANER WITH NAKAMURA FEVER!!!!!!!!!!! AND WHEN YOU BUY AN ALL AGES OUIJA BOARD TO PLACE ON YOUR NUCLEAR TEST SITE OF A FORETHOUGHT FOREHEAD THEN TEJBAIT IP'S ARE GOING TO SELL EMAIL'S FOR WELSH CURRENCY AND IF YOU GET MECDONALDS TO SEND YOU A RESUMÉ, YOUR ANCHOR WILL BEAT EVERYONE'S TRANSNESS SO MUCH THAT DOTS SENT ON DISCORD BECOME BEDS DIFFUSING INTO THE GOD DAMN GROUND SO BLEND YOUR NIGHT AND REDEEM YOUR COMPUTER AS A FAILED BUSINESSMAN BECAUSE I'LL BE YOUR BISHOP WITH PHILIDOR STALEMATE LEE WHEN CULTISTS DO WHAT CULTISTS DON'T!!!!!!!!!!! SO WHY WAIT? WHY BUY A VACUUM CLEANER WHEN A VACUUM CLEANER CLEANER IS FREE!!!!!! AND THAT'S A STEAL FOR THE CENTURY!!!!!! WHAT THE FORK!?!?!??!?!? SON OF A BLITZ!!!!!!!!`;
    //const giantText = `smile`;

    // Create the text element
    const textEl = document.createElement("div");
    textEl.style.position = "absolute";
    textEl.style.whiteSpace = "pre-wrap"; // important
    textEl.style.wordWrap = "break-word"; 
    textEl.style.fontSize = "3vmin";
    textEl.style.opacity = 0;
    textEl.style.top = "-50%";               // start above viewport
    textEl.style.left = "50%";
    textEl.style.transform = "translateX(-50%)";
    textEl.style.width = "80vw";          // <- important for wrapping
    textEl.style.display = "inline-block"; // <- important
    textEl.textContent = giantText;
    stage.appendChild(textEl);

    // Animate the text descending to center while fading in
    gsap.to(textEl, {
        duration: 3,
        top: "50%",
        opacity: 1,
        ease: "power2.out",
        onComplete: () => explodeText(textEl)
    });
}

function explodeTextLaggy(textEl) {
    // Remove any transforms so measurements are accurate
    textEl.style.transform = "none";

    // Split into characters
    const split = new SplitText(textEl, { type: "chars" });
    const chars = split.chars;

    // Ensure stage fills viewport
    stage.style.width = "100%";
    stage.style.height = "100%";

    const stageRect = stage.getBoundingClientRect();

    // Position each char absolutely at its visual position
    chars.forEach(char => {
        const rect = char.getBoundingClientRect();
        char.style.position = "absolute";
        char.style.left = rect.left - stageRect.left + "px";
        char.style.top = rect.top - stageRect.top + "px";
        char.style.transform = "none";
        char.style.display = "inline-block";  // preserve Y position
        stage.appendChild(char);
    });

    textEl.remove();

    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;

    // Animate each letter with physics and bouncing
    chars.forEach(char => {
        // random velocity in all directions
        let vx = gsap.utils.random(-50, 50);
        let vy = gsap.utils.random(-50, 50);
        let rotation = gsap.utils.random(-360, 360);
        const gravity = 0;

        gsap.ticker.add(() => {
            let left = parseFloat(char.style.left);
            let top = parseFloat(char.style.top);

            left += vx * gsap.ticker.deltaRatio();
            top += vy * gsap.ticker.deltaRatio();
            vy += gravity * gsap.ticker.deltaRatio();

            // Bounce off stage edges
            if (left < 0) { left = 0; vx *= -0.7; }
            if (left > stageWidth - char.offsetWidth) { left = stageWidth - char.offsetWidth; vx *= -0.7; }
            if (top < 0) { top = 0; vy *= -0.7; }
            if (top > stageHeight - char.offsetHeight) { top = stageHeight - char.offsetHeight; vy *= -0.7; }

            char.style.left = left + "px";
            char.style.top = top + "px";
            char.style.transform = `rotate(${rotation}deg)`;
            rotation += 10;
        });
    });
}

function explodeText(textEl) {
    // Remove transforms for accurate measurement
    textEl.style.transform = "none";

    // Split text into words + punctuation
    const textPieces = textEl.textContent.match(/[\w’'-]+|[^\s\w]/g); 

    // Clear textEl and wrap each piece in a span
    textEl.textContent = "";
    textPieces.forEach(piece => {
        const span = document.createElement("span");
        span.textContent = piece + " "; // add space after each word
        span.style.display = "inline-block"; // needed for measurement
        textEl.appendChild(span);
    });

    const spans = Array.from(textEl.querySelectorAll("span"));

    // Ensure stage fills viewport
    stage.style.width = "100%";
    stage.style.height = "100%";

    const stageRect = stage.getBoundingClientRect();

    // Position each span absolutely at its visual position
    spans.forEach(span => {
        const rect = span.getBoundingClientRect();
        span.style.position = "absolute";
        span.style.left = rect.left - stageRect.left + "px";
        span.style.top = rect.top - stageRect.top + "px";
        span.style.transform = "none";
        stage.appendChild(span);
    });

    textEl.remove(); // remove original container

    // Store velocities and rotations per span
    const spanData = spans.map(span => ({
        span,
        vx: gsap.utils.random(-50, 50),
        vy: gsap.utils.random(-50, 50),
        rotation: gsap.utils.random(-180, 180)
    }));

    let stageWidth = stage.clientWidth;
    let stageHeight = stage.clientHeight;

    function updateStageSize() {
        stageWidth = stage.clientWidth;
        stageHeight = stage.clientHeight;
    }

    window.addEventListener("resize", updateStageSize);

    // Animate each span with physics
    gsap.ticker.add(() => {
        spanData.forEach(data => {
            let { span, vx, vy, rotation } = data;
            let left = parseFloat(span.style.left);
            let top = parseFloat(span.style.top);

            left += vx * gsap.ticker.deltaRatio();
            top += vy * gsap.ticker.deltaRatio();
            // gravity can be added if desired
            // vy += gravity * gsap.ticker.deltaRatio();

            // Bounce off stage edges
            if (left < 0) { left = 0; data.vx *= -0.7; }
            if (left > stageWidth - span.offsetWidth) { left = stageWidth - span.offsetWidth; data.vx *= -0.7; }
            if (top < 0) { top = 0; data.vy *= -0.7; }
            if (top > stageHeight - span.offsetHeight) { top = stageHeight - span.offsetHeight; data.vy *= -0.7; }

            span.style.left = left + "px";
            span.style.top = top + "px";
            span.style.transform = `rotate(${rotation}deg)`;
            data.rotation += 10;
        });
    });
}