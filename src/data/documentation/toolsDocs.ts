import { DocSection } from '../../types/documentation';

export const toolsDocs: DocSection = {
  title: 'Tools',
  link: '/tools',
  color: 'mint',
  description: 'The Tools section provides powerful features for analyzing, reporting, and visualizing your ministry data. From calendar views to influence mapping, these tools help you gain deeper insights and make informed decisions.',
  features: [
    'Calendar reporting and visualization',
    'Sphere of influence analysis',
    'Prayer week scheduling',
    'Daily and monthly ministry reports',
    'Data export capabilities'
  ],
  questions: [
    {
      question: 'How do I generate a calendar report?',
      answer: 'Navigate to Tools > Calendar Report to view your schedule in a calendar format. Use the export button to download a PDF version for printing or sharing.'
    },
    {
      question: 'What is the Sphere of Influence tool?',
      answer: 'The Sphere of Influence tool visualizes your ministry network and relationships. It shows how contacts are connected and helps identify key relationships and influence patterns in your ministry.'
    },
    {
      question: 'How do I manage prayer week assignments?',
      answer: 'Use the Prayer Week Schedule tool to assign contacts to specific weeks for focused prayer. You can view, modify, and export the schedule as needed.'
    },
    {
      question: 'How do I create a ministry report?',
      answer: 'Choose either Daily Report or Monthly Report from the Tools page. Click the generate button to create a comprehensive PDF report of your ministry activities and metrics.'
    },
    {
      question: 'Can I customize report content?',
      answer: 'Yes, you can customize report titles and content through Profile & Settings. Set your preferred titles and configure which metrics and information should be included in your reports.'
    }
  ]
};