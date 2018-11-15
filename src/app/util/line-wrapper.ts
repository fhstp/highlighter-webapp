import * as d3 from 'd3';
import { LineModel, Markup } from '../shared/line.model';

export class LineWrapper {

    private fontFam;
    private fontSize;
    private font_size_char;
    private line_height;

    public initByElement(element) {

        this.fontFam = window.getComputedStyle(element, null).getPropertyValue('font-family');
        this.fontSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
        const cssLineHeight = window.getComputedStyle(element, null).getPropertyValue('line-height');
        // console.log('font ' + this.fontFam + ' ' + this.fontSize);

        this.initByFontSpec([this.fontFam], [this.fontSize], cssLineHeight);
        // console.log(this.font_size_char);
    }

    /**
     * translated to TypeScript and d3.js by alex.rind 30 Oct 2018 based on:
     * {@link https://stackoverflow.com/a/3738797/1140589}
     * jQuery getFontSizeCharObject
     * @version 1.0.0
     * @date September 18, 2010
     * @since 1.0.0, September 18, 2010
     * @package jquery-sparkle {@link http://www.balupton/projects/jquery-sparkle}
     * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
     * @copyright (c) 2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
     * @license Attribution-ShareAlike 2.5 Generic {@link http://creativecommons.org/licenses/by-sa/2.5/}
     */
    public initByFontSpec(fonts: Array<string>, sizes: Array<string>, cssLineHeight: string) {
        const lfonts = fonts || ['Arial', 'Times'],
            lsizes = sizes || ['12px', '14px'],
            lchars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'y', 'x', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'X', 'Z',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '=',
                '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+',
                '[', ']', '{', '}', '\\', '|',
                // tslint:disable-next-line:quotemark
                ';', "'", ':', '"',
                ',', '.', '/', '<', '>', '?', ' '],
            font_size_char = {},

            $body = d3.select('body'),
            $span = $body.append('span')
                .style('padding', 0)
                .style('margin', 0)
                .style('letter-spacing', 0)
                .style('word-spacing', 0);

        lfonts.forEach((font, i) => {
            $span.style('font-family', font);
            font_size_char[font] = font_size_char[font] || {};
            lsizes.forEach((size) => {
                $span.style('font-size', size);
                font_size_char[font][size] = font_size_char[font][size] || {};
                lchars.forEach((char) => {
                    if (char === ' ') {
                        $span.html('&nbsp;');
                    } else {
                        $span.text(char);
                    }
                    const width = ($span.node() as HTMLElement).getBoundingClientRect().width || 0;
                    font_size_char[font][size][char] = width;
                });
            });
        });
        $span.remove();
        this.font_size_char = font_size_char;

        // guess line height
        const line_height = {};
        const $div = $body.append('div')
            .style('padding', 0)
            .style('margin', 0)
            .style('letter-spacing', 0)
            .style('word-spacing', 0)
            .style('line-height', cssLineHeight);

        lfonts.forEach((font, i) => {
            $div.style('font-family', font);
            line_height[font] = line_height[font] || {};
            lsizes.forEach((size) => {
                $div.style('font-size', size);
                line_height[font][size] = line_height[font][size] || {};
                $div.html('M');
                const oneline = ($div.node() as HTMLElement).getBoundingClientRect().height || 0;
                $div.html('M<br>M');
                const twoline = ($div.node() as HTMLElement).getBoundingClientRect().height || 0;
                line_height[font][size] = twoline - oneline;
                // console.log('h ' + twoline + ' ' + oneline);
            });
        });
        $div.remove();
        this.line_height = line_height;
    }

    public wrapText(tokens: Array<string>, maxLineWidth: number): Array<LineModel> {
        const charWidth = this.font_size_char[this.fontFam][this.fontSize];
        // console.log(charWidth);

        // find widest char (which will be used for unknown char)
        let charWidthMax = 0;
        for (const char in charWidth) {
            if (charWidth.hasOwnProperty(char)) {
                charWidthMax = Math.max(charWidthMax, charWidth[char]);
            }
        }

        const mLines = Array<LineModel>(0);

        let markedText = '';
        let cTokens = [];
        let lineWidth = 0;
        let yPos = 1;

        tokens.forEach((token) => {
            if (token === '\n' || token.trim() === '<br>') {
                // finish line
                mLines.push(new LineModel(yPos++, markedText, cTokens));
                // reset
                markedText = '';
                cTokens = [];
                lineWidth = 0;
            } else {
                const next = new Markup();
                if (token.startsWith('<span')) {
                    next.class = token.replace(/<span class=(?:\"|\')([a-z]*)(?:\"|\')>.*/, '$1');
                    next.text = token.replace(/<span class=(?:\"|\')[a-z]*(?:\"|\')>(.*)<\/span>/, '$1');
                    // console.log(token + ' -> ' + next.text);
                } else {
                    next.class = 'x-none';
                    next.text = token;
                }

                // sum of char widths
                let tokenWidth = 0;
                for (const char of next.text) {
                    tokenWidth += charWidth.hasOwnProperty(char) ? charWidth[char] : charWidthMax;
                }

                if ((lineWidth + charWidth[' '] + tokenWidth) >= maxLineWidth) {
                    // finish line
                    mLines.push(new LineModel(yPos++, markedText, cTokens));
                    // start next line
                    markedText = token + ' ';
                    next.start = 0;
                    next.end = next.start + tokenWidth;
                    cTokens = [next];
                    lineWidth = tokenWidth + charWidth[' '];
                } else {
                    // just a normal token in middle of line
                    markedText += token + ' ';
                    next.start = lineWidth;
                    next.end = next.start + tokenWidth;
                    cTokens.push(next);
                    lineWidth += tokenWidth + charWidth[' '];
                }
            }
        });
        // finish line
        mLines.push(new LineModel(yPos++, markedText, cTokens));

        return mLines;
    }

    public getLineHeight() {
        return this.line_height[this.fontFam][this.fontSize];
    }
}
