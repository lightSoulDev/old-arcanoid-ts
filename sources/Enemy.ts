import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import BaseTexture = PIXI.BaseTexture;
import Texture = PIXI.Texture;
import {Game} from "./Game";

export class Enemy extends Container
{
    // Params >>------------------------------------------------------------<<<<
    private _image: Sprite;
    private _animation: any[];
    public speed: number = 2;
    public posX: number;
    public posY: number;
    public velocityX: number;
    public velocityY: number;
    public active: boolean = true;

    // Init >>--------------------------------------------------------------<<<<

    /**
     * @private
     */
    constructor(x: number, y: number)
    {
        super();
        this.posX = x + 10;
        this.posY = y;
        this.configurate();
    }

    protected configurate():void
    {
        this._animation = [];
        for (let i=0; i < 12;i++)
        {
            this._animation.push(new PIXI.Rectangle(20 * i,0,20,14));
        }

        this._image = new Sprite();
        this._image.scale.set(1.5);
        this._image.position.set(this.posX, this.posY);
        this._image.texture = new Texture(BaseTexture.fromImage('assets/images/' + Game.IMAGE_SOURCE_ENEMY));
        this._image.texture.baseTexture.width = 240;
        this._image.texture.baseTexture.height = 14;
        this._image.texture.frame = this._animation[0];
        this.velocityX = (Math.random()*2 - 1);
        this.velocityY = 1;
        this.addChild(this._image);
        this.animate();
    }

    protected animate()
    {
        for (let i=1; i < 12;i++)
        {
            setTimeout(function () {
                if (this.active)
                    this._image.texture.frame = this._animation[i];
            }.bind(this), i * 200);
        }
        setTimeout(function () {
            if (this.active)
            {
                this.animate();
            }
        }.bind(this), 1800)
    }

    public move():void
    {
        this.posY += this.velocityY *this.speed;
        this.posX += this.velocityX *this.speed;

        if (this.posX + this.width >= Game.WIDTH - 32)
        {
            this.posX = Game.WIDTH - this.width - 32;
            this.velocityX *= -1;
        }
        else if (this.posX <= 32)
        {
            this.posX = 32;
            this.velocityX *= -1;
        }
        this._image.position.set(this.posX, this.posY);
    }


    // Base >>--------------------------------------------------------------<<<<

    // Events >>------------------------------------------------------------<<<<

    // Private >>-----------------------------------------------------------<<<<
}