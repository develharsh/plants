import React from "react";

function Footer() {
  return (
    <>
      <footer
        className="text-white body-font mt-10"
        style={{ backgroundColor: "#7b1fa2" }}
      >
        <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <a className="flex title-font font-medium items-center md:justify-start justify-center">
              <img
                src="loginBg.png"
                style={{
                  width: "40px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
                alt=""
              />
              <span className="ml-3 text-xl">Alasca Fashion</span>
            </a>
            <p className="mt-2 text-sm text-white">
              India's Leading Fashion Store for Suits, Lehengas, Gowns, Sarees
              and more...
            </p>
          </div>
          <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
                Quick Navigation
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a
                    className="text-white hover:text-white"
                    href="/collection/products?sortBy=latest"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    className="text-white hover:text-white"
                    href="/collection/products?subcategory=626505b9a8fc44666c191d85&sortBy=latest"
                  >
                    Suits
                  </a>
                </li>
                <li>
                  <a
                    className="text-white hover:text-white"
                    href="/collection/products?subcategory=626505a6a8fc44666c191d7f"
                  >
                    Lehangas
                  </a>
                </li>
                <li>
                  <a
                    className="text-white hover:text-white"
                    href="/collection/products?subcategory=626505b5a8fc44666c191d82&sortBy=latest"
                  >
                    Sarees
                  </a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
                CATEGORIES
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a
                    className="text-white hover:text-white"
                    href="/collection/products?subcategory=6266eac6c2ecfe2a9122444c&sortBy=latest"
                  >
                    Gowns
                  </a>
                </li>
                <li>
                  <a
                    className="text-white hover:text-white"
                    href="/collection/products?subcategory=626505b9a8fc44666c191d85&sortBy=latest"
                  >
                    Suits
                  </a>
                </li>
                <li>
                  <a
                    className="text-white hover:text-white"
                    href="/collection/products?subcategory=626505a6a8fc44666c191d7f"
                  >
                    Lehangas
                  </a>
                </li>
                <li>
                  <a
                    className="text-white hover:text-white"
                    href="/collection/products?subcategory=626505b5a8fc44666c191d82&sortBy=latest"
                  >
                    Sarees
                  </a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
                Important Links
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a
                    href="/info/about-us"
                    className="text-white hover:text-white"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/info/privacy-policy"
                    className="text-white hover:text-white"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/info/terms-and-conditions"
                    className="text-white hover:text-white"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="/info/faqs" className="text-white hover:text-white">
                    FAQs
                  </a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
                Contact
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a
                    href="tel:+917055335905"
                    className="text-white hover:text-white"
                  >
                    +91-7055335905
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:alascafashion@gmail.com"
                    className="text-white hover:text-white"
                  >
                    alascafashion@gmail.com
                  </a>
                </li>
                <li>
                  <p className="text-white hover:text-white">
                    35, Golf Course Rd, Suncity, Sector 54, Gurgaon, Haryana
                    122022
                  </p>
                </li>
              </nav>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
            <p className="text-black text-sm text-center sm:text-left">
              © 2018 Alasca Fashion —
              <a
                href="https://instagram.com/alascafashion"
                rel="noopener noreferrer"
                className="text-black ml-1"
                target="_blank"
              >
                @alascafashion
              </a>
            </p>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
              <a
                className="text-black"
                href="https://instagram.com/alascafashion"
              >
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a
                className="ml-3 text-black"
                href="https://instagram.com/alascafashion"
              >
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a
                className="ml-3 text-black"
                href="https://instagram.com/alascafashion"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </a>
              <a
                className="ml-3 text-black"
                href="https://instagram.com/alascafashion"
              >
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="none"
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                  ></path>
                  <circle cx="4" cy="4" r="2" stroke="none"></circle>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
