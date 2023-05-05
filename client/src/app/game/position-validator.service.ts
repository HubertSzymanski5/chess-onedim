import {Injectable} from '@angular/core';
import {Field, FieldOccupiedType, PieceType} from "./board/field";
import {Player} from "./player";
import {cloneDeep} from "lodash";

@Injectable({
  providedIn: 'root'
})
export class PositionValidatorService {

  constructor() {
  }

  checkForTheEnd(board: Field[], turn: Player) {
    console.log(board.filter(f => f.isPossibleMoveDest));
    const boardCopy = this.boardWithAllControlledFields(board, turn);
    const noValidMoves = boardCopy.filter(f => f.isPossibleMoveDest).length === 0;
    const isCurrentPlayerInCheck = this.boardWithAllControlledFields(board, this.nextPlayer(turn))
      .filter(f => f.occupiedBy.valueOf() === turn.valueOf()
      && f.piece === PieceType.KING
      && f.isPossibleMoveDest).length !== 0;
    return noValidMoves ? isCurrentPlayerInCheck ? `${this.nextPlayer(turn).toUpperCase()} WINS` : "PAT" : undefined;
  }

  private boardWithAllControlledFields(board: Field[], turn: Player): Field[] {
    return board.filter(field => field.occupiedBy.valueOf() === turn.valueOf())
      .map(field => {
        const clonedBoard = cloneDeep(board);
        this.markValidDestinations(clonedBoard, field, turn);
        return clonedBoard;
      })
      .reduce((result, current) => {
        result.forEach((field, index) => {
          field.isPossibleMoveDest ||= current[index].isPossibleMoveDest;
        });
        return result;
      });
  }

  markValidDestinations(board: Field[], selected: Field, turn: Player): void {
    this.markAllDestinations(board, selected);
    board
      .filter(field => field.isPossibleMoveDest)
      .forEach(field => {
        const boardIfMoved = this.getNewPosition(board, selected, field.index)
        field.isPossibleMoveDest = this.validate(boardIfMoved, this.nextPlayer(turn));
      });
  }

  private validate(board: Field[], turn: Player): boolean {
    board.forEach(field => field.isPossibleMoveDest = false);
    board
      .filter(field => field.occupiedBy.valueOf() === turn.valueOf())
      .forEach(field => this.markAllDestinations(board, field));

    return this.isOpponentKingExposedToCapture(board, turn);
  }

  private isOpponentKingExposedToCapture(board: Field[], turn: Player) {
    return board
      .filter(field => field.occupiedBy.valueOf() === this.nextPlayer(turn).valueOf()
        && field.piece === PieceType.KING
        && field.isPossibleMoveDest).length === 0;
  }

  private markAllDestinations(board: Field[], selected: Field): void {
    const i = selected.index;
    switch (selected.piece) {
      case PieceType.KING:
        this.markPossibleKingMoves(i, selected, board);
        break;
      case PieceType.KNIGHT:
        this.markPossibleKnightMoves(i, selected, board);
        break;
      case PieceType.ROOK:
        this.markPossibleRookMoves(i, selected, board);
        break;
    }
  }

  private getNewPosition(board: Field[], selected: Field, next: number) {
    const newPosition = cloneDeep(board);
    const newField = newPosition[selected.index];
    newPosition[next].setPiece(newField.occupiedBy, newField.piece!);
    newField.setEmpty();
    return newPosition;
  }

  private markPossibleRookMoves(i: number, selected: Field, board: Field[]) {
    let next = i;
    while (++next < 8 && board[next].occupiedBy !== selected.occupiedBy) {
      board[next].isPossibleMoveDest = true;
      if (!board[next].isEmpty()) {
        break;
      }
    }
    next = i;
    while (--next < 8 && board[next].occupiedBy !== selected.occupiedBy) {
      board[next].isPossibleMoveDest = true;
      if (!board[next].isEmpty()) {
        break;
      }
    }
  }

  private markPossibleKnightMoves(i: number, selected: Field, board: Field[]) {
    if (i - 2 >= 0 && board[i - 2].occupiedBy !== selected.occupiedBy) {
      board[i - 2].isPossibleMoveDest = true;
    }
    if (i + 2 < 8 && board[i + 2].occupiedBy !== selected.occupiedBy) {
      board[i + 2].isPossibleMoveDest = true;
    }
  }

  private markPossibleKingMoves(i: number, selected: Field, board: Field[]) {
    if (i - 1 >= 0 && board[i - 1].occupiedBy !== selected.occupiedBy) {
      board[i - 1].isPossibleMoveDest = true;
    }
    if (i + 1 < 8 && board[i + 1].occupiedBy !== selected.occupiedBy) {
      board[i + 1].isPossibleMoveDest = true;
    }
  }

  private nextPlayer(turn: Player): Player {
    return turn === Player.WHITE ? Player.BLACK : Player.WHITE;
  }
}

function printBoard(fields: Field[]) {
  let boardStr = "";
  fields.forEach(f => {
    if (f.isEmpty()) {
      boardStr += ".";
    } else {
      let s = "";
      switch (f.piece) {
        case PieceType.KING:
          s = 'k';
          break;
        case PieceType.KNIGHT:
          s = 'n';
          break;
        case PieceType.ROOK:
          s = 'r';
          break;

      }
      if (f.occupiedBy === FieldOccupiedType.WHITE) {
        boardStr += s.toUpperCase();
      } else {
        boardStr += s;
      }
    }
  });
  console.log(boardStr);
}
