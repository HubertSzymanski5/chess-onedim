export class Field {
  index: number;
  occupiedBy: FieldOccupiedType;
  piece?: PieceType;
  isSelected: boolean;
  isPossibleMoveDest: boolean;

  constructor(index: number) {
    this.index = index;
    this.occupiedBy = FieldOccupiedType.EMPTY;
    this.isSelected = false;
    this.isPossibleMoveDest = false;
  }

  isEmpty(): boolean {
    return this.occupiedBy === FieldOccupiedType.EMPTY;
  }

  pieceImgSrc(): string {
    if (this.isEmpty()) {
      throw Error(`There is no piece on this field ${this.index}`);
    }
    return `assets/pieces/${this.occupiedBy}-${this.piece}.png`;
  }

  setEmpty(): void {
    this.piece = undefined;
    this.occupiedBy = FieldOccupiedType.EMPTY;
  }

  setPiece(color: FieldOccupiedType, piece: PieceType) {
    this.occupiedBy = color;
    this.piece = piece;
  }
}

export enum PieceType {
  KING = 'king',
  KNIGHT = 'knight',
  ROOK = 'rook'
}

export enum FieldOccupiedType {
  EMPTY = 'empty',
  WHITE = 'white',
  BLACK = 'black'
}
