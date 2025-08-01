# Onbloom Style Guide

This guide demonstrates how to effectively use Tailwind CSS with the Onbloom design system.

## Brand Colors

### Primary Palette
```jsx
// Primary brand colors
<div className="bg-onbloom-primary text-onbloom-neutral">Primary Purple</div>
<div className="bg-onbloom-secondary text-onbloom-primary">Secondary Pink</div>
<div className="bg-onbloom-neutral text-onbloom-primary">Neutral Background</div>
```

### Accent Colors
```jsx
// Accent variations for highlights and CTAs
<button className="bg-onbloom-accent-pink text-white">Pink CTA</button>
<button className="bg-onbloom-accent-blue text-white">Blue CTA</button>
<button className="bg-onbloom-accent-green text-white">Green CTA</button>
```

### Semantic Colors
```jsx
// Status and feedback colors
<div className="text-onbloom-success">Success message</div>
<div className="text-onbloom-error">Error message</div>
<div className="text-onbloom-warning">Warning message</div>
<div className="text-onbloom-info bg-onbloom-info/10 p-4 rounded">Info banner</div>
```

## Typography

### Font Families
```jsx
// Title font (Nunito Sans - Futura alternative)
<h1 className="font-title text-4xl font-bold text-onbloom-primary">Main Heading</h1>

// Secondary font (Inter - Okomito alternative)  
<p className="font-secondary text-lg text-onbloom-dark-purple">Body text with secondary font</p>

// Default (inherits font-title)
<p className="text-base">Regular body text</p>
```

### Typography Scale
```jsx
// Headings using brand colors
<h1 className="font-title text-5xl font-bold text-onbloom-primary">Hero Title</h1>
<h2 className="font-title text-3xl font-semibold text-onbloom-dark-purple">Section Title</h2>
<h3 className="font-title text-xl font-medium text-onbloom-primary">Subsection</h3>

// Body text variations
<p className="font-secondary text-base text-onbloom-dark-purple leading-relaxed">
  Standard body text with good readability
</p>
<p className="text-sm text-onbloom-dark-purple/70">Caption or secondary text</p>
```

## Component Patterns

### Cards
```jsx
// Light card with Onbloom styling
<div className="bg-onbloom-neutral border border-onbloom-secondary rounded-lg p-6 shadow-sm">
  <h3 className="font-title text-xl font-semibold text-onbloom-primary mb-3">Card Title</h3>
  <p className="font-secondary text-onbloom-dark-purple">Card content...</p>
</div>

// Elevated card
<div className="bg-white border border-onbloom-secondary rounded-xl p-6 shadow-lg">
  <h3 className="font-title text-lg font-medium text-onbloom-primary">Elevated Card</h3>
</div>
```

### Buttons
```jsx
// Primary button
<button className="bg-onbloom-primary hover:bg-onbloom-dark-purple text-onbloom-neutral font-title font-medium px-6 py-3 rounded-lg transition-colors">
  Primary Action
</button>

// Secondary button
<button className="bg-onbloom-secondary hover:bg-onbloom-accent-pink text-onbloom-primary font-title font-medium px-6 py-3 rounded-lg transition-colors">
  Secondary Action
</button>

// Outline button
<button className="border-2 border-onbloom-primary text-onbloom-primary hover:bg-onbloom-primary hover:text-onbloom-neutral font-title font-medium px-6 py-3 rounded-lg transition-all">
  Outline Action
</button>

// Accent buttons
<button className="bg-onbloom-accent-green hover:bg-green-600 text-white font-title font-medium px-4 py-2 rounded-md">
  Success Action
</button>
```

### Forms
```jsx
// Input styling
<input 
  className="w-full px-4 py-3 border border-onbloom-secondary rounded-lg focus:ring-2 focus:ring-onbloom-primary focus:border-onbloom-primary font-secondary"
  placeholder="Enter text..."
/>

// Label styling
<label className="block font-title font-medium text-onbloom-primary mb-2">
  Form Label
</label>

// Form group
<div className="space-y-2">
  <label className="block font-title font-medium text-onbloom-primary">
    Email Address
  </label>
  <input 
    type="email"
    className="w-full px-4 py-3 border border-onbloom-secondary rounded-lg focus:ring-2 focus:ring-onbloom-primary focus:border-onbloom-primary font-secondary"
  />
  <p className="text-sm text-onbloom-dark-purple/70">We'll never share your email</p>
</div>
```

