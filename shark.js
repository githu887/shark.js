alert("MOD LOADED");

runAfterLoad(function() {
    elements.test_element = {
        color: "#ff0000",
        behavior: behaviors.WALL,
        category: "life",
        state: "solid"
    };
});
