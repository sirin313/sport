import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginForm:FormGroup;
user:any={};
users:any[];
msgError:string;
constructor(private formBuilder: FormBuilder , private router:Router , private userService: UserService) { }

  ngOnInit() {
    this.loginForm= this.formBuilder.group({
      email:["",[Validators.required, Validators.email]],
      password:["",[Validators.required]]
    })
  }
  login() {
    let user=this.loginForm.value
    console.log("here object", user);
 this.userService.login(user)
//  .subscribe(
//   (data)=>{
//     console.log("response after login", data.message);
//     console.log(data.user.jwt);
    
//     if (data.message=="2") {
//       localStorage.setItem("connectedUserId", data.user.id);
//       if (data.user.role=="admin") {
//         this.router.navigate(["admin"])
//       } else {
//         this.router.navigate([""])
//       }
      
//     } else {
//       this.msgError="please check email/password"
//     }
//   }
//  )
    
      
    }
  
  // }
}
