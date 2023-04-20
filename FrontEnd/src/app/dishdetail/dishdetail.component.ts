import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from 'src/shared/dish';
import { DishService } from '../service/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { expand, flyInOut, visibility } from '../animations/app.animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    }, 
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})


export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishcopy: Dish
  dishIds: string[];
  prev: string;
  next: string;
  com: Comment;
  formComment: FormGroup;
  @ViewChild('fform') commmentFormDirective;
  visibility = 'shown'

  formErrors = {
    'author': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
      'maxlength':     'Author Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Commentmust be at least 2 characters long.',
    },
  };
  errMess: any;

  constructor( private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('baseURL') private baseURL) { 
      this.createForm()
    }

    ngOnInit() {
      //const id = this.route.snapshot.params['id'];
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
      /*this.dishservice.getDish(id).subscribe((dish)=>{
        this.dish = dish;
      });*/
    }

    createForm(){
        this.formComment = this.fb.group(
          {
            author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
            rating: 0,
            comment: ['', [Validators.required, Validators.minLength(3)]]
          }
        )

        this.formComment.valueChanges.subscribe(data=>{
          this.onValueChanged(data)
          this.com = this.formComment.value
          this.com['date'] = new Date()
        })
    }

    onValueChanged(data?: any){
      for(const field in this.formErrors){
        this.formErrors[field] = ''
        const control = this.formComment.get(field)
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  
    goBack(): void {
      this.location.back();
    }

    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

    onSubmit(){
      this.com['date'] = new Date().toISOString()
      this.com = this.formComment.value
      this.dishcopy.comments.push(this.com);
      this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
      this.com = null
      this.commmentFormDirective.resetForm()
      this.formComment.reset({
        author: '',
        rating: 5,
        comment: ''
      });
    }

}
