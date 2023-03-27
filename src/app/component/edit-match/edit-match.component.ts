import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from 'src/app/services/match.service';

@Component({
  selector: 'app-edit-match',
  templateUrl: './edit-match.component.html',
  styleUrls: ['./edit-match.component.css']
})
export class EditMatchComponent implements OnInit {
  matchForm: FormGroup;
  match: any = {};
  matches: any[];
  id: any;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private matchService: MatchService) { }

  ngOnInit() {

    // get id from path
    this.id = this.activatedRoute.snapshot.paramMap.get("id")
    this.matchService.getMatchById(this.id).subscribe(
      (Response) => {
        this.match = Response.findedMatch
      }
    )


  }
  editMatch() {
    this.matchService.editMatch(this.match).subscribe(
      (Response) => {
        console.log("here msg", Response.message);
        this.router.navigate(["admin"])
      }
    )

  }
}
