
export interface Markup {
    start: number;
    end: number;
    class: string;
}

export class LineModel {

    yPos: number;
    // markedTokens: Array<string>;
    markedText: string;
    markup: Array<Markup>;

    constructor(yPos: number, markedText: string, markup: Array<Markup>) {
        this.yPos = yPos;
        this.markedText = markedText;
        this.markup = markup;
    }

}
