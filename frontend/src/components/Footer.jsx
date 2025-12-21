import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content">
      {/* Main Footer Content */}
      <div className="footer p-10 max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand & Info Column */}
        <nav>
          <header className="footer-title opacity-100 text-primary font-bold text-lg">GetaDoc</header>
          <p className="max-w-xs text-sm">
            Connecting patients with top-rated healthcare professionals. 
            Making healthcare accessible, reliable, and digital-first.
          </p>
          <div className="mt-4">
            <p className="text-xs font-semibold">Headquarters:</p>
            <p className="text-xs text-gray-500">123 Health Ave, Medical District<br/>San Francisco, CA 94103</p>
          </div>
        </nav>

        {/* Services Column */}
        <nav>
          <header className="footer-title">Services</header>
          <a className="link link-hover">Online Consultations</a>
          <a className="link link-hover">In-person Booking</a>
          <a className="link link-hover">Health Checkups</a>
          <a className="link link-hover">Lab Test Reports</a>
          <a className="link link-hover">Emergency Care</a>
        </nav>

        {/* Company Column */}
        <nav>
          <header className="footer-title">Company</header>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Our Doctors</a>
          <a className="link link-hover">Career Opportunities</a>
          <a className="link link-hover">Press Kit</a>
          <a className="link link-hover">Contact Support</a>
        </nav>

        {/* Legal & Newsletter Column */}
        <nav>
          <header className="footer-title">Legal & Newsletter</header>
          <a className="link link-hover">Terms of Service</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Cookie Policy</a>
          
          <div className="form-control w-80 mt-4">
            <label className="label">
              <span className="label-text">Subscribe to our newsletter</span>
            </label>
            <div className="join">
              <input
                type="text"
                placeholder="username@site.com"
                className="input input-bordered join-item w-full"
              />
              <button className="btn btn-primary join-item">Join</button>
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom Bar: Copyright & Socials */}
      <div className="footer px-10 py-4 border-t bg-base-300 border-base-content/10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <aside className="items-center grid-flow-col">
          <p>© {new Date().getFullYear()} GetaDoc Inc.</p>
        </aside>
        
        <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <a href="#" className="hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
            </a>
            <a href="#" className="hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
            </a>
            <a href="#" className="hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;