import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment.prod';
import { PageEvent } from '@angular/material/paginator';
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsDialog } from './utils/dialog-view';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'movie-app';
  trendingMoviesList!: any[];
  filteredTrendingMovies!: any[];
  //
  usernameControl = new FormControl()
  passwordControl = new FormControl()
  //
  currentPage = 0;
  pageSize = 20;
  pageSizeOptions = [10, 30, 40, 50];
  paginatedMovies: any[] = [];
  auth:any

  constructor(private httpClient: HttpClient, private router:Router) {
    const app = initializeApp(environment.firebaseConfig)
    this.auth = getAuth(app)
  }

  ngOnInit() {
    this.getTrendingMovies();
    onAuthStateChanged(this.auth, (user) => {
      if(user?.providerData){
        //reroute to home page
        this.router.navigate(['/home'],{
          state: {user: user.providerData}
        })
      }
    });
  }
  getTrendingMovies() {
    //Get movies list from TMDB
    this.httpClient
      .get('https://api.themoviedb.org/3/trending/all/day?language=en-US', {
        headers: {
          Authorization: `Bearer ${environment.tmdbAccessToken}`,
        },
      })
      .subscribe((response: any) => {
        this.trendingMoviesList = response['results'];
        this.filteredTrendingMovies = [...this.trendingMoviesList];
        this.updatePaginator();
      });
  }
  ratingPercent(number: any) {
    return Math.floor(number);
  }
  onMovieSearch(event: Event) {
    const movie = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTrendingMovies = this.trendingMoviesList.filter((mvie) =>
      (mvie.name || mvie.title).toLowerCase().includes(movie)
    );
  }
  updatePaginator() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMovies = this.filteredTrendingMovies.slice(
      startIndex,
      endIndex
    );
  }
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginator();
  }
  async gmailLogin() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  /**
   * Firebase handles password hashing and salting. It also handles email validation.
   * I will ride on that functionality since I am not saving user data password in the application
   */
  async signUp(){
    try{
      if(this.validateInputFields()){
        const email = this.usernameControl.value
        const password = this.passwordControl.value
        await createUserWithEmailAndPassword(this.auth,email, password)
      }
    }catch(error:any){
      alert(error.message)
    }
  }
  async loginWithPassword(){
    try{
      if(this.validateInputFields()){
        const email = this.usernameControl.value
        const password = this.passwordControl.value
        await signInWithEmailAndPassword(this.auth, email, password)
      }
    }catch(error:any){
      alert(error.message)
    }
  }
  validateInputFields():boolean{
    const emailInput = this.usernameControl.value
    const passwordInput = this.passwordControl.value
    if(!emailInput){
      alert("Email is required")
      return false
    }
    if(!passwordInput){
      alert("Input a password to proceed")
      return false
    }
    return true
  }

}
