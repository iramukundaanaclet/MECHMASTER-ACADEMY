const quizzes = [
  {
    id: 'alternator-quiz',
    title: 'Alternator Basics',
    category: 'Electrical',
    lesson: 'Charging System',
    questions: [
      {
        id: 1,
        question: 'What is the main function of an alternator?',
        options: ['Start the engine', 'Charge the battery', 'Cool the engine', 'Control the brakes'],
        answer: 'Charge the battery',
      },
      {
        id: 2,
        question: 'Which component commonly provides the initial engine rotation during cranking?',
        options: ['Starter motor', 'Alternator', 'Radiator', 'Fuel pump'],
        answer: 'Starter motor',
      },
      {
        id: 3,
        question: 'A weak battery voltage can often cause which symptom?',
        options: ['Brake fade', 'No crank or slow crank', 'Low coolant level', 'Gearbox slip'],
        answer: 'No crank or slow crank',
      },
    ],
  },
  {
    id: 'brake-quiz',
    title: 'Brake System',
    category: 'Repair',
    lesson: 'Brake Fundamentals',
    questions: [
      {
        id: 1,
        question: 'What is the main purpose of brake fluid?',
        options: ['Carry heat away from the engine', 'Transmit hydraulic pressure', 'Lubricate the clutch', 'Store fuel'],
        answer: 'Transmit hydraulic pressure',
      },
      {
        id: 2,
        question: 'ABS is designed to help with which driving condition?',
        options: ['Steering alignment', 'Wheel lock-up under heavy braking', 'Exhaust noise', 'Transmission shifting'],
        answer: 'Wheel lock-up under heavy braking',
      },
    ],
  },
]

export default quizzes
