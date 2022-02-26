import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import Texture = PIXI.Texture;
import {Game} from "./Game";
import BaseTexture = PIXI.BaseTexture;

export class Brick extends Container
{
    // Params >>------------------------------------------------------------<<<<
    private _image: Sprite;
    private _strength: number;
    public posX: number;
    public posY: number;
    public powerBrick: string;
    // Init >>--------------------------------------------------------------<<<<

    /**
     * @private
     */
    constructor(x:number, y:number, strength: number)
    {
        super();
        this.posX = x;
        this.posY = y;
        this._strength = strength;
        switch (this._strength)
        {
            case 3:
                this.powerBrick = 'LongRocket';
                break;
            default:
                if (Math.random() * 100 > 96)
                {
                    this.powerBrick = 'Heal';
                }
        }
        this.configurate();
    }

    protected configurate():void
    {
        this._image = new Sprite();
        this._image.position.set(this.posX, this.posY);
        this.setImage();
        this.addChild(this._image);
    }

    protected setImage():void
    {
        this._image.texture =Texture.fromImage('assets/images/' + this._strength + '_' + Game.IMAGE_SOURCE_BRICKS);
    }

    public dealDamage():boolean
    {
        this._strength -= 1;
        return this._strength <= 0;
    }


    // Base >>--------------------------------------------------------------<<<<

    // Events >>------------------------------------------------------------<<<<

    // Private >>-----------------------------------------------------------<<<<
}