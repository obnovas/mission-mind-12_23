import { NetworkGroup } from '../types';

export const mockNetworkGroups: NetworkGroup[] = [
  {
    id: '1',
    name: 'Youth Ministry Team',
    description: 'Core team members involved in youth ministry programs and activities',
    members: ['2', '3', '4', '10'], // Sarah, Michael, Emily, James
    createdAt: '2024-03-01T00:00:00.000Z',
    updatedAt: '2024-03-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Community Outreach Partners',
    description: 'Organizations collaborating on community service initiatives',
    members: ['7', '8', '9'], // Hope Center, Mercy Hospital, Food Bank
    createdAt: '2024-03-02T00:00:00.000Z',
    updatedAt: '2024-03-02T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Small Group Leaders',
    description: 'Leaders and mentors of various small groups and Bible studies',
    members: ['11', '12', '6'], // Rachel, Thomas, Lisa
    createdAt: '2024-03-03T00:00:00.000Z',
    updatedAt: '2024-03-03T00:00:00.000Z'
  },
  {
    id: '4',
    name: 'Prayer Warriors',
    description: 'Dedicated team focused on prayer ministry and intercession',
    members: ['2', '5', '10', '11'], // Sarah, David, James, Rachel
    createdAt: '2024-03-04T00:00:00.000Z',
    updatedAt: '2024-03-04T00:00:00.000Z'
  },
  {
    id: '5',
    name: 'Mission Support Network',
    description: 'Contacts involved in supporting mission work and missionaries',
    members: ['3', '7', '9', '12'], // Michael, Hope Center, Food Bank, Thomas
    createdAt: '2024-03-05T00:00:00.000Z',
    updatedAt: '2024-03-05T00:00:00.000Z'
  }
];