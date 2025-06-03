import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { PageEvent } from '@angular/material/paginator';

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
  pageSizeOptions = [10, 30, 40, 50];
  paginatedMovies: any[] = [];

  constructor(private httpClient: HttpClient){}

  ngOnInit(): void {
   this.getTrendingMovies()
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
}
