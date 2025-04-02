type AnimationType = 'fade' | 'scale-up' | 'scale-down' | 'slide-top' | 'slide-bottom' | 'slide-left' | 'slide-right' | 'kenburns';
type OriginType = 'top' | 'bottom' | 'left' | 'right' | 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left' | 'center-left' | 'center-right';

interface AnimationOptions {
  element: HTMLElement;
  animation: AnimationType;
  reverse?: boolean;
  fast?: boolean;
  origin?: OriginType;
  onScroll?: boolean;
  strokeAnimation?: boolean;
  strokeLength?: number;
}

export class Animation {
  private element: HTMLElement;
  private options: AnimationOptions;

  constructor(options: AnimationOptions) {
    this.element = options.element;
    this.options = {
      ...options,
      reverse: options.reverse || false,
      fast: options.fast || false,
      onScroll: options.onScroll || false,
      strokeAnimation: options.strokeAnimation || false
    };
    
    this.init();
  }

  private init(): void {
    // Apply animation class
    this.element.classList.add(`uk-anmt-${this.options.animation}`);
    
    // Apply modifiers
    if (this.options.reverse) {
      this.element.classList.add('uk-anmt-reverse');
    }
    
    if (this.options.fast) {
      this.element.classList.add('uk-anmt-fast');
    }
    
    if (this.options.origin) {
      this.element.classList.add(`uk-transform-origin-${this.options.origin}`);
    }
    
    // Handle SVG stroke animation
    if (this.options.strokeAnimation && this.options.strokeLength) {
      this.element.style.setProperty('--uk-anmt-stroke', this.options.strokeLength.toString());
    }
    
    // Add scroll-based triggering if needed
    if (this.options.onScroll) {
      this.setupScrollObserver();
    }
  }

  private setupScrollObserver(): void {
    // Remove initial animation classes, they'll be added when scrolled into view
    this.element.classList.remove(`uk-anmt-${this.options.animation}`);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Re-add the animation class when element is in view
          this.element.classList.add(`uk-anmt-${this.options.animation}`);
          observer.unobserve(this.element);
        }
      });
    }, {
      threshold: 0.1 // Trigger when at least 10% of the element is visible
    });
    
    observer.observe(this.element);
  }
}

// Helper function to easily initialize animations
export function initAnimation(selector: string, options: Omit<AnimationOptions, 'element'>): Animation | null {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) return null;
  
  return new Animation({
    element,
    ...options
  });
}
