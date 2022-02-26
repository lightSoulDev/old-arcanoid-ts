/**
 * @author Вячеслав И.Э.
 * @version 1.0
 * @since 08 Октябрь 2017
 */
import Container = PIXI.Container;
import Sprite = PIXI.Sprite;
import {Rocket} from "./Rocket";
import {Level} from "./Level";
import {Ball} from "./Ball";
import {UserBar} from "./UserBar";
import {Button} from "./Button";
import {Menu} from "./Menu";
import Ticker = PIXI.ticker.Ticker;

export class Game extends Container
{
    // Params >>------------------------------------------------------------<<<<

    public static WIDTH:number = 512;
    public static HEIGHT:number = 512;
    public static EVENT_GAME_PAUSE = 'GamePause';
    public static EVENT_GAME_ACTION = 'GameAction';
    public static EVENT_GAME_SOUND = 'GameSound';
    public static EVENT_GAME_CHEAT = 'GameCheat';
    public static AUDIO_SOURCE_COLLISION = 'Collision';
    public static AUDIO_SOURCE_BALL_OUT = 'BallOut';
    public static AUDIO_SOURCE_PONG = 'Pong';
    public static AUDIO_SOURCE_LOOP = 'Loop';
    public static AUDIO_SOURCE_ENEMY = 'Enemy';
    public static IMAGE_SOURCE_BACKGROUND = 'Background.png';
    public static IMAGE_SOURCE_BORDER = 'Border.png';
    public static IMAGE_SOURCE_BALL = 'Ball.png';
    public static IMAGE_SOURCE_POWER_UP = 'PowerUp.png';
    public static IMAGE_SOURCE_BRICKS = 'Brick.png';
    public static IMAGE_SOURCE_ROCKET = 'Rocket.png';
    public static IMAGE_SOURCE_LONG_ROCKET = 'LongRocket.png';
    public static IMAGE_SOURCE_MENU = 'Menu.png';
    public static IMAGE_SOURCE_ENEMY = 'Enemy.png';

    private _bgImage: Sprite;
    private _borderImage: Sprite;
    private _rocket: Rocket;
    private _level: Level;
    private _ball: Ball;
    private _userBar: UserBar;
    private _pauseButton: Button;
    private _actionButton: Button;
    private _soundButton: Button;
    private _cheatButton: Button;
    private _menu: Menu;
    private _score: number = 0;
    private _highScore: number = 0;
    private _lives: number = 3;
    private _stage: number = 1;
    private _cheatMode: boolean = false;
    private _pause: boolean = true;
    private _music: boolean = true;
    private _ticker: Ticker;
    // Init >>--------------------------------------------------------------<<<<

    /**
     * @private
     */
    constructor()
    {
        super();
        this._bgImage = Sprite.fromImage('assets/images/' + Game.IMAGE_SOURCE_BACKGROUND);
        this._borderImage = Sprite.fromImage('assets/images/' + Game.IMAGE_SOURCE_BORDER);
        this._menu = new Menu();
        this._rocket = new Rocket();
        this._level = new Level();
        this._ball = new Ball();
        this._userBar = new UserBar();
        this._pauseButton = new Button(Game.EVENT_GAME_PAUSE, 'Pause', 100, 1, 0);
        this._pauseButton.on(Game.EVENT_GAME_PAUSE, this.gamePause, this);
        this._actionButton = new Button(Game.EVENT_GAME_ACTION, 'Action', 100, 0, 0);
        this._actionButton.on(Game.EVENT_GAME_ACTION, this.gameAction, this);
        this._soundButton = new Button(Game.EVENT_GAME_SOUND, 'Sound', 100, 0.5, 0);
        this._soundButton.on(Game.EVENT_GAME_SOUND, this.gameSound, this);
        this._cheatButton = new Button(Game.EVENT_GAME_CHEAT, 'Cheat', 100, 0.5, 0);
        this._cheatButton.on(Game.EVENT_GAME_CHEAT, this.gameCheat, this);
        this._menu.on('pointerup', this.menuHide, this);

        this._level.on(Level.EVENT_COLLISION, this.eventCollision, this);
        this._level.on(Level.EVENT_NEXT_LEVEL, this.nextStage, this);
        this._level.on(Level.EVENT_POWER_UP, this.eventPowerUp, this);
        this._ball.on(Level.EVENT_BALL_OUT, this.eventBallOut, this);
        this.interactive = true;
        this.on('pointerdown', this.eventPointerDown, this);
        this.on('pointerup', this.eventPointerUp, this);

        this._ticker = PIXI.ticker.shared;
        this._ticker.add(this.Update, this);
        this._ticker.stop();
        this.configurate();
    }

