import { DocSection } from '../../types/documentation';

export const contactsDocs: DocSection = {
  title: 'Contacts',
  link: '/contacts',
  color: 'coral',
  description: `The Contacts section is where you manage all your ministry relationships. Whether you're tracking individual relationships, organizations, or business connections, this section provides tools for maintaining detailed records, scheduling regular check-ins, and monitoring relationship growth through various journeys.`,
  features: [
    'Comprehensive contact management',
    'Automated check-in scheduling',
    'Relationship mapping',
    'Journey progress tracking',
    'Communication history'
  ],
  questions: [
    {
      question: 'How do I import contacts from another system?',
      answer: 'Go to Profile & Settings and use the CSV Import tool. Your CSV file should include required fields like name, type, and check-in frequency. The system will guide you through mapping your columns to the correct fields.'
    },
    {
      question: 'How do I set up regular check-in reminders?',
      answer: 'When creating or editing a contact, set their check-in frequency (Daily, Weekly, Monthly, etc.). The system will automatically calculate the next check-in date and display reminders on your dashboard when they\'re due.'
    },
    {
      question: 'How can I track relationships between contacts?',
      answer: 'In any contact\'s profile, use the Relationships section to establish connections with other contacts. You can specify relationship types (Friend, Family, Mentor, etc.) and add notes about the relationship.'
    },
    {
      question: 'How do I add a contact to multiple journeys?',
      answer: 'From a contact\'s profile, click "Add to Journey" in the Journey Progress section. You can select any available journey and set their initial stage. A contact can be in multiple journeys simultaneously.'
    },
    {
      question: 'How can I export my contact data?',
      answer: 'Visit Profile & Settings to access the data export tools. You can export all contact data or filter by specific criteria. Exports include contact details, relationships, journey progress, and prayer requests.'
    },
    {
      question: 'Is it possible to merge duplicate contacts?',
      answer: 'Currently, there is no built-in feature to merge duplicate contacts. However, you can manually edit one of the contact profiles to consolidate information, then delete the duplicate entry. Ensure all related data (journeys, prayer requests, etc.) is assigned to the remaining contact profile.'
    },
    {
      question: 'Can I assign a contact to a specific team member for follow-up?',
      answer: 'Assigning contacts to team members is not supported at this time. As a workaround, you can use the Notes field within a contact profile to indicate who is responsible for managing the contact.'
    }
  ]
};