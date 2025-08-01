"use client"
import React, { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Database, 
  MessageSquare, 
  GraduationCap, 
  ShoppingBag,
  CheckCircle,
  XCircle,
  ExternalLink,
  Zap
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: React.ReactNode;
  connected: boolean;
  category: string;
}

interface IntegrationSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  integrations: Integration[];
}

const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const [isConnected, setIsConnected] = useState(integration.connected);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  return (
    <Card className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Grid size={20} />
      
      <div className="relative z-20 flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center">
            {integration.logo}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{integration.name}</h3>
            <Badge 
              variant={isConnected ? "default" : "secondary"}
              className={`mt-1 ${isConnected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
            >
              {isConnected ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Not Connected
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 relative z-20 leading-relaxed">
        {integration.description}
      </p>

      <div className="relative z-20 flex gap-2">
        <Button
          onClick={handleConnect}
          variant={isConnected ? "outline" : "default"}
          size="sm"
          className="flex-1"
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
        <Button variant="ghost" size="sm">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

const IntegrationSection = ({ title, description, icon, integrations }: IntegrationSectionProps) => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
};

const NotionLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-900 dark:text-gray-100">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933l3.222-.187z"/>
  </svg>
);

const AirtableLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
    <path d="M3 3v18h18V3H3zm15 15H6V6h12v12z"/>
    <path d="M8 8h8v2H8zm0 3h8v2H8zm0 3h5v2H8z"/>
  </svg>
);

const SlackLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

const TeamsLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169-.185-.4-.29-.64-.29-.185 0-.37.074-.507.216l-2.896 2.896c-.142.142-.216.327-.216.507 0 .24.105.471.29.64.185.169.4.29.64.29.185 0 .37-.074.507-.216l2.896-2.896c.142-.142.216-.327.216-.507 0-.24-.105-.471-.29-.64z"/>
  </svg>
);

const YouTubeLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const CourseraLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
    <path d="M11.374 23.977c-4.183-.21-7.662-2.52-9.88-6.27C.296 15.82-.462 13.14.35 10.264 1.16 7.388 3.008 4.928 5.6 3.4 8.192 1.87 11.296 1.387 14.26 2.042c2.964.656 5.556 2.44 7.086 4.877 1.53 2.438 1.9 5.45 1.01 8.246-.89 2.795-2.81 5.152-5.253 6.44-2.443 1.29-5.32 1.44-7.866.788-2.546-.652-4.77-2.18-6.085-4.18-.263-.4-.49-.822-.678-1.26l2.99-1.31c.13.29.284.57.46.83.88 1.29 2.21 2.23 3.75 2.65 1.54.42 3.18.26 4.61-.45 1.43-.71 2.54-1.87 3.13-3.27.59-1.4.61-2.97.05-4.39-.56-1.42-1.62-2.62-2.98-3.38-1.36-.76-2.94-.99-4.45-.64-1.51.35-2.87 1.24-3.83 2.51-.96 1.27-1.45 2.84-1.38 4.42.07 1.58.67 3.09 1.69 4.25.34.39.72.74 1.14 1.04l-1.9 2.37c-.58-.46-1.1-.98-1.56-1.56z"/>
  </svg>
);

const EdxLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-600">
    <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.073 7.5h2.146L16 12l-2.927 4.5h-2.146L13.854 12 10.927 7.5z"/>
  </svg>
);

const UdemyLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-500">
    <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm0 4.5c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"/>
  </svg>
);

const AirbnbLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
    <path d="M12 0C5.8 0 .8 5.8.8 13.1c0 7.3 5 13.1 11.2 13.1S23.2 20.4 23.2 13.1C23.2 5.8 18.2 0 12 0zm0 19.5c-3.2 0-5.8-3.2-5.8-7.1s2.6-7.1 5.8-7.1 5.8 3.2 5.8 7.1-2.6 7.1-5.8 7.1z"/>
  </svg>
);

const ShopifyLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600">
    <path d="M15.337 2.368c-.332-.066-.664-.066-.996 0-2.324.464-4.648 1.328-6.64 2.656C6.369 5.688 5.373 6.552 4.71 7.416c-.664.864-1.328 1.728-1.66 2.656-.332.928-.332 1.856 0 2.784.332.928.996 1.792 1.66 2.656.664.864 1.66 1.728 2.992 2.392 1.992 1.328 4.316 2.192 6.64 2.656.332.066.664.066.996 0 2.324-.464 4.648-1.328 6.64-2.656 1.332-.664 2.328-1.528 2.992-2.392.664-.864 1.328-1.728 1.66-2.656.332-.928.332-1.856 0-2.784-.332-.928-.996-1.792-1.66-2.656-.664-.864-1.66-1.728-2.992-2.392-1.992-1.328-4.316-2.192-6.64-2.656z"/>
  </svg>
);

const SquareLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-900 dark:text-gray-100">
    <path d="M4.01 4.01h15.98v15.98H4.01V4.01zm2 2v11.98h11.98V6.01H6.01z"/>
  </svg>
);

const AlyceLogo = () => (
  <img 
    src="https://www.alyce.com/wp-content/uploads/2022/07/gifting-integrations-alyce.png" 
    alt="Alyce Gifting" 
    className="w-10 h-10 object-contain"
  />
);

const DoorDashLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
    <path d="M23.071 8.409a6.09 6.09 0 0 0-5.396-3.228H.929A.929.929 0 0 0 .2 6.267L3.613 9.68a.929.929 0 0 0 .657.272h12.804c1.582 0 2.864 1.282 2.864 2.864s-1.282 2.864-2.864 2.864H9.681a.929.929 0 0 0-.657.272l-3.413 3.413a.929.929 0 0 0 .729 1.586h11.735a6.09 6.09 0 0 0 5.396-3.228L23.8 8.409z"/>
  </svg>
);

const UberEatsLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
    <path d="M8 8h8v2H8zm0 3h8v2H8zm0 3h5v2H8z"/>
  </svg>
);

export default function IntegrationsSettingsPage() {
  const integrationSections: IntegrationSectionProps[] = [
    {
      title: "Company Data Source",
      description: "Connect your data sources for seamless information flow",
      icon: <Database className="w-5 h-5" />,
      integrations: [
        {
          id: "notion",
          name: "Notion",
          description: "All-in-one workspace for notes, tasks, wikis, and databases. Sync your company knowledge base.",
          logo: <NotionLogo />,
          connected: true,
          category: "data"
        },
        {
          id: "airtable",
          name: "Airtable",
          description: "Cloud collaboration service with spreadsheet-database hybrid functionality for project management.",
          logo: <AirtableLogo />,
          connected: false,
          category: "data"
        }
      ]
    },
    {
      title: "Communication Tools",
      description: "Integrate with your team communication platforms",
      icon: <MessageSquare className="w-5 h-5" />,
      integrations: [
        {
          id: "slack",
          name: "Slack",
          description: "Team communication platform for real-time messaging, file sharing, and collaboration.",
          logo: <SlackLogo />,
          connected: true,
          category: "communication"
        },
        {
          id: "teams",
          name: "Microsoft Teams",
          description: "Unified communication and collaboration platform that combines workplace chat, meetings, and files.",
          logo: <TeamsLogo />,
          connected: false,
          category: "communication"
        }
      ]
    },
    {
      title: "Knowledge Base & Training",
      description: "Connect learning platforms and educational resources",
      icon: <GraduationCap className="w-5 h-5" />,
      integrations: [
        {
          id: "youtube",
          name: "YouTube",
          description: "Video sharing platform for training content, tutorials, and educational materials.",
          logo: <YouTubeLogo />,
          connected: true,
          category: "learning"
        },
        {
          id: "coursera",
          name: "Coursera",
          description: "Online learning platform offering courses, specializations, and degrees from top universities.",
          logo: <CourseraLogo />,
          connected: false,
          category: "learning"
        },
        {
          id: "edx",
          name: "edX",
          description: "Massive open online course provider offering university-level courses in various disciplines.",
          logo: <EdxLogo />,
          connected: true,
          category: "learning"
        },
        {
          id: "udemy",
          name: "Udemy",
          description: "Online learning marketplace with courses on programming, business, design, and more.",
          logo: <UdemyLogo />,
          connected: false,
          category: "learning"
        }
      ]
    },
    {
      title: "Connect Vendors",
      description: "Integrate with business and e-commerce platforms",
      icon: <ShoppingBag className="w-5 h-5" />,
      integrations: [
        {
          id: "alyce",
          name: "Alyce Gifting",
          description: "Corporate gifting platform for building stronger business relationships through personalized gifts.",
          logo: <AlyceLogo />,
          connected: false,
          category: "vendor"
        },
        {
          id: "airbnb",
          name: "Airbnb",
          description: "Online marketplace for lodging and tourism experiences. Manage your property listings.",
          logo: <AirbnbLogo />,
          connected: false,
          category: "vendor"
        },
        {
          id: "shopify",
          name: "Shopify",
          description: "E-commerce platform for online stores and retail point-of-sale systems.",
          logo: <ShopifyLogo />,
          connected: true,
          category: "vendor"
        },
        {
          id: "square",
          name: "Square",
          description: "Financial services and digital payment company for small and medium businesses.",
          logo: <SquareLogo />,
          connected: false,
          category: "vendor"
        },
        {
          id: "doordash",
          name: "DoorDash",
          description: "Food delivery platform connecting customers with local restaurants and food establishments.",
          logo: <DoorDashLogo />,
          connected: true,
          category: "vendor"
        },
        {
          id: "ubereats",
          name: "Uber Eats",
          description: "Online food ordering and delivery platform operated by Uber Technologies.",
          logo: <UberEatsLogo />,
          connected: false,
          category: "vendor"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Third-Party Integrations</h1>
              <p className="text-muted-foreground">Connect and manage your external service integrations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>Streamline your workflow with powerful integrations</span>
          </div>
        </div>

        <div className="space-y-12">
          {integrationSections.map((section, index) => (
            <IntegrationSection
              key={index}
              title={section.title}
              description={section.description}
              icon={section.icon}
              integrations={section.integrations}
            />
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">Need a custom integration?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Don't see the service you need? Contact our team to discuss custom integration options for your specific requirements.
              </p>
              <Button variant="outline" size="sm">
                Request Integration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
