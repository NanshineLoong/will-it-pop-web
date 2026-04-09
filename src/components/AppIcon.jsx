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

const icons = {
  ban: Ban,
  chart: BarChart3,
  bookmark: Bookmark,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  close: X,
  download: Download,
  flame: Flame,
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
