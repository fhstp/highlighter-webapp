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
      console.log('triggered first data storage... observable');

      this.storedData = data;

      this.renderText(this.storedData);
    });

    // We need to subscribe only if its a comparison
    if (this.isComparison) {
      this.dataStorage.currentData2.subscribe((data) => {
        console.log('triggered second data storage... observable');

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
    console.log('FROM component | Inside renderText() function (ONE INPUT).');

    this.firstWebsiteName = data.link;

    if (isNullOrUndefined(this.wrapper)) {
      this.wrapper = new LineWrapper();
      this.wrapper.initByElement(this.dataContainer.nativeElement);
    }
    this.textModel = this.wrapper.wrapText(data.markupString, 600);

    this.renderOverview(this.textModel);
    this.renderDetail();
  }

  private renderDetail() {
    // calculate extent based on heigth of detail comp & measured lineHeight
    const detailHeight = this.dataContainer.nativeElement.getBoundingClientRect().height
      // substract 40% of a line height
      - this.wrapper.getLineHeight() * 0.4;
    const linesToShow = Math.floor(detailHeight / this.wrapper.getLineHeight());
    console.log('extent: ' + detailHeight + ' / ' + this.wrapper.getLineHeight() + ' = ' + linesToShow);

    const stringToPrint = this.textModel.slice(0, linesToShow).map((d) => d.markedText).join('\n');
    this.dataContainer.nativeElement.innerHTML = stringToPrint;
  }

  private renderOverview(textModel: Array<LineModel>) {
    console.log('FROM component | Inside renderOverview() function');

    // make sure we start clean
    this.dataOverview.nativeElement.innerHTML = '';

    const margin = {top: 3, right: 2, bottom: 4, left: 2};
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
    // console.log('xdom', minLineStart, maxLineEnd);

    const y = d3.scaleLinear()
      .rangeRound([0, height])
      .domain(d3.extent(textModel.map((l) => l.yPos))); // .nice();

    const lineHeight = y(Math.min(...textModel.map((p, i, all) => (i > 0) ? p.yPos - all[i - 1].yPos : 100000 ))) - y(0);
    const rectHeight = Math.min(Math.max(Math.ceil(lineHeight * 0.4), 1), 10);

    // TODO use predefined colors
    const flatClasses = [].concat.apply([], textModel.map((d) => d.markup.map((m) => m.class)));

    const z = d3.scaleOrdinal(d3.schemeCategory10)
      // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
      .domain(flatClasses);

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
        .attr('y', Math.ceil(rectHeight / -2))
        .attr('height', rectHeight)
        .attr('title', (d) => d.text)
        .attr('fill', (d) => z(d.class) );

  }


  /**
   * This method is only used if we are in comparison mode.
   * @param data to show in the second input
   */
  private renderSecondText(data: Aurum) {
    console.log('FROM component | Inside renderSecondText() function (TWO INPUTS)');

    this.secondWebsiteName = data.link;
    const stringToPrint = data.markupString.join(' ');
    this.dataContainer2.nativeElement.innerHTML = stringToPrint;
  }
}
