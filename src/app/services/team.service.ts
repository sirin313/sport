import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  teamUrl: string = "http://localhost:3000/teams"
  constructor(private httpClient: HttpClient) { }


  addTeam(obj) {
    return this.httpClient.post<{ message: string }>(this.teamUrl, obj);
  }

  getAllTeam() {
    return this.httpClient.get<{ teams: any, message: any }>(this.teamUrl);
  }

  deleteTeam(id) {
    return this.httpClient.delete<{ message: string }>(`${this.teamUrl}/${id}`);
  }

  getTeamById(id) {
    return this.httpClient.get<{team:any}>(`${this.teamUrl}/${id}`);
  }




}
