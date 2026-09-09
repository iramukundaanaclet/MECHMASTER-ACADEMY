const courses = [
  {
    id: 'automotive-fundamentals',
    title: 'Automotive Fundamentals',
    category: 'Automotive',
    level: 'Beginner',
    description: 'Build a strong understanding of vehicle systems, components, and safe workshop habits.',
    lessons: 12,
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    progress: 28,
    lessonsList: ['Vehicle identification', 'Chassis and body basics', 'Powertrain overview', 'Safety systems', 'Workshop safety'],
  },
  {
    id: 'engine-maintenance',
    title: 'Engine Maintenance',
    category: 'Automotive',
    level: 'Intermediate',
    description: 'Learn preventive care, inspection routines, and practical engine service processes.',
    lessons: 15,
    image:
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80',
    progress: 42,
    lessonsList: ['Engine fundamentals', 'Lubrication system', 'Cooling system', 'Air intake and fuel', 'Maintenance checklist'],
  },
  {
    id: 'automotive-electrical-systems',
    title: 'Automotive Electrical Systems',
    category: 'Electrical',
    level: 'Intermediate',
    description: 'Understand batteries, starters, charging systems, wiring, and diagnostics with real-world logic.',
    lessons: 18,
    image:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
    progress: 80,
    lessonsList: ['Battery basics', 'Charging system', 'Wiring and fuses', 'Sensors and actuators', 'ECU diagnosis'],
  },
  {
    id: 'vehicle-diagnostics',
    title: 'Vehicle Diagnostics',
    category: 'Diagnostics',
    level: 'Intermediate',
    description: 'Use symptom-based troubleshooting, scan tool logic, and testing procedures to isolate faults.',
    lessons: 14,
    image:
      'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?auto=format&fit=crop&w=900&q=80',
    progress: 60,
    lessonsList: ['Symptom mapping', 'OBD-II basics', 'Sensor testing', 'Live data', 'Repair verification'],
  },
  {
    id: 'brake-system',
    title: 'Brake System',
    category: 'Repair',
    level: 'Intermediate',
    description: 'Study brake layout, friction materials, hydraulic systems, and safe inspection methods.',
    lessons: 11,
    image:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
    progress: 35,
    lessonsList: ['Disc and drum principles', 'ABS and boosters', 'Brake fluid and maintenance', 'Brake diagnostics', 'Road test'],
  },
  {
    id: 'motorcycle-technology',
    title: 'Motorcycle Technology',
    category: 'Motorcycle',
    level: 'Beginner',
    description: 'Explore the core systems of motorcycles with a practical workshop and performance lens.',
    lessons: 13,
    image:
      'https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=900&q=80',
    progress: 52,
    lessonsList: ['Motorcycle fundamentals', 'Engine types', 'Fuel systems', 'Electrical basics', 'Diagnostics'],
  },
  {
    id: 'motorcycle-diagnostics',
    title: 'Motorcycle Diagnostics',
    category: 'Motorcycle',
    level: 'Advanced',
    description: 'Diagnose starting, charging, fuel, and electrical faults with structured motorcycle procedures.',
    lessons: 10,
    image:
      'https://images.unsplash.com/photo-1524467673154-16ce45e4d5d6?auto=format&fit=crop&w=900&q=80',
    progress: 71,
    lessonsList: ['Starting faults', 'Charging issues', 'Ignition checks', 'Fuel faults', 'ECU troubleshooting'],
  },
  {
    id: 'automotive-body-repair',
    title: 'Automotive Body Repair',
    category: 'Body Repair',
    level: 'Intermediate',
    description: 'Learn panel repair, alignment, welding, and finishing work used in modern body shops.',
    lessons: 9,
    image:
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=80',
    progress: 19,
    lessonsList: ['Body structure', 'Dent repair', 'Welding basics', 'Painting prep', 'Alignment checks'],
  },
]

export default courses
