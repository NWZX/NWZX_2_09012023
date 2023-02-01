import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);
  public results: any[] = [];
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
    this.olympics$.subscribe((data) => {
      if (data) {
        if (this.route.snapshot.params['id']) {
          const result = data.find(
            (item) => item.id.toString() === this.route.snapshot.params['id']
          );
          if (result) {
            console.log(result);
            
            this.countryName = result.country;
            this.numberOfEntries = result.participations.length;
            this.results = [{
              name: result.country,
              series: result.participations.map((item) => {
                this.numberOfMedals += item.medalsCount;
                this.numberOfAthletes += item.athleteCount;
                return {
                  name: item.year.toString(),
                  value: item.medalsCount,
                };
              })
            }]
          }
        }
      }
    });
  }

  view: [number, number] = [700, 400];

  // options
  legendPosition: string = 'below';
  tooltipText: () => void = () => {};

  scheme = 'cool';

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onBack(): void {
    this.router.navigateByUrl('');
  }
}
