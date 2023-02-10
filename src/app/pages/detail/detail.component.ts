import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);
  private subcription?: Subscription;
  
  public results: {
    name: string;
    series: { name: string; value: number }[];
  }[] = [];
  public countryName: string = '';
  public numberOfEntries: number = 0;
  public numberOfMedals: number = 0;
  public numberOfAthletes: number = 0;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.subcription = this.olympics$.subscribe((data) => {
      if (data && this.route.snapshot.params['id']) {
        const result = data.find(
          (item) => item.id.toString() === this.route.snapshot.params['id']
        );
        if (result) {
          this.countryName = result.country;
          this.numberOfEntries = result.participations.length;
          this.results = [
            {
              name: result.country,
              series: result.participations.map((item) => {
                this.numberOfMedals += item.medalsCount;
                this.numberOfAthletes += item.athleteCount;
                return {
                  name: item.year.toString(),
                  value: item.medalsCount,
                };
              }),
            },
          ];
        }
      }
    });
  }
  ngOnDestory(): void {
    this.subcription?.unsubscribe();
  }

  onBack(): void {
    this.router.navigateByUrl('');
  }
}
