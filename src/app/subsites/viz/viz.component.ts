import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Aurum } from '../../shared/aurum.model';
import { DataStorageService } from '../../shared/data-storage.service';
import { LineModel, Markup } from '../../shared/line.model';
import { domRendererFactory3 } from '@angular/core/src/render3/interfaces/renderer';
import { LineWrapper } from 'src/app/util/line-wrapper';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VizComponent implements OnInit {

  private storedData: Aurum;
  private storedData2: Aurum;

  private textModel: Array<LineModel>;
  private wrapper: LineWrapper;

  private yExtent: [undefined, undefined] | [number, number];
  private detailStart = 1;
  private linesToShow = 10;
  private brushScale;

  isComparison: boolean;
  firstWebsiteName: string;
  secondWebsiteName: string;

  @ViewChild('dataContainer') dataContainer: ElementRef;
  @ViewChild('dataContainer2') dataContainer2: ElementRef;
  @ViewChild('dataOverview') dataOverview: ElementRef;

  constructor(private dataStorage: DataStorageService) { }

  /**
   * Here we subscribe to the data storage service which is essential in order to
   * retrieve the data upon arrival.
   */
  ngOnInit() {
    // Check if we are in comparison mode or not
    this.isComparison = this.dataStorage.isComparsion;

    // TODO: Add maybe take(1) as we only need the values once anc can unsubscribe later
    this.dataStorage.currentData.subscribe((data) => {
      console.log('%c TRIGGERED | first data storage... observable',
      'background: #222; color: aquamarine;');

      this.storedData = data;

      this.renderText(this.storedData);
    });

    // We need to subscribe only if its a comparison
    if (this.isComparison) {
      this.dataStorage.currentData2.subscribe((data) => {
        console.log('%c TRIGGERED | second data storage... observable',
        'background: #222; color: aquamarine;');

        this.storedData2 = data;
        this.renderSecondText(this.storedData2);
      });
    }
  }

  /**
   * This method is currently used to render just the received data and show it on the screen.
   * @param data to show to the user
   */
  private renderText(data: Aurum) {
    console.log('%c FROM component | Inside renderText() function (ONE INPUT).',
    'background: #222; color: orange;');

    this.firstWebsiteName = data.link;

    if (isNullOrUndefined(this.wrapper)) {
      this.wrapper = new LineWrapper();
      this.wrapper.initByElement(this.dataContainer.nativeElement);
    }
    const textWidth = this.dataContainer.nativeElement.getBoundingClientRect().width - 22;
    this.textModel = this.wrapper.wrapText(data.markupString, textWidth);

    this.calculateSpace();
    this.renderDetail();
    this.renderOverview(this.textModel);
  }

  private calculateSpace() {
    this.yExtent = d3.extent(this.textModel.map((l) => l.yPos));
    this.detailStart = this.yExtent[0];

    // calculate detail extent based on heigth of detail comp & measured lineHeight
    const detailHeight = this.dataContainer.nativeElement.getBoundingClientRect().height
      // substract 40% of a line height
      - this.wrapper.getLineHeight() * 0.4;
    const possLinesToShow = Math.floor(detailHeight / this.wrapper.getLineHeight());
    this.linesToShow = Math.min(possLinesToShow, this.yExtent[1] - this.yExtent[0]);
    console.log('extent: ' + detailHeight + ' / ' + this.wrapper.getLineHeight() + ' = ' + this.linesToShow);
  }

  private renderDetail() {
    console.log('FROM component | Inside renderDetail() function', this.detailStart, this.linesToShow);

    const stringToPrint = this.textModel
      .filter((d) => this.detailStart <= d.yPos && d.yPos <= (this.detailStart + this.linesToShow - 1))
      .map((d) => d.markedText)
      .join('\n');
    this.dataContainer.nativeElement.innerHTML = stringToPrint;
  }

  private renderOverview(textModel: Array<LineModel>) {
    console.log('FROM component | Inside renderOverview() function');

    // make sure we start clean
    this.dataOverview.nativeElement.innerHTML = '';

    const margin = {top: 4, right: 9, bottom: 4, left: 2};
    const width = +this.dataOverview.nativeElement.getBoundingClientRect().width - margin.left - margin.right;
    const height = +this.dataOverview.nativeElement.getBoundingClientRect().height - margin.top - margin.bottom;

    const minLineStart = textModel.reduce((p, c) => {
      return Math.min(p, c.markup.reduce((p2, c2) => Math.min(p2, c2.start), 1000000));
      }, 1000000);
    const maxLineEnd = textModel.reduce((p, c) => {
      return Math.max(p, c.markup.reduce((p2, c2) => Math.max(p2, c2.end), 0));
      }, 0);

    const x = d3.scaleLinear()
      .rangeRound([0, width])
      .domain([minLineStart, maxLineEnd]);
     console.log('xdom', minLineStart, maxLineEnd, width);


    const y = d3.scaleLinear()
      .rangeRound([0, height])
      .domain(this.yExtent); // .nice();

    const lineHeight = y(Math.min(...textModel.map((p, i, all) => (i > 0) ? p.yPos - all[i - 1].yPos : 100000 ))) - y(0);
    const rectHeight = Math.min(Math.max(Math.ceil(lineHeight * 0.35), 1), 10);
    const yOffset = Math.ceil(rectHeight / -2);

    /// indicator of unformated text
    // textModel.forEach((d) => { d.markup.forEach((m) => { if (m.start < 100) {console.log('Warning: ', m); } } ); } );

    const svg = d3.select('#dataOverview');
    const g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const linesG = g.selectAll('.line')
      .data(textModel)
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
            // console.log(d);
            // console.log(x(d.start), x(d.end), w);
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

    this.brushScale = (d, i) => i === 0 ? y(d) + yOffset - 1 : y(d) - yOffset + 1;
    const brush = d3.brushY()
        .extent([[-1, yOffset - 1], [width + 1, height - yOffset + 1]])
        .on('end', () => {
          if (!d3.event.sourceEvent) { return; } // Only transition after input.
          // console.log(d3.event);

          const d0 = d3.event.selection.map((d) => y.invert(d - yOffset));
          console.log(d0);
          const d1 = d0.map(Math.round);

          // correct extent and at edges
          if (d1[1] > this.yExtent[1]) {
            d1[0] = this.yExtent[1] - this.linesToShow + 1;
          }
          if (d1[0] < this.yExtent[0]) {
            d1[0] = this.yExtent[0];
          }
          d1[1] = d1[0] + this.linesToShow - 1;
          const y1 = d1.map(this.brushScale);
          this.detailStart = d1[0];
          this.renderDetail();
          d3.select('g.brush').transition().call(d3.event.target.move, y1);
        });

    // g.append('g')
    //   .attr('class', 'brush')
    //   .call(brush);


    const gBrush = g.append('g')
        .attr('class', 'brush')
        .call(brush)
      .call(brush.move, [this.detailStart, this.linesToShow].map(this.brushScale));

    // removes handle to resize the brush
    d3.selectAll('.brush>.handle').remove();
    // removes crosshair cursor
    d3.selectAll('.brush>.overlay').remove();
  }


  /**
   * This method is only used if we are in comparison mode.
   * @param data to show in the second input
   */
  private renderSecondText(data: Aurum) {
    console.log('%c FROM component | Inside renderSecondText() function (TWO INPUTS)',
    'background: #222; color: orange;');

    this.secondWebsiteName = data.link;
    const stringToPrint = data.markupString.join(' ');
    this.dataContainer2.nativeElement.innerHTML = stringToPrint;
  }
}
