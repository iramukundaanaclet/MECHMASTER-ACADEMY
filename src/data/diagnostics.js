const diagnostics = [
  {
    id: 'vehicle-doesnt-start',
    symptom: "Vehicle doesn't start",
    category: 'Automotive',
    possibleCauses: ['Weak battery', 'Starter problem', 'Fuel problem', 'Ignition problem', 'Sensor failure', 'ECU problem'],
    tests: ['Check battery voltage', 'Cranking test', 'Fuel pressure test', 'Spark or injector test', 'Scan for DTCs'],
    solution: 'Confirm the actual failing system before replacing parts. Start with battery voltage, then fuel and ignition checks.',
  },
  {
    id: 'charging-light-on',
    symptom: 'Charging warning light is on',
    category: 'Automotive',
    possibleCauses: ['Alternator failure', 'Loose drive belt', 'Low battery voltage', 'Bad regulator', 'Wiring fault'],
    tests: ['Voltage drop test', 'Alternator output test', 'Belt inspection', 'Charging circuit check'],
    solution: 'Measure charging output under load and inspect belt tension before replacing the alternator.',
  },
  {
    id: 'brake-pedal-soft',
    symptom: 'Brake pedal feels soft',
    category: 'Automotive',
    possibleCauses: ['Air in the system', 'Brake fluid leak', 'Worn pads', 'Master cylinder issue', 'ABS fault'],
    tests: ['Brake fluid check', 'Pressure bleed', 'Visual inspection', 'Pedal travel test'],
    solution: 'Inspect the hydraulic circuit for leaks and bleed the brakes if air is present.',
  },
  {
    id: 'motorcycle-no-start',
    symptom: 'Motorcycle cranks but will not start',
    category: 'Motorcycle',
    possibleCauses: ['Weak battery', 'Fuel flow issue', 'Spark plug fault', 'Ignition coil fault', 'Sensor problem'],
    tests: ['Battery voltage check', 'Spark test', 'Fuel delivery check', 'Compression and timing review'],
    solution: 'Verify fuel and ignition delivery before diagnosing deeper engine faults.',
  },
]

export default diagnostics
