import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { getAuth, signOut } from "firebase/auth";
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsDialog } from '../utils/dialog-view';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'movie-app';
  trendingMoviesList!:any[]
  filteredTrendingMovies!:any[]
  //
  currentPage = 0;
  pageSize = 20
  pageSizeOptions = [20, 30, 40, 50];
  paginatedMovies: any[] = [];
  displayName!: string
  displayPhoto!: string

  constructor(private httpClient: HttpClient, private router: Router, private dialog: MatDialog){}

  ngOnInit(): void {
    const user = window.history.state['user']
    this.updateProfile(user)
    this.getTrendingMovies()
  }
  updateProfile(user:any){
    this.displayName = user[0].displayName || user[0].email
    this.displayPhoto = user[0].photoURL
  }
  getTrendingMovies(){
    //Get movies list from TMDB
    this.httpClient.get('https://api.themoviedb.org/3/trending/all/day?language=en-US',{
      headers:{
        Authorization: `Bearer ${environment.tmdbAccessToken}`
      }
    }).subscribe((response: any) => {
      this.trendingMoviesList = response["results"];
      this.filteredTrendingMovies = [...this.trendingMoviesList]
      this.updatePaginator()
    })

  }
  ratingPercent(number:any){
    return Math.floor(number)
  }
  onMovieSearch(event:Event){
    const movie = (event.target as HTMLInputElement).value.toLowerCase()
    this.filteredTrendingMovies = this.trendingMoviesList.filter(mvie => (mvie.name || mvie.title).toLowerCase().includes(movie))
  }
  updatePaginator(){
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMovies = this.filteredTrendingMovies.slice(startIndex, endIndex);
  }
  onPageChange(event: PageEvent){
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginator();
  }
  logout(){
    signOut(getAuth()).then(()=>{
      //reroute to login
      this.router.navigate(['/login'])
    })
  }
  displayMovieDetails(movie:any){
    this.dialog.open(MovieDetailsDialog,{
      width: '900px',
      height: '500px',
      data: movie,
      disableClose:false,
      position: {top: '100px'}
    })
  }
}