    protected configurate():void
    {
        createjs.Sound.on("fileload", this.eventLoad, this);
        createjs.Sound.registerSound({src:'assets/audio/' + Game.AUDIO_SOURCE_COLLISION + '.wav', id: Game.AUDIO_SOURCE_COLLISION});
        createjs.Sound.registerSound({src:'assets/audio/' + Game.AUDIO_SOURCE_BALL_OUT + '.wav', id: Game.AUDIO_SOURCE_BALL_OUT});
        createjs.Sound.registerSound({src:'assets/audio/' + Game.AUDIO_SOURCE_PONG + '.wav', id: Game.AUDIO_SOURCE_PONG});
        createjs.Sound.registerSound({src:'assets/audio/' + Game.AUDIO_SOURCE_LOOP + '.wav', id: Game.AUDIO_SOURCE_LOOP});
        createjs.Sound.registerSound({src:'assets/audio/' + Game.AUDIO_SOURCE_ENEMY + '.wav', id: Game.AUDIO_SOURCE_ENEMY});
        this._pauseButton.position.set(Game.WIDTH - 4, 96);
        this._actionButton.position.set(3, 96);
        this._soundButton.position.set(Game.WIDTH/2 - 114, 56);
        this._cheatButton.position.set(Game.WIDTH/2 + 114, 56);
        this.addChild(this._menu);
        if (!localStorage.getItem('highscore'))
        {
            localStorage.setItem('highscore', '0');
        }
        this._highScore = parseInt(localStorage.getItem('highscore'));
        this._userBar.setUserBar(this._score, this._lives, this._stage);
        this._userBar.setMessage(UserBar.START_TEXT);
    }

    // Base >>--------------------------------------------------------------<<<<
    protected Update():void
    {
        if (this._ball.onTheRocket)
        {
            this._ball.posX = this._rocket.posX + this._rocket.width/2 - this._ball.width/2;
        }
        if (this._cheatMode)
        {
            if (this._rocket.posX + this._rocket.width/2 < this._ball.posX - 20)
            {
                this._rocket.velocity = 1;
            }
            else if (this._rocket.posX + this._rocket.width/2 > this._ball.posX + 20)
            {
                this._rocket.velocity = -1;
            }
            else
            {
                this._rocket.velocity = 0;
            }
        }
        this._level.powerUps.forEach(function (element) {
            element.move();
        });
        this._level.enemies.forEach(function (element) {
            element.move();
        });
        this._rocket.move();
        this._ball.move();
        this._level.checkCollision(this._ball, this._rocket);
    }

    protected gameEnd(gameover:boolean):void
    {
        if (this._score > this._highScore)
        {
            this._highScore = this._score;
            localStorage.setItem('highscore', this._highScore + '');
        }
        let gameStatus: string;
        if (gameover)
            gameStatus = 'GAME OVER!';
        else
            gameStatus = 'YOU WON!';
        this._menu.menuText.text = gameStatus + '\n\n YOUR SCORE: ' + this._score + '\n HIGH SCORE: ' + this._highScore +
            '\n\n TAP OR CLICK TO CONTINUE!';
        this.showMenu();
        this._score = 0;
        this._stage = 1;
        this._lives = 3;
        this._userBar.setUserBar(this._score, this._lives, this._stage);
        this._userBar.setMessage(UserBar.START_TEXT);
        this._rocket.reset();
        this._ball.reset(this._rocket.posX + this._rocket.width/2 - this._ball.width/2);
        this._level.setStage(this._stage);
    }

    protected nextStage():void
    {
        this._stage += 1;
        if (this._stage > 3)
        {
            this.gameEnd(false);
        }
        else
        {
            this._userBar.setUserBar(this._score, this._lives, this._stage);
            this._rocket.reset();
            this._ball.reset(this._rocket.posX + this._rocket.width/2 - this._ball.width/2);
            this._level.setStage(this._stage);
        }
    }

