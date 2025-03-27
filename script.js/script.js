// ========== MAIN SCRIPT.JS ==========
document.addEventListener('DOMContentLoaded', function() {
    // ----- Global Variables -----
    const currentPage = window.location.pathname.split('/').pop();
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
    // ----- Initialize Components -----
    initNavigation();
    initCart();
    initAnimations();
    initBackToTop();
    
    // Page-specific initializations
    if (currentPage === 'index.html' || currentPage === '') {
      initFeaturedLaptops();
      initTestimonials();
      initSpecialOffers();
    } else if (currentPage === 'contact.html') {
      initContactForm();
    } else if (currentPage === 'faq.html') {
      initFAQAccordion();
    } else if (currentPage === 'gallery.html') {
      initLaptopGallery();
    }
  
    // ----- Core Functions -----
  
    // Initialize navigation and mobile menu
    function initNavigation() {
      const navToggle = document.createElement('button');
      navToggle.className = 'nav-toggle';
      navToggle.innerHTML = '<span></span><span></span><span></span>';
      navToggle.setAttribute('aria-label', 'Toggle navigation');
      
      const nav = document.querySelector('nav');
      if (nav) {
        nav.prepend(navToggle);
        
        navToggle.addEventListener('click', function() {
          document.body.classList.toggle('nav-open');
          this.setAttribute('aria-expanded', 
            this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });
      }
      
      // Highlight current page in navigation
      document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '' && link.getAttribute('href') === 'index.html')) {
          link.classList.add('active');
        }
      });
    }
  
    // Initialize cart functionality
    function initCart() {
      updateCartCount();
      
      // Add event listeners to all "Buy Now" buttons
      document.querySelectorAll('.laptop-item button, .gallery-item button').forEach(button => {
        button.addEventListener('click', function() {
          const laptopCard = this.closest('.laptop-item, .gallery-item');
          const laptop = {
            id: generateId(),
            name: laptopCard.querySelector('h3').textContent,
            price: parseFloat(laptopCard.querySelector('strong').textContent.replace(/[^0-9.]/g, '')),
            image: laptopCard.querySelector('img').getAttribute('src'),
            quantity: 1
          };
          
          addToCart(laptop);
          showNotification(`${laptop.name} added to cart!`);
        });
      });
    }
  
    // Add item to cart
    function addToCart(item) {
      const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
      
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cartItems.push(item);
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      cartCount++;
      updateCartCount();
    }
  
    // Update cart count display
    function updateCartCount() {
      const cartCounter = document.getElementById('cart-counter');
      if (cartCounter) {
        cartCounter.textContent = cartCount;
        cartCounter.style.display = cartCount > 0 ? 'flex' : 'none';
      }
    }
  
    // Generate unique ID
    function generateId() {
      return Math.random().toString(36).substr(2, 9);
    }
  
    // Show notification
    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }
  
    // Initialize animations
    function initAnimations() {
      // Intersection Observer for scroll animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('.laptop-item, .gallery-item, .testimonial, .info, section').forEach(el => {
        observer.observe(el);
      });
    }
  
    // Back to top button
    function initBackToTop() {
      const backToTop = document.createElement('button');
      backToTop.id = 'back-to-top';
      backToTop.innerHTML = '&uarr;';
      backToTop.setAttribute('aria-label', 'Back to top');
      document.body.appendChild(backToTop);
      
      window.addEventListener('scroll', function() {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
      });
      
      backToTop.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  
    // ----- Page-Specific Functions -----
  
    // Index Page - Featured Laptops
    function initFeaturedLaptops() {
      // Could fetch from API in a real application
      const laptops = [
        {
          name: "Gaming Beast Pro",
          description: "High-performance gaming laptop with RTX 4090 and 32GB RAM.",
          price: 2499,
          image: "gaming-laptop.jpg",
          specs: ["RTX 4090 GPU", "32GB DDR5 RAM", "1TB NVMe SSD", "240Hz Display"]
        },
        {
          name: "Elite Business X",
          description: "Lightweight, powerful, and perfect for professionals.",
          price: 1499,
          image: "business-laptop.jpg",
          specs: ["Intel i7 Processor", "16GB RAM", "512GB SSD", "14\" 4K Display"]
        },
        {
          name: "Everyday Essential",
          description: "Affordable laptop for students and daily use.",
          price: 699,
          image: "budget-laptop.jpg",
          specs: ["Intel i5 Processor", "8GB RAM", "256GB SSD", "15.6\" Full HD"]
        }
      ];
      
      // Add event listeners for "View Details" buttons
      document.querySelectorAll('.laptop-item button').forEach((button, index) => {
        button.addEventListener('click', function() {
          showLaptopDetails(laptops[index]);
        });
      });
    }
  
    // Show laptop details modal
    function showLaptopDetails(laptop) {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <div class="modal-body">
            <div class="modal-image">
              <img src="${laptop.image}" alt="${laptop.name}">
            </div>
            <div class="modal-info">
              <h2>${laptop.name}</h2>
              <p class="price">$${laptop.price.toFixed(2)}</p>
              <p>${laptop.description}</p>
              <h3>Specifications</h3>
              <ul class="specs">
                ${laptop.specs.map(spec => `<li>${spec}</li>`).join('')}
              </ul>
              <button class="btn btn-accent add-to-cart">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      document.body.classList.add('modal-open');
      
      // Close modal
      modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
        document.body.classList.remove('modal-open');
      });
      
      // Add to cart from modal
      modal.querySelector('.add-to-cart').addEventListener('click', function() {
        addToCart({
          id: generateId(),
          name: laptop.name,
          price: laptop.price,
          image: laptop.image,
          quantity: 1
        });
        showNotification(`${laptop.name} added to cart!`);
      });
      
      // Close when clicking outside
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          document.body.removeChild(modal);
          document.body.classList.remove('modal-open');
        }
      });
    }
  
    // Index Page - Testimonials
    function initTestimonials() {
      const testimonials = document.querySelectorAll('.testimonial');
      if (testimonials.length > 0) {
        let currentIndex = 0;
        
        function showTestimonial(index) {
          testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
          });
        }
        
        // Auto-rotate testimonials
        setInterval(() => {
          currentIndex = (currentIndex + 1) % testimonials.length;
          showTestimonial(currentIndex);
        }, 5000);
        
        showTestimonial(0);
      }
    }
  
    // Index Page - Special Offers
    function initSpecialOffers() {
      const offerCountdown = document.getElementById('offer-countdown');
      if (offerCountdown) {
        // Set offer end time (24 hours from now)
        const offerEndTime = new Date();
        offerEndTime.setHours(offerEndTime.getHours() + 24);
        
        function updateCountdown() {
          const now = new Date();
          const diff = offerEndTime - now;
          
          if (diff <= 0) {
            offerCountdown.textContent = 'Offer expired!';
            return;
          }
          
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          offerCountdown.textContent = `Offer ends in: ${hours}h ${minutes}m ${seconds}s`;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
      }
    }
  
    // Contact Page - Form Validation
    function initContactForm() {
      const form = document.querySelector('form');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const name = form.elements['name'].value.trim();
          const email = form.elements['email'].value.trim();
          const phone = form.elements['phone'].value.trim();
          const subject = form.elements['subject'].value;
          const message = form.elements['message'].value.trim();
          
          // Reset error states
          document.querySelectorAll('.error').forEach(el => el.remove());
          
          let isValid = true;
          
          // Validate name
          if (!name) {
            showError(form.elements['name'], 'Please enter your name');
            isValid = false;
          }
          
          // Validate email
          if (!email) {
            showError(form.elements['email'], 'Please enter your email');
            isValid = false;
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError(form.elements['email'], 'Please enter a valid email');
            isValid = false;
          }
          
          // Validate phone
          if (!phone) {
            showError(form.elements['phone'], 'Please enter your phone number');
            isValid = false;
          } else if (!/^[\d\s\-()+]{10,}$/.test(phone)) {
            showError(form.elements['phone'], 'Please enter a valid phone number');
            isValid = false;
          }
          
          // Validate message
          if (!message) {
            showError(form.elements['message'], 'Please enter your message');
            isValid = false;
          } else if (message.length < 20) {
            showError(form.elements['message'], 'Message should be at least 20 characters');
            isValid = false;
          }
          
          if (isValid) {
            // In a real app, you would send the form data to a server
            showNotification('Thank you for your message! We will contact you soon.');
            form.reset();
          }
        });
      }
    }
  
    // Show form error message
    function showError(input, message) {
      const error = document.createElement('div');
      error.className = 'error';
      error.textContent = message;
      error.style.color = 'var(--accent-color)';
      error.style.fontSize = '0.875rem';
      error.style.marginTop = '0.25rem';
      input.parentNode.appendChild(error);
      input.focus();
    }
  
    // FAQ Page - Accordion
    function initFAQAccordion() {
      const accordionHeaders = document.querySelectorAll('.accordion-header');
      
      accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
          this.classList.toggle('active');
          const content = this.nextElementSibling;
          
          if (this.classList.contains('active')) {
            content.classList.add('show');
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.classList.remove('show');
            content.style.maxHeight = '0';
          }
        });
      });
    }
  
    // Gallery Page - Image Modal
    function initLaptopGallery() {
      const galleryItems = document.querySelectorAll('.gallery-item img');
      
      galleryItems.forEach(img => {
        img.addEventListener('click', function() {
          const modal = document.createElement('div');
          modal.className = 'image-modal';
          modal.innerHTML = `
            <div class="image-modal-content">
              <span class="close-modal">&times;</span>
              <img src="${this.src}" alt="${this.alt}">
              <p>${this.nextElementSibling.textContent}</p>
            </div>
          `;
          
          document.body.appendChild(modal);
          document.body.classList.add('modal-open');
          
          modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
            document.body.classList.remove('modal-open');
          });
          
          modal.addEventListener('click', function(e) {
            if (e.target === modal) {
              document.body.removeChild(modal);
              document.body.classList.remove('modal-open');
            }
          });
        });
      });
    }
  });
  
  // ----- CSS to be added to styles.css -----
  // Add these styles to your existing styles.css file
  /*
  .notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-color);
    color: white;
    padding: 12px 24px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .notification.show {
    opacity: 1;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .modal-open .modal {
    opacity: 1;
    visibility: visible;
  }
  
  .modal-content {
    background-color: white;
    border-radius: var(--radius-md);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    padding: var(--space-lg);
  }
  
  .close-modal {
    position: absolute;
    top: var(--space-md);
    right: var(--space-md);
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-muted);
  }
  
  .modal-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }
  
  .modal-image img {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
  }
  
  #back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    display: none;
    z-index: 999;
    box-shadow: var(--shadow-md);
  }
  
  #back-to-top:hover {
    background-color: var(--secondary-color);
  }
  
  .accordion-content {
    transition: max-height 0.3s ease;
  }
  
  .nav-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-sm);
  }
  
  .nav-toggle span {
    display: block;
    width: 25px;
    height: 2px;
    background-color: var(--text-light);
    margin: 5px 0;
    transition: var(--transition-normal);
  }
  
  @media (max-width: 768px) {
    .nav-toggle {
      display: block;
    }
    
    .nav-menu {
      position: fixed;
      top: 0;
      left: -100%;
      width: 80%;
      height: 100vh;
      background-color: var(--primary-dark);
      flex-direction: column;
      padding: var(--space-xl) var(--space-md);
      transition: var(--transition-normal);
      z-index: 900;
    }
    
    body.nav-open .nav-menu {
      left: 0;
    }
    
    body.nav-open .nav-toggle span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    body.nav-open .nav-toggle span:nth-child(2) {
      opacity: 0;
    }
    
    body.nav-open .nav-toggle span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
  */