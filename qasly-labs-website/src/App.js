import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Main App Component: Manages the entire website's state and navigation.
// This single-page application structure ensures seamless transitions.
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentPost, setCurrentPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = (page, post = null) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setCurrentPost(post);
      setIsLoading(false);
    }, 500); // Simulate a short loading time for a smoother transition
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'blog':
        return <Blog navigateTo={navigateTo} />;
      case 'contact':
        return <Contact navigateTo={navigateTo} />;
      case 'post':
        return <BlogPost navigateTo={navigateTo} post={currentPost} />;
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen relative font-inter">
      <style>
        {`
        @import url('https://rsms.me/inter/inter.css');
        body { font-family: 'Inter', sans-serif; }
        .bg-subtle-gradient {
            background: radial-gradient(circle at center, #111827, #000000);
        }
        .animate-fade-in-slow { 
            animation: fadeInSlow 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
            opacity: 0; 
        }
        @keyframes fadeInSlow { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
        .hover-glow {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        .hover-glow::before {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 1px;
            background: #e5e7eb;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-glow:hover::before {
            width: 100%;
        }
        .page-container {
            position: relative;
            z-index: 10;
        }
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .code-block-minimal {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
            transition: all 0.3s ease-in-out;
        }
        `}
      </style>
      <BackgroundAnimation />
      <Header navigateTo={navigateTo} />
      <div className="relative z-10">
        {renderPage()}
      </div>
      <Footer navigateTo={navigateTo} />
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

// Background Animation Component with a subtle starfield effect
const BackgroundAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialiasing: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 1000;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: 0x9ca3af,
        transparent: true,
        opacity: 0.8
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    camera.position.z = 50;

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.0005;
      particles.rotation.x = time * 0.1;
      particles.rotation.y = time * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0"></div>;
};

// Header Component: Minimalist top navigation.
const Header = ({ navigateTo }) => (
  <header className="absolute top-0 p-8 z-30 w-full flex justify-between items-center px-8 md:px-16">
    <div className="text-xl md:text-2xl font-extrabold text-white tracking-widest cursor-pointer hover-glow" onClick={() => navigateTo('home')}>Qasly Labs</div>
    <nav className="flex space-x-4">
      <a
        onClick={() => navigateTo('blog')}
        className="text-white text-lg font-light hover-glow cursor-pointer"
      >
        Blog
      </a>
      <a
        onClick={() => navigateTo('contact')}
        className="text-white text-lg font-light hover-glow cursor-pointer"
      >
        Contact
      </a>
    </nav>
  </header>
);

// Footer Component: The website's footer, now including researcher profiles.
const Footer = ({ navigateTo }) => (
  <footer className="relative text-center py-10 z-20 text-gray-500 text-sm">
  
    <p>&copy; 2025 Qasly Labs. All Rights Reserved.</p>
    <div className="mt-2">
      <a onClick={() => navigateTo('contact')} className="text-gray-400 hover:text-gray-200 transition-colors duration-300 cursor-pointer hover-glow">
        Contact
      </a>
    </div>
  </footer>
);

const LoadingOverlay = () => (
  <div className="loading-overlay">
    <div className="text-white text-2xl font-semibold animate-pulse">Loading...</div>
  </div>
);

// Home Component: Landing page with the new minimalist style.
const Home = ({ navigateTo }) => {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center p-4 relative page-container">
      <div className="z-10 animate-fade-in-slow">
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold text-white tracking-tighter">Qasly Labs</h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-light text-gray-400 mt-6 tracking-wide">Independent Security Research Lab</p>
      </div>
      <a onClick={() => navigateTo('blog')} className="absolute bottom-10 animate-pulse cursor-pointer">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7"></path>
        </svg>
      </a>
    </section>
  );
};

