import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cartoon from '../models/Cartoon.js';
import User from '../models/User.js';

dotenv.config();

const sampleCartoons = [
  {
    title: 'Ben 10: Alien Force',
    slug: 'ben-10-alien-force',
    network: 'Cartoon Network',
    networkId: 'cartoon-network',
    description:
      'Five years after defeating Vilgax, 15-year-old Ben Tennyson puts the Omnitrix back on to search for his missing Grandpa Max. Joined by cousin Gwen and former enemy Kevin Levin, Ben battles the sinister Highbreed and DNAliens who threaten Earth.',
    rating: 9.2,
    year: 2008,
    seasons: 3,
    episodes: 46,
    categories: ['Action & Adventure', 'Sci-Fi & Fantasy', 'Superhero'],
    poster: '/cartoon-posters/ben-10.jpg',
    banner: '/cartoon-posters/ben-10-banner.jpg',
    youtubeTrailerId: 'Xq3kj0gOct0',
    isFeatured: true,
    isTrending: true,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '1.4 GB', format: 'MKV (HEVC)', downloadUrl: 'https://archive.org/download/ben10-af-episodes/s01e01-1080p.mkv', audioLanguages: ['Hindi', 'English', 'Tamil'] },
      { quality: '720p HD', resolution: '1280x720', size: '720 MB', format: 'MP4 (H.264)', downloadUrl: 'https://archive.org/download/ben10-af-episodes/s01e01-720p.mp4', audioLanguages: ['Hindi', 'English'] },
      { quality: '480p SD', resolution: '854x480', size: '350 MB', format: 'MP4 (H.264)', downloadUrl: 'https://archive.org/download/ben10-af-episodes/s01e01-480p.mp4', audioLanguages: ['Hindi', 'English'] },
    ],
  },
  {
    title: 'Tom and Jerry',
    slug: 'tom-and-jerry',
    network: 'Cartoon Network',
    networkId: 'cartoon-network',
    description:
      'The iconic cat and mouse duo in a legendary, timeless comic rivalry packed with slapstick chases, ingenious traps, explosive confrontations, and heartwarming truces.',
    rating: 9.5,
    year: 1940,
    seasons: 16,
    episodes: 164,
    categories: ['Comedy', 'Classic'],
    poster: '/cartoon-posters/tom-and-jerry.jpg',
    banner: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: 'QCMMZrfDOEs',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '950 MB', format: 'MKV', downloadUrl: 'https://archive.org/download/tom-jerry-collection/tj-classic-1080p.mkv', audioLanguages: ['English', 'Music Track'] },
      { quality: '720p HD', resolution: '1280x720', size: '520 MB', format: 'MP4', downloadUrl: 'https://archive.org/download/tom-jerry-collection/tj-classic-720p.mp4', audioLanguages: ['English'] },
    ],
  },
  {
    title: "Dexter's Laboratory",
    slug: 'dexters-laboratory',
    network: 'Cartoon Network',
    networkId: 'cartoon-network',
    description:
      'Boy genius Dexter builds an extraordinary secret laboratory at home, while his curious sister Dee Dee repeatedly finds her way inside and disrupts his experiments.',
    rating: 8.8,
    year: 1996,
    seasons: 4,
    episodes: 78,
    categories: ['Comedy', 'Sci-Fi & Fantasy'],
    poster: '/cartoon-posters/dexters-laboratory.jpg',
    banner: '/cartoon-posters/dexters-laboratory.jpg',
    youtubeTrailerId: 'Ya3Q9OLk25g',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: false,
  },
  {
    title: 'Avatar: The Last Airbender',
    slug: 'avatar-the-last-airbender',
    network: 'Nickelodeon',
    networkId: 'nickelodeon',
    description:
      'In a war-torn world of elemental magic, a young boy named Aang reawakens to undertake a dangerous mystic quest to master all four elements and bring balance to the Fire Nation and the world.',
    rating: 9.8,
    year: 2005,
    seasons: 3,
    episodes: 61,
    categories: ['Action & Adventure', 'Sci-Fi & Fantasy'],
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: 'ooVvH2IYz0w',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '1.8 GB', format: 'MKV', downloadUrl: 'https://archive.org/download/avatar-remastered/avatar-s01-1080p.mkv', audioLanguages: ['Hindi', 'English', 'Japanese'] },
      { quality: '720p HD', resolution: '1280x720', size: '850 MB', format: 'MP4', downloadUrl: 'https://archive.org/download/avatar-remastered/avatar-s01-720p.mp4', audioLanguages: ['Hindi', 'English'] },
    ],
  },
  {
    title: 'SpongeBob SquarePants',
    slug: 'spongebob-squarepants',
    network: 'Nickelodeon',
    networkId: 'nickelodeon',
    description:
      'Deep beneath the ocean in the city of Bikini Bottom lives a good-natured yellow sponge named SpongeBob, his starfish best friend Patrick, cynical Squidward, and his money-loving boss Mr. Krabs.',
    rating: 9.1,
    year: 1999,
    seasons: 14,
    episodes: 300,
    categories: ['Comedy', 'Slice of Life'],
    poster: '/cartoon-posters/spongebob-squarepants.jpg',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: 'a2cowVH03Xo',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '1.1 GB', format: 'MKV', downloadUrl: 'https://archive.org/download/spongebob-fhd/s01-1080p.mkv', audioLanguages: ['Hindi', 'English'] },
      { quality: '720p HD', resolution: '1280x720', size: '580 MB', format: 'MP4', downloadUrl: 'https://archive.org/download/spongebob-fhd/s01-720p.mp4', audioLanguages: ['Hindi', 'English'] },
    ],
  },
  {
    title: 'Phineas and Ferb',
    slug: 'phineas-and-ferb',
    network: 'Disney Channel',
    networkId: 'disney',
    description:
      'Stepbrothers Phineas and Ferb make each day of summer vacation count by inventing impossible contraptions, while their pet platypus Perry secretly fights evil scientist Dr. Doofenshmirtz.',
    rating: 8.9,
    year: 2007,
    seasons: 4,
    episodes: 129,
    categories: ['Comedy', 'Sci-Fi & Fantasy'],
    poster: '/cartoon-posters/phineas-and-ferb.jpg',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: 'pj7aDHPfzZU',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '1.2 GB', format: 'MKV', downloadUrl: 'https://archive.org/download/phineas-ferb-pack/pf-1080p.mkv', audioLanguages: ['Hindi', 'English'] },
    ],
  },
  {
    title: 'Gravity Falls',
    slug: 'gravity-falls',
    network: 'Disney Channel',
    networkId: 'disney',
    description:
      'Twin siblings Dipper and Mabel Pines spend the summer with their eccentric Great Uncle Stan in Gravity Falls, Oregon, a mysterious town full of supernatural creatures, cryptic journals, and mind-bending secrets.',
    rating: 9.4,
    year: 2012,
    seasons: 2,
    episodes: 40,
    categories: ['Mystery & Thriller', 'Comedy', 'Sci-Fi & Fantasy'],
    poster: '/cartoon-posters/gravity-falls.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: 'yfUDIPUETUg',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '1.5 GB', format: 'MKV', downloadUrl: 'https://archive.org/download/gravity-falls-complete/gf-s01-1080p.mkv', audioLanguages: ['English', 'Hindi'] },
      { quality: '720p HD', resolution: '1280x720', size: '750 MB', format: 'MP4', downloadUrl: 'https://archive.org/download/gravity-falls-complete/gf-s01-720p.mp4', audioLanguages: ['English'] },
    ],
  },
  {
    title: 'Dragon Ball Z',
    slug: 'dragon-ball-z',
    network: 'Cartoon Network',
    networkId: 'cartoon-network',
    description:
      'Goku, the legendary Saiyan warrior, defends the Earth alongside the Z-Fighters against intergalactic tyrants, androids, bio-weapons, and mystical destroyers in monumental martial arts battles.',
    rating: 9.3,
    year: 1989,
    seasons: 9,
    episodes: 291,
    categories: ['Action & Adventure', 'Anime', 'Superhero'],
    poster: '/cartoon-posters/dragon-ball-z.jpg',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: 'sxufB6DxXk0',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '2.1 GB', format: 'MKV', downloadUrl: 'https://archive.org/download/dbz-saiyan-saga/dbz-1080p.mkv', audioLanguages: ['Hindi', 'Japanese', 'English'] },
    ],
  },
  {
    title: 'The Powerpuff Girls',
    slug: 'the-powerpuff-girls',
    network: 'Cartoon Network',
    networkId: 'cartoon-network',
    description:
      'Sugar, spice, and everything nice — plus an accidental splash of Chemical X created Blossom, Bubbles, and Buttercup, Townsville’s kindergarten superhero trio who dedicate their lives to fighting crime and the forces of evil.',
    rating: 8.7,
    year: 1998,
    seasons: 6,
    episodes: 78,
    categories: ['Action & Adventure', 'Superhero', 'Comedy'],
    poster: '/cartoon-posters/powerpuff-girls.jpg',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: 'f7MiaSr-0ug',
    isFeatured: false,
    isTrending: false,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '720p HD', resolution: '1280x720', size: '550 MB', format: 'MP4', downloadUrl: 'https://archive.org/download/ppg-classic/ppg-s01-720p.mp4', audioLanguages: ['Hindi', 'English'] },
    ],
  },
  {
    title: 'Chhota Bheem',
    slug: 'chhota-bheem',
    network: 'Pogo',
    networkId: 'pogo',
    description:
      'In the mythical kingdom of Dholakpur, brave and noble 9-year-old Bheem uses his superhuman strength, fueled by delicious laddoos made by Tuntun Mausi, to protect his friends and village from cunning villains and sorcerers.',
    rating: 8.1,
    year: 2008,
    seasons: 12,
    episodes: 280,
    categories: ['Action & Adventure', 'Comedy'],
    poster: '/cartoon-posters/chhota-bheem.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: '5TN_9xCrWFA',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '720p HD', resolution: '1280x720', size: '480 MB', format: 'MP4', downloadUrl: 'https://archive.org/download/chhota-bheem-dholakpur/cb-720p.mp4', audioLanguages: ['Hindi', 'Telugu', 'Tamil'] },
    ],
  },
  {
    title: 'Doraemon: Nobita and the Castle of the Undersea Devil',
    slug: 'doraemon',
    network: 'Hungama TV',
    networkId: 'hungama',
    description:
      'Join Doraemon, Nobita, Shizuka, Gian, and Suneo on an epic underwater expedition to the Bermuda Triangle and Mariana Trench, where they uncover a lost undersea civilization and battle the ancient artificial intelligence Poseidon!',
    rating: 9.5,
    year: 2026,
    seasons: 1,
    episodes: 1,
    categories: ['Action & Adventure', 'Sci-Fi & Fantasy', 'Comedy'],
    poster: '/banners/doraemon-banner.webp',
    banner: '/banners/doraemon-banner.webp',
    youtubeTrailerId: 'tKdIRLkFs2E',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: true,
    downloadLinks: [
      { quality: '720p HD', resolution: '1280x720', size: '481 MB', format: 'MP4 (H.264)', downloadUrl: 'http://localhost:5000/api/media/download/doraemon', audioLanguages: ['Hindi (Original Audio)'] },
      { quality: '1080p FHD', resolution: '1920x1080', size: '1.2 GB', format: 'MKV', downloadUrl: 'http://localhost:5000/api/media/download/doraemon', audioLanguages: ['Hindi', 'Japanese'] },
    ],
  },
  {
    title: 'Courage the Cowardly Dog',
    slug: 'courage-the-cowardly-dog',
    network: 'Cartoon Network',
    networkId: 'cartoon-network',
    description:
      'Courage is an easily terrified pink dog who lives in the middle of Nowhere, Kansas with elderly couple Muriel and Eustace Bagge. Despite his paralyzing fears, Courage repeatedly saves his kind owner Muriel from terrifying extraterrestrial and paranormal horrors.',
    rating: 9.3,
    year: 1999,
    seasons: 4,
    episodes: 52,
    categories: ['Mystery & Thriller', 'Comedy', 'Sci-Fi & Fantasy'],
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: 'O_fXl3Zf4b0',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '1.1 GB', format: 'MKV', downloadUrl: 'https://archive.org/download/courage-complete/courage-1080p.mkv', audioLanguages: ['Hindi', 'English'] },
    ],
  },
  {
    title: 'Shinchan',
    slug: 'shinchan',
    network: 'Hungama TV',
    networkId: 'hungama',
    description:
      'The hilarious antics of mischievous five-year-old Shinnosuke "Shinchan" Nohara, his exasperated parents Hiroshi and Misae, baby sister Himawari, and loyal pet dog Shiro in Kasukabe, Japan.',
    rating: 8.9,
    year: 1992,
    seasons: 15,
    episodes: 1200,
    categories: ['Comedy', 'Slice of Life'],
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: 'P_jKk7i7t78',
    isFeatured: false,
    isTrending: true,
    isRecentlyAdded: false,
    downloadLinks: [
      { quality: '720p HD', resolution: '1280x720', size: '520 MB', format: 'MP4', downloadUrl: 'https://archive.org/download/shinchan-episodes/shinchan-720p.mp4', audioLanguages: ['Hindi', 'Japanese'] },
    ],
  },
  {
    title: 'Bluey',
    slug: 'bluey',
    network: 'Disney Channel',
    networkId: 'disney',
    description:
      'An exuberant six-year-old Blue Heeler puppy named Bluey turns everyday family life into extraordinary, joyful adventures alongside her playful sister Bingo and loving parents Bandit and Chilli.',
    rating: 9.7,
    year: 2018,
    seasons: 3,
    episodes: 154,
    categories: ['Comedy', 'Slice of Life', 'Educational'],
    poster: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: '4uIq88Fq7_A',
    isFeatured: false,
    isTrending: false,
    isRecentlyAdded: true,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '890 MB', format: 'MKV', downloadUrl: 'https://archive.org/download/bluey-season3/bluey-s03-1080p.mkv', audioLanguages: ['English', 'Hindi'] },
    ],
  },
  {
    title: 'The Owl House',
    slug: 'the-owl-house',
    network: 'Disney Channel',
    networkId: 'disney',
    description:
      'Luz Noceda, an imaginative human teenager, accidentally stumbles through a magical portal to the Boiling Isles, where she befriends rebellious witch Eda and tiny demon warrior King.',
    rating: 9.2,
    year: 2020,
    seasons: 3,
    episodes: 43,
    categories: ['Sci-Fi & Fantasy', 'Action & Adventure', 'Comedy'],
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: '6b2KzFz6w1U',
    isFeatured: false,
    isTrending: false,
    isRecentlyAdded: true,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '1.4 GB', format: 'MKV', downloadUrl: 'https://archive.org/download/owl-house-fhd/toh-1080p.mkv', audioLanguages: ['English', 'Hindi'] },
    ],
  },
  {
    title: 'Kipo and the Age of Wonderbeasts',
    slug: 'kipo-and-the-age-of-wonderbeasts',
    network: 'Nickelodeon',
    networkId: 'nickelodeon',
    description:
      'After being separated from her subterranean burrow, shelter-dweller Kipo must navigate a whimsical yet dangerous surface world populated by colossal sentient mutant animals.',
    rating: 8.9,
    year: 2020,
    seasons: 3,
    episodes: 30,
    categories: ['Action & Adventure', 'Sci-Fi & Fantasy'],
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    youtubeTrailerId: 'bA4yN9Yx7yQ',
    isFeatured: false,
    isTrending: false,
    isRecentlyAdded: true,
    downloadLinks: [
      { quality: '1080p FHD', resolution: '1920x1080', size: '1.2 GB', format: 'MKV', downloadUrl: 'https://archive.org/download/kipo-wonderbeasts/kipo-1080p.mkv', audioLanguages: ['English', 'Hindi'] },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/toonverse');
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing
    await Cartoon.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleaned up old data');

    // Create Admin User
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@toonverse.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`👤 Admin created: ${adminUser.email} / admin123`);

    // Create Regular User
    const regularUser = await User.create({
      username: 'toonfan',
      email: 'user@toonverse.com',
      password: 'user123',
      role: 'user',
    });
    console.log(`👤 Test user created: ${regularUser.email} / user123`);

    // Insert Cartoons
    const insertedCartoons = await Cartoon.insertMany(sampleCartoons);
    console.log(`🎉 Successfully inserted ${insertedCartoons.length} cartoons!`);

    // Add some favorites for test user
    regularUser.favorites.push(insertedCartoons[0]._id, insertedCartoons[1]._id);
    await regularUser.save();
    console.log('❤️ Seeded favorites for test user');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
