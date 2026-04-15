elements.shark = {
    color: "#3f6f8f",
    category: "life",
    state: "solid",

    tick: function(pixel) {
        let dirs = [
            [1,0],[-1,0],[0,1],[0,-1]
        ];

        let d = dirs[Math.floor(Math.random() * dirs.length)];

        tryMove(pixel, pixel.x + d[0], pixel.y + d[1]);
    }
};
