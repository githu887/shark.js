// Shark Mod for Sandboxels - Complex predator with blood scenting + human/fish eating
// Created for perfect compatibility with vanilla fish/human/blood mechanics

runAfterLoad(() => {
    if (!elements.fish) {
        console.log("Shark mod: Fish element not found - falling back to basic definition");
        // Fallback (rare) - basic swim behavior
        elements.shark = {
            color: "#2c2c2c",
            behavior: [
                ["XX", "M1", "XX"],
                ["M1", "XX", "M1"],
                ["XX", "M2", "XX"]
            ],
            ignore: ["water","salt_water","sugar_water","seltzer","dirty_water","pool_water","foam","bubble"],
            state: "solid",
            category: "life",
            density: 1100,
            temp: 20,
            tempHigh: 120,
            stateHigh: "meat",
            tempLow: -20,
            stateLow: "frozen_meat",
            breakInto: "blood",
            reactions: {
                "fish": { elem2: null },
                "body": { elem2: null, chance: 0.4 },
                "head": { elem2: null, chance: 0.4 },
                "blood": { elem2: null, chance: 0.8 }
            }
        };
        return;
    }

    // Perfect copy of fish for identical swimming + base traits
    elements.shark = JSON.parse(JSON.stringify(elements.fish));

    // Shark-specific visuals and tweaks
    elements.shark.color = ["#2c2c2c", "#3a3a3a", "#242424"]; // Dark shark gray with variation
    elements.shark.name = "shark"; // Internal name
    elements.shark.displayName = "Shark"; // In-game name

    // Predator reactions (overrides/adds to fish's food reactions)
    if (!elements.shark.reactions) elements.shark.reactions = {};
    elements.shark.reactions.fish = { elem2: null };           // Primary food: eat fish instantly
    elements.shark.reactions.body = { elem2: null, chance: 0.4 }; // Sometimes eat human body
    elements.shark.reactions.head = { elem2: null, chance: 0.4 }; // Sometimes eat human head
    elements.shark.reactions.blood = { elem2: null, chance: 0.8 }; // Eat blood (scent + consume)

    // Complex AI: smell blood/life from far away + hunt
    elements.shark.tick = function(pixel) {
        // Scan radius for blood or life (fish/body/head) - "smell" mechanic
        const radius = 10;
        let closest = null;
        let minDist = Infinity;

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = pixel.x + dx;
                const ny = pixel.y + dy;
                if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

                const neighbor = getPixel(nx, ny);
                if (neighbor && (neighbor.element === "blood" ||
                                 neighbor.element === "fish" ||
                                 neighbor.element === "body" ||
                                 neighbor.element === "head")) {
                    const dist = Math.abs(dx) + Math.abs(dy); // Manhattan distance
                    if (dist < minDist) {
                        minDist = dist;
                        closest = {x: nx, y: ny};
                    }
                }
            }
        }

        // Occasionally bias movement toward closest scent (doesn't override natural swim)
        if (closest && Math.random() < 0.35) {
            const tx = closest.x > pixel.x ? pixel.x + 1 : (closest.x < pixel.x ? pixel.x - 1 : pixel.x);
            const ty = closest.y > pixel.y ? pixel.y + 1 : (closest.y < pixel.y ? pixel.y - 1 : pixel.y);

            // Try horizontal then vertical move toward target (smooth hunting)
            if (!tryMove(pixel, tx, pixel.y)) {
                tryMove(pixel, pixel.x, ty);
            }
        }
    };

    console.log("✅ Shark mod loaded successfully - swims, smells blood/life, eats fish primarily + humans occasionally");
});