// Blog Component: A clean, text-based list of blog post titles with a hover effect.
const Blog = ({ navigateTo }) => {
  const posts = [
    { 
      title: 'How We Exploited an Auth0 Misconfiguration to Bypass Login Restrictions', 
      date: 'Jan 9, 2025',
      content: (
        <>
          <p>
            Hey everyone 👋,
            In this write-up, we're sharing an interesting bug we discovered during a security test. This bug allowed us to bypass login restrictions and register an unauthorized account in a web application’s admin panel. What made this case especially intriguing was the absence of a connection string in the responses, making it challenging to figure out the correct value to use.
          </p>
          <p>
            Eventually, we discovered a simple yet effective method to crack this vulnerability by experimenting with the realm parameter. Let us walk you through the entire process!
          </p>
          <h3 className="text-xl md:text-2xl font-extrabold mt-8 mb-4 text-white">The Scenario</h3>
          <p>
            We were testing a web application with an admin login panel. Here’s what we observed:
          </p>
          <ul className="list-disc list-inside ml-4 text-gray-300">
            <li>There was no visible “Sign Up” option on the page.</li>
            <li>It was designed to allow only authorized users with pre-created accounts to log in.</li>
          </ul>
          <p>
            Our first step was to see if there were any hidden signup pages or endpoints. We used fuzzing to try different paths but didn’t find anything useful. Then, we attempted to log in with random credentials and intercepted the network request.
          </p>
          <h3 className="text-xl md:text-2xl font-extrabold mt-8 mb-4 text-white">Discovery</h3>
          <h4 className="text-lg md:text-xl font-extrabold mt-4 mb-2 text-white">Intercepting the Login Request</h4>
          <p>
            Using Burp Suite, we intercepted the login request. The payload included:
          </p>
          <ul className="list-disc list-inside ml-4 text-gray-300">
            <li>A client_id, which is typical for OAuth flows.</li>
            <li>A realm parameter, which specifies the authentication method (e.g., "Username-Password-Authentication").</li>
          </ul>
          <h4 className="text-lg md:text-xl font-extrabold mt-4 mb-2 text-white">Testing the Signup Endpoint</h4>
          <p>
            From prior experience with Auth0, we knew that the /dbconnections/signup endpoint is often used for account creation. Even if the frontend doesn’t expose a signup option, this endpoint might still be active.
          </p>
          <h4 className="text-lg md:text-xl font-extrabold mt-4 mb-2 text-white">The Challenge</h4>
          <p>
            Here’s where things got tricky:
          </p>
          <ul className="list-disc list-inside ml-4 text-gray-300">
            <li>We crafted a request targeting /dbconnections/signup.</li>
            <li>The connection parameter, which specifies the database or identity provider, wasn’t returned in the responses to guide us.</li>
          </ul>
          <p>
            Without a connection string, we couldn’t proceed immediately, so we had to think outside the box.
          </p>
          <h3 className="text-xl md:text-2xl font-extrabold mt-8 mb-4 text-white">Exploitation</h3>
          <h4 className="text-lg md:text-xl font-extrabold mt-4 mb-2 text-white">Testing Permutations</h4>
          <p>
            We tried different guesses for the connection parameter based on common naming patterns (e.g., default, Username-Password-Authentication, and variations of the domain name). Nothing worked.
          </p>
          <h4 className="text-lg md:text-xl font-extrabold mt-4 mb-2 text-white">The Breakthrough</h4>
          <p>
            Finally, we noticed the realm parameter in the login request. It was set to "Username-Password-Authentication". Out of curiosity, we copied its value and used it for the connection parameter in the signup request.
          </p>
          <h4 className="text-lg md:text-xl font-extrabold mt-4 mb-2 text-white">The Signup Request</h4>
          <p>
            With the realm value as the connection, we crafted the following request:
          </p>
          <div className="code-block-minimal p-4 rounded-lg text-sm my-4 overflow-x-auto">
            <pre>
              <code>
{`POST /dbconnections/signup HTTP/2
Host: auth.example.com
Content-Type: application/json
Payload:
{
  "client_id": "example-client-id",
  "email": "attacker@example.com",
  "password": "Password123!",
  "connection": "Username-Password-Authentication",
  "realm": "Username-Password-Authentication",
  "credential_type": "http://auth0.com/oauth/grant-type/password-realm"
}`}
              </code>
            </pre>
          </div>
          <h4 className="text-lg md:text-xl font-extrabold mt-4 mb-2 text-white">The Result</h4>
          <p>
            To our surprise, the server responded with:
          </p>
          <div className="code-block-minimal p-4 rounded-lg text-sm my-4 overflow-x-auto">
            <pre>
              <code>
{`{
 "_id": "auth0|1234567890", 
 "email": "attacker@example.com",
 "email_verified": false
}`}
              </code>
            </pre>
          </div>
          <p>
            🎉 Success! Our account was created.
          </p>
          <h4 className="text-lg md:text-xl font-extrabold mt-4 mb-2 text-white">Logging In</h4>
          <p>
            We used the newly created credentials to log in to the admin panel, and it worked perfectly. This confirmed the vulnerability: we could register an unauthorized admin account by exploiting the misconfigured OAuth flow.
          </p>
          <h3 className="text-xl md:text-2xl font-extrabold mt-8 mb-4 text-white">Why This Worked</h3>
          <p>
            The issue arose because:
          </p>
          <ul className="list-disc list-inside ml-4 text-gray-300">
            <li>The /dbconnections/signup endpoint was left exposed and did not validate whether the request was authorized.</li>
            <li>The realm parameter from the login request could be used as the connection value in the signup request.</li>
            <li>The system didn’t restrict account creation to pre-approved email domains or specific users.</li>
          </ul>
          <h3 className="text-xl md:text-2xl font-extrabold mt-8 mb-4 text-white">Lessons Learned</h3>
          <p>
            When the obvious approach doesn’t work, experiment with available parameters and their relationships.
          </p>
          <h3 className="text-xl md:text-2xl font-extrabold mt-8 mb-4 text-white">Conclusion</h3>
          <p>
            This bug was a great reminder of how small misconfigurations can lead to critical security risks. If you’re exploring OAuth systems, always pay attention to hidden parameters like realm and test for misconfigurations in exposed endpoints.
          </p>
          <p>
            We hope this write-up helps you learn something new. Let us know your thoughts in the comments. Happy hunting! 🕵️‍♂️
          </p>
        </>
      ),
    },
  ];

  return (
    <section id="blog" className="py-20 md:py-32 px-4 md:px-8 lg:px-16 min-h-screen page-container">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-12 animate-fade-in-slow">Recent Posts</h2>
      <div className="max-w-3xl mx-auto divide-y divide-gray-700">
        {posts.map((post, index) => (
          <div key={index} className="py-8 animate-fade-in-slow" style={{ animationDelay: `${0.2 * index}s` }}>
            <a onClick={() => navigateTo('post', post)} className="flex justify-between items-center cursor-pointer hover-glow">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">{post.title}</h3>
              <p className="text-gray-400 text-base md:text-lg font-medium tracking-wide">{post.date}</p>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

// BlogPost Component: A simple, highly readable page for the content.
const BlogPost = ({ navigateTo, post }) => {
  const content = post?.content || (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{post?.title || 'Blog Post'}</h1>
      <p className="text-gray-400 text-xl md:text-2xl font-medium tracking-wide mb-8">Published on {post?.date || 'Unknown Date'}</p>
      <p>
        In the ever-evolving landscape of digital security, cryptography remains the bedrock upon which trust is built. However, with the advent of quantum computing, the very foundations of modern encryption are being challenged. This article delves into the exciting new paradigms of quantum-resistant cryptography, exploring how we can future-proof our digital world against the threats of tomorrow.
      </p>
      <p>
        Current cryptographic standards, such as RSA and elliptic-curve cryptography (ECC), rely on the computational difficulty of factoring large prime numbers or solving discrete logarithms. While these problems are intractable for classical computers, quantum computers, armed with algorithms like Shor's, could solve them in a matter of minutes, rendering our current encryption schemes obsolete.
      </p>
      <p>
        The race is on to develop post-quantum cryptography (PQC) solutions. These new algorithms are designed to be secure against both classical and quantum computers. Leading candidates include lattice-based cryptography, code-based cryptography, and multivariate polynomial cryptography. Each approach offers a unique set of trade-offs in terms of performance, key size, and security guarantees.
      </p>
    </>
  );

  return (
    <section className="py-20 md:py-32 px-4 md:px-8 lg:px-16 min-h-screen page-container">
      <div className="max-w-3xl mx-auto animate-fade-in-slow">
        <a onClick={() => navigateTo('blog')} className="text-gray-400 hover-glow transition-colors duration-300 mb-8 block cursor-pointer">← Back to Blog</a>
        <article className="prose prose-invert max-w-none text-gray-300 mt-8">
          {content}
        </article>
      </div>
    </section>
  );
};


// Contact form component: A clean, minimal form.
const Contact = ({ navigateTo }) => (
  <section className="min-h-screen flex justify-center items-center p-4 page-container">
    <div className="max-w-xl w-full mx-4 animate-fade-in-slow">
      <h2 className="text-4xl font-extrabold text-white mb-8 text-center">Contact Us</h2>
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-light text-gray-400">Name</label>
          <input type="text" id="name" className="mt-1 block w-full p-3 rounded-lg text-white placeholder-gray-600 bg-gray-800 border-none focus:outline-none focus:ring-1 focus:ring-gray-600 transition-colors duration-300" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-light text-gray-400">Email</label>
          <input type="email" id="email" className="mt-1 block w-full p-3 rounded-lg text-white placeholder-gray-600 bg-gray-800 border-none focus:outline-none focus:ring-1 focus:ring-gray-600 transition-colors duration-300" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-light text-gray-400">Message</label>
          <textarea id="message" rows="5" className="mt-1 block w-full p-3 rounded-lg text-white placeholder-gray-600 bg-gray-800 border-none focus:outline-none focus:ring-1 focus:ring-gray-600 transition-colors duration-300"></textarea>
        </div>
        <button type="submit" className="w-full text-white py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 transition-colors duration-300">Send Message</button>
      </form>
      <div className="mt-8 text-center">
        <a onClick={() => navigateTo('home')} className="text-gray-400 hover-glow transition-colors duration-300 cursor-pointer">← Back to Home</a>
      </div>
    </div>
  </section>
);

export default App;
