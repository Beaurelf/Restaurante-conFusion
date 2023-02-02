import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from 'src/shared/dish';
import { expand, flyInOut } from '../animations/app.animations';
import { DishService } from '../service/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    }, 
  animations: [
    flyInOut(), 
    expand()
  ]
})


export class MenuComponent implements OnInit {

  dishes: Dish[];
  selectedDish: Dish;
  errMess: string;

  constructor(private dishService: DishService, @Inject('baseURL') private baseURL) { }

  ngOnInit() {
    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = dishes,
      errmess => this.errMess = <any>errmess);
  }

  onSelect(dish: Dish){
    this.selectedDish = dish;
  }

}
