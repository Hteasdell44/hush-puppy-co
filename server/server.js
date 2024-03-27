const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth.js');
const stripe = require('stripe')('sk_test_51NEaXoLPaVHcGI2ULpBGbLY4RrTt54VQ4g0brtF78HWeh42S0lIdK3JJskWt6WknBvnplk6xecEl3IfNYuoQ0Kif004c209S9X');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const Cart = require('./models/Cart.js');
const multer = require('multer');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Define multer storage
const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Function to recursively traverse the dataset directory and extract dog breeds
function extractDogBreeds(datasetPath) {
  const breeds = [];
  const contents = fs.readdirSync(datasetPath);
  contents.forEach(item => {
    if (item !== '.DS_Store') { // Skip .DS_Store files
      const itemPath = path.join(datasetPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        const breed = item.split('-')[1].replace(/_/g, ' '); // Format breed name
        const formattedBreed = breed.replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
        breeds.push(formattedBreed);
      }
    }
  });
  return breeds;
}


// Specify the path to the dataset directory
const datasetPath = path.join(__dirname, '../breed-dataset', 'images', 'Images');

// Extract the list of dog breeds from the dataset
const dogBreeds = extractDogBreeds(datasetPath);

// Print the list of dog breeds
console.log('List of Dog Breeds:');
for (i = 0; i < dogBreeds.length; i++) {
  console.log(dogBreeds[i]);
}

// Function to format breed names
function formatBreedName(breedName) {
    // Remove underscores and capitalize first letter of each word
    return breedName.replace(/\b\w/g, c => c.toUpperCase());
}

