import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import TextStyle = PIXI.TextStyle;
import {Game} from "./Game";


export class Menu extends Container
{
    // Params >>------------------------------------------------------------<<<<
    public static INTRO_TEXT = 'CONTROLS:\nZ - START, LEFT/RIGHT ARROWS - MOVEMENT\nDOWN ARROW - SOUND, UP ARROW - CHEAT.\n\n' +
        'MOBILE:\nZ, SOUND, CHEAT, PAUSE BUTTONS ARE ON THE PIPE\n TAP LEFT OR RIGHT (NEAR PADDLE) TO MOVE.\n\n TAP OR CLICK TO CONTINUE!';

    public menuText: PIXI.Text;
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
        this.interactive = true;
        let background :Sprite = Sprite.fromImage('assets/images/' + Game.IMAGE_SOURCE_MENU);
        let style = new TextStyle({fill: '#ffffff', fontSize: 18, fontWeight: '600', dropShadow: true, align: 'center'});
        this.menuText = new PIXI.Text(Menu.INTRO_TEXT);
        this.menuText.anchor.set(0.5);
        this.menuText.style = style;
        this.menuText.position.set(Game.WIDTH/2, Game.HEIGHT/2);
        this.addChild(background);
        this.addChild(this.menuText);
    }

    // Base >>--------------------------------------------------------------<<<<

    // Events >>------------------------------------------------------------<<<<

    // Private >>-----------------------------------------------------------<<<<
}