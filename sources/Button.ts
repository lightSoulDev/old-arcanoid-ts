import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import any = PIXI.utils.isMobile.any;

export class Button extends Container
{

    private _event:String;
    private _timeToWork:number;
    private _icon:String;
    private _anchor: number[];
    constructor(event:String, icon:String, timeToWork:number, anchorX: number, anchorY: number)
    {
        super();
        this._event = event;
        this._icon = icon;
        this._timeToWork = timeToWork;
        this._anchor = [anchorX, anchorY];
        this.configure();
    }

    protected configure():void
    {
        let icon:Sprite = Sprite.fromImage('assets/buttons/' + this._icon + '.png');
        icon.interactive = true;
        icon.buttonMode = true;
        icon.anchor.set(this._anchor[0], this._anchor[1]);
        icon.on('pointerup', function ()
        {
            this.emit(this._event);
            icon.alpha = 0.5;
            icon.interactive = false;
            setTimeout(function () {
                icon.alpha = 1;
                icon.interactive = true;
            }, this._timeToWork);
        }, this);
        icon.on('pointerdown', function () {
            icon.alpha = 0.5;
        });
        icon.on('pointerupoutside', function () {
            icon.alpha = 1;
        });
        this.addChild(icon);
    }

    public show()
    {
        this.visible = true;
    }

    public hide()
    {
        this.visible = false;
    }

}