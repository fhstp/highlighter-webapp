import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { Aurum } from '../../shared/aurum.model';
import { DataStorageService } from '../../shared/data-storage.service';
import { LineModel, Markup } from '../../shared/line.model';
import { LineWrapper } from 'src/app/util/line-wrapper';
import { isNullOrUndefined } from 'util';
import { ContainerElement } from 'd3';

interface TextModel {
  lines: Array<LineModel>;
  extent: [undefined, undefined] | [number, number];
  detailStart: number;
}

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VizComponent implements OnInit, OnDestroy {

  private storedData: Aurum;
  private storedData2: Aurum;

  private text1: TextModel;
  private text2: TextModel;

  private wrapper: LineWrapper;

  private possibleLinesToShow = 10;
  private widthDetail = 400;
  private widthOverview = 100;

  private subscription1;
  private subscription2;

  isComparison = false;
  firstWebsiteName: string;
  secondWebsiteName: string;

  @ViewChild('dataContainer') dataContainer: ElementRef;
  @ViewChild('dataContainer2') dataContainer2: ElementRef;
  @ViewChild('dataOverview') dataOverview: ElementRef;
  @ViewChild('dataOverview2') dataOverview2: ElementRef;

  constructor(private dataStorage: DataStorageService) { }

  /**
   * Here we subscribe to the data storage service which is essential in order to
   * retrieve the data upon arrival.
   */
  ngOnInit() {
    // Check if we are in comparison mode or not
    this.dataStorage.isComparison.subscribe((val) => {
      console.log('%c TRIGGERED | isComparison ' + val + ' ... observable',
        'background: #222; color: hotpink;');
      this.isComparison = val;
    });

    // TODO: Add maybe take(1) as we only need the values once anc can unsubscribe later
    this.subscription1 = this.dataStorage.currentData.subscribe((data) => {
      console.log('%c TRIGGERED | first data storage... observable',
        'background: #222; color: aquamarine;');

      this.storedData = data;
      this.renderText(this.storedData);
    });


    this.subscription2 = this.dataStorage.currentData2.subscribe((data) => {
      console.log('%c TRIGGERED | second data storage... observable',
        'background: #222; color: aquamarine;');

      this.storedData2 = data;
      this.renderSecondText(this.storedData2);

      // render the first again because the div width changed
      if (this.storedData !== undefined) {
        this.renderText(this.storedData);
      }
    });
  }

  /**
   * This method is currently used to render just the received data and show it on the screen.
   * @param data to show to the user
   */
  private renderText(data: Aurum) {
    console.log('%c FROM component | Inside renderText() function (ONE INPUT).',
      'background: #222; color: orange;');

    this.firstWebsiteName = data.link;

    this.wrapper = new LineWrapper();
    this.wrapper.initByElement(this.dataContainer.nativeElement);
    this.calculateDetailLinesToShow();
    this.setWidthAndVisibility();

    const textWidth = this.widthDetail - 22;
    const textModel = this.wrapper.wrapText(data.markupString, textWidth);
    const yExtent = d3.extent(textModel.map((l) => l.yPos));
    this.text1 = { lines: textModel, extent: yExtent, detailStart: yExtent[0] };
    // console.log(this.text1);

    this.renderDetail(this.text1, this.dataContainer);
    this.renderOverview(this.text1, '#dataOverview', this.dataOverview, this.dataContainer);
  }

  private setWidthAndVisibility() {
    const availWidth = (d3.select('#data1Pane').node() as any).getBoundingClientRect().width;

    if (this.isComparison) {
      d3.select('#comparisonContainer').style('display', 'block');
      d3.select('#dataOverview2').style('display', 'block');
      d3.select('#dataDetail2').style('display', 'block');

      this.widthOverview = availWidth * 0.11;
      this.widthDetail = availWidth * 0.35;
    } else {
      d3.select('#comparisonContainer').style('display', 'none');
      d3.select('#dataOverview2').style('display', 'none');
      d3.select('#dataDetail2').style('display', 'none');

      this.widthOverview = availWidth * 0.2;
      this.widthDetail = availWidth * 0.7;
    }

    d3.selectAll('.textOverview').style('width', this.widthOverview + 'px');
    d3.selectAll('.textContainer').style('width', this.widthDetail + 'px');

  }

  private calculateDetailLinesToShow() {
    // calculate detail extent based on heigth of detail comp & measured lineHeight
    const detailHeight = this.dataContainer.nativeElement.getBoundingClientRect().height
      // substract 40% of a line height
      - this.wrapper.getLineHeight() * 0.4;
    this.possibleLinesToShow = Math.floor(detailHeight / this.wrapper.getLineHeight());
    // console.log('linesToShow: ' + detailHeight + ' / ' + this.wrapper.getLineHeight() + ' = ' + this.possibleLinesToShow);
  }

  private renderDetail(text: TextModel, elem: ElementRef) {
    console.log('%c FROM component | Inside renderDetail() function', 'background: #222; color: orange;');

    const stringToPrint = text.lines
      .filter((d) => text.detailStart <= d.yPos && d.yPos < (text.detailStart + this.possibleLinesToShow))
      .map((d) => d.markedText)
      .join('\n');
    elem.nativeElement.innerHTML = stringToPrint;
  }

  private renderOverview(text: TextModel, overviewSelector: string, overviewElem: ElementRef, detailElem: ElementRef) {
    console.log('%c FROM component | Inside renderOverview() function', 'background: #222; color: orange;');

    // make sure we start clean
    overviewElem.nativeElement.innerHTML = '';

    const margin = { top: 4, right: 9, bottom: 4, left: 2 };
    const width = +this.widthOverview - margin.left - margin.right;
    const height = +overviewElem.nativeElement.getBoundingClientRect().height - margin.top - margin.bottom;

    const linesToShow = Math.min(this.possibleLinesToShow, text.extent[1] - text.extent[0] + 1);

    const minLineStart = text.lines.reduce((p, c) => {
      return Math.min(p, c.markup.reduce((p2, c2) => Math.min(p2, c2.start), 1000000));
    }, 1000000);
    const maxLineEnd = text.lines.reduce((p, c) => {
      return Math.max(p, c.markup.reduce((p2, c2) => Math.max(p2, c2.end), 0));
    }, 0);

    const x = d3.scaleLinear()
      .rangeRound([0, width])
      .domain([minLineStart, maxLineEnd]);
    //  console.log('xdom', minLineStart, maxLineEnd, width);

    const y = d3.scaleLinear()
      .rangeRound([0, height])
      .domain(text.extent); // .nice();

    const lineHeight = y(Math.min(...text.lines.map((p, i, all) => (i > 0) ? p.yPos - all[i - 1].yPos : 100000))) - y(0);
    const rectHeight = Math.min(Math.max(Math.ceil(lineHeight * 0.35), 1), 10);
    const yOffset = Math.ceil(rectHeight / -2);

    /// indicator of unformated text
    // textModel.forEach((d) => { d.markup.forEach((m) => { if (m.start < 100) {console.log('Warning: ', m); } } ); } );

    const svg = d3.select(overviewSelector);
    const g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const linesG = g.selectAll('.line')
      .data(text.lines)
      .enter().append('g')
      .classed('line', true)
      .attr('transform', (d) => 'translate(0,' + y(d.yPos) + ')')
      .selectAll('rect')
      .data((d) => d.markup)
      .enter().append('rect')
      .attr('x', (d) => x(d.start))
      .attr('width', (d) => {
        const w = x(d.end) - x(d.start);
        if (w < 1) {
          return 1;
        } else {
          return x(d.end) - x(d.start);
        }
      })
      .attr('y', yOffset)
      .attr('height', rectHeight)
      .attr('title', (d) => d.text)
      .attr('class', (d) => d.class);
    // .attr('fill', (d) => d.class === 'x-none' ? '#777' : z(d.class) );

    const brushScale = (d, i) => i === 0 ? y(d) + yOffset - 1 : y(d) - yOffset + 1;

    const brush = d3.brushY()
      .extent([[-1, yOffset - 1], [width + 1, height - yOffset + 1]])
      .on('end', () => {
        if (!d3.event.sourceEvent) { return; } // Only transition after input.
        const d0 = d3.event.selection.map((d) => y.invert(d - yOffset));
        const d1 = d0.map(Math.round);

        // correct extent and at edges
        if (d1[1] > text.extent[1]) {
          d1[0] = text.extent[1] - linesToShow + 1;
        }
        if (d1[0] < text.extent[0]) {
          d1[0] = text.extent[0];
        }
        d1[1] = d1[0] + linesToShow - 1;
        const y1 = d1.map(brushScale);
        text.detailStart = d1[0];
        this.renderDetail(text, detailElem);
        d3.select(overviewSelector + ' g.brush').transition().call(d3.event.target.move, y1);
      });

    const gBrush = g.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, [text.detailStart, linesToShow].map(brushScale));

    // removes handle to resize the brush
    d3.selectAll('.brush>.handle').remove();
    // removes overlay that listens on drag selection
    d3.selectAll('.brush>.overlay').remove();

    // instead listen to mouse clicks (result from usab test Nov 2018)
    svg.on('click', () => {
      const coords = d3.mouse(svg.node() as ContainerElement);
      const line = y.invert(coords[1]);
      text.detailStart = line - linesToShow / 2;

      // correct extent at edges
      if (text.detailStart < text.extent[0]) {
        text.detailStart = text.extent[0];
      }
      if (text.detailStart + linesToShow - 1 > text.extent[1]) {
        text.detailStart = text.extent[1] - linesToShow + 1;
      }

      // update brush & detail view
      gBrush.call(brush.move, [text.detailStart, text.detailStart + linesToShow - 1].map(brushScale));
      this.renderDetail(text, detailElem);
    });

    // enable scrolling
    detailElem.nativeElement.addEventListener('wheel', event => {
      const delta = Math.sign(event.wheelDelta);
      text.detailStart -= delta;

      // correct extent at edges
      if (text.detailStart < text.extent[0]) {
        text.detailStart = text.extent[0];
      }
      if (text.detailStart + linesToShow - 1 > text.extent[1]) {
        text.detailStart = text.extent[1] - linesToShow + 1;
      }

      // update brush & detail view
      gBrush.call(brush.move, [text.detailStart, text.detailStart + linesToShow - 1].map(brushScale));
      this.renderDetail(text, detailElem);
    });
  }


  /**
   * This method is only used if we are in comparison mode.
   * @param data to show in the second input
   */
  private renderSecondText(data: Aurum) {
    console.log('%c FROM component | Inside renderSecondText() function (TWO INPUTS)',
      'background: #222; color: orange;');

    this.secondWebsiteName = data.link;
    this.setWidthAndVisibility();

    // const textWidth = 400;
    const textWidth = this.widthDetail - 22;
    const textModel = this.wrapper.wrapText(data.markupString, textWidth);
    const yExtent = d3.extent(textModel.map((l) => l.yPos));

    this.text2 = { lines: textModel, extent: yExtent, detailStart: yExtent[0] };
    this.renderDetail(this.text2, this.dataContainer2);
    this.renderOverview(this.text2, '#dataOverview2', this.dataOverview2, this.dataContainer2);
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
    if (this.subscription2 !== undefined) {
      this.subscription2.unsubscribe();
    }
  }
}
