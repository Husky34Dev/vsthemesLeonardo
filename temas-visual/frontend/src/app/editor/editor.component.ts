import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


interface ColorField {
  label: string;
  value: string;
  description: string;
  expanded?: boolean;  // Propiedad para controlar si la tarjeta está expandida
}

interface ThemeResponse {
  id: number;
}

type SectionKey = 'editor' | 'syntax' | 'sidebar' | 'statusBar' | 'topBar' | 'additional' | 'tabs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('codeElement', { static: true }) codeElement!: ElementRef;
  @ViewChild('lineNumbers', { static: true }) lineNumbersElement!: ElementRef;

  themeDetails = {
    name: '',
    publisher: '',
    description: '',
    type: 'dark'
  };

  editorColors: ColorField[] = [
    { label: '--editor-background', value: '#fbf8f1', description: 'Editor Background - Changes the background color of the editor.' },
    { label: '--editor-foreground', value: '#3c3b3a', description: 'Editor Foreground - Changes the text color of the editor.' },
    { label: '--editor-line-number-foreground', value: '#8c6b58', description: 'Editor Line Number - Changes the color of the line numbers.' },
  ];

  syntaxColors: ColorField[] = [
    { label: '--keyword', value: '#b25a00', description: 'Keyword - Changes the color of keywords in the code.' },
    { label: '--numbers', value: '#b35800', description: 'Numbers - Changes the color of numbers in the code.' },
    { label: '--variables-properties', value: '#007073', description: 'Variables and Properties - Changes the color of variables and properties.' },
    { label: '--function-methods', value: '#005f56', description: 'Functions and Methods - Changes the color of function and method names.' },
    { label: '--classes-constants', value: '#1c7d7e', description: 'Classes and Constants - Changes the color of class names and constants.' },
    { label: '--string', value: '#006b5e', description: 'Strings - Changes the color of string literals.' },
    { label: '--operators-special', value: '#4b5c5c', description: 'Operators and Special Characters - Changes the color of operators and special characters.' },
    { label: '--comments', value: '#5e5e5e', description: 'Comments - Changes the color of comments in the code.' },
  ];

  tabColors: ColorField[] = [
    { label: '--tabs-container-background', value: '#e8dfd0', description: 'Tabs Container Background - Changes the background color of the tabs container.' },
    { label: '--tab-active-background', value: '#d6c7a1', description: 'Active Tab Background - Changes the background color of the active tab.' },
    { label: '--tab-active-foreground', value: '#3c3b3a', description: 'Active Tab Foreground - Changes the text color of the active tab.' },
    { label: '--tab-border', value: '#c0b28f', description: 'Tab Border - Changes the color of the border around tabs.' },
    { label: '--tab-inactive-background', value: '#e8dfd0', description: 'Inactive Tab Background - Changes the background color of inactive tabs.' },
    { label: '--tab-inactive-foreground', value: '#8c6b58', description: 'Inactive Tab Foreground - Changes the text color of inactive tabs.' },
    { label: '--tab-hover-background', value: '#d6c7a1', description: 'Tab Hover Background - Changes the background color when hovering over a tab.' },
    { label: '--tab-hover-foreground', value: '#3c3b3a', description: 'Tab Hover Foreground - Changes the text color when hovering over a tab.' }
  ];

  sidebarColors: ColorField[] = [
    { label: '--sidebar-background', value: '#f3f3f3', description: 'Sidebar Background - Changes the background color of the sidebar.' },
    { label: '--sidebar-foreground', value: '#616161', description: 'Sidebar Foreground - Changes the text color in the sidebar.' },
    { label: '--side-bar-section-header-background', value: '#00000000', description: 'Sidebar Section Header Background - Changes the background color of section headers in the sidebar.' },
    { label: '--side-bar-section-header-foreground', value: '#616161', description: 'Sidebar Section Header Foreground - Changes the text color of section headers in the sidebar.' },
    { label: '--side-bar-section-header-border', value: '#61616130', description: 'Sidebar Section Header Border - Changes the border color of section headers in the sidebar.' },
    { label: '--side-bar-section-border', value: '#c0b28f', description: 'Sidebar Section Border - Changes the border color of sections in the sidebar.' },
    { label: '--list-hover-background', value: '#d6c7a1', description: 'List Hover Background - Changes the background color when hovering over items in lists.' },
    { label: '--list-hover-foreground', value: '#3c3b3a', description: 'List Hover Foreground - Changes the text color when hovering over items in lists.' },
  ];

  statusBarColors: ColorField[] = [
    { label: '--status-bar-background', value: '#7b7060', description: 'Status Bar Background - Changes the background color of the status bar.' },
    { label: '--status-bar-foreground', value: '#ffffff', description: 'Status Bar Foreground - Changes the text color in the status bar.' },
    { label: '--status-bar-background-hover', value: '#5e5e5e', description: 'Status Bar Hover Background - Changes the background color when hovering over items in the status bar.' },
    { label: '--status-bar-remote-foreground', value: '#925151', description: 'Status Bar Remote Foreground - Changes the text color of remote items in the status bar.' }
  ];

  topBarColors: ColorField[] = [
    { label: '--top-bar-background', value: '#d6c7a1', description: 'Top Bar Background - Changes the background color of the top bar.' },
    { label: '--top-bar-text', value: '#3c3b3a', description: 'Top Bar Text - Changes the text color in the top bar.' },
    { label: '--title-bar-border', value: '#00000000', description: 'Title Bar Border - Changes the border color of the title bar.' },
  ];

  expandedSections: Record<SectionKey, boolean> = {
    editor: false,
    syntax: false,
    sidebar: false,
    statusBar: false,
    topBar: false,
    additional: false,
    tabs: false,
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngAfterViewInit() {
    this.generateLineNumbers();
  }

  get colors(): ColorField[] {
    return [
      ...this.editorColors,
      ...this.syntaxColors,
      ...this.sidebarColors,
      ...this.statusBarColors,
      ...this.topBarColors,
      ...this.tabColors,
    ];
  }

  updateTheme() {
    this.colors.forEach((color) => {
      document.documentElement.style.setProperty(color.label, color.value);
    });
  }

  extractColors() {
    const style = getComputedStyle(document.documentElement);
    const updateColorValues = (colors: ColorField[]) => {
      return colors.map(color => {
        color.value = style.getPropertyValue(color.label).trim();
        return color;
      });
    };

    this.editorColors = updateColorValues(this.editorColors);
    this.syntaxColors = updateColorValues(this.syntaxColors);
    this.tabColors = updateColorValues(this.tabColors);
    this.sidebarColors = updateColorValues(this.sidebarColors);
    this.statusBarColors = updateColorValues(this.statusBarColors);
    this.topBarColors = updateColorValues(this.topBarColors);
  }

  applyCustomTheme() {
  this.http.get<any>('assets/leonardo_theme.json').subscribe(theme => {
    this.applyTheme(theme);
  });
}

applyTheme(theme: any) {
  // Apply colors
  for (const key in theme.colors) {
    if (theme.colors.hasOwnProperty(key)) {
      document.documentElement.style.setProperty(`--${key}`, theme.colors[key]);
    }
  }

  // Apply token colors
  theme.tokenColors.forEach((tokenColor: any) => {
    const cssRule = `.${tokenColor.scope.replace(/\./g, '-')}`;
    const style = document.createElement('style');
    style.innerHTML = `${cssRule} { color: ${tokenColor.settings.foreground}; }`;
    document.head.appendChild(style);
  });
}


  sendColorsToServer() {
  this.extractColors();
  const themeData = {
    name: this.themeDetails.name,
    type: this.themeDetails.type,
    colors: this.colors,
  };

  this.http.post<ThemeResponse>('http://127.0.0.1:8000/api/theme', themeData, { responseType: 'json' }).subscribe(response => {
    const themeId = response.id;
    console.log('Theme saved successfully');
  }, error => {
    console.error('Error saving theme:', error);
  });
}

downloadGeneratedTheme() {
  this.extractColors();
  const themeData = {
    name: this.themeDetails.name,
    publisher: this.themeDetails.publisher,
    description: this.themeDetails.description,
    type: this.themeDetails.type,
    colors: this.colors,
  };

  this.http.post('http://127.0.0.1:8000/api/theme/download', themeData, { responseType: 'blob' }).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.themeDetails.name}-theme.vsix`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, error => {
    console.error('Error downloading theme:', error);
  });
}

  downloadTheme() {
    this.extractColors();
    this.sendColorsToServer();
  }

  toggleSection(section: SectionKey) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  isSectionExpanded(section: SectionKey): boolean {
    return this.expandedSections[section];
  }

  toggleExpandColor(color: ColorField) {
    color.expanded = !color.expanded;
  }

  generateLineNumbers() {
    const codeElement = this.codeElement.nativeElement;
    const lineNumbersElement = this.lineNumbersElement.nativeElement;
    const lines = codeElement.innerText.split('\n').length;

    for (let i = 1; i <= lines; i++) {
      const lineNumber = document.createElement('div');
      lineNumber.className = 'line-number';
      lineNumber.textContent = i.toString();
      lineNumbersElement.appendChild(lineNumber);
    }
  }
  navigateToLanding(): void {
    this.router.navigate(['/landing']);
  }
}
