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
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

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
  currentPage = 0;
  pageSize = 20;
  pageSizeOptions = [10, 30, 40, 50];
  paginatedMovies: any[] = [];
  auth:any

  constructor(private httpClient: HttpClient) {
    const app = initializeApp(environment.firebaseConfig)
    this.auth = getAuth(app)
  }

  ngOnInit() {
    this.getTrendingMovies();
    this.getfirebaseRedirectResult();
    onAuthStateChanged(this.auth, (user) => {
      console.log('Usser value :; ', user);
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
  gmailLogin() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(this.auth, provider).catch((error) => {
      console.error('Sign-in error:', error);
    });
  }
  getfirebaseRedirectResult() {
    getRedirectResult(this.auth)
      .then((result) => {
        console.log('Result value is :: ', result);

        if (result?.user) {
          console.log('User:', result.user);
        } else {
          console.log('No redirect result');
        }
      })
      .catch((err) => {
        console.error('Redirect error:', err);
      });
  }
}
