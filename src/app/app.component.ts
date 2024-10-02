import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { mxGraph, mxGraphModel } from 'mxgraph';
import mx from '../mxgraph';

console.log(mx.mxClient.VERSION);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  title = 'ergomxgraph';
  positionX: number = 0;
  positionY: number = 0;
  itemHeight: number = 0;
  itemWidth: number = 0;
  disableInput: boolean = true;
  @ViewChild("graphContainer") graphContainerRef: ElementRef;
  graph!: mxGraph;
  undoManager = new mx.mxUndoManager();

  ngOnInit(): void {

  }


  get container() {
    return this.graphContainerRef.nativeElement;
  }

  ngAfterViewInit(): void {
    if (mx.mxClient.isBrowserSupported()) {
      console.log('Yes! Yes!');
    }

    this.graph = new mx.mxGraph(this.container) as mxGraph;
    this.graph.autoExtend = false;
    this.graph.maximumContainerSize = new mx.mxRectangle(0, 0, this.scaleSizes(2408), this.scaleSizes(3508));
    this.graph.minimumContainerSize = new mx.mxRectangle(0, 0, this.scaleSizes(2408), this.scaleSizes(3508));
    this.graph.setResizeContainer(true);

    console.log('scaleSizes', this.scaleSizes(3508));
    console.log('convertToRealValue', this.convertToRealValue(this.scaleSizes(3508)));

    // ------------------
    var listener = (sender: any, evt: any) => this.undoFunc(sender, evt);
    this.graph.getModel().addListener(mx.mxEvent.UNDO, listener);
    this.graph.getView().addListener(mx.mxEvent.UNDO, listener);
    // -------------------------------------

    this.graph.minimumGraphSize = new mx.mxRectangle(0, 0, this.scaleSizes(2408), this.scaleSizes(3508));
    this.graph.border = 1;
    var img = new mx.mxImage('https://porequest.s3.us-east-1.amazonaws.com/pageTemplates/a80d4ed6-1e55-4c88-81a3-4efb0ccce217.png', this.scaleSizes(2408), this.scaleSizes(3508));
    this.graph.setBackgroundImage(img);
    this.graph.gridSize = 2;
    const model: mxGraphModel = this.graph.getModel();
    model.beginUpdate();
    try {
      const parent = this.graph.getDefaultParent();

      // this.graph.insertVertex(parent, '', 'TEST', 0, 0, 100, 100);
      const vertex1 = this.graph.insertVertex(parent, '1', 'Item 1', this.scaleSizes(55.5), this.scaleSizes(1671.5), this.scaleSizes(892), this.scaleSizes(776), 'selectable=1;connectable=0;editable=0;movable=1;');
      const vertex2 = this.graph.insertVertex(parent, '1', 'Item 2', this.scaleSizes(891.5), this.scaleSizes(1671.5), this.scaleSizes(892), this.scaleSizes(776));
      const vertex3 = this.graph.insertVertex(parent, '1', 'Item 3', this.scaleSizes(1687.5), this.scaleSizes(1671.5), this.scaleSizes(892), this.scaleSizes(776));

      // const vertex2 = this.graph.insertVertex(parent, '2', 'Item 2', 0, 0, 200, 200);
      // const vertex3 = this.graph.insertVertex(parent, '3', 'Item 3', 0, 0, 200, 200);
      // const vertex4 = this.graph.insertVertex(parent, '4', 'Item 4', 0, 0, 200, 200);
      // const vertex5 = this.graph.insertVertex(parent, '5', 'Item 5', 0, 0, 200, 200);
      // const vertex6 = this.graph.insertVertex(parent, '6', 'Item 6', 0, 0, 200, 200);
      // const vertex7 = this.graph.insertVertex(parent, '7', 'Item 6', 0, 0, 200, 200, `shape=${mx.mxConstants.SHAPE_LINE};fill=orange`);
      console.log('nextId: ', model.nextId);

    } finally {
      model.endUpdate();
    }

    this.graph.getSelectionModel()
      .addListener(mx.mxEvent.CHANGE, (sender, evt) => this.onChange(sender, evt));

    this.graph.addListener(mx.mxEvent.CELLS_MOVED, (sender, evt) => this.onCellMovedOrResized(sender, evt));
    this.graph.addListener(mx.mxEvent.CELLS_RESIZED, (sender, evt) => this.onCellMovedOrResized(sender, evt));
    // this.graph.addListener(mx.mxEvent.CLICK, function (sender, evt) {
    //   var cells = evt.getProperty('added');

    //   console.log('currentEdit', cells);
    // });
  }

  onCellMovedOrResized(sender: any, evt: any) {
    var cell = evt.getProperties("cell");
    if (cell && cell.cells[0]) {
      console.log('CellMovedOrResized', cell.cells[0]);
      console.log('CellMovedOrResized X', cell.cells[0].geometry.x);
      console.log('CellMovedOrResized Y', cell.cells[0].geometry.y);
      this.positionX = cell.cells[0].geometry.x;
      this.positionY = cell.cells[0].geometry.y;
      this.itemHeight = cell.cells[0].geometry.height;
      this.itemWidth = cell.cells[0].geometry.width;
    }

  }

  onChange(sender: any, evt: any) {
    var cells = evt.getProperty('added');
    // console.log(cells);
    for (var i = 0; i < cells.length; i++) {
      // Handle cells[i]...
      console.log(cells[i]);
    }
  }

  printSelectedCell() {
    var cell = this.graph.getSelectionCell();
    if (cell) {
      console.log('currentEdit', cell);
      this.positionX = cell.geometry.x;
      this.positionY = cell.geometry.y;
      this.itemHeight = cell.geometry.height;
      this.itemWidth = cell.geometry.width;
      this.disableInput = false;
    }
    else {
      console.log('No Selected Item');
      this.positionX = 0;
      this.positionY = 0;
      this.itemHeight = 0;
      this.itemWidth = 0;
      this.disableInput = true;
    }
  }

  applyChangedValues() {
    var cell = this.graph.getSelectionCell();
    if (cell) {
      var geo = cell.geometry.clone();
      geo.x = this.positionX;
      geo.y = this.positionY;
      geo.height = this.itemHeight;
      geo.width = this.itemWidth;
      const model: mxGraphModel = this.graph.getModel();
      model.setGeometry(cell, geo);
      this.graph.refresh();
    }
  }

  addCell() {
    const model: mxGraphModel = this.graph.getModel();
    model.beginUpdate();
    try {
      const parent = this.graph.getDefaultParent();
      const nextId = model.nextId;
      this.graph.insertVertex(parent, `${nextId}`, `Item ${nextId}`, this.scaleSizes(0), this.scaleSizes(0), this.scaleSizes(892), this.scaleSizes(776), 'selectable=1;connectable=0;editable=0;movable=1;');

    } finally {
      model.endUpdate();
    }
  }

  deleteCell() {
    var cell = this.graph.getSelectionCell();
    if (cell) {
      const model: mxGraphModel = this.graph.getModel();
      model.remove(cell);
      this.graph.refresh();
    }
  }

  printItemsLocations() {
    // this.graph.zoomOut();
    console.log(this.graph);
    console.log(this.graph.getModel());
    // var cell = this.graph.getSelectionCell();
    // console.log('currentEdit', cell);

    var itemsPositions = this.graph.getModel().cells;
    console.log(itemsPositions);
    console.log('x: ', itemsPositions[2].geometry.x);
    console.log('y: ', itemsPositions[2].geometry.y);
    console.log('height: ', itemsPositions[2].geometry.height);
    console.log('width: ', itemsPositions[2].geometry.width);
    console.log('convertToRealValue: --------------------');
    console.log('x: ', this.convertToRealValue(itemsPositions[2].geometry.x));
    console.log('y: ', this.convertToRealValue(itemsPositions[2].geometry.y));
    console.log('height: ', this.convertToRealValue(itemsPositions[2].geometry.height));
    console.log('width: ', this.convertToRealValue(itemsPositions[2].geometry.width));
    // itemsPositions.forEach(element => {
    //   if (element && element.geometry)
    //     console.log(element.geometry);

    // });
    const parent = this.graph.getDefaultParent();
    let children = this.graph.getChildCells(parent);
    console.log(children);

    // this.graph.moveCells(children, undefined, 20);  // assuming you want to "move your graph 20px to the bottom"
    // this.graph.model.endUpdate();
  }

  zoomOut() {
    this.graph.zoomOut();
    this.graph.zoom(1, true);
  }

  undoFunc(sender: any, evt: any): any {
    this.undoManager.undoableEditHappened(evt.getProperty('edit'));
  }

  undo() {
    this.undoManager.undo();
  }

  scaleSizes(value: number, percentage: number = 5 /* % */): number {
    return (value / percentage);
  }

  convertToRealValue(value: number, percentage: number = 5 /* % */): number {
    return value * percentage;
  }
}