// Function to provide additional information based on the predicted breed
function provideDecisionSupport(breed) {
  // Define recommendations for each breed
  const recommendations = {
    'Chihuahua': {
        description: 'Chihuahuas are small and energetic dogs that require regular exercise and mental stimulation. They can be prone to dental issues, so regular dental care is important.',
        product: 'The Peaceful Playtime Mat',
        price: 17.99
    },
    'Japanese Spaniel': {
        description: 'Japanese Spaniels, also known as Chin, are affectionate and gentle dogs that make great companions. They enjoy being around people and thrive on attention and affection.',
        product: 'Calm Treats',
        price: 14.99
    },
    'Maltese Dog': {
        description: 'Maltese Dogs are known for their elegant appearance and gentle demeanor. They require regular grooming to maintain their long, silky coats.',
        product: 'The Hush Puppy',
        price: 27.99
    },
    'Pekinese': {
        description: 'Pekingese are independent and confident dogs with a regal appearance. They can be stubborn at times, so consistent training is important. Regular grooming is also necessary to keep their coat in good condition.',
        product: 'Cozy Bed',
        price: 47.99
    },
    'Shih': {
        description: 'Shih Tzus are friendly and outgoing dogs that enjoy spending time with their families. They have a long, flowing coat that requires regular grooming. They can be prone to certain health issues, so regular veterinary check-ups are important.',
        product: 'Puppy Gate',
        price: 99.99
    },
    'Blenheim Spaniel': {
        description: 'Blenheim Cavaliers are affectionate and gentle dogs that make great family pets. They enjoy spending time with their owners and are good with children. Regular exercise and mental stimulation are important to keep them happy and healthy.',
        product: 'The Peaceful Playtime Mat',
        price: 17.99
    },
    'Papillon': {
        description: 'Papillons are small but energetic dogs that love to play and explore. They are intelligent and trainable, making them suitable for various activities such as obedience and agility. Regular grooming is necessary to maintain their long, flowing coats.',
        product: 'Calm Treats',
        price: 14.99
    },
    'Toy Terrier': {
        description: 'Toy Terriers, also known as Manchester Terriers, are energetic and intelligent dogs that excel in various canine sports and activities. They require regular exercise and mental stimulation to prevent boredom and destructive behavior.',
        product: 'The Hush Puppy',
        price: 27.99
    },
    'Rhodesian Ridgeback': {
        description: 'Rhodesian Ridgebacks are strong and athletic dogs known for their distinctive "ridge" along their back. They are loyal and protective, making them excellent guard dogs. Regular exercise and training are important to keep them mentally and physically stimulated.',
        product: 'Cozy Bed',
        price: 47.99
    },
    'Afghan Hound': {
        description: 'Afghan Hounds are elegant and graceful dogs with a distinctive long, flowing coat. They are independent and aloof, but also affectionate with their families. Regular exercise and mental stimulation are important to prevent boredom.',
        product: 'Puppy Gate',
        price: 99.99
    },
    'Basset': {
        description: 'Basset Hounds are known for their long ears, droopy eyes, and short legs. They are friendly and laid-back dogs that get along well with children and other pets. They require regular exercise to prevent obesity and joint issues.',
        product: 'The Peaceful Playtime Mat',
        price: 17.99
    },
    'Beagle': {
        description: 'Beagles are friendly and curious dogs with a keen sense of smell. They are social animals that enjoy being around people and other dogs. Regular exercise and mental stimulation are important to prevent boredom and destructive behavior.',
        product: 'Calm Treats',
        price: 14.99
    },
    'Bloodhound': {
        description: 'Bloodhounds are large and powerful dogs known for their incredible sense of smell. They are gentle and affectionate with their families, but also independent and stubborn. They require consistent training and regular exercise.',
        product: 'The Hush Puppy',
        price: 27.99
    },
    'Bluetick': {
        description: 'Bluetick Coonhounds are energetic and outgoing dogs bred for hunting. They have a strong prey drive and require plenty of exercise and mental stimulation. They are loyal and affectionate with their families.',
        product: 'Cozy Bed',
        price: 47.99
    },
    'Black': {
        description: 'Black and Tan Coonhounds are versatile hunting dogs known for their tracking abilities. They are loyal and intelligent dogs that require regular exercise and mental stimulation. They are also social animals that enjoy being around people and other dogs.',
        product: 'Puppy Gate',
        price: 99.99
    },
    'Walker Hound': {
        description: 'Walker Coonhounds are energetic and hardworking dogs bred for hunting. They have a strong prey drive and require plenty of exercise and mental stimulation. They are friendly and outgoing dogs that get along well with children and other pets.',
        product: 'The Peaceful Playtime Mat',
        price: 17.99
    },
    'English Foxhound': {
        description: 'English Foxhounds are athletic and energetic dogs bred for hunting. They have a strong prey drive and require plenty of exercise and mental stimulation. They are social animals that enjoy being around people and other dogs.',
        product: 'Calm Treats',
        price: 14.99
    },
    'Redbone': {
        description: 'Redbone Coonhounds are versatile hunting dogs known for their endurance and speed. They are loyal and affectionate with their families, but also independent and stubborn. They require regular exercise and mental stimulation to stay happy and healthy.',
        product: 'The Hush Puppy',
        price: 27.99
    },
    'Borzoi': {
        description: 'Borzois, also known as Russian Wolfhounds, are elegant and graceful dogs with a long, silky coat. They are independent and aloof, but also loyal and affectionate with their families. Regular exercise and mental stimulation are important to prevent boredom.',
        product: 'Cozy Bed',
        price: 47.99
    },
    'Irish Wolfhound': {
        description: 'Irish Wolfhounds are one of the tallest dog breeds known for their size and strength. They are gentle giants that are loyal and affectionate with their families. Despite their large size, they are relatively low-energy dogs that require moderate exercise.',
        product: 'Puppy Gate',
        price: 99.99
    },
    'Italian Greyhound': {
        description: 'Italian Greyhounds are small and elegant dogs known for their sleek appearance and gentle demeanor. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
        product: 'The Peaceful Playtime Mat',
        price: 17.99
        },
        'Whippet': {
        description: 'Whippets are sleek and athletic dogs known for their speed and agility. They are affectionate and playful companions that enjoy spending time with their families. Regular exercise is important to keep them physically fit and mentally stimulated.',
        product: 'Calm Treats',
        price: 14.99
        },
        'Ibizan Hound': {
        description: 'Ibizan Hounds are sleek and athletic dogs known for their hunting abilities. They are independent and intelligent, but also affectionate with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
        product: 'The Hush Puppy',
        price: 27.99
        },
        'Norwegian Elkhound': {
        description: 'Norwegian Elkhounds are strong and energetic dogs known for their hunting abilities. They are loyal and protective, making them excellent guard dogs. They require regular exercise and mental stimulation to prevent boredom.',
        product: 'Cozy Bed',
        price: 47.99
        },
        'Otterhound': {
        description: 'Otterhounds are large and playful dogs with a distinctive shaggy coat. They are friendly and outgoing dogs that get along well with children and other pets. They require regular exercise and mental stimulation to prevent boredom.',
        product: 'Puppy Gate',
        price: 99.99
        },
        'Saluki': {
        description: 'Salukis are elegant and graceful dogs known for their hunting abilities. They are independent and aloof, but also loyal and affectionate with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
        product: 'The Peaceful Playtime Mat',
        price: 17.99
        },
        'Scottish Deerhound': {
        description: 'Scottish Deerhounds are large and gentle dogs known for their hunting abilities. They are loyal and affectionate with their families, but also independent and stubborn. They require regular exercise and mental stimulation to stay happy and healthy.',
        product: 'Calm Treats',
        price: 14.99
        },
        'Weimaraner': {
        description: 'Weimaraners are sleek and athletic dogs known for their hunting abilities. They are intelligent and energetic, making them suitable for various canine sports and activities. They require regular exercise and mental stimulation to prevent boredom.',
        product: 'The Hush Puppy',
        price: 27.99
        },
        'Staffordshire Bullterrier': {
        description: 'Staffordshire Bull Terriers are strong and muscular dogs known for their loyalty and courage. They are affectionate and playful companions that enjoy spending time with their families. Early socialization and training are important for this breed.',
        product: 'Cozy Bed',
        price: 47.99
        },
        'American Staffordshire Terrier': {
        description: 'American Staffordshire Terriers, often referred to as AmStaffs, are strong and muscular dogs with a confident and courageous temperament. They are loyal and affectionate with their families but can be protective of their territory. Early socialization and training are essential for this breed.',
        product: 'Puppy Gate',
        price: 99.99
        },
        'Bedlington Terrier': {
        description: 'Bedlington Terriers are elegant and gentle dogs with a distinctive lamb-like appearance. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
        product: 'The Peaceful Playtime Mat',
        price: 17.99
        },
        'Border Terrier': {
        description: 'Border Terriers are small but sturdy dogs known for their affectionate and friendly nature. They are intelligent and trainable, making them suitable for various activities such as obedience and agility. They require regular exercise and mental stimulation to stay happy and healthy.',
        product: 'Calm Treats',
        price: 14.99
        },
        'Kerry Blue Terrier': {
        description: 'Kerry Blue Terriers are spirited and energetic dogs known for their playful and mischievous nature. They are intelligent and independent, but also affectionate with their families. Regular grooming is necessary to maintain their unique coat.',
        product: 'The Hush Puppy',
        price: 27.99
        },
        'Irish Terrier': {
        description: 'Irish Terriers are spirited and intelligent dogs known for their loyalty and courage. They are affectionate and playful companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
        product: 'Cozy Bed',
        price: 47.99
        },
        'Norfolk Terrier': {
        description: 'Norfolk Terriers are small but sturdy dogs known for their lively and outgoing personality. They are intelligent and independent, but also affectionate with their families. Regular exercise and mental stimulation are important to prevent boredom.',
        product: 'Puppy Gate',
        price: 99.99
        },
        'Norwich Terrier': {
        description: 'Norwich Terriers are small and spirited dogs known for their bold and confident nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
        product: 'The Peaceful Playtime Mat',
        price: 17.99
        },
        'Yorkshire Terrier': {
        description: 'Yorkshire Terriers, also known as Yorkies, are small and energetic dogs known for their long, silky coat. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their coat.',
        product: 'Calm Treats',
        price: 14.99
        },
        'Wire': {
        description: 'Wire Fox Terriers are energetic and intelligent dogs known for their playful and mischievous nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
        product: 'The Hush Puppy',
        price: 27.99
        },    'Lakeland Terrier': {
          description: 'Lakeland Terriers are small but sturdy dogs known for their confidence and determination. They are intelligent and independent, but also affectionate with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Sealyham Terrier': {
          description: 'Sealyham Terriers are sturdy and spirited dogs known for their charming personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Airedale': {
          description: 'Airedale Terriers are confident and outgoing dogs known for their intelligence and versatility. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Cairn': {
          description: 'Cairn Terriers are small but sturdy dogs known for their courage and tenacity. They are intelligent and independent, but also affectionate with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Australian Terrier': {
          description: 'Australian Terriers are small and spirited dogs known for their loyalty and intelligence. They are affectionate and playful companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Dandie Dinmont': {
          description: 'Dandie Dinmont Terriers are small but sturdy dogs known for their distinctive appearance and cheerful personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Boston Bull': {
          description: 'Boston Terriers, often referred to as Boston Bulls, are small and friendly dogs known for their tuxedo-like coat and gentle demeanor. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Miniature Schnauzer': {
          description: 'Miniature Schnauzers are small but sturdy dogs known for their distinctive beard and eyebrows. They are intelligent and energetic, making them suitable for various canine sports and activities. Regular grooming is necessary to maintain their unique coat.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Giant Schnauzer': {
          description: 'Giant Schnauzers are strong and powerful dogs known for their imposing presence and protective nature. They are loyal and affectionate companions that are devoted to their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Standard Schnauzer': {
          description: 'Standard Schnauzers are medium-sized dogs known for their distinctive beard and eyebrows. They are intelligent and energetic, making them suitable for various canine sports and activities. Regular grooming is necessary to maintain their unique coat.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Scotch Terrier': {
          description: 'Scottish Terriers, often referred to as Scotch Terriers, are small but sturdy dogs known for their distinctive beard and dignified appearance. They are independent and confident, but also affectionate with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Tibetan Terrier': {
          description: 'Tibetan Terriers are medium-sized dogs known for their long, flowing coat and friendly demeanor. They are affectionate and playful companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Silky Terrier': {
          description: 'Silky Terriers are small and elegant dogs known for their long, silky coat and confident personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Soft': {
          description: 'Soft Coated Wheaten Terriers, often referred to as Wheaten Terriers, are medium-sized dogs known for their soft, silky coat and friendly personality. They are affectionate and playful companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Calm Treats',
          price: 14.99
      },
      'West Highland White Terrier': {
          description: 'West Highland White Terriers, often referred to as Westies, are small and sturdy dogs known for their distinctive white coat and friendly demeanor. They are affectionate and playful companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Lhasa': {
          description: 'Lhasa Apsos are small and confident dogs known for their long, flowing coat and dignified appearance. They are independent and intelligent, but also affectionate with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Flat': {
          description: 'Flat-Coated Retrievers are friendly and outgoing dogs known for their glossy black coat and playful personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Curly': {
          description: 'Curly-Coated Retrievers are confident and independent dogs known for their distinctive curly coat and outgoing personality. They are intelligent and energetic, making them suitable for various canine sports and activities. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Golden Retriever': {
          description: 'Golden Retrievers are friendly and outgoing dogs known for their gentle temperament and intelligence. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Labrador Retriever': {
          description: 'Labrador Retrievers, often referred to as Labs, are friendly and outgoing dogs known for their intelligence and loyalty. They are affectionate and playful companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy  and healthy.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Chesapeake Bay Retriever': {
          description: 'Chesapeake Bay Retrievers are strong and athletic dogs known for their love of water and retrieving abilities. They are loyal and affectionate companions that are devoted to their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'German Short': {
          description: 'German Shorthaired Pointers are versatile hunting dogs known for their intelligence and athleticism. They are loyal and affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Vizsla': {
          description: 'Vizslas are energetic and affectionate dogs known for their distinctive rust-colored coat and friendly demeanor. They are loyal companions that thrive on human companionship. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'English Setter': {
          description: 'English Setters are elegant and athletic dogs known for their distinctive feathered coat and friendly personality. They are affectionate and playful companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Irish Setter': {
          description: 'Irish Setters are lively and outgoing dogs known for their beautiful mahogany coat and friendly temperament. They are affectionate and playful companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Gordon Setter': {
          description: 'Gordon Setters are loyal and intelligent dogs known for their distinctive black and tan coat and dignified appearance. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Brittany Spaniel': {
          description: 'Brittany Spaniels are energetic and affectionate dogs known for their beautiful coat and friendly demeanor. They are loyal companions that thrive on human companionship. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Clumber': {
          description: 'Clumber Spaniels are calm and gentle dogs known for their large, heavyset build and sweet temperament. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'English Springer': {
          description: 'English Springer Spaniels are energetic and friendly dogs known for their distinctive coat and playful personality. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Welsh Springer Spaniel': {
          description: 'Welsh Springer Spaniels are friendly and outgoing dogs known for their beautiful red and white coat and playful personality. They are affectionate companions that thrive on human companionship. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Cocker Spaniel': {
          description: 'Cocker Spaniels are cheerful and affectionate dogs known for their beautiful coat and gentle temperament. They are loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Sussex Spaniel': {
          description: 'Sussex Spaniels are friendly and affectionate dogs known for their long, low-set build and sweet temperament. They are loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Irish Water Spaniel': {
          description: 'Irish Water Spaniels are energetic and intelligent dogs known for their distinctive curly coat and playful personality. They are affectionate companions that thrive on human companionship. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Kuvasz': {
          description: 'Kuvaszok are large and protective dogs known for their loyalty and courage. They are affectionate companions that are devoted to their families. Early socialization and training are important for this breed.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Schipperke': {
          description: 'Schipperkes are small but sturdy dogs known for their distinctive black coat and mischievous personality. They are intelligent and energetic companions that thrive on human companionship. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Groenendael': {
          description: 'Belgian Groenendaels are elegant and intelligent dogs known for their loyalty and versatility. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Malinois': {
          description: 'Belgian Malinois are strong and agile dogs known for their intelligence and work ethic. They are loyal companions that thrive on human companionship. Early socialization and training are important for this breed.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Briard': {
          description: 'Briards are loyal and protective dogs known for their distinctive long coat and dignified appearance. They are affectionate companions that are devoted to their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Kelpie': {
          description: 'Australian Kelpies are energetic and intelligent dogs known for their herding abilities. They are loyal companions that thrive on human companionship. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Komondor': {
          description: 'Komondors are large and powerful dogs known for their distinctive corded coat and protective nature. They are loyal companions that are devoted to their families. Early socialization and training are important for this breed.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Old English Sheepdog': {
          description: 'Old English Sheepdogs are large and gentle dogs known for their shaggy coat and playful personality. They are affectionate companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Shetland Sheepdog': {
          description: 'Shetland Sheepdogs, also known as Shelties, are intelligent and affectionate dogs known for their long, flowing coat and friendly demeanor. They are loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Collie': {
          description: 'Collies are intelligent and loyal dogs known for their beautiful coat and gentle temperament. They are affectionate companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Border Collie': {
          description: 'Border Collies are highly intelligent and energetic dogs known for their herding abilities. They are loyal companions that thrive on mental and physical stimulation. Regular exercise and training are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Bouvier Des Flandres': {
          description: 'Bouvier des Flandres are sturdy and versatile dogs known for their loyalty and protective nature. They are affectionate companions that are devoted to their families. Early socialization and training are important for this breed.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Rottweiler': {
          description: 'Rottweilers are strong and confident dogs known for their protective instincts and loyalty to their families. They are affectionate companions that require early socialization and training. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'German Shepherd': {
          description: 'German Shepherds are intelligent and versatile dogs known for their loyalty and courage. They are affectionate companions that excel in various roles, including as family pets, working dogs, and service animals. Early socialization and training are important for this breed.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Doberman': {
          description: 'Doberman Pinschers are powerful and fearless dogs known for their loyalty and protective nature. They are affectionate companions that require early socialization and training. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Miniature Pinscher': {
          description: 'Miniature Pinschers are small but spirited dogs known for their bold and lively personality. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Greater Swiss Mountain Dog': {
          description: 'Greater Swiss Mountain Dogs are large and gentle dogs known for their strength and affectionate nature. They are loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Bernese Mountain Dog': {
          description: 'Bernese Mountain Dogs are large and gentle dogs known for their calm and affectionate nature. They are loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Appenzeller': {
          description: 'Appenzeller Sennenhunds are energetic and intelligent dogs known for their loyalty and versatility. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'EntleBucher': {
          description: 'Entlebucher Mountain Dogs are sturdy and energetic dogs known for their loyalty and protective nature. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Boxer': {
          description: 'Boxers are energetic and playful dogs known for their loyalty and affectionate nature. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Bull Mastiff': {
          description: 'Bullmastiffs are large and powerful dogs known for their loyalty and protective nature. They are affectionate companions that require early socialization and training. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Tibetan Mastiff': {
          description: 'Tibetan Mastiffs are large and powerful dogs known for their strength and protective instincts. They are loyal companions that require early socialization and training. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'French Bulldog': {
          description: 'French Bulldogs are small but sturdy dogs known for their affectionate and playful nature. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Great Dane': {
          description: 'Great Danes  are giant and gentle dogs known for their imposing size and friendly demeanor. They are affectionate companions that enjoy spending time with their families. Regular exercise and proper training are important to keep them happy and healthy.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Saint Bernard': {
          description: 'Saint Bernards are large and gentle dogs known for their calm and affectionate nature. They are loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Eskimo Dog': {
          description: 'Eskimo Dogs, also known as American Eskimo Dogs, are playful and intelligent dogs known for their beautiful white coat and friendly personality. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Malamute': {
          description: 'Alaskan Malamutes are strong and independent dogs known for their endurance and loyalty. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Siberian Husky': {
          description: 'Siberian Huskies are energetic and intelligent dogs known for their striking appearance and friendly demeanor. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Affenpinscher': {
          description: 'Affenpinschers are small but sturdy dogs known for their terrier-like personality and amusing antics. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Basenji': {
          description: 'Basenjis are small and athletic dogs known for their unique bark and independent nature. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Pug': {
          description: 'Pugs are charming and affectionate dogs known for their wrinkled face and playful personality. They are loving companions that enjoy spending time with their families. Regular exercise and proper diet are important to keep them happy and healthy.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Leonberg': {
          description: 'Leonbergers are large and gentle dogs known for their majestic appearance and sweet temperament. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Newfoundland': {
          description: 'Newfoundlands are giant and gentle dogs known for their calm and patient nature. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Great Pyrenees': {
          description: 'Great Pyrenees are large and noble dogs known for their protective instincts and gentle demeanor. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Samoyed': {
          description: 'Samoyeds are friendly and gentle dogs known for their fluffy white coat and cheerful personality. They are affectionate companions that enjoy spending time with their families. Regular exercise and grooming are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Pomeranian': {
          description: 'Pomeranians are small and lively dogs known for their fluffy coat and outgoing personality. They are affectionate companions that enjoy spending time with their families. Regular exercise and grooming are important to keep them happy and healthy.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Chow': {
          description: 'Chow Chows are sturdy and aloof dogs known for their lion-like mane and independent nature. They are loyal companions that require early socialization and training. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Keeshond': {
          description: 'Keeshonds are friendly and affectionate dogs known for their distinctive "spectacles" and outgoing personality. They are loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Brabancon Griffon': {
          description: 'Brussels Griffons, also known as Griffons Bruxellois, are small but sturdy dogs known for their distinctive face and charming personality. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Pembroke': {
          description: 'Pembroke Welsh Corgis are intelligent and outgoing dogs known for their distinctive appearance and friendly demeanor. They are affectionate companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Cardigan': {
          description: 'Cardigan Welsh Corgis are intelligent and affectionate dogs known for their long body and friendly personality. They are loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
          product: 'The Hush Puppy',
          price: 27.99
      },
      'Toy Poodle': {
          description: 'Toy Poodles are intelligent and affectionate dogs known for their elegant appearance and playful personality. They are loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Cozy Bed',
          price: 47.99
      },
      'Miniature Poodle': {
          description: 'Miniature Poodles are intelligent and versatile dogs known for their elegant appearance and friendly demeanor. They are affectionate companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'Puppy Gate',
          price: 99.99
      },
      'Standard Poodle': {
          description: 'Standard Poodles are intelligent and graceful dogs  known for their elegant appearance and friendly demeanor. They are affectionate companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
          product: 'The Peaceful Playtime Mat',
          price: 17.99
      },
      'Mexican Hairless': {
          description: 'Mexican Hairless Dogs, also known as Xoloitzcuintli or simply Xolos, are ancient and rare dogs known for their unique appearance and calm disposition. They are affectionate companions that enjoy spending time with their families. Regular exercise and proper skincare are important to keep them happy and healthy.',
          product: 'Calm Treats',
          price: 14.99
      },
      'Dingo': {
          description: 'Dingoes are wild canines native to Australia, known for their intelligence and adaptability. They are independent animals that require vast amounts of space to roam and thrive. Dingoes are not typically kept as pets due to their wild nature.',
          product: 'Wilderness Adventure Kit',
          price: 149.99
      },
      'Dhole': {
          description: 'Dholes, also known as Asian wild dogs, are highly social animals native to Asia. They live and hunt cooperatively in packs and are known for their agility and endurance. Dholes are not typically kept as pets and require specialized care due to their wild nature.',
          product: 'Wilderness Adventure Kit',
          price: 149.99
      },
      'African Hunting Dog': {
          description: 'African Hunting Dogs, also known as African wild dogs or painted wolves, are highly social and efficient hunters native to sub-Saharan Africa. They live and hunt cooperatively in packs and are known for their stamina and teamwork. African Hunting Dogs are not typically kept as pets and require specialized care due to their wild nature.',
          product: 'Wilderness Adventure Kit',
          price: 149.99
      }
  };
  
    // Remove underscores and convert to title case
    const formattedBreed = breed.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Retrieve recommendation for the breed
    const recommendation = recommendations[formattedBreed].description;
    const productRecommendation = recommendations[formattedBreed].product;
    const productRecommendationPrice = recommendations[formattedBreed].price;
    
    // Return recommendation or default message if breed not found
    return {recommendation, productRecommendation, productRecommendationPrice};
    }


async function predictBreed(imageData) {
  // Load the MobileNet model
  const model = await mobilenet.load();

  // Convert the image data to a TensorFlow tensor
  const imageTensor = tf.node.decodeImage(imageData);

  // Perform prediction
  const predictions = await model.classify(imageTensor);

  // Get the top prediction
  const topPrediction = predictions[0];
  const breed = formatBreedName(topPrediction.className);
  const confidence = topPrediction.probability;

  return { breed, confidence };
  
}

// Route handler
app.post('/api/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded image file
    const imageData = fs.readFileSync(req.file.path);

    // Make prediction
    const { breed, confidence } = await predictBreed(imageData);

    // Provide decision support based on the predicted breed
    const recommendations = provideDecisionSupport(breed);
    const recommendation = recommendations.recommendation;
    const recommendedProduct = recommendations.productRecommendation;
    const recommendedProductPrice = recommendations.productRecommendationPrice;

    // Send the prediction back to the client
    res.json({ breed, confidence, recommendation, dogBreeds, recommendedProduct, recommendedProductPrice });
  } catch (error) {
    console.error('Error predicting:', error);
    res.status(500).json({ error: 'An error occurred while predicting' });
  } finally {
    // Delete the uploaded image file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

app.post('/api/correct-breed', async (req, res) => {
  try {
    const correctedBreed = req.body.breed;
    const correctedRecommendation = provideDecisionSupport(req.body.breed);
    res.json({ correctedBreed, correctedRecommendation, dogBreeds });
  } catch (error) {
    console.error('Error Correcting:', error);
    res.status(500).json({ error: 'An error occurred while correcting' });
  }
});

// Apollo Server setup
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Stripe checkout session creation route
app.post('/create-checkout-session', async (req, res) => {
  let lineItemArr = [];

  const cart = await Cart.find().sort({ _id: -1 }).populate('productIds');
  const products = cart[0].productIds;

  products.forEach((item, i) => {
    lineItemArr.push({ price: item.stripeId, quantity: item.amountInCart });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItemArr,
    mode: 'payment',
    success_url: `https://the-hush-puppy-co.herokuapp.com/`,
    cancel_url: `https://the-hush-puppy-co.herokuapp.com/cart`,
    automatic_tax: { enabled: true },
  });

  res.redirect(303, session.url);
});

startApolloServer();
