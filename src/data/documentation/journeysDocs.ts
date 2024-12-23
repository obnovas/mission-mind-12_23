import { DocSection } from '../../types/documentation';

export const journeysDocs: DocSection = {
  title: 'Journeys',
  link: '/journeys',
  color: 'sage',
  description: `Journeys help you track the spiritual and relational progress of your contacts. Each journey represents a pathway of growth or engagement, with customizable stages that reflect your ministry's unique discipleship or development process. This powerful tool helps you visualize and guide people through various stages of their faith journey or ministry involvement.`,
  features: [
    'Customizable journey stages',
    'Visual progress tracking',
    'Multiple journey paths',
    'Progress analytics',
    'Stage-specific notes and actions'
  ],
  questions: [
    {
      question: 'How do I create a new journey template?',
      answer: 'Click "Create Journey" on the Journeys page. Define the journey name, description, and up to 9 stages. You can use the default stages from Settings or create custom stages for this specific journey.'
    },
    {
      question: 'How can I modify journey stages?',
      answer: 'Edit a journey by clicking the edit icon. You can add, remove, or reorder stages using drag-and-drop. Note that modifying stages will not affect contacts\' current positions in the journey.'
    },
    {
      question: 'How do I move someone to the next stage?',
      answer: 'On the journey board, drag and drop a contact\'s card to the next stage column. You can also use the contact\'s profile to update their journey progress and add notes about the transition.'
    },
    {
      question: 'Can someone be in multiple journeys?',
      answer: 'Yes! Contacts can participate in multiple journeys simultaneously. Each journey tracks progress independently, allowing you to monitor different aspects of their growth or involvement.'
    },
    {
      question: 'How do I track group progress in a journey?',
      answer: 'Use the journey analytics to view distribution of contacts across stages. The visual board shows all participants, and you can filter by network groups to track collective progress.'
    }
  ]
};