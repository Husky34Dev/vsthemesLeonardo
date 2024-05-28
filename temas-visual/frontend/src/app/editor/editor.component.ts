import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ColorField {
  label: string;
  value: string;
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
    { label: '--editor-background', value: '#1e1e1e' },
    { label: '--editor-foreground', value: '#d4d4d4' },
    { label: '--editor-line-number-foreground', value: '#237893' },
  ];

  syntaxColors: ColorField[] = [
    { label: '--keyword', value: '#c678dd' },
    { label: '--numbers', value: '#ff7c00' },
    { label: '--variables-properties', value: '#ec0113' },
    { label: '--function-methods', value: '#00ff64' },
    { label: '--classes-constants', value: '#ffa600' },
    { label: '--string', value: '#0800ff' },
    { label: '--operators-special', value: '#14ff91' },
    { label: '--comments', value: '#0055ff' },
  ];

  tabColors: ColorField[] = [
    { label: '--tabs-container-background', value: '#333333' },
    { label: '--tab-active-background', value: '#1e1e1e' },
    { label: '--tab-active-foreground', value: '#ffffff' },
    { label: '--tab-border', value: '#444444' },
    { label: '--tab-inactive-background', value: '#2d2d2d' },
    { label: '--tab-inactive-foreground', value: '#aaaaaa' },
    { label: '--tab-hover-background', value: '#3d3d3d' },
    { label: '--tab-hover-foreground', value: '#ffffff' }
  ];

  sidebarColors: ColorField[] = [
    { label: '--sidebar-background', value: '#f3f3f3' },
    { label: '--sidebar-foreground', value: '#616161' },
    { label: '--side-bar-section-header-background', value: '#00000000' },
    { label: '--side-bar-section-header-foreground', value: '#616161' },
    { label: '--side-bar-section-header-border', value: '#61616130' },
    { label: '--side-bar-section-border', value: '#00000000'},
    { label: '--list-hover-background', value: '#e8e8e8' },
    { label: '--list-hover-foreground', value: '#616161' },
  ];

  statusBarColors: ColorField[] = [
    { label: '--status-bar-background', value: '#007acc' },
    { label: '--status-bar-foreground', value: '#ffffff' },
    { label: '--status-bar-background-hover', value: '#ffffff' },
    { label: '--status-bar-remote-foreground', value: '#925151' }
  ];

  topBarColors: ColorField[] = [
    { label: '--top-bar-background', value: '#2c2c2c' },
    { label: '--top-bar-text', value: '#ffffff' },
    { label: '--title-bar-border', value: '#00000000' },
  ];

  additionalColors: ColorField[] = [
    { label: '--activity-bar-background', value: '#2c2c2c' },
    { label: '--activity-bar-foreground', value: '#ffffff' },
    { label: '--activity-bar-inactive-foreground', value: '#ffffff66' },
    { label: '--activity-bar-badge-foreground', value: '#ffffff' },
    { label: '--activity-bar-badge-background', value: '#007acc' },
    { label: '--menubar-selection-foreground', value: '#333333' },
    { label: '--menubar-selection-background', value: '#0000001a' },
    { label: '--menu-foreground', value: '#616161' },
    { label: '--menu-background', value: '#ffffff' },
    { label: '--menu-selection-foreground', value: '#ffffff' },
    { label: '--menu-selection-background', value: '#0060c0' },
    { label: '--menu-selection-border', value: '#00000000' },
    { label: '--menu-separator-background', value: '#888888' },
    { label: '--menu-border', value: '#00000085' },
    { label: '--button-background', value: '#007acc' },
    { label: '--button-foreground', value: '#ffffff' },
    { label: '--button-hover-background', value: '#0062a3' },
    { label: '--button-secondary-foreground', value: '#ffffff' },
    { label: '--button-secondary-background', value: '#5f6a79' },
    { label: '--button-secondary-hover-background', value: '#4c5561' },
    { label: '--input-background', value: '#ffffff' },
    { label: '--input-border', value: '#00000000' },
    { label: '--input-foreground', value: '#616161' },
    { label: '--input-option-active-background', value: '#0090f133' },
    { label: '--input-option-active-border', value: '#007acc00' },
    { label: '--input-option-active-foreground', value: '#000000' },
    { label: '--input-placeholder-foreground', value: '#767676' },
    { label: '--text-link-foreground', value: '#006ab1' },
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
      ...this.additionalColors,
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
    this.additionalColors = updateColorValues(this.additionalColors);
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

  toggleSection(section: SectionKey) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  isSectionExpanded(section: SectionKey): boolean {
    return this.expandedSections[section];
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
