import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Dish } from 'src/shared/dish';
import { Leader } from 'src/shared/leader';
import { Promotion } from 'src/shared/promotion';
import { expand, flyInOut } from '../animations/app.animations';
import { DishService } from '../service/dish.service';
import { LeaderService } from '../service/leader.service';
import { PromotionService } from '../service/promotion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    }, 
  animations: [
    flyInOut(), 
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  errLeader: String = ""
  errPromotion: String = ""
  errDish: String = ""

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderservice: LeaderService,
    @Inject('baseURL') private baseURL) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe((dish)=>{
      this.dish = dish;
    }, err=>this.errDish = err)
    this.promotionservice.getFeaturedPromotion().subscribe((promotion)=>{
      this.promotion = promotion;
    }, err=>this.errPromotion = err)
    this.leaderservice.getFeaturedLeader().subscribe((leader)=>{
      this.leader = leader;
    }, err=>this.errLeader = err)
  }

}
