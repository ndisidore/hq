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
export const TECH_ICON_MAP: Record<string, string> = {
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
};
