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

  selectOrMove(field: Field) {
    console.log("> clicked on " + field.index);
    if (this.selectedField && field.isPossibleMoveDest) {
      this.move(field);
    } else {
      this.clearPreviousSelection();
      this.selectField(field);
    }
  }

  private move(field: Field) {
    console.log("> MOVING TO" + field.index);
    field.setPiece(this.selectedField?.occupiedBy!, this.selectedField?.piece!)
    this.selectedField?.setEmpty();
    this.clearPreviousSelection();
  }

  private selectField(field: Field) {
    console.log("> selecting field " + field.index);
    if (field.isEmpty()) return;
    this.selectedField = field;

    field.isSelected = true;
    // mark possible destinations
    const i = field.index;
    switch (field.piece) {
      case PieceType.KING:
        if (i - 1 >= 0 && this.fields[i - 1].occupiedBy !== field.occupiedBy) {
          this.fields[i - 1].isPossibleMoveDest = true;
        }
        if (i + 1 < 8 && this.fields[i + 1].occupiedBy !== field.occupiedBy) {
          this.fields[i + 1].isPossibleMoveDest = true;
        }
        break;
      case PieceType.KNIGHT:
        if (i - 2 >= 0 && this.fields[i - 2].occupiedBy !== field.occupiedBy) {
          this.fields[i - 2].isPossibleMoveDest = true;
        }
        if (i + 2 < 8 && this.fields[i + 2].occupiedBy !== field.occupiedBy) {
          this.fields[i + 2].isPossibleMoveDest = true;
        }
        break;
      case PieceType.ROOK:
        // look forward
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
        break;
    }
  }

  private clearPreviousSelection() {
    console.log("> *** clear selection ***")
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
