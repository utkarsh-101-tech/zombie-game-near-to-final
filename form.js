class Form {
    constructor() {

        this.button = createImg("assets/menu.png");
    }

    hide() {
        this.button.hide();
    }

    display() {
        translate(0, 0);
        this.button.position(displayWidth / 2, displayHeight / 2);
        this.button.size(200, 200);
        this.button.mousePressed(() => {
            gameState = GameState.load;
        });


    }
}