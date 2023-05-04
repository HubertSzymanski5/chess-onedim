import {Component, OnInit} from '@angular/core';
import {Field, FieldOccupiedType, PieceType} from "./field";
import {Player} from "../player";
import {PositionValidatorService} from "../position-validator.service";
import {cloneDeep} from "lodash";

const BOARD_LENGTH = 8;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  fields: Field[] = [...Array(BOARD_LENGTH)
    .fill(null)
    .map((_, i) => new Field(i))];

  private selectedField?: Field;
  private turn: Player = Player.WHITE;

  constructor(private positionValidator: PositionValidatorService) {
  }

  ngOnInit(): void {
    this.setupInitialPosition();
  }

  interactWithField(field: Field) {
    if (this.selectedField == field) {
      this.clearPreviousSelection();
    } else if (this.selectedField && field.isPossibleMoveDest) {
      this.move(field);
    } else {
      this.clearPreviousSelection();
      this.selectField(field);
    }
  }

  private move(field: Field) {
    field.setPiece(this.selectedField?.occupiedBy!, this.selectedField?.piece!)
    this.selectedField?.setEmpty();
    this.turn = this.turn === Player.WHITE ? Player.BLACK : Player.WHITE;
    this.clearPreviousSelection();
  }

  private selectField(field: Field) {
    if (field.isEmpty() || field.occupiedBy.valueOf() != this.turn.valueOf()) return;
    this.selectedField = field;

    field.isSelected = true;
    this.positionValidator.markValidDestinations(this.fields, field, this.turn);
    // this.markPossibleDestinations(field);
  }

  private clearPreviousSelection() {
    this.selectedField = undefined;
    this.fields.forEach(field => {
      field.isSelected = false;
      field.isPossibleMoveDest = false;
    });
  }

  private setupInitialPosition() {
    this.fields[0].setPiece(FieldOccupiedType.WHITE, PieceType.KING)
    this.fields[1].setPiece(FieldOccupiedType.WHITE, PieceType.KNIGHT)
    this.fields[2].setPiece(FieldOccupiedType.WHITE, PieceType.ROOK)
    this.fields[5].setPiece(FieldOccupiedType.BLACK, PieceType.ROOK)
    this.fields[6].setPiece(FieldOccupiedType.BLACK, PieceType.KNIGHT)
    this.fields[7].setPiece(FieldOccupiedType.BLACK, PieceType.KING)
  }
}
