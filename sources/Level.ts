import Container = PIXI.Container;
import {Game} from "./Game";
import {Brick} from "./Brick";
import {Ball} from "./Ball";
import {Rocket} from "./Rocket";
import {PowerUp} from "./PowerUp";
import {Enemy} from "./Enemy";

export class Level extends Container
{
    // Params >>------------------------------------------------------------<<<<
    public static EVENT_COLLISION = 'Collision';
    public static EVENT_POWER_UP = 'PowerUp';
    public static EVENT_NEXT_LEVEL = 'NextLevel';
    public static EVENT_BALL_OUT = 'BallOut';
    private _levelMatrix: number[][];
    private _stages: number[][][];
    private _bricks: Brick[];
    public powerUps: PowerUp[] = [];
    public enemies: Enemy[] = [];
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
        this.buildStages();
        this._levelMatrix = this._stages[0];
        this.setBricks();
    }


    // Base >>--------------------------------------------------------------<<<<
    protected setBricks():void
    {
        this._bricks = [];
        for (let i = 0; i < this._levelMatrix.length; i++)
        {
            for (let j = 0; j < this._levelMatrix[i].length; j++)
            {
                if (this._levelMatrix[i][j] != 0)
                {
                    let newBrick = new Brick((j+1) * 32, i * 16 + 84, this._levelMatrix[i][j]);
                    this._bricks.push(newBrick);
                    this.addChild(newBrick);
                }
            }
        }
    }

    protected removeBricks():void
    {
        for (let i = 0; i < this._bricks.length; i++)
        {
            this.removeChild(this._bricks[i]);
        }
    }

    protected buildStages():void
    {
        this._stages = [];
        this._stages.push(
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [0,0,0,1,1,1,1,0,1,1,1,1],
                [0,0,0,2,2,0,0,0,0,0,2,2],
                [0,0,0,2,2,0,0,4,0,0,2,2],
                [0,0,0,2,2,0,0,0,0,0,2,2],
                [0,0,0,1,1,1,1,3,1,1,1,1],
            ]
        );
        this._stages.push(
            [
                [],
                [],
                [],
                [],
                [2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                [2,2,2,3,2,2,2,2,2,2,3,2,2,2],
                [4,4,4,0,0,0,0,0,0,0,0,4,4,4],
                [4,1,4,0,0,0,0,0,0,0,0,4,1,4],
                [4,1,4,0,0,0,0,0,0,0,0,4,1,4],
                [4,1,4,0,0,0,0,0,0,0,0,4,1,4],
                [4,1,4,0,0,0,0,0,0,0,0,4,1,4],
                [4,1,4,0,0,0,0,0,0,0,0,4,1,4],
                [4,1,4,4,4,0,0,0,0,4,4,4,1,4],
                [4,1,1,1,4,0,0,0,0,4,1,1,1,4],
                [4,4,4,4,4,0,0,0,0,4,4,4,4,4],

            ]
        );
        this._stages.push(
            [
                [],
                [],
                [],
                [],
                [5,5,5,5,2,1,1,1,1,2,5,5,5,5],
                [5,5,5,2,1,1,0,0,1,1,2,5,5,5],
                [5,5,2,1,1,0,0,0,0,1,1,2,5,5],
                [5,2,1,1,0,0,0,0,0,0,1,1,2,5],
                [2,1,1,0,0,0,0,0,0,0,0,1,1,2],
                [1,1,0,0,0,0,0,0,0,0,0,0,1,1],
                [1,1,0,0,0,0,0,0,0,0,0,0,1,1],
                [3,1,0,0,0,0,0,0,0,0,0,0,1,3],
                [1,1,0,0,0,0,0,0,0,0,0,0,1,1],
                [1,1,0,0,0,0,0,0,0,0,0,0,1,1],
                [2,1,1,0,0,0,0,0,0,0,0,1,1,2],
                [5,2,1,1,0,0,0,0,0,0,1,1,2,5],
                [5,5,2,1,1,0,0,0,0,1,1,2,5,5],
                [5,5,5,2,1,1,0,0,1,1,2,5,5,5],
                [5,5,5,5,2,1,1,1,1,2,5,5,5,5],
            ]
        );
    }

    public setStage(stage: any):void
    {
        this._levelMatrix = this._stages[stage-1];
        this.removeBricks();
        this.setBricks();
    }

    // Calculations >>------------------------------------------------------------<<<<
    protected rectangleCollision(x1: any, y1: any, width1: any, height1: any, x2: any, y2: any, width2: any, height2: any, smooth:boolean):boolean
    {
        if (smooth)
        {
            return y1 <= y2 + height2
                && y1 + height1 >= y2
                && x1 + width1 >= x2
                && x1 <= x2 + width2
        }
        else
            return y1 < y2 + height2
                && y1 + height1 > y2
                && x1 + width1 > x2
                && x1 < x2 + width2
    }

    public checkCollision(ball: Ball, rocket: Rocket): void
    {
        let velocityX: number;
        let velocityY: number;
        for (let i = 0; i < this._bricks.length; i++)
        {
            let collision: boolean;
            if (this.rectangleCollision(ball.posX + ball.width/4, ball.posY, ball.width/2, ball.height/4,
                    this._bricks[i].posX, this._bricks[i].posY, this._bricks[i].width, this._bricks[i].height, true ))
            {
                collision = true;
                velocityX = ball.velocityX;
                velocityY = -ball.velocityY;
            }
            else if (this.rectangleCollision(ball.posX + 3*ball.width/4, ball.posY + ball.height/4, ball.width/4, ball.height/2,
                    this._bricks[i].posX,this._bricks[i].posY, this._bricks[i].width, this._bricks[i].height, true ))
            {
                collision = true;
                velocityX = -ball.velocityX;
                velocityY = ball.velocityY;
            }
            else if (this.rectangleCollision(ball.posX + ball.width/4, ball.posY + 4*ball.height/4, ball.width/2, ball.height/4,
                    this._bricks[i].posX,this._bricks[i].posY, this._bricks[i].width, this._bricks[i].height, true))
            {
                collision = true;
                velocityX = ball.velocityX;
                velocityY = -ball.velocityY;
            }
            else if (this.rectangleCollision(ball.posX, ball.posY + ball.height/4, ball.width/4, ball.height/2,
                    this._bricks[i].posX,this._bricks[i].posY, this._bricks[i].width, this._bricks[i].height, true))
            {
                collision = true;
                velocityX = -ball.velocityX;
                velocityY = ball.velocityY;

            }

            if (collision)
            {
                let blockDestroyed = this._bricks[i].dealDamage();
                if (blockDestroyed)
                {
                    if (this._bricks[i].powerBrick)
                    {
                        let newPowerUp = new PowerUp(this._bricks[i].posX + this._bricks[i].width/2,
                            this._bricks[i].posY + this._bricks[i].height, this._bricks[i].powerBrick);
                        this.powerUps.push(newPowerUp);
                        this.addChild(newPowerUp);
                    }
                    this.removeChild(this._bricks[i]);
                    this._bricks.splice(i, 1);
                    if (this._bricks.length <= 0)
                    {
                        this.emit(Level.EVENT_NEXT_LEVEL);
                    }
                    if (Math.random()*100 > 85)
                    {
                        let newEnemy = new Enemy(Game.WIDTH/2, 50);
                        this.enemies.push(newEnemy);
                        this.addChild(newEnemy);
                    }
                }
                createjs.Sound.play(Game.AUDIO_SOURCE_COLLISION);
                this.emit(Level.EVENT_COLLISION, velocityX, velocityY, blockDestroyed);
                break;
            }
        }

        if (this.rectangleCollision(ball.posX, ball.posY, ball.width, ball.height, rocket.posX, rocket.posY,
                rocket.width, rocket.height, false))
        {
            let velocity = this.calculateVelocity(ball.posX, ball.width/2, rocket.posX, rocket.width);
            createjs.Sound.play(Game.AUDIO_SOURCE_PONG);
            this.emit(Level.EVENT_COLLISION, velocity[0], velocity[1] * ball.velocityY, false);
        }

        for (let i=0; i<this.powerUps.length;i++)
        {
            if (this.rectangleCollision(this.powerUps[i].posX, this.powerUps[i].posY, this.powerUps[i].width, this.powerUps[i].height,
                    rocket.posX, rocket.posY, rocket.width, rocket.height, true))
            {
                this.powerUps[i].active = false;
                this.emit(Level.EVENT_POWER_UP, this.powerUps[i].power);
                this.removeChild(this.powerUps[i]);
                this.powerUps.splice(i, 1);
            }
            else if (this.powerUps[i].posY > Game.HEIGHT)
            {
                this.powerUps[i].active = false;
                this.removeChild(this.powerUps[i]);
                this.powerUps.splice(i, 1);
            }
        }

        for (let i=0; i<this.enemies.length;i++)
        {
            if (this.rectangleCollision(this.enemies[i].posX, this.enemies[i].posY, this.enemies[i].width, this.enemies[i].height,
                    rocket.posX, rocket.posY, rocket.width, rocket.height, true))
            {
                createjs.Sound.play(Game.AUDIO_SOURCE_ENEMY);
                ball.emit(Level.EVENT_BALL_OUT);
                this.enemies[i].active = false;
                this.removeChild(this.enemies[i]);
                this.enemies.splice(i, 1);
            }
            else if (this.rectangleCollision(this.enemies[i].posX, this.enemies[i].posY, this.enemies[i].width, this.enemies[i].height,
                    ball.posX, ball.posY, ball.width, ball.height, true))
            {
                createjs.Sound.play(Game.AUDIO_SOURCE_ENEMY);
                ball.emit(Level.EVENT_BALL_OUT);
                this.enemies[i].active = false;
                this.removeChild(this.enemies[i]);
                this.enemies.splice(i, 1);
            }
            else if (this.enemies[i].posY > Game.HEIGHT)
            {
                this.enemies[i].active = false;
                this.removeChild(this.enemies[i]);
                this.enemies.splice(i, 1);
            }
        }
    }

    protected calculateVelocity(ballX:number, ballR:number, rectX:number, rectWidth:number):number[]
    {
        let sideHit = ballX - 1 >= rectX + rectWidth || ballX + ballR*2 + 1 <= rectX;
        if (ballX + ballR <= rectX + rectWidth / 5)
        {
            if(sideHit)
                return [-1, 1];
            else
                return [-1, -1];
        }
        else if (ballX+ballR <= rectX + 2*rectWidth / 5)
        {
            return [-0.5, -1];
        }
        else if (ballX+ballR <= rectX + 3*rectWidth / 5)
        {
            return [Math.random() * 0.2 - 0.1, -1];
        }
        else if (ballX+ballR <= rectX + 3*rectWidth / 5)
        {
            return [0.5, -1];
        }
        else
        {
            if(sideHit)
                return [1, 1];
            else
                return [1, -1];
        }
    }
}