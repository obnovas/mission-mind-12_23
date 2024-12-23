export interface DocQuestion {
  question: string;
  answer: string;
}

export interface DocSection {
  title: string;
  link: string;
  color: string;
  description: string;
  features: string[];
  questions: DocQuestion[];
}