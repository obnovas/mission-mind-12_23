import { DocSection } from '../../types/documentation';

export const dashboardDocs: DocSection = {
  title: 'Dashboard',
  link: '/',
  color: 'ocean',
  description: `The dashboard is your central hub for ministry relationship management. Here you'll find an overview of your contacts, upcoming check-ins, active prayer requests, and journey progress. The dashboard is designed to give you quick insights into your ministry relationships and help you stay on top of important follow-ups and prayer needs.`,
  features: [
    'Quick access to favorite contacts',
    'Overview of upcoming check-ins',
    'Active prayer request tracking',
    'Journey progress visualization',
    'Ministry metrics and analytics'
  ],
  questions: [
    {
      question: 'How do I add contacts to my favorites?',
      answer: 'To add a contact to your favorites, click the "+" symbol next to the "Favorites" section on the dashboard. This will instantly add them to your favorites list, allowing for quick access and easy follow-up.'
    },
    {
      question: 'How do I perform a quick check-in from the dashboard?',
      answer: 'Click the "Contact Check-in" button at the top of the dashboard. Select a contact from the list, add any relevant notes or prayer requests, and submit the check-in. The system will automatically schedule the next check-in based on the contact\'s frequency settings.'
    },
    {
      question: 'How can I customize which metrics appear?',
      answer: 'Visit the Profile & Settings page to customize your dashboard metrics. You can adjust which statistics are displayed and how they\'re calculated. This includes check-in periods, prayer request categories, and journey progress tracking.'
    },
    {
      question: 'How do I view more details about a specific metric?',
      answer: 'Click on any metric card or chart on the dashboard to view detailed information. This will take you to the relevant section (Contacts, Journeys, etc.) with filtered data specific to that metric.'
    },
    {
      question: 'How far ahead does the upcoming check-ins view show?',
      answer: 'By default, the upcoming check-ins view shows the next 30 days. You can adjust this timeframe in Settings under the "Check-in Period" section, choosing anywhere from 1 to 90 days.'
    },
    {
      question: 'How to Set a Welcome Message?',
      answer: 'To set a personalized welcome message, go to your Profile & Settings. Under the "Mission Personalization Options," select a message style that suits you, such as Biblical, Inspirational, or Simple. Once you\'ve made your choice, save the settings. The message will now appear on your dashboard each time you log in, providing a warm and tailored greeting.'
    },
    {
      question: 'How to Generate a Quick Ministry Report?',
      answer: 'Navigate to the Tools section and choose from available report options like Daily Report, Monthly Report, or specialized reports. Click the export button to download your selected report in PDF format.'
    }
  ]
};