import { DocSection } from '../../types/documentation';

export const networkDocs: DocSection = {
  title: 'Network Groups',
  link: '/network-groups',
  color: 'lavender',
  description: `Network Groups allow you to organize your contacts into meaningful collections. Whether you're managing ministry teams, small groups, or special interest groups, this feature helps you track collective progress and facilitate group communication. Groups can overlap, allowing you to see how different aspects of your ministry intersect and interact.`,
  features: [
    'Group management',
    'Member tracking',
    'Group communications',
    'Collective progress monitoring',
    'Group analytics'
  ],
  questions: [
    {
      question: 'How do I create a new group?',
      answer: 'Click "Create Group" on the Network Groups page. Name your group, add a description, and select members from your contacts. Groups can represent ministry teams, small groups, or any other collective.'
    },
    {
      question: 'How can I add members to a group?',
      answer: 'Edit a group and use the member selection tool to add contacts. You can search for contacts by name or email, and add multiple members at once.'
    },
    {
      question: 'Can someone be in multiple groups?',
      answer: 'Yes! Contacts can belong to multiple groups. This helps track different aspects of their involvement, such as being in both a small group and a ministry team.'
    },
    {
      question: 'How do I communicate with group members?',
      answer: 'To communicate with group members, use the messaging tool located in each network group section on the Network page for direct communication. You can also export member contact information if you prefer to use external communication methods.'
    },
    {
      question: 'How do I communicate with a subset of group members?',
      answer: 'Open the group\'s member list and select the individuals you wish to contact. Group members can see each other\'s contact information and send messages directly to selected individuals without involving the entire group.'
    },
    {
      question: 'How can I track group activities?',
      answer: 'Each group has an activity feed showing member updates, journey progress, and prayer requests. Use group analytics to monitor collective growth and engagement.'
    },
    {
      question: 'How can I monitor individual contributions within a group?',
      answer: 'Go to the member\'s profile from the group page. Review their associated journeys, check-ins, and prayer requests to evaluate their engagement within the group.'
    }
  ]
};