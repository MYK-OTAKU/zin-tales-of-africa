import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 mt-auto border-t bg-card text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-6">
        <p className="mb-2">
          © {currentYear} Zirin. Tous droits réservés.
        </p>
        <p>
          Made with ❤️ by{' '}
          <a
            href="https://mohamedyehiyakoita.me"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors font-medium"
          >
            MYKDEV CONSULTING
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
