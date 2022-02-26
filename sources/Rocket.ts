import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import {Game} from "./Game";
import Texture = PIXI.Texture;

export class Rocket extends Container
{
    // Params >>------------------------------------------------------------<<<<
    private _image: Sprite;
    public speed: number = 4;
    public velocity: number = 0;
    public posX: number = Game.WIDTH/2 - 48;
    public posY: number = Game.HEIGHT - 32;
    private _longRocket: Texture;
    private _normalRocket: Texture;
    private _longitude: boolean;
    // Init >>--------------------------------------------------------------<<<<

    /**
     * @private
     */
    constructor()
    {
        super();
        this.configurate();
    }

    protected configurate():void
    {
        this._normalRocket = Texture.fromImage('assets/images/' + Game.IMAGE_SOURCE_ROCKET);
        this._longRocket = Texture.fromImage('assets/images/' + Game.IMAGE_SOURCE_LONG_ROCKET);
        this._image = new Sprite(this._normalRocket);
        this._image.position.set(this.posX, this.posY);
        this.addChild(this._image);
        this._longitude = false;
    }

    public reset():void
    {
        this._longitude = false;
        this._image.texture = this._normalRocket;
        this.posX += 18;
        this.posX = Game.WIDTH/2 - 48;
        this._image.position.set(this.posX, this.posY);
    }

    public move():void
    {
        this.posX += this.velocity * this.speed;

        if (this.posX <= 32){
            this.posX = 32;
        }
        if (this.posX >= Game.WIDTH - this.width - 32){
            this.posX = Game.WIDTH - this.width - 32;
        }
        this._image.position.set(this.posX, this.posY);
    }

    public powerUp(type: string)
    {
        switch (type)
        {
            case 'LongRocket':
                this.posX -= 18;
                this._image.texture = this._longRocket;
                this._longitude = true;
                setTimeout(function () {
                    if (this._longitude)
                    {
                        this._image.texture = this._normalRocket;
                        this.posX += 18;
                        this._longitude = false;
                    }
                }.bind(this), 15000);
                break;
        }
    }

    // Base >>--------------------------------------------------------------<<<<

    // Events >>------------------------------------------------------------<<<<

    // Private >>-----------------------------------------------------------<<<<
}