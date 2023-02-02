import { Component, Inject, OnInit } from '@angular/core';
import { Leader } from 'src/shared/leader';
import { expand, flyInOut } from '../animations/app.animations';
import { LeaderService } from '../service/leader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    }, 
  animations: [
    flyInOut(), 
    expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[];
  err: String = ""

  constructor(private leaderservice: LeaderService, @Inject('baseURL') private baseURL) { }

  ngOnInit() {
    this.leaderservice.getLeaders().subscribe((leaders)=>{
      this.leaders = leaders
    }, err=>this.err = err)
  }

}
