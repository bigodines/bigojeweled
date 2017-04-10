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
const numrows = 8;

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

    protected selected:Array<Block> = [];

    // game state
    protected ctx:CanvasRenderingContext2D;
    protected grid:Array<Array<String>> = [];
    @ViewChild("canvas") canvas: ElementRef;
    protected score:number = 0;

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

        for (x = 0; x < numrows; x++) {
            row = [];
            for (y = 0; y < numrows; y++) {
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
        for(x = 0; x < numrows; x++) {
            for(y = 0; y < numrows; y++) {
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

        /**
         * TODO: move this logic to service
         */
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
            this.grid = this.checkBoard(this.grid);
            this.draw();

        }
    }

    swap(grid, previousSelection, currentSelection) {
        grid[previousSelection.x][previousSelection.y] = currentSelection.block;
        grid[currentSelection.x][currentSelection.y] = previousSelection.block;
        return grid ;    
    }

    checkBoard(grid:Array<Array<String>>): Array<Array<String>> {
        var x:number;
        var y:number;

        // coordinates of items to be removed from the board and computed as score.
        var scores:Array<Array<number>> = []; 
        var verticalMatches;
        var horizontalMatches

        /** Using the same loop to match horizontal and vertical sequences */
        for (x=0; x<numrows; x++) {
            // buffer of items that match
            verticalMatches = [[x, 0]];
            for (y=0; y<numrows; y++) {
                let verticalCandidateX = verticalMatches[0][0];
                let verticalCandidateY = verticalMatches[0][1];
                if (grid[x][y] != grid[verticalCandidateX][verticalCandidateY]) {
                    // vertical match!
                    if (verticalMatches.length >= 3) { 
                        verticalMatches.map(function(coordinates) {
                            scores.push(coordinates);
                        })
                    }
                    verticalMatches = [];

                }
                verticalMatches.push([x, y]);
            }
        }

        for (y=0; y<numrows; y++) {
            // buffer of items that match
            horizontalMatches = [[0, y]];

            for (x=0; x<numrows; x++) {
                let horizontalCandidateX = horizontalMatches[0][0];
                let horizontalCandidateY = horizontalMatches[0][1];
                if (grid[x][y] != grid[horizontalCandidateX][horizontalCandidateY]) { 
                    // horizontal match!
                    if(horizontalMatches.length >= 3) { 
                        horizontalMatches.map(function(coordinates) {
                            scores.push(coordinates);
                        })
                    }
                    horizontalMatches = [];
                }
                horizontalMatches.push([x, y]);
            }
        }

        console.log(scores);
        // TODO: FIX-ME
        for (var xy=0; xy<scores.length; xy++) {
            let x:number = scores[xy][0];
            let y:number = scores[xy][1];
            grid[x][y] = "-1";
            this.score = this.score + 10;
        }

        return grid;
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
