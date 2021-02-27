import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit {

  @Input() AppTitle: string;
  @Input() SupportEmail: string;
  @Input() SupportTel: string;
  @Input() ErrorMessage: string | null;

  constructor() { }

  ngOnInit(): void {
  }


  Reload(){
    
    window.location.reload();
  }

}