### Navigation
```jsx
// Header navigation
<nav className="bg-onbloom-neutral border-b border-onbloom-secondary">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-between items-center h-16">
      <div className="font-title text-xl font-bold text-onbloom-primary">Onbloom</div>
      <div className="space-x-6">
        <a href="#" className="font-secondary text-onbloom-dark-purple hover:text-onbloom-primary transition-colors">
          Home
        </a>
        <a href="#" className="font-secondary text-onbloom-dark-purple hover:text-onbloom-primary transition-colors">
          About
        </a>
      </div>
    </div>
  </div>
</nav>
```

### Status Indicators
```jsx
// Success state
<div className="flex items-center space-x-2 text-onbloom-success">
  <CheckIcon className="w-4 h-4" />
  <span className="font-secondary">Operation successful</span>
</div>

// Error state
<div className="bg-onbloom-error/10 border border-onbloom-error/20 rounded-lg p-4">
  <p className="text-onbloom-error font-secondary">Something went wrong</p>
</div>

// Warning banner
<div className="bg-onbloom-warning/10 border-l-4 border-onbloom-warning p-4">
  <p className="text-onbloom-warning font-secondary font-medium">Warning message</p>
</div>
```

## Layout Patterns

### Hero Section
```jsx
<section className="bg-gradient-to-br from-onbloom-neutral to-onbloom-secondary/30 py-20">
  <div className="max-w-4xl mx-auto text-center px-4">
    <h1 className="font-title text-5xl font-bold text-onbloom-primary mb-6">
      Human-first onboarding
    </h1>
    <p className="font-secondary text-xl text-onbloom-dark-purple mb-8 leading-relaxed">
      Create meaningful connections with your users from day one
    </p>
    <button className="bg-onbloom-primary hover:bg-onbloom-dark-purple text-onbloom-neutral font-title font-semibold px-8 py-4 rounded-xl transition-colors">
      Get Started
    </button>
  </div>
</section>
```

### Content Sections
```jsx
<section className="py-16 bg-white">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="font-title text-3xl font-bold text-onbloom-primary text-center mb-12">
      Features
    </h2>
    <div className="grid md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div key={feature.id} className="text-center">
          <div className="bg-onbloom-accent-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <feature.icon className="w-8 h-8 text-onbloom-accent-blue" />
          </div>
          <h3 className="font-title text-xl font-semibold text-onbloom-primary mb-3">
            {feature.title}
          </h3>
          <p className="font-secondary text-onbloom-dark-purple">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

## Dark Mode
```jsx
// Dark mode variations (automatically handled by CSS variables)
<div className="bg-background text-foreground p-6">
  <h2 className="text-primary">Automatically adapts to dark mode</h2>
  <p className="text-muted-foreground">Uses semantic color tokens</p>
</div>
```

## Best Practices

### Color Usage
- **Primary (`onbloom-primary`)**: Main CTAs, headings, brand elements
- **Secondary (`onbloom-secondary`)**: Backgrounds, borders, subtle highlights  
- **Neutral (`onbloom-neutral`)**: Page backgrounds, card backgrounds
- **Accent colors**: Sparingly for variety and emphasis
- **Dark variants**: Text, dark mode, depth

### Typography Guidelines
- Use `font-title` for headings, buttons, and UI elements
- Use `font-secondary` for body text and descriptions  
- Maintain consistent font weights: `font-medium` for UI, `font-semibold` for emphasis
- Use `leading-relaxed` for better readability in longer text

### Spacing & Layout
- Follow Tailwind's spacing scale: `space-y-4`, `gap-6`, `p-8`
- Use consistent border radius: `rounded-lg` for cards, `rounded-xl` for prominent elements
- Leverage CSS Grid and Flexbox: `grid grid-cols-3`, `flex items-center`

### Responsive Design
```jsx
// Mobile-first responsive patterns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 sm:p-6 lg:p-8">
    <h3 className="text-lg sm:text-xl lg:text-2xl font-title">Responsive Text</h3>
  </div>
</div>
```

### Performance Tips
- Use color opacity utilities: `bg-onbloom-primary/10` instead of custom transparent colors
- Leverage Tailwind's built-in hover/focus states: `hover:bg-onbloom-accent-pink`
- Use semantic color tokens (`bg-primary`) when you want automatic dark mode handling
- Use brand colors (`bg-onbloom-primary`) when you want consistent brand representation