import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent implements OnInit {
  themes: any[] = [];

  constructor(private themeService: ThemeService, private router: Router) {}

  ngOnInit(): void {
    this.loadThemes();
  }

  loadThemes(): void {
    this.themeService.getUserThemes().subscribe(
      themes => {
        this.themes = themes;
      },
      error => {
        console.error('Error loading themes', error);
      }
    );
  }

  downloadTheme(themeId: number, themeName: string): void {
    this.themeService.downloadTheme(themeId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${themeName}-theme.vsix`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading theme', error);
    });
  }

  navigateToLanding(): void {
    this.router.navigate(['/landing']);
  }
}
