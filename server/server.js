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
    'Chihuahua': 'Chihuahuas are small and energetic dogs that require regular exercise and mental stimulation. They can be prone to dental issues, so regular dental care is important.',
    'Japanese Spaniel': 'Japanese Spaniels, also known as Chin, are affectionate and gentle dogs that make great companions. They enjoy being around people and thrive on attention and affection.',
    'Maltese Dog': 'Maltese Dogs are known for their elegant appearance and gentle demeanor. They require regular grooming to maintain their long, silky coats.',
    'Pekinese': 'Pekingese are independent and confident dogs with a regal appearance. They can be stubborn at times, so consistent training is important. Regular grooming is also necessary to keep their coat in good condition.',
    'Shih': 'Shih Tzus are friendly and outgoing dogs that enjoy spending time with their families. They have a long, flowing coat that requires regular grooming. They can be prone to certain health issues, so regular veterinary check-ups are important.',
    'Blenheim Spaniel': 'Blenheim Cavaliers are affectionate and gentle dogs that make great family pets. They enjoy spending time with their owners and are good with children. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Papillon': 'Papillons are small but energetic dogs that love to play and explore. They are intelligent and trainable, making them suitable for various activities such as obedience and agility. Regular grooming is necessary to maintain their long, flowing coats.',
    'Toy Terrier': 'Toy Terriers, also known as Manchester Terriers, are energetic and intelligent dogs that excel in various canine sports and activities. They require regular exercise and mental stimulation to prevent boredom and destructive behavior.',
    'Rhodesian Ridgeback': 'Rhodesian Ridgebacks are strong and athletic dogs known for their distinctive "ridge" along their back. They are loyal and protective, making them excellent guard dogs. Regular exercise and training are important to keep them mentally and physically stimulated.',
    'Afghan Hound': 'Afghan Hounds are elegant and graceful dogs with a distinctive long, flowing coat. They are independent and aloof, but also affectionate with their families. Regular grooming is essential to maintain their coat in good condition.',
    'Basset': 'Basset Hounds are known for their long ears, droopy eyes, and short legs. They are friendly and laid-back dogs that get along well with children and other pets. They require regular exercise to prevent obesity and joint issues.',
    'Beagle': 'Beagles are friendly and curious dogs with a keen sense of smell. They are social animals that enjoy being around people and other dogs. Regular exercise and mental stimulation are important to prevent boredom and destructive behavior.',
    'Bloodhound': 'Bloodhounds are large and powerful dogs known for their incredible sense of smell. They are gentle and affectionate with their families, but also independent and stubborn. They require consistent training and regular exercise.',
    'Bluetick': 'Bluetick Coonhounds are energetic and outgoing dogs bred for hunting. They have a strong prey drive and require plenty of exercise and mental stimulation. They are loyal and affectionate with their families.',
    'Black': 'Black and Tan Coonhounds are versatile hunting dogs known for their tracking abilities. They are loyal and intelligent dogs that require regular exercise and mental stimulation. They are also social animals that enjoy being around people and other dogs.',
    'Walker Hound': 'Walker Coonhounds are energetic and hardworking dogs bred for hunting. They have a strong prey drive and require plenty of exercise and mental stimulation. They are friendly and outgoing dogs that get along well with children and other pets.',
    'English Foxhound': 'English Foxhounds are athletic and energetic dogs bred for hunting. They have a strong prey drive and require plenty of exercise and mental stimulation. They are social animals that enjoy being around people and other dogs.',
    'Redbone': 'Redbone Coonhounds are versatile hunting dogs known for their endurance and speed. They are loyal and affectionate with their families, but also independent and stubborn. They require regular exercise and mental stimulation to stay happy and healthy.',
    'Borzoi': 'Borzois, also known as Russian Wolfhounds, are elegant and graceful dogs with a long, silky coat. They are independent and aloof, but also loyal and affectionate with their families. Regular exercise and mental stimulation are important to prevent boredom.',
    'Irish Wolfhound': 'Irish Wolfhounds are one of the tallest dog breeds known for their size and strength. They are gentle giants that are loyal and affectionate with their families. Despite their large size, they are relatively low-energy dogs that require moderate exercise.',
    'Italian Greyhound': 'Italian Greyhounds are small and elegant dogs known for their sleek appearance and gentle demeanor. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Whippet': 'Whippets are sleek and athletic dogs known for their speed and agility. They are affectionate and playful companions that enjoy spending time with their families. Regular exercise is important to keep them physically fit and mentally stimulated.',
    // Continued list of dog breeds with recommendations
    'Ibizan Hound': 'Ibizan Hounds are sleek and athletic dogs known for their hunting abilities. They are independent and intelligent, but also affectionate with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Norwegian Elkhound': 'Norwegian Elkhounds are strong and energetic dogs known for their hunting abilities. They are loyal and protective, making them excellent guard dogs. They require regular exercise and mental stimulation to prevent boredom.',
    'Otterhound': 'Otterhounds are large and playful dogs with a distinctive shaggy coat. They are friendly and outgoing dogs that get along well with children and other pets. They require regular exercise and mental stimulation to prevent boredom.',
    'Saluki': 'Salukis are elegant and graceful dogs known for their hunting abilities. They are independent and aloof, but also loyal and affectionate with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Scottish Deerhound': 'Scottish Deerhounds are large and gentle dogs known for their hunting abilities. They are loyal and affectionate with their families, but also independent and stubborn. They require regular exercise and mental stimulation to stay happy and healthy.',
    'Weimaraner': 'Weimaraners are sleek and athletic dogs known for their hunting abilities. They are intelligent and energetic, making them suitable for various canine sports and activities. They require regular exercise and mental stimulation to prevent boredom.',
    'Staffordshire Bullterrier': 'Staffordshire Bull Terriers are strong and muscular dogs known for their loyalty and courage. They are affectionate and playful companions that enjoy spending time with their families. Early socialization and training are important for this breed.',
    'American Staffordshire Terrier': 'American Staffordshire Terriers, often referred to as AmStaffs, are strong and muscular dogs with a confident and courageous temperament. They are loyal and affectionate with their families but can be protective of their territory. Early socialization and training are essential for this breed.',
    'Bedlington Terrier': 'Bedlington Terriers are elegant and gentle dogs with a distinctive lamb-like appearance. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'Border Terrier': 'Border Terriers are small but sturdy dogs known for their affectionate and friendly nature. They are intelligent and trainable, making them suitable for various activities such as obedience and agility. They require regular exercise and mental stimulation to stay happy and healthy.',
    'Kerry Blue Terrier': 'Kerry Blue Terriers are spirited and energetic dogs known for their playful and mischievous nature. They are intelligent and independent, but also affectionate with their families. Regular grooming is necessary to maintain their unique coat.',
    'Irish Terrier': 'Irish Terriers are spirited and intelligent dogs known for their loyalty and courage. They are affectionate and playful companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Norfolk Terrier': 'Norfolk Terriers are small but sturdy dogs known for their lively and outgoing personality. They are intelligent and independent, but also affectionate with their families. Regular exercise and mental stimulation are important to prevent boredom.',
    'Norwich Terrier': 'Norwich Terriers are small and spirited dogs known for their bold and confident nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Yorkshire Terrier': 'Yorkshire Terriers, also known as Yorkies, are small and energetic dogs known for their long, silky coat. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their coat.',
    'Wire': 'Wire Fox Terriers are energetic and intelligent dogs known for their playful and mischievous nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Lakeland Terrier': 'Lakeland Terriers are spirited and independent dogs known for their feisty temperament. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'Sealyham Terrier': 'Sealyham Terriers are small but sturdy dogs known for their distinctive appearance and playful nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'Airedale': 'Airedale Terriers are confident and intelligent dogs known for their versatility and courage. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Cairn': 'Cairn Terriers are spirited and independent dogs known for their playful and mischievous nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Australian Terrier': 'Australian Terriers are spirited and courageous dogs known for their loyalty and intelligence. They are affectionate and playful companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Dandie Dinmont': 'Dandie Dinmont Terriers are independent and intelligent dogs known for their distinctive appearance and playful nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'Boston Bull': 'Boston Terriers, also known as Boston Bulls, are friendly and affectionate dogs known for their gentle and loving nature. They are intelligent and trainable, making them suitable for various activities such as obedience and agility.',
    'Miniature Schnauzer': 'Miniature Schnauzers are spirited and intelligent dogs known for their distinctive beard and eyebrows. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'Giant Schnauzer': 'Giant Schnauzers are strong and intelligent dogs known for their protective nature. They are loyal and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Standard Schnauzer': 'Standard Schnauzers are spirited and intelligent dogs known for their distinctive beard and eyebrows. They are loyal and protective companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Scotch Terrier': 'Scottish Terriers, also known as Scotties, are independent and spirited dogs known for their distinctive appearance and confident personality. They are loyal and affectionate companions that enjoy spending time with their families.',
    'Tibetan Terrier': 'Tibetan Terriers are intelligent and affectionate dogs known for their distinctive appearance and playful nature. They are loyal and devoted companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'Silky Terrier': 'Silky Terriers are small and spirited dogs known for their silky coat and playful personality. They are affectionate andloyal companions that enjoy spending time with their families. They are intelligent and trainable, making them suitable for various activities such as obedience and agility. Regular grooming is necessary to maintain their coat in good condition.',
    'Soft': 'Soft-coated Wheaten Terriers are friendly and affectionate dogs known for their soft, silky coat and playful nature. They are intelligent and trainable, making them suitable for various activities such as obedience and agility. Regular grooming is necessary to maintain their unique coat.',
    'West Highland White Terrier': 'West Highland White Terriers, also known as Westies, are spirited and friendly dogs known for their distinctive white coat and playful personality. They are affectionate and loyal companions that enjoy spending time with their families.',
    'Lhasa': 'Lhasa Apsos are independent and intelligent dogs known for their distinctive appearance and dignified demeanor. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'Flat': 'Flat-coated Retrievers are friendly and outgoing dogs known for their glossy black coat and playful nature. They are intelligent and trainable, making them suitable for various activities such as obedience and agility. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Curly': 'Curly-coated Retrievers are confident and energetic dogs known for their distinctive curly coat and outgoing personality. They are intelligent and trainable, making them suitable for various activities such as obedience and agility. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Golden Retriever': 'Golden Retrievers are friendly and intelligent dogs known for their gentle temperament and outgoing personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Labrador Retriever': 'Labrador Retrievers, often referred to as Labs, are friendly and outgoing dogs known for their gentle nature and intelligence. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Chesapeake Bay Retriever': 'Chesapeake Bay Retrievers are strong and independent dogs known for their retrieving abilities and protective nature. They are loyal and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'German Short': 'German Shorthaired Pointers are energetic and intelligent dogs known for their hunting abilities and versatility. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Vizsla': 'Vizslas are energetic and affectionate dogs known for their hunting abilities and friendly disposition. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'English Setter': 'English Setters are elegant and affectionate dogs known for their hunting abilities and gentle nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Irish Setter': 'Irish Setters are lively and outgoing dogs known for their hunting abilities and friendly personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Gordon Setter': 'Gordon Setters are loyal and intelligent dogs known for their hunting abilities and gentle nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Brittany Spaniel': 'Brittany Spaniels are energetic and intelligent dogs known for their hunting abilities and friendly demeanor. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Clumber': 'Clumber Spaniels are gentle and affectionate dogs known for their hunting abilities and calm demeanor. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'English Springer': 'English Springer Spaniels are energetic and friendly dogs known for their hunting abilities and playful personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Welsh Springer Spaniel': 'Welsh Springer Spaniels are friendly and outgoing dogs known for their hunting abilities and affectionate nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Cocker Spaniel': 'Cocker Spaniels are gentle and affectionate dogs known for their hunting abilities and outgoing personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'Sussex Spaniel': 'Sussex Spaniels are friendly and outgoing dogs known for their hunting abilities and affectionate nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Irish Water Spaniel': 'Irish Water Spaniels are energetic and intelligent dogs known for their retrieving abilities and playful nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Kuvasz': 'Kuvaszok are strong and independent dogs known for their protective instincts and loyalty. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Schipperke': 'Schipperkes are small but spirited dogs known for their mischievous nature and high energy levels. They are intelligent and independent, but also affectionate with their families. Regular exercise and mental stimulation are important to prevent boredom.',
    'Groenendael': 'Belgian Groenendaels are intelligent and versatile dogs known for their herding abilities and protective nature. They are loyal and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Malinois': 'Belgian Malinois are intelligent and energetic dogs known for their working abilities and loyalty. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Briard': 'Briards are intelligent and loyal dogs known for their herding abilities and protective nature. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Kelpie': 'Australian Kelpies are energetic and intelligent dogs known for their herding abilities and agility. They are loyal and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Komondor': 'Komondors are large and independent dogs known for their distinctive corded coat and protective nature. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Old English Sheepdog': 'Old English Sheepdogs are gentle and affectionate dogs known for their shaggy coat and playful personality. They are intelligent and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'Shetland Sheepdog': 'Shetland Sheepdogs, also known as Shelties, are intelligent and affectionate dogs known for their herding abilities and loyalty. They are affectionate and devoted companions that enjoy spending time with their families. Regular grooming is necessary to maintain their unique coat.',
    'Collie': 'Collies are intelligent and gentle dogs known for their herding abilities and loyalty. They are affectionate and devoted companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Border Collie': 'Border Collies are highly intelligent and energetic dogs known for their herding abilities and agility. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Bouvier Des Flandres': 'Bouvier des Flandres are strong and intelligent dogs known for their herding abilities and protective nature. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Rottweiler': 'Rottweilers are strong and loyal dogs known for their protective instincts and affectionate nature. They are intelligent and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'German Shepherd': 'German Shepherds are intelligent and versatile dogs known for their loyalty and courage. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Doberman': 'Doberman Pinschers are intelligent and alert dogs known for their loyalty and protective instincts. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Miniature Pinscher': 'Miniature Pinschers are spirited and intelligent dogs known for their loyalty and courage. They are affectionate and devoted companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Greater Swiss Mountain Dog': 'Greater Swiss Mountain Dogs are strong and gentle dogs known for their loyalty and affectionate nature. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Bernese Mountain Dog': 'Bernese Mountain Dogs are gentle and affectionate dogs known for their loyalty and protective instincts. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Appenzeller': 'Appenzeller Sennenhunds are energetic and intelligent dogs known for their herding abilities and loyalty. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'EntleBucher': 'Entlebucher Mountain Dogs are energetic and intelligent dogs known for their herding abilities and loyalty. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Boxer': 'Boxers are playful and energetic dogs known for their loyalty and protective nature. They are affectionate and devoted companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Bull Mastiff': 'Bullmastiffs are strong and powerful dogs known for their protective instincts and loyalty. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Tibetan Mastiff': 'Tibetan Mastiffs are large and powerful dogs known for their protective instincts and independent nature. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'French Bulldog': 'French Bulldogs are affectionate and playful dogs known for their distinctive bat-like ears and easygoing temperament. They are loyal and devoted companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Great Dane': 'Great Danes are gentle giants known for their imposing size and friendly disposition. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Saint Bernard': 'Saint Bernards are massive and gentle dogs known for their loyalty and affectionate nature. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Eskimo Dog': 'Eskimo Dogs, also known as American Eskimo Dogs, are playful and intelligent dogs known for their fluffy white coat and friendly demeanor. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their coat.',
    'Malamute': 'Alaskan Malamutes are strong and independent dogs known for their endurance and loyalty. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Siberian Husky': 'Siberian Huskies are energetic and intelligent dogs known for their endurance and playful nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Affenpinscher': 'Affenpinschers are small and spirited dogs known for their distinctive monkey-like face and playful personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Basenji': 'Basenjis are intelligent and independent dogs known for their unique yodel-like bark and cat-like grooming habits. They are affectionate and loyal companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Pug': 'Pugs are charming and affectionate dogs known for their wrinkled face and playful nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Leonberg': 'Leonbergers are gentle giants known for their imposing size and gentle demeanor. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Newfoundland': 'Newfoundlands are massive and gentle dogs known for their strength and sweet temperament. They are affectionate and devoted companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Great Pyrenees': 'Great Pyrenees are majestic and protective dogs known for their thick white coat and gentle nature. They are affectionate and devoted companions that require regular exercise and mental stimulation. Early socialization and training are important for this breed.',
    'Samoyed': 'Samoyeds are friendly and gentle dogs known for their fluffy white coat and cheerful disposition. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their coat.',
    'Pomeranian': 'Pomeranians are lively and intelligent dogs known for their fluffy coat and playful personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their coat.',
    'Chow': 'Chow Chows are independent and aloof dogs known for their distinctive lion-like mane and dignified demeanor. They are affectionate and loyal companions that require early socialization and training. Regular grooming is necessary to maintain their coat.',
    'Keeshond': 'Keeshonds are friendly and outgoing dogs known for their distinctive "spectacles" and playful nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their coat.',
    'Brabancon Griffon': 'Brussels Griffons are small and spirited dogs known for their distinctive appearance and charming personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their coat in good condition.',
    'Pembroke': 'Pembroke Welsh Corgis are intelligent and outgoing dogs known for their distinctive appearance and playful nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Cardigan': 'Cardigan Welsh Corgis are intelligent and affectionate dogs known for their long body and playful personality. They are affectionate and loyal companions that enjoy spending time with their families. Regular exercise and mental stimulation are important to keep them happy and healthy.',
    'Toy Poodle': 'Toy Poodles are intelligent and elegant dogs known for their curly coat and friendly demeanor. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their coat.',
    'Miniature Poodle': 'Miniature Poodles are intelligent and versatile dogs known for their curly coat and playful nature. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their coat.',
    'Standard Poodle': 'Standard Poodles are intelligent and graceful dogs known for their curly coat and dignified demeanor. They are affectionate and loyal companions that enjoy spending time with their families. Regular grooming is necessary to maintain their coat.',
    'Mexican Hairless': 'Mexican Hairless Dogs, also known as Xoloitzcuintli, are intelligent and affectionate dogs known for their unique appearance and loyal nature. They are affectionate and devoted companions that enjoy spending time with their families.',
    'Dingo': 'Dingoes are wild dogs native to Australia known for their intelligence and adaptability. They are independent and aloof, but also loyal and affectionate with their families. Early socialization and training are important for this breed.',
    'Dhole': 'Dholes, also known as Asiatic wild dogs, are social and intelligent animals known for their cooperative hunting behavior. They are independent and elusive creatures that require a large amount of space to roam and explore.',
    'African Hunting Dog': 'African Hunting Dogs, also known as African Wild Dogs, are highly social and intelligent animals known for their cooperative hunting behavior. They are fast and agile hunters that require vast territories to thrive in the wild.'
    };
    
    // Remove underscores and convert to title case
    const formattedBreed = breed.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Retrieve recommendation for the breed
    const recommendation = recommendations[formattedBreed];
    
    // Return recommendation or default message if breed not found
    return recommendation ? recommendation : 'Recommendation not available for this breed.';
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
    const recommendation = provideDecisionSupport(breed);

    const breeds = Object.keys(dogBreeds);


    // Send the prediction back to the client
    res.json({ breed, confidence, recommendation, breeds });
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
