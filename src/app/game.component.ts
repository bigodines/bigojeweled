import {
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';

import { GameService } from './game.service';

/** Block types. */
enum Types {
    A,
    B,
    C,
    D,
    E,
    F,
    G
}
const blockSize = 50;

export class Block {
    public x:number;
    public y:number;
    public block:any

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
    protected numrows = 8;
    protected numlines = 8;

    protected selected:Array<Block> = [];

    @ViewChild("canvas") canvas: ElementRef;

    constructor(private service: GameService) {

     }

    ngOnInit() {
        //console.log(this.canvas);
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
        //console.log(this.grid);
    }

    wipe() {
        this.ctx.clearRect(0, 0, 400, 400);
    }

    draw() {
        let x:number;
        let y:number;

        this.wipe();
        for(x = 0; x < this.numrows; x++) {
            for(y = 0; y < this.numlines; y++) {
                this.print(x, y, this.grid[x][y]);
            }
        }

    }

    print(x: number, y: number, type: any) {
        let color: String = 'white';

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
        } 
        this.ctx.fillStyle = color as string;
        this.ctx.fillRect(x*blockSize, y*blockSize, blockSize-1, blockSize-1);
    }

    clicked(event) {
        var x:number = event.clientX;
        var y:number = event.clientY;
        var previousSelection:Block = <Block>{};
        var currentSelection:Block = this._getBlockAt(x,y);

        // console.log(currentSelection);

        if (this.selected.length === 0) {
            this.selected.push(currentSelection);
        } else {
            previousSelection = this.selected[0];
            // Only X or Y can change from previous selection
            if (currentSelection.x != previousSelection.x && currentSelection.y != previousSelection.y)  {
                
                console.debug('not straight', currentSelection, previousSelection);
                this.selected = [];
                return;
            }
            if (Math.abs(currentSelection.x - previousSelection.x) > 1 || Math.abs(currentSelection.y - previousSelection.y) > 1) {
                console.debug('too far', currentSelection, previousSelection);

                this.selected = [];
                return;
            }

            // Swap!
            this.grid = this.swap(this.grid, previousSelection, currentSelection);
            this.selected = [];
            this.draw();

        }
    }

    swap(grid, previousSelection, currentSelection) {
        grid[previousSelection.x][previousSelection.y] = currentSelection.block;
        grid[currentSelection.x][currentSelection.y] = previousSelection.block;
        return grid ;    
    }

    _getBlockAt(canvas_x:number, canvas_y:number): Block {
        let x = Math.floor(canvas_x/blockSize);
        let y = Math.floor(canvas_y/blockSize);
        return <Block>{ 
            x: x, 
            y: y, 
            block: this.grid[x][y] 
        };
    }

    /** helper candidates */
    /** Get a random element  from ENUM */
    _getRandomEnum<E>(e: any): any {
        let keys =Object.keys(e).filter(key => !isNaN(Number(e[key]))),
            index = Math.floor(Math.random() * keys.length),
            k = keys[index];
        return Types[<string>k];
    }
}
