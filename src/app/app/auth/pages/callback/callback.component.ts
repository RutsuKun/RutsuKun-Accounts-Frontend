import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router,
  ROUTER_INITIALIZER,
  ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  response: Array < any > = [];
  constructor(private route: ActivatedRoute) {
    this.route.fragment.subscribe((fragment: string) => {
      const variables = fragment.split("&");

      for (let i = 0; i <= variables.length; i++) {
        if (variables[i]) {
          const values = variables[i].split("=");
          const index = values[0];
          const item = values[1];

          localStorage.setItem(index, item);
        }

      }
      
      window.close();
    });
  }

  ngOnInit(): void {
  }

}