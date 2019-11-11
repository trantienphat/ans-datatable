import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
// import { NotificationService } from '~/app/shared-base/services/notification.service';
import { formatNumber, generationBlankItems, formatHeaderName } from "./ultis/datatable-helper";

@Component({
  selector: 'ns-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit {

  @Input() data: any[];
  @Input() width = "auto";
  @Input() height = "auto";
  @Input() pageSize = 10;
  @Input() pageIndex = 1;
  @Input() totalItems = 0;
  @Input() maxSize = 5;
  @Input() structureDisplay: any;
  /**
   * Choose properties will display
   * { property: property_name_display,...}
   * 
   * Ex: { name: "Customer Name", age: "Customer Age"}
   */

  @Output() selection: EventEmitter<any> = new EventEmitter();

  protected _data: any[] = [];
  protected columns: string;
  protected rows: string;
  protected colSpan: number = 0;
  protected headerNames: string[] = [];
  protected _structureDisplay: string[] = [];

  protected _selected: any;

  protected pageData: any[] = [];
  protected totalPages: number = 0;
  protected _totalItems = '0';
  protected pages = [];
  protected footerRow = 2;
  constructor(
    // private notificaionService: NotificationService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.processDataTable();
  }

  public selected(e: any) {
    this.selection.emit(e);
  }

  private processDataTable() {
    this.generationHeaderNames();
    this.calcDimensionTable();

    this.getTotalPage();
    this.buildDataDisplay();
    this.calcFooterRow();
    this.calcPages(this.maxSize);
    this._totalItems = formatNumber(this.totalItems);

    this.setPage(this.pageIndex);
  }




  private generationHeaderNames(): void {
    if (this.structureDisplay) {
      const properties = Object.getOwnPropertyNames(this.structureDisplay);
      properties.forEach(property => {
        this.headerNames.push(this.structureDisplay[property]);
        this._structureDisplay = [...this._structureDisplay, property];
      });
    }

    if (!this.structureDisplay && this.data && this.data.length > 0) {
      const properties = Object.getOwnPropertyNames(this.data[0]);
      properties.forEach(property => {
        this.headerNames.push(formatHeaderName(property));
        this._structureDisplay = [...this._structureDisplay, property];
      });
    }
  }

  private calcDimensionTable(): void {
    if (!this.headerNames || !this.headerNames.length) {
      // this.notificaionService.error(`Something went wrong! Can't render the table.`);
      return;
    }

    this.calcDimensionColumns();
    this.calcDimensionRows();
    this.colSpan = this.headerNames && this.headerNames.length > 0 ? this.headerNames.length : 0;
  }

  private calcDimensionColumns(): void {
    this.columns = `*`;
    for (let i = 1; i < this.headerNames.length; i++) {
      this.columns += `,*`;
    }
  }

  private calcDimensionRows(): void {
    this.rows = `auto`;
    if (!this.data || !this.data.length) {
      this.rows += `,auto`;
    } else {
      for (let i = 1; i <= this.pageSize; i++) {
        this.rows += `,auto`;
      }
    }
    this.rows += `,auto`;
  }





  private getTotalPage(): void {
    if (!this.data || !this.data.length) {
      this.totalPages = 1;
      return;
    }
    this.totalPages = this.pageSize < 1 ? 1 : Math.ceil(this.totalItems / this.pageSize);
  }

  private buildDataDisplay(): void {
    if (!this.data || !this.data.length) {
      this.totalItems = 0;
      return;
    }
    this._data = [...this.data, ...generationBlankItems(this.totalPages, this.pageSize, this.totalItems, this._structureDisplay)];
  }

  private calcFooterRow(): void {
    this.footerRow = !this._data || !this._data.length ? 2 : this.pageSize + 1;
  }

  private calcPages(maxSize: number): void {
    const pages = [];
    let startPage = 1;
    let endPage = this.totalPages;
    const isMaxSize = maxSize < this.totalPages;

    if (isMaxSize) {
      startPage = this.pageIndex - Math.floor(maxSize / 2);
      endPage = this.pageIndex + Math.floor(maxSize / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, this.totalPages);
      } else if (endPage > this.totalPages) {
        startPage = Math.max(this.totalPages - maxSize + 1, 1);
        endPage = this.totalPages
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    this.pages = pages;
  }

  private setPage(page: number): void {
    this.pageData = this.getPageData(page);
    this.calcPages(this.maxSize);
  }

  protected previousPage(): void {
    if (this.canPrevious()) {
      this.setPage(this.pageIndex - 1);
    }
  }

  protected nextPage(): void {
    if (this.canNext()) {
      this.setPage(this.pageIndex + 1);
    }
  }

  private getPageData(page: number) {
    const pageData = [];
    if (!this._data || !this._data.length) { return pageData; }
    this.pageIndex = page > 0 && page <= this.totalPages && page !== this.pageIndex ? (page <= 0 ? 1 : page) : (this.pageIndex <= 0 ? 1 : this.pageIndex);
    let startIndex = this.pageIndex <= 1 ? 0 : (this.pageIndex - 1) * this.pageSize;
    let endIndex = this.pageIndex <= 1 ? this.pageSize - 1 : this.pageIndex * this.pageSize - 1;

    if (this.pageIndex > this.totalPages) {
      return this.pageData;
    }

    for (let i = startIndex; i <= endIndex; i++) {
      pageData.push(this._data[i]);
    }

    return pageData;
  }

  private canPrevious(): boolean {
    return this.pageIndex > 1;
  }

  private canNext(): boolean {
    return this.pageIndex < this.totalPages;
  }
}
