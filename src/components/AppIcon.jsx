import {
  Ban,
  BarChart3,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Download,
  Flame,
  Heart,
  House,
  Lightbulb,
  Link2,
  MessageCircle,
  QrCode,
  Rocket,
  Share2,
  Sparkles,
  ThumbsUp,
  Upload,
  X,
  Zap,
} from 'lucide-react'

function GitHubIcon({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 .5C5.65.5.5 5.8.5 12.35c0 5.24 3.3 9.68 7.88 11.25.58.11.79-.26.79-.57 0-.28-.01-1.2-.02-2.18-3.2.71-3.88-1.4-3.88-1.4-.52-1.38-1.28-1.74-1.28-1.74-1.05-.74.08-.72.08-.72 1.16.08 1.78 1.22 1.78 1.22 1.03 1.82 2.7 1.29 3.36.99.1-.77.4-1.29.73-1.58-2.56-.3-5.24-1.32-5.24-5.88 0-1.3.45-2.36 1.19-3.2-.12-.3-.52-1.5.11-3.13 0 0 .97-.32 3.19 1.22a10.8 10.8 0 0 1 5.8 0c2.21-1.54 3.18-1.22 3.18-1.22.64 1.63.24 2.83.12 3.13.74.84 1.19 1.9 1.19 3.2 0 4.57-2.68 5.58-5.24 5.88.42.37.79 1.08.79 2.19 0 1.58-.01 2.85-.01 3.23 0 .31.21.69.8.57 4.57-1.57 7.87-6.01 7.87-11.25C23.5 5.8 18.35.5 12 .5Z" />
    </svg>
  )
}

const icons = {
  ban: Ban,
  chart: BarChart3,
  bookmark: Bookmark,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  close: X,
  download: Download,
  flame: Flame,
  github: GitHubIcon,
  heart: Heart,
  help: CircleHelp,
  home: House,
  lightbulb: Lightbulb,
  link: Link2,
  message: MessageCircle,
  qr: QrCode,
  rocket: Rocket,
  share: Share2,
  sparkles: Sparkles,
  thumbsUp: ThumbsUp,
  upload: Upload,
  zap: Zap,
}

export default function AppIcon({ name, className, strokeWidth = 2.25, ...props }) {
  const Icon = icons[name]

  if (!Icon) return null

  return <Icon aria-hidden="true" className={className} strokeWidth={strokeWidth} {...props} />
}
