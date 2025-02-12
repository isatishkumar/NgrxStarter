import {Component} from "@angular/core";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styles: [`
    header{
      background: #D7E3FF;
    }
    h1{
      color: #005cbb;
      margin:0;
      padding:1rem 2rem;
    }
    `]
})
export class HomeComponent {
}
