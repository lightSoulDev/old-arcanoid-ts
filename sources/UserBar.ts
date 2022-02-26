import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import TextStyle = PIXI.TextStyle;
import {Game} from "./Game";

export class UserBar extends Container
{
    // Params >>------------------------------------------------------------<<<<
    private static SCORE_TEXT = 'SCORE: ';
    private static LIVES_TEXT = 'LIVES: ';
    private static STAGE_TEXT = 'STAGE: ';
    public static START_TEXT = 'PRESS Z TO START';
    public static PAUSE_TEXT = 'GAME PAUSED';
    private _score: PIXI.Text;
    private _lives: PIXI.Text;
    private _stage: PIXI.Text;
    private _message: PIXI.Text;
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
        let style = new TextStyle({fill: '#ffffff', fontSize: 28, fontWeight: '600', dropShadow: true, align: 'center'});
        this._score = new PIXI.Text();
        this._lives = new PIXI.Text();
        this._stage = new PIXI.Text();
        this._message = new PIXI.Text();
        this._score.position.set(5,10);
        this._lives.anchor.set(1, 0);
        this._lives.position.set(Game.WIDTH - 5, 10);
        this._stage.anchor.set(0.5);
        this._stage.position.set(Game.WIDTH/2, 68);
        this._message.anchor.set(0.5);
        this._message.position.set(Game.WIDTH/2, Game.HEIGHT/2);
        this._lives.style = style;
        this._score.style = style;
        this._stage.style = new TextStyle({fill: '#ffffff', fontSize: 18, fontWeight: '600', dropShadow: false, align: 'center'});
        this._message.style = style;
        this.addChild(this._score);
        this.addChild(this._lives);
        this.addChild(this._stage);
        this.addChild(this._message);
    }

    public setUserBar(score: number, lives: number, stage: number)
    {
        this._score.text = UserBar.SCORE_TEXT + score;
        this._lives.text = UserBar.LIVES_TEXT + lives;
        this._stage.text = UserBar.STAGE_TEXT + stage;
    }

    public setMessage(text: string)
    {
        this._message.text = text;
    }

    // Base >>--------------------------------------------------------------<<<<

    // Events >>------------------------------------------------------------<<<<

    // Private >>-----------------------------------------------------------<<<<
}