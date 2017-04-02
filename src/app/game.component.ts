import { 
    Component,
    OnInit
} from '@angular/core';

import { GameService } from './game.service';

/**
 *  Game screen component
 * */
@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: [ './app.component.css' ]
})
export class GameComponent implements OnInit {
  
  constructor(private service: GameService) { }

  ngOnInit() {
      this.buildSprite();
      this.buildBoard();
      console.log(this.service);
  }

  /** does nothing for now. */
  buildSprite() {
      return;
  }

  buildBoard() {

  }
}
