import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { useLocation } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Stethoscope,
  Phone,
  Mail,
  Eye,
  Edit,
  ArrowLeft,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  RefreshCw,
  X,
  ChevronDown
} from 'lucide-react';

export function SearchResults() {
  const location = useLocation();
  FileText,
  Users,
  Ban,
  Trash2
  const query = searchParams.get('q') || '';
  const managedBy = searchParams.get('managedBy') || '';

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    status: '',
    credentials: ''
  });

  // Mock search results - 100 total providers assigned by specialty
  const allResults = [
    // John Doe's providers (28 total) - Internal Medicine, Cardiology, Gastroenterology
    {
      id: '1',
      name: 'Dr. Robert Anderson',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Los Angeles, CA',
      phone: '(555) 123-4567',
      email: 'robert.anderson@example.com',
      npi: '1234567890',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '2',
      name: 'Dr. Maria Gonzalez',
      credentials: 'MD',
      specialty: 'Cardiology',
      location: 'Beverly Hills, CA',
      phone: '(555) 234-5678',
      email: 'maria.gonzalez@example.com',
      npi: '1234567891',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '3',
      name: 'Dr. James Wilson',
      credentials: 'MD',
      specialty: 'Gastroenterology',
      location: 'Santa Monica, CA',
      phone: '(555) 345-6789',
      email: 'james.wilson@example.com',
      npi: '1234567892',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '4',
      name: 'Dr. Jennifer Lee',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Pasadena, CA',
      phone: '(555) 456-7890',
      email: 'jennifer.lee@example.com',
      npi: '1234567893',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '5',
      name: 'Dr. Steven Chen',
      credentials: 'MD',
      specialty: 'Cardiology',
      location: 'Long Beach, CA',
      phone: '(555) 567-8901',
      email: 'steven.chen@example.com',
      npi: '1234567894',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '6',
      name: 'Dr. Lisa Park',
      credentials: 'DO',
      specialty: 'Internal Medicine',
      location: 'Irvine, CA',
      phone: '(555) 678-9012',
      email: 'lisa.park@example.com',
      npi: '1234567895',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '7',
      name: 'Dr. Michael Torres',
      credentials: 'MD',
      specialty: 'Gastroenterology',
      location: 'San Diego, CA',
      phone: '(555) 789-0123',
      email: 'michael.torres@example.com',
      npi: '1234567896',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '8',
      name: 'Dr. Amanda Kim',
      credentials: 'MD',
      specialty: 'Cardiology',
      location: 'Anaheim, CA',
      phone: '(555) 890-1234',
      email: 'amanda.kim@example.com',
      npi: '1234567897',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '9',
      name: 'Dr. David Martinez',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Riverside, CA',
      phone: '(555) 901-2345',
      email: 'david.martinez@example.com',
      npi: '1234567898',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '10',
      name: 'Dr. Rachel Thompson',
      credentials: 'DO',
      specialty: 'Gastroenterology',
      location: 'Fresno, CA',
      phone: '(555) 012-3456',
      email: 'rachel.thompson@example.com',
      npi: '1234567899',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '11',
      name: 'Dr. Brian Lee',
      credentials: 'MD',
      specialty: 'Cardiology',
      location: 'Sacramento, CA',
      phone: '(555) 123-4567',
      email: 'brian.lee@example.com',
      npi: '1234567900',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '12',
      name: 'Dr. Nicole Wang',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Oakland, CA',
      phone: '(555) 234-5678',
      email: 'nicole.wang@example.com',
      npi: '1234567901',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '13',
      name: 'Dr. Christopher Davis',
      credentials: 'MD',
      specialty: 'Gastroenterology',
      location: 'San Jose, CA',
      phone: '(555) 345-6789',
      email: 'christopher.davis@example.com',
      npi: '1234567902',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '14',
      name: 'Dr. Stephanie Brown',
      credentials: 'DO',
      specialty: 'Cardiology',
      location: 'Stockton, CA',
      phone: '(555) 456-7890',
      email: 'stephanie.brown@example.com',
      npi: '1234567903',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '15',
      name: 'Dr. Kevin Rodriguez',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Bakersfield, CA',
      phone: '(555) 567-8901',
      email: 'kevin.rodriguez@example.com',
      npi: '1234567904',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '16',
      name: 'Dr. Michelle Garcia',
      credentials: 'MD',
      specialty: 'Gastroenterology',
      location: 'Modesto, CA',
      phone: '(555) 678-9012',
      email: 'michelle.garcia@example.com',
      npi: '1234567905',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '17',
      name: 'Dr. Daniel Wilson',
      credentials: 'MD',
      specialty: 'Cardiology',
      location: 'Santa Barbara, CA',
      phone: '(555) 789-0123',
      email: 'daniel.wilson@example.com',
      npi: '1234567906',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '18',
      name: 'Dr. Jessica Miller',
      credentials: 'DO',
      specialty: 'Internal Medicine',
      location: 'Oxnard, CA',
      phone: '(555) 890-1234',
      email: 'jessica.miller@example.com',
      npi: '1234567907',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '19',
      name: 'Dr. Andrew Taylor',
      credentials: 'MD',
      specialty: 'Gastroenterology',
      location: 'Salinas, CA',
      phone: '(555) 901-2345',
      email: 'andrew.taylor@example.com',
      npi: '1234567908',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '20',
      name: 'Dr. Sarah Johnson',
      credentials: 'MD',
      specialty: 'Cardiology',
      location: 'Visalia, CA',
      phone: '(555) 012-3456',
      email: 'sarah.johnson@example.com',
      npi: '1234567909',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '21',
      name: 'Dr. Matthew Anderson',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Thousand Oaks, CA',
      phone: '(555) 123-4567',
      email: 'matthew.anderson@example.com',
      npi: '1234567910',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '22',
      name: 'Dr. Lauren Thomas',
      credentials: 'DO',
      specialty: 'Gastroenterology',
      location: 'Simi Valley, CA',
      phone: '(555) 234-5678',
      email: 'lauren.thomas@example.com',
      npi: '1234567911',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '23',
      name: 'Dr. Ryan Jackson',
      credentials: 'MD',
      specialty: 'Cardiology',
      location: 'Concord, CA',
      phone: '(555) 345-6789',
      email: 'ryan.jackson@example.com',
      npi: '1234567912',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '24',
      name: 'Dr. Emily White',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Antioch, CA',
      phone: '(555) 456-7890',
      email: 'emily.white@example.com',
      npi: '1234567913',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '25',
      name: 'Dr. Justin Harris',
      credentials: 'MD',
      specialty: 'Gastroenterology',
      location: 'Richmond, CA',
      phone: '(555) 567-8901',
      email: 'justin.harris@example.com',
      npi: '1234567914',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '26',
      name: 'Dr. Megan Clark',
      credentials: 'DO',
      specialty: 'Cardiology',
      location: 'Vallejo, CA',
      phone: '(555) 678-9012',
      email: 'megan.clark@example.com',
      npi: '1234567915',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '27',
      name: 'Dr. Tyler Lewis',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Fairfield, CA',
      phone: '(555) 789-0123',
      email: 'tyler.lewis@example.com',
      npi: '1234567916',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '28',
      name: 'Dr. Samantha Walker',
      credentials: 'MD',
      specialty: 'Gastroenterology',
      location: 'Napa, CA',
      phone: '(555) 890-1234',
      email: 'samantha.walker@example.com',
      npi: '1234567917',
      status: 'active',
      managedBy: 'John Doe'
    },

    // Emily Rodriguez's providers (35 total) - Pediatrics, Family Medicine, Pediatric Surgery
    {
      id: '29',
      name: 'Dr. Sarah Martinez',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Miami, FL',
      phone: '(555) 567-8901',
      email: 'sarah.martinez@example.com',
      npi: '1234567918',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '30',
      name: 'Dr. Michael Brown',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Orlando, FL',
      phone: '(555) 678-9012',
      email: 'michael.brown@example.com',
      npi: '1234567919',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '31',
      name: 'Dr. Amanda Davis',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'Tampa, FL',
      phone: '(555) 789-0123',
      email: 'amanda.davis@example.com',
      npi: '1234567920',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '32',
      name: 'Dr. Carlos Hernandez',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Jacksonville, FL',
      phone: '(555) 890-1234',
      email: 'carlos.hernandez@example.com',
      npi: '1234567921',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '33',
      name: 'Dr. Jennifer Lopez',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Fort Lauderdale, FL',
      phone: '(555) 901-2345',
      email: 'jennifer.lopez@example.com',
      npi: '1234567922',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '34',
      name: 'Dr. Robert Gonzalez',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'St. Petersburg, FL',
      phone: '(555) 012-3456',
      email: 'robert.gonzalez@example.com',
      npi: '1234567923',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '35',
      name: 'Dr. Maria Perez',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Hialeah, FL',
      phone: '(555) 123-4567',
      email: 'maria.perez@example.com',
      npi: '1234567924',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '36',
      name: 'Dr. David Rodriguez',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Tallahassee, FL',
      phone: '(555) 234-5678',
      email: 'david.rodriguez@example.com',
      npi: '1234567925',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '37',
      name: 'Dr. Lisa Garcia',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'Port St. Lucie, FL',
      phone: '(555) 345-6789',
      email: 'lisa.garcia@example.com',
      npi: '1234567926',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '38',
      name: 'Dr. Antonio Martinez',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Cape Coral, FL',
      phone: '(555) 456-7890',
      email: 'antonio.martinez@example.com',
      npi: '1234567927',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '39',
      name: 'Dr. Carmen Sanchez',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Pembroke Pines, FL',
      phone: '(555) 567-8901',
      email: 'carmen.sanchez@example.com',
      npi: '1234567928',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '40',
      name: 'Dr. Miguel Torres',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'Hollywood, FL',
      phone: '(555) 678-9012',
      email: 'miguel.torres@example.com',
      npi: '1234567929',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '41',
      name: 'Dr. Ana Ramirez',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Gainesville, FL',
      phone: '(555) 789-0123',
      email: 'ana.ramirez@example.com',
      npi: '1234567930',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '42',
      name: 'Dr. Jose Flores',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Miramar, FL',
      phone: '(555) 890-1234',
      email: 'jose.flores@example.com',
      npi: '1234567931',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '43',
      name: 'Dr. Patricia Rivera',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'Coral Springs, FL',
      phone: '(555) 901-2345',
      email: 'patricia.rivera@example.com',
      npi: '1234567932',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '44',
      name: 'Dr. Francisco Morales',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Clearwater, FL',
      phone: '(555) 012-3456',
      email: 'francisco.morales@example.com',
      npi: '1234567933',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '45',
      name: 'Dr. Rosa Gutierrez',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Miami Gardens, FL',
      phone: '(555) 123-4567',
      email: 'rosa.gutierrez@example.com',
      npi: '1234567934',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '46',
      name: 'Dr. Eduardo Vargas',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'Plantation, FL',
      phone: '(555) 234-5678',
      email: 'eduardo.vargas@example.com',
      npi: '1234567935',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '47',
      name: 'Dr. Lucia Castillo',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Davie, FL',
      phone: '(555) 345-6789',
      email: 'lucia.castillo@example.com',
      npi: '1234567936',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '48',
      name: 'Dr. Manuel Jimenez',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Sunrise, FL',
      phone: '(555) 456-7890',
      email: 'manuel.jimenez@example.com',
      npi: '1234567937',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '49',
      name: 'Dr. Gabriela Mendez',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'Boca Raton, FL',
      phone: '(555) 567-8901',
      email: 'gabriela.mendez@example.com',
      npi: '1234567938',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '50',
      name: 'Dr. Ricardo Herrera',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Delray Beach, FL',
      phone: '(555) 678-9012',
      email: 'ricardo.herrera@example.com',
      npi: '1234567939',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '51',
      name: 'Dr. Veronica Cruz',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Boynton Beach, FL',
      phone: '(555) 789-0123',
      email: 'veronica.cruz@example.com',
      npi: '1234567940',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '52',
      name: 'Dr. Alejandro Diaz',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'West Palm Beach, FL',
      phone: '(555) 890-1234',
      email: 'alejandro.diaz@example.com',
      npi: '1234567941',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '53',
      name: 'Dr. Isabella Ruiz',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Pompano Beach, FL',
      phone: '(555) 901-2345',
      email: 'isabella.ruiz@example.com',
      npi: '1234567942',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '54',
      name: 'Dr. Fernando Ortiz',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Lakeland, FL',
      phone: '(555) 012-3456',
      email: 'fernando.ortiz@example.com',
      npi: '1234567943',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '55',
      name: 'Dr. Natalia Moreno',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'Kissimmee, FL',
      phone: '(555) 123-4567',
      email: 'natalia.moreno@example.com',
      npi: '1234567944',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '56',
      name: 'Dr. Andres Romero',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Homestead, FL',
      phone: '(555) 234-5678',
      email: 'andres.romero@example.com',
      npi: '1234567945',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '57',
      name: 'Dr. Camila Silva',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Deerfield Beach, FL',
      phone: '(555) 345-6789',
      email: 'camila.silva@example.com',
      npi: '1234567946',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '58',
      name: 'Dr. Diego Castro',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'Palm Bay, FL',
      phone: '(555) 456-7890',
      email: 'diego.castro@example.com',
      npi: '1234567947',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '59',
      name: 'Dr. Valentina Ramos',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Melbourne, FL',
      phone: '(555) 567-8901',
      email: 'valentina.ramos@example.com',
      npi: '1234567948',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '60',
      name: 'Dr. Sebastian Vega',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Largo, FL',
      phone: '(555) 678-9012',
      email: 'sebastian.vega@example.com',
      npi: '1234567949',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '61',
      name: 'Dr. Daniela Aguilar',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'Pinellas Park, FL',
      phone: '(555) 789-0123',
      email: 'daniela.aguilar@example.com',
      npi: '1234567950',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '62',
      name: 'Dr. Mateo Guerrero',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Ocala, FL',
      phone: '(555) 890-1234',
      email: 'mateo.guerrero@example.com',
      npi: '1234567951',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '63',
      name: 'Dr. Sofia Medina',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Fort Myers, FL',
      phone: '(555) 901-2345',
      email: 'sofia.medina@example.com',
      npi: '1234567952',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },

    // David Thompson's providers (22 total) - Orthopedic Surgery, Sports Medicine, Physical Therapy
    {
      id: '64',
      name: 'Dr. Kevin Johnson',
      credentials: 'MD',
      specialty: 'Orthopedic Surgery',
      location: 'Denver, CO',
      phone: '(555) 890-1234',
      email: 'kevin.johnson@example.com',
      npi: '1234567953',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '65',
      name: 'Dr. Rachel Green',
      credentials: 'DO',
      specialty: 'Sports Medicine',
      location: 'Boulder, CO',
      phone: '(555) 901-2345',
      email: 'rachel.green@example.com',
      npi: '1234567954',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '66',
      name: 'Dr. Thomas Miller',
      credentials: 'DPT',
      specialty: 'Physical Therapy',
      location: 'Colorado Springs, CO',
      phone: '(555) 012-3456',
      email: 'thomas.miller@example.com',
      npi: '1234567955',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '67',
      name: 'Dr. Mark Stevens',
      credentials: 'MD',
      specialty: 'Orthopedic Surgery',
      location: 'Aurora, CO',
      phone: '(555) 123-4567',
      email: 'mark.stevens@example.com',
      npi: '1234567956',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '68',
      name: 'Dr. Jennifer Adams',
      credentials: 'DO',
      specialty: 'Sports Medicine',
      location: 'Lakewood, CO',
      phone: '(555) 234-5678',
      email: 'jennifer.adams@example.com',
      npi: '1234567957',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '69',
      name: 'Dr. Robert Baker',
      credentials: 'DPT',
      specialty: 'Physical Therapy',
      location: 'Thornton, CO',
      phone: '(555) 345-6789',
      email: 'robert.baker@example.com',
      npi: '1234567958',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '70',
      name: 'Dr. Sarah Campbell',
      credentials: 'MD',
      specialty: 'Orthopedic Surgery',
      location: 'Westminster, CO',
      phone: '(555) 456-7890',
      email: 'sarah.campbell@example.com',
      npi: '1234567959',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '71',
      name: 'Dr. Michael Carter',
      credentials: 'DO',
      specialty: 'Sports Medicine',
      location: 'Arvada, CO',
      phone: '(555) 567-8901',
      email: 'michael.carter@example.com',
      npi: '1234567960',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '72',
      name: 'Dr. Lisa Collins',
      credentials: 'DPT',
      specialty: 'Physical Therapy',
      location: 'Pueblo, CO',
      phone: '(555) 678-9012',
      email: 'lisa.collins@example.com',
      npi: '1234567961',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '73',
      name: 'Dr. James Cooper',
      credentials: 'MD',
      specialty: 'Orthopedic Surgery',
      location: 'Fort Collins, CO',
      phone: '(555) 789-0123',
      email: 'james.cooper@example.com',
      npi: '1234567962',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '74',
      name: 'Dr. Amanda Edwards',
      credentials: 'DO',
      specialty: 'Sports Medicine',
      location: 'Greeley, CO',
      phone: '(555) 890-1234',
      email: 'amanda.edwards@example.com',
      npi: '1234567963',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '75',
      name: 'Dr. Daniel Evans',
      credentials: 'DPT',
      specialty: 'Physical Therapy',
      location: 'Longmont, CO',
      phone: '(555) 901-2345',
      email: 'daniel.evans@example.com',
      npi: '1234567964',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '76',
      name: 'Dr. Michelle Foster',
      credentials: 'MD',
      specialty: 'Orthopedic Surgery',
      location: 'Loveland, CO',
      phone: '(555) 012-3456',
      email: 'michelle.foster@example.com',
      npi: '1234567965',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '77',
      name: 'Dr. Christopher Gray',
      credentials: 'DO',
      specialty: 'Sports Medicine',
      location: 'Grand Junction, CO',
      phone: '(555) 123-4567',
      email: 'christopher.gray@example.com',
      npi: '1234567966',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '78',
      name: 'Dr. Nicole Hall',
      credentials: 'DPT',
      specialty: 'Physical Therapy',
      location: 'Broomfield, CO',
      phone: '(555) 234-5678',
      email: 'nicole.hall@example.com',
      npi: '1234567967',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '79',
      name: 'Dr. Ryan Hughes',
      credentials: 'MD',
      specialty: 'Orthopedic Surgery',
      location: 'Centennial, CO',
      phone: '(555) 345-6789',
      email: 'ryan.hughes@example.com',
      npi: '1234567968',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '80',
      name: 'Dr. Stephanie King',
      credentials: 'DO',
      specialty: 'Sports Medicine',
      location: 'Parker, CO',
      phone: '(555) 456-7890',
      email: 'stephanie.king@example.com',
      npi: '1234567969',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '81',
      name: 'Dr. Brandon Lee',
      credentials: 'DPT',
      specialty: 'Physical Therapy',
      location: 'Castle Rock, CO',
      phone: '(555) 567-8901',
      email: 'brandon.lee@example.com',
      npi: '1234567970',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '82',
      name: 'Dr. Ashley Martin',
      credentials: 'MD',
      specialty: 'Orthopedic Surgery',
      location: 'Wheat Ridge, CO',
      phone: '(555) 678-9012',
      email: 'ashley.martin@example.com',
      npi: '1234567971',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '83',
      name: 'Dr. Jordan Mitchell',
      credentials: 'DO',
      specialty: 'Sports Medicine',
      location: 'Englewood, CO',
      phone: '(555) 789-0123',
      email: 'jordan.mitchell@example.com',
      npi: '1234567972',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '84',
      name: 'Dr. Taylor Moore',
      credentials: 'DPT',
      specialty: 'Physical Therapy',
      location: 'Littleton, CO',
      phone: '(555) 890-1234',
      email: 'taylor.moore@example.com',
      npi: '1234567973',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '85',
      name: 'Dr. Morgan Nelson',
      credentials: 'MD',
      specialty: 'Orthopedic Surgery',
      location: 'Louisville, CO',
      phone: '(555) 901-2345',
      email: 'morgan.nelson@example.com',
      npi: '1234567974',
      status: 'active',
      managedBy: 'David Thompson'
    },

    // Lisa Wang's providers (15 total) - Psychiatry, Psychology, Mental Health
    {
      id: '86',
      name: 'Dr. Patricia White',
      credentials: 'MD',
      specialty: 'Psychiatry',
      location: 'Seattle, WA',
      phone: '(555) 123-4567',
      email: 'patricia.white@example.com',
      npi: '1234567975',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '87',
      name: 'Dr. Daniel Clark',
      credentials: 'PsyD',
      specialty: 'Psychology',
      location: 'Portland, OR',
      phone: '(555) 234-5678',
      email: 'daniel.clark@example.com',
      npi: '1234567976',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '88',
      name: 'Dr. Susan Taylor',
      credentials: 'DO',
      specialty: 'Mental Health',
      location: 'Spokane, WA',
      phone: '(555) 345-6789',
      email: 'susan.taylor@example.com',
      npi: '1234567977',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '89',
      name: 'Dr. Richard Allen',
      credentials: 'MD',
      specialty: 'Psychiatry',
      location: 'Tacoma, WA',
      phone: '(555) 456-7890',
      email: 'richard.allen@example.com',
      npi: '1234567978',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '90',
      name: 'Dr. Karen Young',
      credentials: 'PsyD',
      specialty: 'Psychology',
      location: 'Eugene, OR',
      phone: '(555) 567-8901',
      email: 'karen.young@example.com',
      npi: '1234567979',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '91',
      name: 'Dr. Steven Wright',
      credentials: 'DO',
      specialty: 'Mental Health',
      location: 'Vancouver, WA',
      phone: '(555) 678-9012',
      email: 'steven.wright@example.com',
      npi: '1234567980',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '92',
      name: 'Dr. Nancy Lopez',
      credentials: 'MD',
      specialty: 'Psychiatry',
      location: 'Bellevue, WA',
      phone: '(555) 789-0123',
      email: 'nancy.lopez@example.com',
      npi: '1234567981',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '93',
      name: 'Dr. Paul Hill',
      credentials: 'PsyD',
      specialty: 'Psychology',
      location: 'Salem, OR',
      phone: '(555) 890-1234',
      email: 'paul.hill@example.com',
      npi: '1234567982',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '94',
      name: 'Dr. Betty Scott',
      credentials: 'DO',
      specialty: 'Mental Health',
      location: 'Kent, WA',
      phone: '(555) 901-2345',
      email: 'betty.scott@example.com',
      npi: '1234567983',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '95',
      name: 'Dr. Mark Green',
      credentials: 'MD',
      specialty: 'Psychiatry',
      location: 'Renton, WA',
      phone: '(555) 012-3456',
      email: 'mark.green@example.com',
      npi: '1234567984',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '96',
      name: 'Dr. Helen Adams',
      credentials: 'PsyD',
      specialty: 'Psychology',
      location: 'Gresham, OR',
      phone: '(555) 123-4567',
      email: 'helen.adams@example.com',
      npi: '1234567985',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '97',
      name: 'Dr. Gary Baker',
      credentials: 'DO',
      specialty: 'Mental Health',
      location: 'Federal Way, WA',
      phone: '(555) 234-5678',
      email: 'gary.baker@example.com',
      npi: '1234567986',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '98',
      name: 'Dr. Sandra Gonzalez',
      credentials: 'MD',
      specialty: 'Psychiatry',
      location: 'Everett, WA',
      phone: '(555) 345-6789',
      email: 'sandra.gonzalez@example.com',
      npi: '1234567987',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '99',
      name: 'Dr. Anthony Nelson',
      credentials: 'PsyD',
      specialty: 'Psychology',
      location: 'Hillsboro, OR',
      phone: '(555) 456-7890',
      email: 'anthony.nelson@example.com',
      npi: '1234567988',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '100',
      name: 'Dr. Donna Carter',
      credentials: 'DO',
      specialty: 'Mental Health',
      location: 'Spokane Valley, WA',
      phone: '(555) 567-8901',
      email: 'donna.carter@example.com',
      npi: '1234567989',
      status: 'active',
      managedBy: 'Lisa Wang'
    }
  ];

  // Get unique values for filter options
  const specialties = [...new Set(allResults.map(p => p.specialty))].sort();
  const locations = [...new Set(allResults.map(p => p.location.split(', ')[1]))].sort();
  const statuses = [...new Set(allResults.map(p => p.status))];
  const credentials = [...new Set(allResults.map(p => p.credentials))].sort();

  // Filter and sort results
  const filteredResults = allResults.filter(provider => {
    const matchesInitialQuery = !query || 
      provider.name.toLowerCase().includes(query.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(query.toLowerCase()) ||
      provider.location.toLowerCase().includes(query.toLowerCase());
    
    const matchesManagedBy = !managedBy || provider.managedBy === managedBy;
    
    const matchesSearchQuery = !searchQuery || 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.npi.includes(searchQuery) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = !filters.specialty || provider.specialty === filters.specialty;
    const matchesLocation = !filters.location || provider.location.includes(filters.location);
    const matchesStatus = !filters.status || provider.status === filters.status;
    const matchesCredentials = !filters.credentials || provider.credentials === filters.credentials;
    
    return matchesInitialQuery && matchesManagedBy && matchesSearchQuery && 
           matchesSpecialty && matchesLocation && matchesStatus && matchesCredentials;
  });

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'specialty':
        aValue = a.specialty.toLowerCase();
        bValue = b.specialty.toLowerCase();
        break;
      case 'location':
        aValue = a.location.toLowerCase();
        bValue = b.location.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      specialty: '',
      location: '',
      status: '',
      credentials: ''
    });
    setSearchQuery('');
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting search results...');
  };

  const handleSelectAll = () => {
    if (selectedProviders.length === sortedResults.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders(sortedResults.map(p => p.id));
    }
  };

  const handleSelectProvider = (providerId: string) => {
    setSelectedProviders(prev => {
      if (prev.includes(providerId)) {
        return prev.filter(id => id !== providerId);
      } else {
        return [...prev, providerId];
      }
    });
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on ${selectedProviders.length} providers:`, selectedProviders);
    // Mock bulk actions
    switch (action) {
      case 'export':
        console.log('Bulk exporting selected providers...');
        break;
      case 'deactivate':
        console.log('Bulk deactivating selected providers...');
        break;
      case 'reassign':
        console.log('Bulk reassigning selected providers...');
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedProviders.length} providers?`)) {
          console.log('Bulk deleting selected providers...');
        }
        break;
    }
    setSelectedProviders([]);
    setShowBulkActions(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPageTitle = () => {
    if (managedBy && query) {
      return `Search Results for "${query}" managed by ${managedBy}`;
    } else if (managedBy) {
      return `Providers managed by ${managedBy}`;
    } else if (query) {
      return `Search Results for "${query}"`;
    }
    return 'Search Results';
  };

  const getBreadcrumbs = () => {
    if (managedBy) {
      return [
        { label: 'User Management', href: '/user-management' },
        { label: 'Provider Results' }
      ];
    }
    return [
      { label: 'HCP Search', href: '/search' },
      { label: 'Search Results' }
    ];
  };

  return (
    <Layout breadcrumbs={getBreadcrumbs()}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href={managedBy ? "/user-management" : "/search"}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </a>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-gray-600">
                  {sortedResults.length} results found
                  {searchQuery && ` for "${searchQuery}"`}
                  {managedBy && ` managed by ${managedBy}`}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              {selectedProviders.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <span>Actions ({selectedProviders.length})</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {showBulkActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button
                        onClick={() => handleBulkAction('export')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Export Selected
                      </button>
                      <button
                        onClick={() => handleBulkAction('reassign')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Reassign to User
                      </button>
                      <button
                        onClick={() => handleBulkAction('deactivate')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Deactivate Selected
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => handleBulkAction('delete')}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete Selected
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search providers by name, specialty, location, NPI, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {Object.values(filters).some(v => v) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {Object.values(filters).filter(v => v).length}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="specialty">Sort by Specialty</option>
                  <option value="location">Sort by Location</option>
                  <option value="status">Sort by Status</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <select
                    value={filters.specialty}
                    onChange={(e) => handleFilterChange('specialty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All States</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credentials
                  </label>
                  <select
                    value={filters.credentials}
                    onChange={(e) => handleFilterChange('credentials', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Credentials</option>
                    {credentials.map(credential => (
                      <option key={credential} value={credential}>{credential}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Providers ({sortedResults.length})
              </h2>
              {sortedResults.length > 0 && (
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={selectedProviders.length === sortedResults.length && sortedResults.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span>Select All</span>
                  </label>
                  {selectedProviders.length > 0 && (
                    <span className="text-sm text-blue-600 font-medium">
                      {selectedProviders.length} selected
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {sortedResults.map((provider) => (
              <div key={provider.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedProviders.includes(provider.id)}
                      onChange={() => handleSelectProvider(provider.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {provider.name}, {provider.credentials}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                          {provider.status}
                        </span>
                      </div>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Stethoscope className="h-4 w-4 mr-2" />
                          {provider.specialty}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {provider.location}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {provider.phone}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {provider.email}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          NPI: {provider.npi}
                        </div>
                        {managedBy && (
                          <div className="text-sm text-gray-500">
                            Managed by: {provider.managedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={`/hcp-detail?id=${provider.id}`}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </a>
                    <a
                      href={`/hcp-edit?id=${provider.id}`}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}