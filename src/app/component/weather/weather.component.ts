import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  searchForm: FormGroup;
  weatherData: any;
  constructor(private formBuilder: FormBuilder, private searchService: SearchService) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      city: ["", [Validators.required]],

    })
  }

  searchWeather() {
    console.log("here search by city", this.searchForm.value);
    this.searchService.searchWeather(this.searchForm.value).subscribe(
      (data) => {
        this.weatherData = data.response;
        console.log(this.weatherData);
        
      }
    )
  }
}
