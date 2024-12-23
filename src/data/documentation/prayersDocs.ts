import { DocSection } from '../../types/documentation';

export const prayersDocs: DocSection = {
  title: 'Prayer Requests',
  link: '/prayer-requests',
  color: 'sunset',
  description: `The Prayer Requests section helps you maintain a structured prayer ministry. Track prayer needs, record God's answers, and maintain a testimony of His faithfulness. This feature integrates with your contacts and check-ins, ensuring that prayer remains a central part of your ministry relationships.`,
  features: [
    'Prayer request tracking',
    'Answer documentation',
    'Prayer history',
    'Category organization',
    'Prayer updates and notifications'
  ],
  questions: [
    {
      question: 'How do I add a new prayer request?',
      answer: 'Click "Add Prayer Request" and select the associated contact. Enter the request details and set the status to Active. You can add requests from the main Prayer Requests page or directly from a contact\'s profile.'
    },
    {
      question: 'How do I mark a prayer as answered?',
      answer: 'Find the prayer request and click the checkmark icon to mark it as Answered. You can add notes about how God answered the prayer, which helps build a testimony of God\'s faithfulness.'
    },
    {
      question: 'Can I share prayer requests with others?',
      answer: 'Yes, you can share prayer requests by creating a network group. Simply navigate to the Network Groups page, set up a group, and share prayer details with the members to foster collaboration and support.'
    },
    {
      question: 'How do I track long-term prayer needs?',
      answer: 'Keep prayer requests Active and use the notes feature to add updates. Regular check-ins will prompt you to review and update long-term prayer needs.'
    },
    {
      question: 'How can I review answered prayers?',
      answer: 'Filter the prayer requests to show Answered status. This creates a powerful testimony record and helps encourage faith by seeing God\'s faithfulness over time.'
    },
    {
      question: 'Can I filter prayer requests by category?',
      answer: 'Yes, you can include specific keywords like "Health," "Ministry," or "Family" in the prayer request text. Then, use the search bar on the Prayers page to filter and find requests related to those terms.'
    },
    {
      question: 'How do I delete multiple prayer requests at once?',
      answer: 'While there\'s no bulk delete option, you can filter requests (e.g., by status or category) and manually delete them one by one. Consider archiving instead, if you want to keep the history for future reference.'
    }
  ]
};