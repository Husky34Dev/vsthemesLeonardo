import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

interface Faq {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  faqs: Faq[] = [
    {
      question: 'What is Leonardo Editor?',
      answer:
        'Leonardo Editor is a powerful tool inspired by the works of Leonardo da Vinci, designed to help you create and manage your visual studio themes!',
      open: false,
    },
    {
      question: 'How do I edit my personal data?',
      answer:
        'You can edit your personal data by clicking on the "Edit Personal Data" button above and navigating to your user profile page.',
      open: false,
    },
    {
      question: 'How to install VSIX extensions in Visual Studio?',
      answer:
        'Navigate to Extensions > Manage Extensions and select "Install from VSIX...". Remember to restart Visual Studio after installation.',
      open: false,
    },
    {
      question: 'Can I use Leonardo Editor on other platforms besides Windows?',
      answer:
        'Yes, this tool is available on multiple platforms. However, the development team is continuously working to improve compatibility and ensure a seamless experience across all supported platforms. Stay tuned for updates!',
      open: false,
    },
  ];

  showFaqModal = false;

  constructor(private authService: AuthService, private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  openFaqModal() {
    this.showFaqModal = true;
  }

  closeFaqModal() {
    this.showFaqModal = false;
  }
}
