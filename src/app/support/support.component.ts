import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  @Input() AppTitle: string;
  @Input() SupportEmail: string;
  @Input() SupportTel: string;
  @Input() ErrorMessage: string | null;

  constructor() { }

  ngOnInit(): void {
    
  }

  get EmailLink(): string {
    return `mailto:${this.SupportEmail}?subject=${encodeURI(this.AppTitle)}&body=What%20Happened%3F%0D%0A%0D%0A${encodeURI(this.ErrorMessage ? this.ErrorMessage : "")}%0D%0A%0D%0AWhat%20were%20you%20doing%3F%0D%0A%0D%0AHow%20Can%20We%20Reproduce%20It%3F%0D%0A`;
  }
  get TelLink(): string {
    return `tel:${this.SupportTel}`;

  }

}
