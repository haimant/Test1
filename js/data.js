/**
 * PetServicesIndia — Data Layer
 * All listing data, taxonomies, and city metadata.
 * To add a new city: add to CITIES object and add listings with city: 'newcity'
 * To add a new listing: push a new object into LISTINGS following the schema below.
 */

var PSD = (function () {
  'use strict';

  /* =========================================================
     CATEGORIES
     ========================================================= */
  var CATEGORIES = {
    vets:     { label: 'Vets & Hospitals',  icon: '🩺', color: 'vet'      },
    trainers: { label: 'Dog Trainers',       icon: '🐕', color: 'trainer'  },
    groomers: { label: 'Pet Groomers',       icon: '✂️', color: 'groomer'  },
    boarding: { label: 'Pet Boarding',       icon: '🏨', color: 'boarding' },
    petfood:  { label: 'Pet Food & Shops',  icon: '🛒', color: 'petfood'  }
  };

  /* =========================================================
     BREED TAGS
     ========================================================= */
  var BREED_TAGS = [
    { value: 'all',        label: 'All Breeds',        icon: '🐾' },
    { value: 'small',      label: 'Small Breeds',      icon: '🐩' },
    { value: 'large',      label: 'Large Breeds',      icon: '🦮' },
    { value: 'aggressive', label: 'Aggressive / Reactive', icon: '⚡' },
    { value: 'puppy',      label: 'Puppies',           icon: '🐶' }
  ];

  /* =========================================================
     CITIES
     active: true  = has data, shown in selector
     active: false = coming soon, shown greyed in footer/cities section
     ========================================================= */
  var CITIES = {
    mumbai:    { name: 'Mumbai',    state: 'Maharashtra', emoji: '🌊', active: true },
    delhi:     { name: 'Delhi',     state: 'Delhi',       emoji: '🕌', active: false },
    bangalore: { name: 'Bangalore', state: 'Karnataka',   emoji: '🌿', active: false },
    pune:      { name: 'Pune',      state: 'Maharashtra', emoji: '🏔️', active: false },
    chennai:   { name: 'Chennai',   state: 'Tamil Nadu',  emoji: '🌴', active: false },
    hyderabad: { name: 'Hyderabad', state: 'Telangana',   emoji: '💎', active: false },
    kolkata:   { name: 'Kolkata',   state: 'West Bengal', emoji: '🎨', active: false },
    jaipur:    { name: 'Jaipur',    state: 'Rajasthan',   emoji: '🏰', active: false }
  };

  /* =========================================================
     LISTINGS
     Schema per listing:
     {
       id:          string   unique slug
       rank:        number   position within category (1 = top)
       name:        string   display name
       city:        string   key in CITIES
       category:    string   key in CATEGORIES
       description: string   1–2 sentences about the service
       area:        string   neighbourhood / locality
       address:     string   full address (blank = TBD)
       phone:       string   contact number (blank = TBD)
       website:     string   full URL including https://
       websiteLabel:string   display label for website link
       specialty:   string   short specialty/features summary
       badges:      string[] badge keys: 'emergency','247','premium','at-home',
                             'cage-free','budget','certified','mobile','award',
                             'organic','multi-location'
       breeds:      string[] from BREED_TAGS values ('all','small','large','aggressive','puppy')
     }
     ========================================================= */
  var LISTINGS = [

    /* --------------------------------------------------------
       VETERINARY CLINICS / HOSPITALS — MUMBAI
       -------------------------------------------------------- */
    {
      id: 'blue-7-vets',
      rank: 1,
      name: 'Blue 7 Vets',
      city: 'mumbai',
      category: 'vets',
      description: '24×7 emergency multi-specialty veterinary hospital with state-of-the-art diagnostics, ICU care, and surgical facilities. One of Mumbai\'s most trusted emergency care centres for pets.',
      area: 'Altamount Road (Opp. Antilia)',
      address: 'Altamount Road, Cumballa Hill, Mumbai 400026',
      phone: '',
      website: 'https://blue7vets.com',
      websiteLabel: 'blue7vets.com',
      specialty: 'Emergency & Multi-Specialty',
      badges: ['247', 'emergency'],
      breeds: ['all']
    },
    {
      id: 'dr-nilimas-clinic',
      rank: 2,
      name: "Dr. Nilima's Veterinary Clinic",
      city: 'mumbai',
      category: 'vets',
      description: 'Dr. Nilima Paranjpe brings over 31 years of veterinary experience to this well-established clinic. A trusted name among Mumbai pet owners for decades of compassionate care.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://threebestrated.in',
      websiteLabel: 'threebestrated.in',
      specialty: 'General Practice — 31 Years Experience',
      badges: [],
      breeds: ['all']
    },
    {
      id: 'paw-prints-vet',
      rank: 3,
      name: 'Paw Prints Veterinary Clinic',
      city: 'mumbai',
      category: 'vets',
      description: 'Full-service clinic offering advanced diagnostics including radiology, laboratory testing, cardiology, and orthopaedic surgeries. Comprehensive care under one roof in Goregaon West.',
      area: 'Goregaon West',
      address: 'Goregaon West, Mumbai',
      phone: '',
      website: 'https://threebestrated.in',
      websiteLabel: 'threebestrated.in',
      specialty: 'Radiology, Cardiology, Orthopaedics',
      badges: [],
      breeds: ['all']
    },
    {
      id: 'crown-vet',
      rank: 4,
      name: 'Crown Vet',
      city: 'mumbai',
      category: 'vets',
      description: 'International-standard veterinary facility providing a full spectrum of care from dental treatment to advanced radiology. Known for its high clinical standards and modern equipment.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://travenix.com',
      websiteLabel: 'travenix.com',
      specialty: 'International Standards — Dental & Radiology',
      badges: ['premium'],
      breeds: ['all']
    },
    {
      id: 'acumed-vet',
      rank: 5,
      name: 'AcuMed Veterinary Specialty',
      city: 'mumbai',
      category: 'vets',
      description: 'Specialty veterinary centre in Kandivali East focusing on advanced neurology, ECG, and cardiac care for pets. Ideal for complex cases requiring specialist attention.',
      area: 'Kandivali East',
      address: 'Kandivali East, Mumbai',
      phone: '',
      website: 'https://travenix.com',
      websiteLabel: 'travenix.com',
      specialty: 'Neurology, ECG, Cardiac Care',
      badges: [],
      breeds: ['all']
    },
    {
      id: 'top-dog-pets-clinic',
      rank: 6,
      name: 'Top Dog Pets Clinic',
      city: 'mumbai',
      category: 'vets',
      description: 'Andheri West clinic led by the experienced Dr. M.S. Chousalkar, offering advanced laparoscopic surgeries and comprehensive veterinary services for all breeds.',
      area: 'Andheri West',
      address: 'Andheri West, Mumbai',
      phone: '',
      website: 'https://travenix.com',
      websiteLabel: 'travenix.com',
      specialty: 'Laparoscopic Surgery',
      badges: [],
      breeds: ['all']
    },
    {
      id: 'vetic-pet-clinics',
      rank: 7,
      name: 'Vetic Pet Clinics',
      city: 'mumbai',
      category: 'vets',
      description: 'A growing chain of modern pet clinics across multiple Mumbai locations with in-house labs, surgery suites, pharmacy, and telemedicine support. Consistent, tech-forward care.',
      area: 'Multiple Locations',
      address: 'Multiple Locations, Mumbai',
      phone: '',
      website: 'https://vetic.in',
      websiteLabel: 'vetic.in',
      specialty: 'In-House Labs, Surgery, Multi-Location',
      badges: ['multi-location'],
      breeds: ['all']
    },
    {
      id: 'dr-khushis-pet-clinic',
      rank: 8,
      name: "Dr. Khushi's Pet Clinic",
      city: 'mumbai',
      category: 'vets',
      description: 'A warm, approachable veterinary clinic in Mumbai providing compassionate general practice care for dogs, cats, and small animals. Bookable online via Practo.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://practo.com',
      websiteLabel: 'practo.com',
      specialty: 'General Practice',
      badges: [],
      breeds: ['all']
    },

    /* --------------------------------------------------------
       DOG TRAINERS — MUMBAI
       -------------------------------------------------------- */
    {
      id: 'k9-school',
      rank: 1,
      name: 'K9 School (Adnan Khan)',
      city: 'mumbai',
      category: 'trainers',
      description: "Mumbai's leading professional dog training institution run by Adnan Khan. Structured programs covering obedience, behavior modification, and socialization for all breeds and ages.",
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://k9school.in',
      websiteLabel: 'k9school.in',
      specialty: 'Obedience, Behavior Modification',
      badges: ['certified'],
      breeds: ['all', 'puppy']
    },
    {
      id: 'nilesh-narvekar',
      rank: 2,
      name: 'Nilesh Narvekar',
      city: 'mumbai',
      category: 'trainers',
      description: 'Highly decorated trainer with 21 years of experience and 3000+ dogs trained. Best Handler Award winner. Specializes in obedience, agility, and behavioral training across breeds.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://dogtrainerinmumbai.com',
      websiteLabel: 'dogtrainerinmumbai.com',
      specialty: 'Obedience, Agility, Behaviour',
      badges: ['award', 'certified'],
      breeds: ['all', 'large']
    },
    {
      id: 'action-dogs-services',
      rank: 3,
      name: 'Action Dogs Services (Raghav Shukla)',
      city: 'mumbai',
      category: 'trainers',
      description: '20 years of professional dog training spanning 6 states. INKC & KCI certified trainer specializing in protection, guard dogs, and advanced obedience training.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://actiondogsservices.com',
      websiteLabel: 'actiondogsservices.com',
      specialty: 'Protection, Guard Dogs, Basic/Advanced',
      badges: ['certified'],
      breeds: ['all', 'large', 'aggressive']
    },
    {
      id: 'rohini-fernandes',
      rank: 4,
      name: 'Rohini Fernandes',
      city: 'mumbai',
      category: 'trainers',
      description: "Runs 'Naughty Boys' (aggressive dog specialist program) and Pawfect Classes. Known for her patience and results with reactive, aggressive, and difficult-to-train dogs.",
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://lbb.in',
      websiteLabel: 'lbb.in',
      specialty: 'Aggression, Basic Training',
      badges: [],
      breeds: ['all', 'aggressive']
    },
    {
      id: 'tanya-patel',
      rank: 5,
      name: 'Tanya Patel',
      city: 'mumbai',
      category: 'trainers',
      description: 'Khar-based dog trainer specializing in obedience and aggression management. Uses positive reinforcement techniques to correct behavioral issues efficiently.',
      area: 'Khar, Mumbai',
      address: 'Khar, Mumbai',
      phone: '',
      website: 'https://zeezest.com',
      websiteLabel: 'zeezest.com',
      specialty: 'Obedience, Behavior Modification',
      badges: [],
      breeds: ['all', 'aggressive']
    },
    {
      id: 'saket-gokhale',
      rank: 6,
      name: 'Saket Gokhale',
      city: 'mumbai',
      category: 'trainers',
      description: 'Offers personalized in-home training programs for fearful and aggressive dogs. Expert in building confidence in anxious pets using science-based, force-free methods.',
      area: 'Mumbai (In-Home)',
      address: 'Mumbai (home visits)',
      phone: '',
      website: 'https://zeezest.com',
      websiteLabel: 'zeezest.com',
      specialty: 'In-Home, Fearful & Aggressive Dogs',
      badges: ['at-home'],
      breeds: ['all', 'aggressive']
    },
    {
      id: 'delano-tracy',
      rank: 7,
      name: 'Delano & Tracy',
      city: 'mumbai',
      category: 'trainers',
      description: 'Highly recommended certified behaviorists with deep expertise in behavior modification and aggression rehabilitation. Trusted by dog owners across Mumbai for complex cases.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://dogstrainingindia.com',
      websiteLabel: 'dogstrainingindia.com',
      specialty: 'Behaviour, Aggression',
      badges: ['certified'],
      breeds: ['all', 'aggressive']
    },
    {
      id: 'paw-station',
      rank: 8,
      name: 'Paw Station',
      city: 'mumbai',
      category: 'trainers',
      description: 'Customized training programs for aggression, anxiety, and general obedience. Offers dedicated puppy starter classes as well as adult dog programs for all temperaments.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://starofservice.in',
      websiteLabel: 'starofservice.in',
      specialty: 'Puppy & Adult Classes, Aggression, Anxiety',
      badges: [],
      breeds: ['all', 'aggressive', 'puppy']
    },

    /* --------------------------------------------------------
       PET GROOMERS — MUMBAI
       -------------------------------------------------------- */
    {
      id: 'fur-n-tails',
      rank: 1,
      name: 'Fur N Tails',
      city: 'mumbai',
      category: 'groomers',
      description: 'Professional salon with certified staff delivering hygienic, stress-free full grooming services. Known for careful handling and consistent quality across all coat types and sizes.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://lbb.in',
      websiteLabel: 'lbb.in',
      specialty: 'Full Grooming, Certified Staff',
      badges: ['certified'],
      breeds: ['all']
    },
    {
      id: 'pet-pamper',
      rank: 2,
      name: 'Pet Pamper',
      city: 'mumbai',
      category: 'groomers',
      description: 'Internationally licensed grooming salon using premium imported products. Also offers grooming certification courses for aspiring professional groomers.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://lbb.in',
      websiteLabel: 'lbb.in',
      specialty: 'Grooming + Grooming Courses',
      badges: ['premium', 'certified'],
      breeds: ['all', 'small']
    },
    {
      id: 'pet-grooming-tales',
      rank: 3,
      name: 'Pet Grooming Tales (Yashwini Shetty)',
      city: 'mumbai',
      category: 'groomers',
      description: 'Award-winning internationally licensed groomer specializing in breed-standard show cuts. Yashwini Shetty has trained in grooming competitions and delivers salon-quality results.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://lbb.in',
      websiteLabel: 'lbb.in',
      specialty: 'Show Grooming, Award-Winning',
      badges: ['award', 'certified'],
      breeds: ['all', 'small']
    },
    {
      id: 'doggie-dog-world-groomer',
      rank: 4,
      name: 'Doggie Dog World',
      city: 'mumbai',
      category: 'groomers',
      description: 'Full-service grooming facility with an added swimming pool for hydrotherapy and play. Also offers training and pet communication sessions alongside standard grooming packages.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://lbb.in',
      websiteLabel: 'lbb.in',
      specialty: 'Full Service, Swimming Pool',
      badges: [],
      breeds: ['all', 'large']
    },
    {
      id: 'thepetnest-groomer',
      rank: 5,
      name: 'ThePetNest',
      city: 'mumbai',
      category: 'groomers',
      description: 'Home grooming service where trained, vetted professional groomers come to your doorstep. Covers multiple premium Mumbai neighbourhoods. Stress-free for pets who dislike salons.',
      area: 'Multiple Areas, Mumbai',
      address: 'Multiple Areas, Mumbai',
      phone: '',
      website: 'https://thepetnest.com',
      websiteLabel: 'thepetnest.com',
      specialty: 'At-Home Grooming, Multi-Area',
      badges: ['at-home'],
      breeds: ['all']
    },
    {
      id: 'patmypets',
      rank: 6,
      name: 'Patmypets',
      city: 'mumbai',
      category: 'groomers',
      description: 'Convenient at-home pet grooming service across Mumbai. Easy online booking with experienced groomers coming to your location at your preferred time.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://patmypets.com',
      websiteLabel: 'patmypets.com',
      specialty: 'At-Home Grooming, Online Booking',
      badges: ['at-home'],
      breeds: ['all']
    },
    {
      id: 'oh-my-pet-grooming',
      rank: 7,
      name: 'Oh My Pet Grooming',
      city: 'mumbai',
      category: 'groomers',
      description: 'At-home spa grooming experience with same-day availability in select Mumbai areas. Experienced groomers deliver a full bath-and-groom package in the comfort of your home.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://ohmypetgrooming.in',
      websiteLabel: 'ohmypetgrooming.in',
      specialty: 'At-Home Spa, Same-Day Availability',
      badges: ['at-home', 'premium'],
      breeds: ['all', 'small']
    },
    {
      id: 'flying-fur',
      rank: 8,
      name: 'Flying Fur',
      city: 'mumbai',
      category: 'groomers',
      description: 'Innovative mobile grooming van that parks at your location. Full professional grooming equipment on wheels — ideal for pets who are stressed by travel or salon environments.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://flyingfur.in',
      websiteLabel: 'flyingfur.in',
      specialty: 'Mobile Grooming Van',
      badges: ['mobile', 'at-home'],
      breeds: ['all', 'small']
    },

    /* --------------------------------------------------------
       PET BOARDING / HOSTELS — MUMBAI
       -------------------------------------------------------- */
    {
      id: 'petfelix',
      rank: 1,
      name: 'PetFelix',
      city: 'mumbai',
      category: 'boarding',
      description: 'Premium 6,400 sq ft pet resort with individual 50 sq ft air-conditioned rooms, a 2,000 sq ft play area, and an exceptional 6:1 dog-to-staff ratio. Mumbai\'s most spacious boarding facility.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://petfelix.com',
      websiteLabel: 'petfelix.com',
      specialty: 'AC Rooms, 6:1 Staff Ratio, Play Area',
      badges: ['premium'],
      breeds: ['all', 'large', 'small']
    },
    {
      id: 'pupstop',
      rank: 2,
      name: 'Pupstop',
      city: 'mumbai',
      category: 'boarding',
      description: 'Budget-friendly daycare and overnight boarding service with over 6 years of experience. 24×7 on-site veterinary support ensures your pet is always in safe hands.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://pupstop.in',
      websiteLabel: 'pupstop.in',
      specialty: 'Daycare, Overnight, 24/7 Vet',
      badges: ['budget', '247'],
      breeds: ['all']
    },
    {
      id: 'woof-n-goof',
      rank: 3,
      name: 'Woof N Goof Pet Resort',
      city: 'mumbai',
      category: 'boarding',
      description: 'Full-service pet resort in Thane with a swimming pool, grooming facility, dog training, and birthday party packages. A true resort experience for your fur baby.',
      area: 'Thane',
      address: 'Thane, Mumbai Metropolitan Region',
      phone: '',
      website: 'https://woofngoof.com',
      websiteLabel: 'woofngoof.com',
      specialty: 'Swimming Pool, Grooming, Training, Birthday Parties',
      badges: ['premium'],
      breeds: ['all', 'large']
    },
    {
      id: 'furends-pet-studio',
      rank: 4,
      name: 'Furends Pet Studio',
      city: 'mumbai',
      category: 'boarding',
      description: 'Luxurious boutique boarding studio designed to give your pet a genuine home-away-from-home experience. Premium facilities with personalized attention for each guest.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://furendspetstudio.com',
      websiteLabel: 'furendspetstudio.com',
      specialty: 'Luxurious, Home-Away-from-Home',
      badges: ['premium'],
      breeds: ['all']
    },
    {
      id: 'bonehemian-tails',
      rank: 5,
      name: 'Bonehemian Tails',
      city: 'mumbai',
      category: 'boarding',
      description: 'Cage-free daycare and boarding with a spacious off-leash play area. Perfect for social dogs who thrive in an open, free-roaming environment without the stress of a crate.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://bonehemiantails.com',
      websiteLabel: 'bonehemiantails.com',
      specialty: 'Cage-Free, Off-Leash Play',
      badges: ['cage-free'],
      breeds: ['all']
    },
    {
      id: 'petsitterz',
      rank: 6,
      name: 'Petsitterz (Dr. Neeta Vanjari)',
      city: 'mumbai',
      category: 'boarding',
      description: 'Exclusive one-pet-at-a-time boarding by veterinarian Dr. Neeta Vanjari in Oshiwara. Accepts both dogs and cats. Maximum personal attention guaranteed — truly personalized care.',
      area: 'Oshiwara, Mumbai',
      address: 'Oshiwara, Andheri West, Mumbai',
      phone: '',
      website: 'https://lbb.in',
      websiteLabel: 'lbb.in',
      specialty: 'One Pet at a Time, Vet-Led, Dogs & Cats',
      badges: ['premium'],
      breeds: ['all']
    },
    {
      id: 'doggie-dog-world-boarding',
      rank: 7,
      name: 'Doggie Dog World',
      city: 'mumbai',
      category: 'boarding',
      description: 'Comfortable boarding in Andheri West with individual cubicles and a swimming pool. Also offers daycare and grooming services making it a convenient all-in-one destination.',
      area: 'Andheri West',
      address: 'Andheri West, Mumbai',
      phone: '',
      website: 'https://lbb.in',
      websiteLabel: 'lbb.in',
      specialty: 'Daycare, Cubicles, Swimming Pool',
      badges: [],
      breeds: ['all']
    },
    {
      id: 'pawfect-life',
      rank: 8,
      name: 'Pawfect Life (Niharika)',
      city: 'mumbai',
      category: 'boarding',
      description: "Niharika's cozy, home-like pet boarding in Andheri East. Small, intimate setting ideal for pets who prefer a quiet home environment over large kennel facilities.",
      area: 'Andheri East',
      address: 'Andheri East, Mumbai',
      phone: '',
      website: 'https://lbb.in',
      websiteLabel: 'lbb.in',
      specialty: 'Home-Like Environment, Andheri East',
      badges: [],
      breeds: ['all']
    },
    {
      id: 'thepetnest-boarding',
      rank: 9,
      name: 'ThePetNest',
      city: 'mumbai',
      category: 'boarding',
      description: 'Curated network of vetted home-based pet sitters spread across multiple premium Mumbai localities. Each sitter is background-verified and pet-care trained.',
      area: 'Multiple Areas, Mumbai',
      address: 'Multiple Areas, Mumbai',
      phone: '',
      website: 'https://thepetnest.com',
      websiteLabel: 'thepetnest.com',
      specialty: 'Vetted Sitters, Multiple Premium Locations',
      badges: ['multi-location'],
      breeds: ['all']
    },
    {
      id: 'petbacker',
      rank: 10,
      name: 'PetBacker',
      city: 'mumbai',
      category: 'boarding',
      description: 'Platform aggregating 334+ boarding services across Mumbai with verified reviews and insurance coverage. Browse, compare, and book from a wide variety of boarding options.',
      area: 'Mumbai-Wide',
      address: 'Platform — serving all of Mumbai',
      phone: '',
      website: 'https://petbacker.in',
      websiteLabel: 'petbacker.in',
      specialty: '334+ Services, Reviews & Insurance',
      badges: ['multi-location'],
      breeds: ['all']
    },

    /* --------------------------------------------------------
       PET FOOD STORES / PET SHOPS — MUMBAI
       -------------------------------------------------------- */
    {
      id: 'huft',
      rank: 1,
      name: 'Heads Up For Tails (HUFT)',
      city: 'mumbai',
      category: 'petfood',
      description: "India's most popular premium pet retail chain with 100+ stores nationwide. Stocks a wide range of pet food, accessories, toys, and grooming products. Multiple Mumbai locations.",
      area: 'Multiple Locations',
      address: 'Multiple Locations across Mumbai',
      phone: '',
      website: 'https://headsupfortails.com',
      websiteLabel: 'headsupfortails.com',
      specialty: 'Chain Store — Food, Toys, Accessories, Grooming',
      badges: ['premium', 'multi-location'],
      breeds: ['all']
    },
    {
      id: 'mumbai-pet-shop',
      rank: 2,
      name: 'Mumbai Pet Shop',
      city: 'mumbai',
      category: 'petfood',
      description: 'Affordable one-stop pet shop in Andheri West stocking pet food, accessories, and a wide range of dog and cat items. Popular among local pet owners for competitive pricing.',
      area: 'Andheri West',
      address: 'Andheri West, Mumbai',
      phone: '',
      website: 'https://threebestrated.in',
      websiteLabel: 'threebestrated.in',
      specialty: 'Food, Accessories, Affordable Prices',
      badges: ['budget'],
      breeds: ['all']
    },
    {
      id: 'pets-barn',
      rank: 3,
      name: 'PetsBARN',
      city: 'mumbai',
      category: 'petfood',
      description: 'Lokhandwala\'s go-to store for organic and natural pet food. Stocks quality cat and dog foods, toys, treats, and bedding. Focuses on healthy, chemical-free options.',
      area: 'Lokhandwala',
      address: 'Lokhandwala Complex, Mumbai',
      phone: '',
      website: 'https://threebestrated.in',
      websiteLabel: 'threebestrated.in',
      specialty: 'Organic Food, Toys, Treats, Bedding',
      badges: ['organic'],
      breeds: ['all']
    },
    {
      id: 'oscar-pets-world',
      rank: 4,
      name: "Oscar Pet's World",
      city: 'mumbai',
      category: 'petfood',
      description: 'Government-certified multi-service pet store chain offering puppy sales, food, accessories, boarding, and basic training across multiple locations in Mumbai.',
      area: 'Multiple Locations',
      address: 'Multiple Locations, Mumbai',
      phone: '',
      website: 'https://threebestrated.in',
      websiteLabel: 'threebestrated.in',
      specialty: 'Govt Certified — Puppy Sales, Lodging, Training',
      badges: ['certified', 'multi-location'],
      breeds: ['all', 'puppy']
    },
    {
      id: 'apsans',
      rank: 5,
      name: "Apsan's",
      city: 'mumbai',
      category: 'petfood',
      description: 'Three-gala store known for its comprehensive range including special prescription food, medicine, crates, leashes, and allergy-specific diets. A specialist destination for pet nutrition.',
      area: 'Mumbai',
      address: 'Mumbai (3 locations)',
      phone: '',
      website: 'https://lbb.in',
      websiteLabel: 'lbb.in',
      specialty: 'Allergy-Specific Food, Medicine, Wide Range',
      badges: [],
      breeds: ['all']
    },
    {
      id: 'shake-hands',
      rank: 6,
      name: 'Shake Hands',
      city: 'mumbai',
      category: 'petfood',
      description: 'Tardeo-based specialty store stocking health supplements, treats for dogs and cats, and vet-recommended foods. A trusted source for nutritional and therapeutic pet products.',
      area: 'Tardeo',
      address: 'Tardeo, Mumbai',
      phone: '',
      website: 'https://shakehands.co.in',
      websiteLabel: 'shakehands.co.in',
      specialty: 'Health Supplements, Vet Foods, Specialty Nutrition',
      badges: [],
      breeds: ['all']
    },
    {
      id: 'ohh-my-dog-cafe-pefe',
      rank: 7,
      name: 'Ohh My Dog + Cafe PeFe',
      city: 'mumbai',
      category: 'petfood',
      description: 'Unique hybrid concept: a fully stocked pet accessories and gear shop combined with a pet-friendly café. Shop for your dog, then enjoy a coffee together — truly pet inclusive.',
      area: 'Mumbai',
      address: 'Mumbai',
      phone: '',
      website: 'https://lbb.in',
      websiteLabel: 'lbb.in',
      specialty: 'Pet Shop + Pet-Friendly Cafe',
      badges: ['premium'],
      breeds: ['all']
    },
    {
      id: 'pet-food-court',
      rank: 8,
      name: 'Pet Food Court',
      city: 'mumbai',
      category: 'petfood',
      description: 'Comprehensive pet food store in Andheri East with a wide selection of dry and wet food for cats and dogs, along with fish food and bird seed for exotic pet owners.',
      area: 'Andheri East',
      address: 'Andheri East, Mumbai',
      phone: '',
      website: 'https://travenix.com',
      websiteLabel: 'travenix.com',
      specialty: 'Dry & Wet Food, Treats, Fish, Bird Supplies',
      badges: [],
      breeds: ['all']
    },
    {
      id: 'paws-n-furs',
      rank: 9,
      name: "Paws 'n' Furs",
      city: 'mumbai',
      category: 'petfood',
      description: 'Bandra institution with over 20 years of serving Mumbai\'s pet community. Stocks nutritious food, grooming products, accessories, and everything else your pet needs.',
      area: 'Bandra',
      address: 'Bandra, Mumbai',
      phone: '',
      website: 'https://knocksense.com',
      websiteLabel: 'knocksense.com',
      specialty: '20+ Years, Food, Grooming Products',
      badges: [],
      breeds: ['all']
    },
    {
      id: 'posh-pets',
      rank: 10,
      name: 'Posh Pets',
      city: 'mumbai',
      category: 'petfood',
      description: 'Curated boutique pet shop in Bandra West specializing in rare indie brands, gluten-free food options, and premium grooming services. Perfect for discerning pet parents.',
      area: 'Bandra West',
      address: 'Bandra West, Mumbai',
      phone: '',
      website: 'https://knocksense.com',
      websiteLabel: 'knocksense.com',
      specialty: 'Indie Brands, Gluten-Free, Grooming',
      badges: ['premium'],
      breeds: ['all', 'small']
    }

  ]; // end LISTINGS

  /* =========================================================
     BADGE METADATA
     Maps badge keys to display labels and CSS class suffixes
     ========================================================= */
  var BADGES = {
    '247':            { label: '24/7',           cls: 'badge-247' },
    'emergency':      { label: 'Emergency',      cls: 'badge-emergency' },
    'premium':        { label: 'Premium',        cls: 'badge-premium' },
    'at-home':        { label: 'At-Home',        cls: 'badge-at-home' },
    'cage-free':      { label: 'Cage-Free',      cls: 'badge-cage-free' },
    'budget':         { label: 'Budget',         cls: 'badge-budget' },
    'certified':      { label: 'Certified',      cls: 'badge-certified' },
    'mobile':         { label: 'Mobile',         cls: 'badge-mobile' },
    'award':          { label: 'Award-Winning',  cls: 'badge-award' },
    'organic':        { label: 'Organic',        cls: 'badge-organic' },
    'multi-location': { label: 'Multi-Location', cls: 'badge-multi-location' }
  };

  /* =========================================================
     PUBLIC API
     ========================================================= */
  return {
    CATEGORIES: CATEGORIES,
    BREED_TAGS:  BREED_TAGS,
    CITIES:      CITIES,
    LISTINGS:    LISTINGS,
    BADGES:      BADGES
  };

})();
