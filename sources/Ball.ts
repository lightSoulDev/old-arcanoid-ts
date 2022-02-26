import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import {Game} from "./Game";
import {Level} from "./Level";

export class Ball extends Container
{
    // Params >>------------------------------------------------------------<<<<
    private _image: Sprite;
    public onTheRocket: boolean = true;

    public speed: number = 4;
    public velocityX: number = 0;
    public velocityY: number = 0;
    public posX: number = Math.ceil(Game.WIDTH/2);
    public posY: number = Game.HEIGHT - 48;

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
        this._image = Sprite.fromImage('assets/images/' + Game.IMAGE_SOURCE_BALL);
        this._image.scale.set(1);
        this._image.position.set(this.posX, this.posY);
        this.addChild(this._image);
    }

    public reset(posX: any):void
    {
        this.onTheRocket = true;
        this.velocityX = 0;
        this.velocityY = 0;
        this.posX = posX;
        this.posY = Game.HEIGHT - 48;
        this._image.position.set(this.posX,this.posY);
    }

    public move():void
    {
        this.posX += this.velocityX * this.speed;
        this.posY += this.velocityY * this.speed;
        if (this.posX + this.width >= Game.WIDTH - 32)
        {
            this.posX = Game.WIDTH - this.width - 32;
            this.velocityX *= -1;
            createjs.Sound.play(Game.AUDIO_SOURCE_COLLISION);
        }
        else if (this.posX <= 32)
        {
            this.posX = 32;
            this.velocityX *= -1;
            createjs.Sound.play(Game.AUDIO_SOURCE_COLLISION);
        }
        else if (this.posY  <= 84)
        {
            this.posY = 84;
            this.velocityY *= -1;
            createjs.Sound.play(Game.AUDIO_SOURCE_COLLISION);
        }
        else if (this.posY + this.height >= Game.HEIGHT + 16)
        {
            createjs.Sound.play(Game.AUDIO_SOURCE_BALL_OUT);
            this.emit(Level.EVENT_BALL_OUT);
            console.log('BallOut');
        }

        this._image.position.set(this.posX, this.posY);
    }

    public push():void
    {
        this.onTheRocket = false;
        this.velocityY = -1;
        this.velocityX = Math.random() * 1.6 - 0.8;
    }

    // Base >>--------------------------------------------------------------<<<<

    // Events >>------------------------------------------------------------<<<<

    // Private >>-----------------------------------------------------------<<<<
}