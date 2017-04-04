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
    protected numrows = 10
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

        for (x = 0; x < this.numrows; x++) {
            row = [];
            for (y = 0; y < this.numlines; y++) {
                row.push(this._getRandomEnum<Types>(Types));
            }
            this.grid.push(row);
        }
    }

    draw() {
        let x:number;
        let y:number;
        let row:Array<String>;

        for(x = 0; x < this.grid.length; x++) {
            row = this.grid[x];
            for(y = 0; y < row.length; y++) {
                this.print(x, y, row[x][y]);
            }
        }

    }

    print(x:number, y:number, block:String) {
        // TODO: Print one particular element.
        console.log(x,y);
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect((x * 30), (y * 15), 28, 14);
    }


    /** helper candidates */
    /** Get a random element  from ENUM */
    _getRandomEnum<E>(e: any): String {
        var keys = Object.keys(e),
            index = Math.floor(Math.random() * keys.length),
            k = keys[index];
        return k;
    }
}
