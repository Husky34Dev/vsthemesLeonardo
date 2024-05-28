import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ColorField {
  label: string;
  value: string;
  description: string;
  expanded?: boolean;  // Propiedad para controlar si la tarjeta está expandida
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

  editorColors: ColorField[] = [
    { label: '--editor-background', value: '#1e1e1e', description: 'Editor Background - Changes the background color of the editor.' },
    { label: '--editor-foreground', value: '#d4d4d4', description: 'Editor Foreground - Changes the text color of the editor.' },
    { label: '--editor-line-number-foreground', value: '#237893', description: 'Editor Line Number - Changes the color of the line numbers.' },
  ];

  syntaxColors: ColorField[] = [
    { label: '--keyword', value: '#c678dd', description: 'Keyword - Changes the color of keywords in the code.' },
    { label: '--numbers', value: '#ff7c00', description: 'Numbers - Changes the color of numbers in the code.' },
    { label: '--variables-properties', value: '#ec0113', description: 'Variables and Properties - Changes the color of variables and properties.' },
    { label: '--function-methods', value: '#00ff64', description: 'Functions and Methods - Changes the color of function and method names.' },
    { label: '--classes-constants', value: '#ffa600', description: 'Classes and Constants - Changes the color of class names and constants.' },
    { label: '--string', value: '#0800ff', description: 'Strings - Changes the color of string literals.' },
    { label: '--operators-special', value: '#14ff91', description: 'Operators and Special Characters - Changes the color of operators and special characters.' },
    { label: '--comments', value: '#0055ff', description: 'Comments - Changes the color of comments in the code.' },
  ];

  tabColors: ColorField[] = [
    { label: '--tabs-container-background', value: '#333333', description: 'Tabs Container Background - Changes the background color of the tabs container.' },
    { label: '--tab-active-background', value: '#1e1e1e', description: 'Active Tab Background - Changes the background color of the active tab.' },
    { label: '--tab-active-foreground', value: '#ffffff', description: 'Active Tab Foreground - Changes the text color of the active tab.' },
    { label: '--tab-border', value: '#444444', description: 'Tab Border - Changes the color of the border around tabs.' },
    { label: '--tab-inactive-background', value: '#2d2d2d', description: 'Inactive Tab Background - Changes the background color of inactive tabs.' },
    { label: '--tab-inactive-foreground', value: '#aaaaaa', description: 'Inactive Tab Foreground - Changes the text color of inactive tabs.' },
    { label: '--tab-hover-background', value: '#3d3d3d', description: 'Tab Hover Background - Changes the background color when hovering over a tab.' },
    { label: '--tab-hover-foreground', value: '#ffffff', description: 'Tab Hover Foreground - Changes the text color when hovering over a tab.' }
  ];

  sidebarColors: ColorField[] = [
    { label: '--sidebar-background', value: '#f3f3f3', description: 'Sidebar Background - Changes the background color of the sidebar.' },
    { label: '--sidebar-foreground', value: '#616161', description: 'Sidebar Foreground - Changes the text color in the sidebar.' },
    { label: '--side-bar-section-header-background', value: '#00000000', description: 'Sidebar Section Header Background - Changes the background color of section headers in the sidebar.' },
    { label: '--side-bar-section-header-foreground', value: '#616161', description: 'Sidebar Section Header Foreground - Changes the text color of section headers in the sidebar.' },
    { label: '--side-bar-section-header-border', value: '#61616130', description: 'Sidebar Section Header Border - Changes the border color of section headers in the sidebar.' },
    { label: '--side-bar-section-border', value: '#00000000', description: 'Sidebar Section Border - Changes the border color of sections in the sidebar.' },
    { label: '--list-hover-background', value: '#e8e8e8', description: 'List Hover Background - Changes the background color when hovering over items in lists.' },
    { label: '--list-hover-foreground', value: '#616161', description: 'List Hover Foreground - Changes the text color when hovering over items in lists.' },
  ];

  statusBarColors: ColorField[] = [
    { label: '--status-bar-background', value: '#007acc', description: 'Status Bar Background - Changes the background color of the status bar.' },
    { label: '--status-bar-foreground', value: '#ffffff', description: 'Status Bar Foreground - Changes the text color in the status bar.' },
    { label: '--status-bar-background-hover', value: '#ffffff', description: 'Status Bar Hover Background - Changes the background color when hovering over items in the status bar.' },
    { label: '--status-bar-remote-foreground', value: '#925151', description: 'Status Bar Remote Foreground - Changes the text color of remote items in the status bar.' }
  ];

  topBarColors: ColorField[] = [
    { label: '--top-bar-background', value: '#2c2c2c', description: 'Top Bar Background - Changes the background color of the top bar.' },
    { label: '--top-bar-text', value: '#ffffff', description: 'Top Bar Text - Changes the text color in the top bar.' },
    { label: '--title-bar-border', value: '#00000000', description: 'Title Bar Border - Changes the border color of the title bar.' },
  ];

  constructor(private http: HttpClient) {}

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

  sendColorsToServer() {
    this.extractColors();
    const themeData = {
      name: 'Custom Theme',
      type: 'dark',
      colors: this.colors,
    };

    this.http.post('http://127.0.0.1:8000/api/theme', themeData).subscribe(response => {
      console.log('Theme saved successfully');
    });
  }

  downloadTheme() {
    this.extractColors();
    const themeData = {
      name: 'Custom Theme',
      type: 'dark',
      colors: this.colors,
    };

    this.http.post('http://127.0.0.1:8000/api/theme', themeData, { responseType: 'blob' }).subscribe(response => {
      const blob = new Blob([response], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'custom-theme.vsix';
      a.click();
      window.URL.revokeObjectURL(url);
    });
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

  expandedSections: Record<SectionKey, boolean> = {
    editor: false,
    syntax: false,
    sidebar: false,
    statusBar: false,
    topBar: false,
    additional: false,
    tabs: false,
  };

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
}
