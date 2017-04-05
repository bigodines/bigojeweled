import {
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';

import { GameService } from './game.service';

enum Types {
    A,
    B,
    C,
    D,
    E,
    F,
    G
}
/**
 *  Game screen component
 * */
@Component({
    selector: 'game',
    templateUrl: './game.component.html',
    styleUrls: ['./app.component.css']
})
export class GameComponent implements OnInit {

    protected ctx:CanvasRenderingContext2D;
    protected grid:Array<Array<String>> = [];
    protected numrows = 10;
    protected numlines = 10;

    @ViewChild("canvas") canvas: ElementRef;

    constructor(private service: GameService) {

     }

    ngOnInit() {
        console.log(this.canvas);
        this.ctx = this.canvas.nativeElement.getContext("2d");
        this.buildSprite();
        this.buildBoard();
        this.draw();
    }

    /** does nothing for now. */
    buildSprite() {
        return;
    }

    buildBoard() {
        let x:number;
        let y:number;
        let row:Array<any>;
        let rand:number;

        // this.ctx.fillStyle = "black";
        // this.ctx.fillRect(0,0,400, 400);

        for (x = 0; x < this.numrows; x++) {
            row = [];
            for (y = 0; y < this.numlines; y++) {
                var e:any = this._getRandomEnum<Types>(Types);
                row.push(e);
            }
            this.grid.push(row);
        }
        console.log(this.grid);
    }

    draw() {
        let x:number;
        let y:number;

        for(x = 0; x < this.numrows; x++) {
            for(y = 0; y < this.numlines; y++) {
                this.print(x, y, this.grid[x][y]);
            }
        }

    }

    print(x: number, y: number, block: any) {
        // TODO: Print one particular element.
        let color: String;
        let type: Types = Types[<string>block];

        if (type == Types.A) {
            color = 'blue';
        } else if (type == Types.B) {
            color = 'yellow';
        } else if(type == Types.C) {
            color = 'green';
        } else if(type == Types.D) {
            color = 'red';
        } else if(type == Types.E) {
            color = 'orange';
        } else if(type == Types.F) {
            color = 'gray';
        } else if(type == Types.G) {
            color = 'black';
        } else {
            color = 'white';
        }
        // case Types.C: { 
        //     color = 'green';
        //     break;
        // }
        // default: {
        //     color = 'white';
        // }
        this.ctx.fillStyle = color as string;
        this.ctx.fillRect(x * 40, y * 40, 39, 39);
    }


    /** helper candidates */
    /** Get a random element  from ENUM */
    _getRandomEnum<E>(e: any): String {
        var keys =Object.keys(e).filter(key => !isNaN(Number(e[key])));
        var index = Math.floor(Math.random() * keys.length),
            k = keys[index];

        return k;
    }
}
