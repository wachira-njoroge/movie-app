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
export class AppComponent implements OnInit, AfterViewInit {
  title = 'movie-app';
  trendingMoviesList!: any[];
  filteredTrendingMovies!: any[];
  //
  currentPage = 0;
  pageSize = 20;
  pageSizeOptions = [10, 30, 40, 50];
  paginatedMovies: any[] = [];
  auth: any;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    const firebaseConfig = {
      apiKey: 'AIzaSyCHnfPtp9Bjs2dwt9W_NezWG8bOtSFX8YA',
      authDomain: 'bliss-movies.firebaseapp.com',
      projectId: 'bliss-movies',
      storageBucket: 'bliss-movies.firebasestorage.app',
      messagingSenderId: '1075716313376',
      appId: '1:1075716313376:web:04befd1e5212be0627c745',
    };

    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.getTrendingMovies();
  }
  ngAfterViewInit(): void {
    this.getRedirectResult();
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
  getRedirectResult() {
    getRedirectResult(this.auth)
      .then((result) => {
        console.log('Result value is :: ', result);

        if (result) {
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
