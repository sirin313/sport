import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { generateId } from 'src/app/shared/genericFunction';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  // Form ID
  signupForm: FormGroup;
  // y:boolean=true;
  user: any = {}
  path: string;
  msgError:string;
  imagePreview:any;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.path = this.router.url;
    console.log("here path", this.path);

    this.signupForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(5)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      img:[""]

    });
  }

  signup() {
    console.log("clicked", this.signupForm.value);
    // if (this.path=="/subscription") {
    //   this.signupForm.value.role="user"
    // } else {
    //   this.signupForm.value.role="admin" 
    // }
    this.signupForm.value.role = (this.path == "/subscription") ? "user" : "admin";
    // reactive this.formId.value
    this.userService.signup(this.signupForm.value , this.signupForm.value.img).subscribe(
      (data)=>{
        console.log("here signup Info", data.message);
        if (data.message=="Error") {
          this.msgError="Email Exist"
        } else {
          this.router.navigate(["signin"])
        }
      }
    )
  }
  // add-X.ts
onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log("here file", file);
    
    this.signupForm.patchValue({ img: file });
    this.signupForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    };
    reader.readAsDataURL(file);
  }
}
