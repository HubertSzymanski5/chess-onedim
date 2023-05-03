import {Component, OnInit} from '@angular/core';
import {Field, FieldOccupiedType, PieceType} from "./field";

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

  ngOnInit(): void {
    this.setupInitialPosition();
  }

  interactWithField(field: Field) {
    if (this.selectedField && field.isPossibleMoveDest) {
      this.move(field);
    } else {
      this.clearPreviousSelection();
      this.selectField(field);
    }
  }

  private move(field: Field) {
    field.setPiece(this.selectedField?.occupiedBy!, this.selectedField?.piece!)
    this.selectedField?.setEmpty();
    this.clearPreviousSelection();
  }

  private selectField(field: Field) {
    if (field.isEmpty()) return;
    this.selectedField = field;

    field.isSelected = true;
    this.markPossibleDestinations(field);
  }

  private markPossibleDestinations(field: Field) {
    const i = field.index;
    switch (field.piece) {
      case PieceType.KING:
        this.kingMoves(i, field);
        break;
      case PieceType.KNIGHT:
        this.knightMoves(i, field);
        break;
      case PieceType.ROOK:
        this.rookMoves(i, field);
        break;
    }
  }

  private rookMoves(i: number, field: Field) {
    let next = i;
    while (++next < 8 && this.fields[next].occupiedBy !== field.occupiedBy) {
      this.fields[next].isPossibleMoveDest = true;
      if (!this.fields[next].isEmpty()) {
        break;
      }
    }
    next = i;
    while (--next < 8 && this.fields[next].occupiedBy !== field.occupiedBy) {
      this.fields[next].isPossibleMoveDest = true;
      if (!this.fields[next].isEmpty()) {
        break;
      }
    }
  }

  private knightMoves(i: number, field: Field) {
    if (i - 2 >= 0 && this.fields[i - 2].occupiedBy !== field.occupiedBy) {
      this.fields[i - 2].isPossibleMoveDest = true;
    }
    if (i + 2 < 8 && this.fields[i + 2].occupiedBy !== field.occupiedBy) {
      this.fields[i + 2].isPossibleMoveDest = true;
    }
  }

  private kingMoves(i: number, field: Field) {
    if (i - 1 >= 0 && this.fields[i - 1].occupiedBy !== field.occupiedBy) {
      this.fields[i - 1].isPossibleMoveDest = true;
    }
    if (i + 1 < 8 && this.fields[i + 1].occupiedBy !== field.occupiedBy) {
      this.fields[i + 1].isPossibleMoveDest = true;
    }
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
