import { Component, OnInit } from '@angular/core';
import { DataLoadingService } from '../../shared/data-loading.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public dataLoading: DataLoadingService) { }

  ngOnInit() {
    // One way to get the data from the service
    // this.dataLoading.readLocalData().subscribe(data => {
    //   console.log('FROM component | subscribing to observable: ', data);
    // });
  }

}