    protected menuHide():void
    {
        this.removeChild(this._menu);
        this.addChild(this._bgImage);
        this.addChild(this._ball);
        this.addChild(this._rocket);
        this.addChild(this._level);
        this.addChild(this._borderImage);
        this.addChild(this._userBar);
        this.addChild(this._pauseButton);
        this.addChild(this._actionButton);
        this.addChild(this._soundButton);
        this.addChild(this._cheatButton);
        this._ticker.start();
    }

    protected showMenu():void
    {
        this.addChild(this._menu);
        this._ticker.stop();
    }

    protected gamePause():void
    {
        this._pause = !this._pause;
        if (this._pause)
        {
            this._userBar.setMessage(UserBar.PAUSE_TEXT);
            this._ticker.stop();
        }
        else
        {
            this._userBar.setMessage('');
            this._ticker.start();
        }
    }

    protected gameAction():void
    {
        if (this._ball.onTheRocket)
        {
            this._ball.push();
            this._userBar.setMessage('');
        }
    }

    protected gameSound():void
    {
        this._music = !this._music;
        createjs.Sound.muted = !this._music;
    }

    protected gameCheat():void
    {
        this._cheatMode = !this._cheatMode;
    }

    // Events >>------------------------------------------------------------<<<<
    public eventKeyboardInput(event: KeyboardEvent):void
    {
        if (event.keyCode == 37 && event.type == 'keydown') {
            this._rocket.velocity = -1;
        }
        else if (event.keyCode == 39 && event.type == 'keydown') {
            this._rocket.velocity = 1;
        }
        else if ((event.keyCode == 37 || event.keyCode == 39) && event.type == 'keyup')
        {
            this._rocket.velocity = 0;
        }

        else if (event.keyCode == 38 && event.type == 'keydown') {
            this._cheatMode = !this._cheatMode;
        }
        else if (event.keyCode == 32 && event.type == 'keydown') {
            this.gamePause();
        }
        else if (event.keyCode == 40 && event.type == 'keydown') {
            this.gameSound();
        }
        else if (event.keyCode == 90 && event.type == 'keydown') {
            this.gameAction();
        }
    }

    protected eventLoad():void
    {
        createjs.Sound.play(Game.AUDIO_SOURCE_LOOP, createjs.Sound.INTERRUPT_ANY, 0, 0, -1, 0.2);
    }

    protected eventCollision(velocityX: any, velocityY: any, blockDestroyed: boolean):void
    {
        if (!this._ball.onTheRocket)
        {
            this._ball.velocityY = velocityY;
            this._ball.velocityX = velocityX;
            if (blockDestroyed)
            {
                this._score += 100;
                this._userBar.setUserBar(this._score, this._lives, this._stage);
            }
        }
    }

    protected eventBallOut():void
    {
        this._ball.reset(this._rocket.posX + this._rocket.width/2 - this._ball.width/2);
        this._lives -= 1;
        this._userBar.setUserBar(this._score, this._lives, this._stage);
        if (this._lives <= 0)
        {
            this.gameEnd(true);
        }
    }

    protected eventPowerUp(power: string):void
    {
        switch (power)
        {
            case 'LongRocket':
                this._rocket.powerUp('LongRocket');
                break;
            case 'Heal':
                this._lives += 1;
                this._userBar.setUserBar(this._score, this._lives, this._stage);
                break;
        }
    }

    protected eventPointerDown(event: any):void
    {
        console.log(event);
        let mouseX = event.data.global.x;
        let mouseY = event.data.global.y;
        let width = event.data.originalEvent.target.width;
        let height = event.data.originalEvent.target.height;
        console.log(mouseX, width);
        if (mouseY >= height/2)
        {
            if (mouseX < width/2)
            {
                this._rocket.velocity = -1;
            }
            if (mouseX > width/2)
            {
                this._rocket.velocity = 1;
            }
        }
    }

    protected eventPointerUp():void
    {
        this._rocket.velocity = 0;
    }
    // Private >>-----------------------------------------------------------<<<<
}