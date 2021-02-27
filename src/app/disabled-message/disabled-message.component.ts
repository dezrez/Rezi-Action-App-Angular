import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-disabled-message',
  templateUrl: './disabled-message.component.html',
  styleUrls: ['./disabled-message.component.css']
})
export class DisabledMessageComponent implements OnInit {
  @Input() AppTitle: string;

  constructor() { }

  ngOnInit(): void {
  }

}
