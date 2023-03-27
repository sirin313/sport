import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
userUrl: string = "http://localhost:3000/allUsers"
public token: string;
private authStatusListener = new Subject<boolean>();
private isUserAuthenticated = false;
private name: string;
  constructor(private httpClient: HttpClient ,  private router: Router) { }
  getToken() {
    return this.token;
    }
    getAuthStatusListener() {
    return this.authStatusListener.asObservable();
    }
    isUserAuth() {
    return this.isUserAuthenticated;
    }
    getName(){
    return this.name;
    }

    login(user) {
      this.httpClient.post<{ user: any, message: string }>( this.userUrl + "/signin" , user).subscribe(
      (res) => {
      const token = res.user.jwt;
      this.token = token;
      if (res.user) {
      this.isUserAuthenticated = true;
      this.name = res.user.firstName;
      this.authStatusListener.next( true);
      localStorage.setItem( 'token' , token);
      localStorage.setItem( 'name' , this.name);
      (res.user.role=="admin")?this.router.navigate(["admin"]):this.router.navigate([''])
  
      }
      }
      )
      }
     

  signup(obj, img:File) {
    let formData= new FormData();
    formData.append("firstName",obj.firstName);
    formData.append("lastName",obj.lastName);
    formData.append("email",obj.email);
    formData.append("password",obj.password);
    formData.append("img",img);
    return this.httpClient.post<{message:string}>(this.userUrl +"/subscription", formData);
  }

  editProfile(newUser) {
    return this.httpClient.put(this.userUrl, newUser);
  }



  logout() {
    localStorage.removeItem( 'token' );
    localStorage.removeItem( 'name' );
    this.isUserAuthenticated = false ;
    this.authStatusListener.next( false );
    this.router.navigate([ '/']);
    }

}
