import mongoose from 'mongoose';

const downloadLinkSchema = new mongoose.Schema({
  quality: {
    type: String,
    required: true,
    enum: ['480p SD', '720p HD', '1080p FHD', '4K UHD'],
    default: '1080p FHD',
  },
  resolution: { type: String, default: '1920x1080' },
  size: { type: String, required: true },
  format: { type: String, default: 'MKV / H.264' },
  downloadUrl: { type: String, required: true },
  audioLanguages: [{ type: String, default: ['Hindi', 'English'] }],
});

const cartoonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a cartoon title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    network: {
      type: String,
      required: true,
      enum: ['Cartoon Network', 'Disney Channel', 'Nickelodeon', 'Pogo', 'Hungama TV', 'Discovery Kids', 'Anime Network'],
    },
    networkId: {
      type: String,
      required: true,
      enum: ['cartoon-network', 'disney', 'nickelodeon', 'pogo', 'hungama', 'discovery-kids', 'anime-network'],
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 8.5,
    },
    year: {
      type: Number,
      required: true,
    },
    seasons: {
      type: Number,
      default: 1,
    },
    episodes: {
      type: Number,
      default: 26,
    },
    categories: {
      type: [String],
      required: true,
      validate: [val => val.length > 0, 'Please specify at least one category'],
    },
    poster: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    youtubeTrailerId: {
      type: String,
      required: true,
      trim: true,
    },
    downloadLinks: [downloadLinkSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isRecentlyAdded: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartoonSchema.index({ title: 'text', description: 'text', network: 'text' });

export default mongoose.model('Cartoon', cartoonSchema);
