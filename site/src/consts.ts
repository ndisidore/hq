// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Diz.Rocks';
export const SITE_DESCRIPTION =
  'Personal website and blog about software development, technology, and more.';

export const SITE_URL = 'https://diz.rocks';
export const ME = 'Nathan Disidore';
export const AUTHOR_NAME = ME;

export const SOCIAL_LINKS = {
  github: 'https://github.com/ndisidore',
  linkedin: 'https://linkedin.com/in/ndisidore',
};

export const HERO_TAGLINE =
  'I build distributed systems, edge infrastructure, and developer tools. ' +
  'Currently a founding engineer at Terminal Industries working on computer vision and logistics. ' +
  'Previously at Cloudflare on the Workers platform and observability systems. ' +
  'I write about the craft of building software and the tools that make it better.';

// DaisyUI themes - keep in sync with app.css @plugin "daisyui" config
export const THEMES = [
  { name: 'light', label: 'Light', icon: 'tabler:sun' },
  { name: 'dark', label: 'Dark', icon: 'tabler:moon' },
  { name: 'cupcake', label: 'Cupcake', icon: 'tabler:cake' },
  { name: 'emerald', label: 'Emerald', icon: 'tabler:leaf' },
  { name: 'corporate', label: 'Corporate', icon: 'tabler:building' },
  { name: 'synthwave', label: 'Synthwave', icon: 'tabler:music' },
  { name: 'retro', label: 'Retro', icon: 'tabler:device-tv' },
  { name: 'cyberpunk', label: 'Cyberpunk', icon: 'tabler:robot' },
  { name: 'valentine', label: 'Valentine', icon: 'tabler:heart' },
  { name: 'halloween', label: 'Halloween', icon: 'tabler:pumpkin-scary' },
  { name: 'garden', label: 'Garden', icon: 'tabler:plant' },
  { name: 'forest', label: 'Forest', icon: 'tabler:trees' },
  { name: 'lofi', label: 'Lo-Fi', icon: 'tabler:headphones' },
  { name: 'pastel', label: 'Pastel', icon: 'tabler:palette' },
  { name: 'fantasy', label: 'Fantasy', icon: 'tabler:wand' },
  { name: 'dracula', label: 'Dracula', icon: 'tabler:bat' },
  { name: 'night', label: 'Night', icon: 'tabler:moon-stars' },
  { name: 'coffee', label: 'Coffee', icon: 'tabler:coffee' },
  { name: 'winter', label: 'Winter', icon: 'tabler:snowflake' },
  { name: 'dim', label: 'Dim', icon: 'tabler:brightness-down' },
  { name: 'nord', label: 'Nord', icon: 'tabler:compass' },
  { name: 'sunset', label: 'Sunset', icon: 'tabler:sunset' },
] as const;

export const THEME_NAMES = THEMES.map((t) => t.name);

// Technology name to icon mapping for experience/skills displays
// Priority: logos > simple-icons > tabler (fallback)
export const TECH_ICON_MAP: Record<string, string> = {
  // Terminal Industries stack
  TanStack: 'logos:react-query-icon',
  OpenTofu: 'simple-icons:opentofu',
  Ansible: 'logos:ansible',
  'Computer Vision': 'tabler:eye-code',
  'GPU Acceleration': 'tabler:cpu-2',
  Temporal: 'simple-icons:temporal',
  CEL: 'tabler:code',
  OpenTelemetry: 'logos:opentelemetry-icon',
  Tailscale: 'simple-icons:tailscale',
  'AXIS ACAP': 'tabler:camera',
  Grafana: 'logos:grafana',
  Mise: 'tabler:tool',
  'GitHub Actions': 'logos:github-actions',
  'AWS ECS': 'logos:aws-ecs',
  Redpanda: 'tabler:message-bolt',
  DuckDB: 'simple-icons:duckdb',
  DBT: 'logos:dbt-icon',
  CDC: 'tabler:database-export',
  Debezium: 'tabler:database-share',
  'Claude Code': 'logos:claude-icon',
  // Common
  GraphQL: 'logos:graphql',
  'Node.js': 'logos:nodejs-icon',
  Python: 'logos:python',
  PostgreSQL: 'logos:postgresql',
  'AWS Lambda': 'logos:aws-lambda',
  DynamoDB: 'logos:aws-dynamodb',
  Kinesis: 'logos:aws-kinesis',
  ECS: 'logos:aws-ecs',
  'IoT Core': 'logos:aws',
  Redis: 'logos:redis',
  'Material UI': 'logos:material-ui',
  Webpack: 'logos:webpack',
  React: 'logos:react',
  Redux: 'logos:redux',
  CloudFormation: 'logos:aws-cloudformation',
  S3: 'logos:aws-s3',
  CloudFront: 'logos:aws-cloudfront',
  'Express.js': 'logos:express',
  PHP: 'logos:php',
  'Ruby on Rails': 'logos:ruby',
  JavaScript: 'logos:javascript',
  TypeScript: 'logos:typescript-icon',
  'Backbone.js': 'logos:backbone-icon',
  'AWS EC2': 'logos:aws-ec2',
  Docker: 'logos:docker-icon',
  nginx: 'logos:nginx',
  MySQL: 'logos:mysql-icon',
  Grunt: 'logos:grunt',
  Terraform: 'logos:terraform-icon',
  CSS: 'logos:css-3',
  // Cloudflare stack
  Golang: 'logos:go',
  Kubernetes: 'logos:kubernetes',
  Kafka: 'logos:kafka-icon',
  Prometheus: 'logos:prometheus',
  VictoriaMetrics: 'simple-icons:victoriametrics',
  ClickHouse: 'simple-icons:clickhouse',
  Timescale: 'simple-icons:timescale',
  Elasticsearch: 'logos:elasticsearch',
  'Cloudflare Workers': 'logos:cloudflare-workers-icon',
  'C++': 'logos:c-plusplus',
  Rust: 'logos:rust',
  Protobuf: 'tabler:file-code',
  "Cap'n Proto": 'tabler:message-code',
  Ceph: 'simple-icons:ceph',
  Buf: 'tabler:package',
  Quicksilver: 'tabler:bolt',
  Parquet: 'simple-icons:apacheparquet',
  R2: 'logos:cloudflare-icon',
  'IVF+PQ': 'tabler:vector',
  // Skills section
  'C/C++': 'logos:c',
  Java: 'logos:java',
  Ruby: 'logos:ruby',
  'JavaScript/ES6': 'logos:javascript',
  Lua: 'logos:lua',
  Haskell: 'logos:haskell-icon',
  Express: 'logos:express',
  MongoDB: 'logos:mongodb-icon',
  AWS: 'logos:aws',
  'PCB Design': 'tabler:cpu',
  'Raspberry Pi': 'logos:raspberry-pi',
  Arduino: 'logos:arduino',
  Modbus: 'tabler:plug-connected',
};

export function getTechIcon(tech: string): string {
  return TECH_ICON_MAP[tech] || 'tabler:code';
}
