elements.shark = {
    color: ["#5f8aa6", "#3f6f8f", "#2f5f7f"],
    category: "life",
    behavior: behaviors.WALL,
    state: "solid",
    density: 1050,

    tick: function(pixel) {

        // === SETTINGS ===
        const visionRange = 6;     // how far it can SEE fish/humans
        const smellRange = 12;    // how far it can SMELL blood/life_force
        const moveAttempts = 2;   // speed

        // === TEMPERATURE CHECK ===
        if (pixel.temp > 50 || pixel.temp < 0) {
            if (Math.random() < 0.02) {
                pixel.element = "meat";
                return;
            }
        }

        // === MUST BE IN WATER OR SALT WATER ===
        let below = pixelMap[pixel.x]?.[pixel.y+1];
        if (!below || (below.element !== "water" && below.element !== "salt_water")) {
            if (Math.random() < 0.02) {
                pixel.element = "meat";
                return;
            }
        }

        let target = null;
        let targetType = null;

        // === 1. SMELL SYSTEM (LONG RANGE) ===
        for (let dx = -smellRange; dx <= smellRange; dx++) {
            for (let dy = -smellRange; dy <= smellRange; dy++) {

                let x = pixel.x + dx;
                let y = pixel.y + dy;

                if (!isEmpty(x,y)) {
                    let elem = pixelMap[x][y].element;

                    if (elem === "blood" || elem === "life_force" || elem === "lifeforce") {
                        target = {x:x, y:y};
                        targetType = "smell";
                    }
                }
            }
        }

        // === 2. VISION SYSTEM (FISH + RARE HUMAN ATTACK) ===
        if (!target) {
            for (let dx = -visionRange; dx <= visionRange; dx++) {
                for (let dy = -visionRange; dy <= visionRange; dy++) {

                    let x = pixel.x + dx;
                    let y = pixel.y + dy;

                    if (!isEmpty(x,y)) {
                        let elem = pixelMap[x][y].element;

                        // ALWAYS hunt fish
                        if (elem === "fish") {
                            target = {x:x, y:y};
                            targetType = "fish";
                        }

                        // RARELY attack human
                        if (elem === "human" && Math.random() < 0.02) {
                            target = {x:x, y:y};
                            targetType = "human";
                        }
                    }
                }
            }
        }

        // === 3. MOVEMENT (CHASE TARGET) ===
        for (let i = 0; i < moveAttempts; i++) {

            let nx, ny;

            if (target) {
                let dx = target.x - pixel.x;
                let dy = target.y - pixel.y;

                nx = pixel.x + Math.sign(dx);
                ny = pixel.y + Math.sign(dy);

            } else {
                // RANDOM SWIM IF NO TARGET
                let dirs = [[1,0],[-1,0],[0,1],[0,-1]];
                let dir = dirs[Math.floor(Math.random()*dirs.length)];
                nx = pixel.x + dir[0];
                ny = pixel.y + dir[1];
            }

            if (isEmpty(nx, ny)) {
                movePixel(pixel, nx, ny);
            }
        }

        // === 4. ATTACK (EAT TARGETS NEARBY) ===
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {

                let x = pixel.x + dx;
                let y = pixel.y + dy;

                if (!isEmpty(x,y)) {
                    let targetPixel = pixelMap[x][y];

                    if (targetPixel.element === "fish") {
                        deletePixel(x,y);
                    }

                    if (targetPixel.element === "human" && Math.random() < 0.2) {
                        deletePixel(x,y);
                    }
                }
            }
        }
    }
};