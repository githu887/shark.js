elements.shark = {
    color: ["#3f6f8f", "#2b4c63", "#5f8aa3"],
    category: "life",
    state: "solid",
    behavior: behaviors.WALK,
    density: 1050,

    tick: function(pixel) {
        // simple movement (like your ant mod style)
        if (Math.random() < 0.3) {
            tryMove(pixel, pixel.x + (Math.random() < 0.5 ? -1 : 1), pixel.y);
        }

        if (Math.random() < 0.1) {
            tryMove(pixel, pixel.x, pixel.y + (Math.random() < 0.5 ? -1 : 1));
        }
    }
};
