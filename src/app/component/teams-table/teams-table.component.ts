import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-teams-table',
  templateUrl: './teams-table.component.html',
  styleUrls: ['./teams-table.component.css']
})
export class TeamsTableComponent implements OnInit {
teams:any=[
  
  ]
  constructor(private teamService: TeamService , private router : Router) { }

  ngOnInit() {
    this.teamService.getAllTeam().subscribe(
      (data) => {
        this.teams = data.teams
      }
    )
  }


  displayTeam(id: number){
  
    
    this.router.navigate([`teamInfo/${id}`]);


  }
  editTeam(id){
    alert("Edit"+ id);
  }
  deleteTeam(id) {
    this.teamService.deleteTeam(id).subscribe(
      (response) => {
        console.log("here response after delete", response.message);
        this.teamService.getAllTeam().subscribe(
          (data) => {
            this.teams = data.teams
          });
      });
  }
}
