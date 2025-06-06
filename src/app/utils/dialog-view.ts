import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

interface MovieDetails {
  posterURL: string;
  backdropImage: string;
  title: string;
  release_date:string;
  overview: string;
  country:string;
  popularity: string
}


@Component({
  selector: 'movie-details-dialog',
  template: `
  <div  class="backdrop"
    [style.backgroundImage]="'url(https://image.tmdb.org/t/p/w780' + movieDetails.backdropImage +')'"  >
  >
  <mat-icon class="close" (click)="closeDialog()">close</mat-icon>
    <div class="content">
      <p>{{movieDetails.title}} ({{ movieDetails.release_date.slice(0,4)}})</p>

      <div>
        <p>Overview </p>
        <p>{{movieDetails.overview}}</p>
      </div>
      <div>
        <p>Popularity</p>
        <p>{{movieDetails.popularity}}</p>
      </div>
    </div>
  </div>
  `,
  styleUrl: 'movie-details.css'
})

export class MovieDetailsDialog {
   movieDetails: MovieDetails = {
    posterURL: '',
    backdropImage: '',
    title: '',
    release_date: '',
    overview:'',
    country: '',
    popularity: ''
  };

  constructor(
    public dialogRef: MatDialogRef<MovieDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.displayDetails();
  }

  displayDetails() {
    console.log("Data view :: ", this.data);

    this.movieDetails.backdropImage = this.data.backdrop_path;
    this.movieDetails.title = this.data.name || this.data.title;
    this.movieDetails.release_date = this.data.first_air_date || this.data.release_date
    this.movieDetails.overview = this.data.overview
    this.movieDetails.country = this.data.origin_country
    this.movieDetails.popularity = this.data.popularity
  }
  closeDialog(){
    this.dialogRef.close()
  }
}
