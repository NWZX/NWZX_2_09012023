import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);
  public error$: Observable<string | null> = of(null);
  private subcription?: Subscription;
  public results: { id: number; name: string; value: number }[] = [];

  constructor(private olympicService: OlympicService, private router: Router) {}
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.error$ = this.olympicService.getError();
    
    this.subcription = this.olympics$.subscribe((data) => {
      if (data) {
        this.results = data.map((item) => {
          return {
            id: item.id,
            name: item.country,
            value: item.participations
              .map((item) => item.medalsCount)
              .reduce((a, b) => a + b, 0),
          };
        });
      }
    });
  }
  ngOnDestory(): void {
    this.subcription?.unsubscribe();
  }

  onSelect(data: { name: string; value: number }): void {
    const id = this.results.find((item) => item.name === data.name)?.id;
    if (id) {
      this.router.navigateByUrl('details/' + id);
    }
  }
}
